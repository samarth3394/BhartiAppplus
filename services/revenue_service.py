"""
Revenue-Impact Observability & SLA Burn Rate Calculator.
Computes downtime financial exposure, active bug risk exposure, and SLA error budget consumption.
"""

from datetime import datetime, timedelta, timezone
from models import Bug, BugStatusEnum, UptimeIncident

SEVERITY_EXPOSURE_WEIGHTS = {
    "critical": 1.0,
    "high": 0.5,
    "medium": 0.15,
    "low": 0.05,
}


def _ensure_utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def calculate_bug_revenue_impact(bug: Bug, hourly_revenue: float, now: datetime | None = None) -> dict:
    """Estimate hourly revenue exposure and cumulative risk for a bug based on severity & open duration."""
    now = _ensure_utc(now) or datetime.now(timezone.utc)
    sev = bug.severity.value if bug.severity else "medium"
    weight = SEVERITY_EXPOSURE_WEIGHTS.get(sev, 0.15)
    is_resolved = bug.status == BugStatusEnum.resolved

    created = _ensure_utc(bug.created_at) or now
    end_time = _ensure_utc(bug.resolved_at) if is_resolved and bug.resolved_at else now
    open_hours = max(0.0, (end_time - created).total_seconds() / 3600.0)

    hourly_exposure = round(hourly_revenue * weight, 2) if not is_resolved else 0.0
    cumulative_risk = round(hourly_revenue * weight * min(open_hours, 720.0), 2)

    return {
        "severity_weight": weight,
        "hourly_exposure": hourly_exposure,
        "cumulative_risk": cumulative_risk,
        "open_hours": round(open_hours, 1),
        "is_active": not is_resolved,
    }


def calculate_app_revenue_observability(session, app, now: datetime | None = None) -> dict:
    """Compute app-wide downtime financial impact, SLA error budget burn rate, and active incident risk."""
    now = _ensure_utc(now) or datetime.now(timezone.utc)
    settings = app.settings or {}
    hourly_revenue = float(settings.get("hourly_revenue") or 0.0)
    sla_target_pct = float(settings.get("sla_target_pct") or 99.9)
    sla_target_pct = min(99.999, max(90.0, sla_target_pct))
    currency = settings.get("currency") or "USD"

    cutoff_30d = now - timedelta(days=30)
    cutoff_7d = now - timedelta(days=7)

    incidents_30d = (
        session.query(UptimeIncident)
        .filter(UptimeIncident.app_id == app.id, UptimeIncident.started_at >= cutoff_30d)
        .all()
    )

    downtime_seconds_30d = 0.0
    downtime_seconds_7d = 0.0
    has_active_incident = False

    for inc in incidents_30d:
        started = _ensure_utc(inc.started_at) or now
        if inc.resolved_at is None:
            has_active_incident = True
            dur = max(0.0, (now - started).total_seconds())
        else:
            dur = float(inc.duration_seconds or max(0.0, (_ensure_utc(inc.resolved_at) - started).total_seconds()))

        downtime_seconds_30d += dur
        if started >= cutoff_7d:
            downtime_seconds_7d += dur

    downtime_minutes_30d = downtime_seconds_30d / 60.0
    downtime_minutes_7d = downtime_seconds_7d / 60.0

    # 30-day window = 43,200 minutes
    allowed_downtime_minutes_30d = max(0.01, 43200.0 * (1.0 - (sla_target_pct / 100.0)))
    sla_burn_rate_pct = min(999.9, (downtime_minutes_30d / allowed_downtime_minutes_30d) * 100.0)
    sla_remaining_minutes = max(0.0, allowed_downtime_minutes_30d - downtime_minutes_30d)

    revenue_lost_30d = round((downtime_minutes_30d / 60.0) * hourly_revenue, 2)
    revenue_lost_7d = round((downtime_minutes_7d / 60.0) * hourly_revenue, 2)

    open_bugs = (
        session.query(Bug)
        .filter(
            Bug.app_id == app.id,
            Bug.status.in_([BugStatusEnum.open, BugStatusEnum.in_progress, BugStatusEnum.testing]),
        )
        .all()
    )

    bug_hourly_exposure = sum(
        calculate_bug_revenue_impact(b, hourly_revenue, now=now)["hourly_exposure"]
        for b in open_bugs
    )
    active_revenue_at_risk_per_hour = round(
        (hourly_revenue if has_active_incident else 0.0) + bug_hourly_exposure,
        2,
    )

    return {
        "hourly_revenue": round(hourly_revenue, 2),
        "currency": currency,
        "sla_target_pct": sla_target_pct,
        "allowed_downtime_minutes_30d": round(allowed_downtime_minutes_30d, 2),
        "downtime_minutes_7d": round(downtime_minutes_7d, 2),
        "downtime_minutes_30d": round(downtime_minutes_30d, 2),
        "sla_burn_rate_pct": round(sla_burn_rate_pct, 2),
        "sla_remaining_minutes": round(sla_remaining_minutes, 2),
        "revenue_lost_7d": revenue_lost_7d,
        "revenue_lost_30d": revenue_lost_30d,
        "active_revenue_at_risk_per_hour": active_revenue_at_risk_per_hour,
        "open_bug_exposure_per_hour": round(bug_hourly_exposure, 2),
        "has_active_incident": has_active_incident,
    }

