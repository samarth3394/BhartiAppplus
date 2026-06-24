"""
Health Score Calculation Engine
Combines uptime %, bug severity, and maintenance compliance into a 0-100 score.
"""

from datetime import datetime, timedelta, timezone
from models import UptimeCheck, Bug, BugStatusEnum, SeverityEnum, MaintenanceTask


def calculate_health_score(session, app_id):
    """
    Calculate overall app health score (0-100).
    - Uptime contributes 40 points
    - Bugs contribute 30 points
    - Maintenance compliance contributes 30 points
    """
    uptime_score = _calculate_uptime_score(session, app_id)
    bug_score = _calculate_bug_score(session, app_id)
    maintenance_score = _calculate_maintenance_score(session, app_id)

    total = uptime_score + bug_score + maintenance_score
    return {
        'total': round(total, 1),
        'uptime_score': round(uptime_score, 1),
        'bug_score': round(bug_score, 1),
        'maintenance_score': round(maintenance_score, 1),
    }


def _calculate_uptime_score(session, app_id, max_points=40):
    """Uptime % in last 24 hours → 0-40 points."""
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    checks = session.query(UptimeCheck).filter(
        UptimeCheck.app_id == app_id,
        UptimeCheck.checked_at >= since
    ).all()

    if not checks:
        return max_points  # No checks = assume healthy (new app)

    up_count = sum(1 for c in checks if c.is_up)
    uptime_pct = (up_count / len(checks)) * 100
    return (uptime_pct / 100) * max_points


def _calculate_bug_score(session, app_id, max_points=30):
    """
    Fewer open bugs = higher score.
    Severity weights: critical=4, high=3, medium=2, low=1
    """
    open_bugs = session.query(Bug).filter(
        Bug.app_id == app_id,
        Bug.status.in_([BugStatusEnum.open, BugStatusEnum.in_progress, BugStatusEnum.testing])
    ).all()

    if not open_bugs:
        return max_points

    severity_weights = {
        SeverityEnum.critical: 4,
        SeverityEnum.high: 3,
        SeverityEnum.medium: 2,
        SeverityEnum.low: 1,
    }

    weighted_sum = sum(severity_weights.get(b.severity, 1) for b in open_bugs)
    # Max penalty at 20 weighted points
    penalty_ratio = min(weighted_sum / 20, 1.0)
    return max_points * (1 - penalty_ratio)


def _calculate_maintenance_score(session, app_id, max_points=30):
    """
    More tasks on schedule = higher score.
    Overdue tasks reduce the score.
    """
    now = datetime.now(timezone.utc)
    tasks = session.query(MaintenanceTask).filter(
        MaintenanceTask.app_id == app_id,
        MaintenanceTask.is_active == True
    ).all()

    if not tasks:
        return max_points  # No tasks = assume healthy

    on_time = sum(1 for t in tasks if t.due_date and t.due_date >= now)
    compliance_ratio = on_time / len(tasks)
    return compliance_ratio * max_points


def get_uptime_percentage(session, app_id, hours=24):
    """Get uptime percentage for a given time period."""
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    checks = session.query(UptimeCheck).filter(
        UptimeCheck.app_id == app_id,
        UptimeCheck.checked_at >= since
    ).all()

    if not checks:
        return 100.0

    up_count = sum(1 for c in checks if c.is_up)
    return round((up_count / len(checks)) * 100, 2)
