from fastapi import APIRouter, Request, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional, Any
import uuid

from models import (
    App, Bug, BugStatusEnum, SeverityEnum,
    ServerMetric, AppErrorLog, OtelTraceSpan, OtelMetricPoint
)
from dependencies import get_db

router = APIRouter(tags=["api_ingest"])


class ErrorIngestRequest(BaseModel):
    message: Optional[str] = "Unknown Error"
    url: Optional[str] = ""
    line: Optional[str] = ""
    column: Optional[str] = ""
    stack: Optional[str] = ""
    userAgent: Optional[str] = ""
    timestamp: Optional[str] = None
    auto_create_bug: Optional[bool] = False
    severity: Optional[str] = "high"


class MetricsIngestRequest(BaseModel):
    cpu_percent: Optional[float] = 0.0
    ram_percent: Optional[float] = 0.0
    disk_percent: Optional[float] = 0.0


def _resolve_app_from_headers(request: Request, db: Session, x_nexvora_key: Optional[str] = None) -> App:
    """Resolve App from X-Nexvora-Key, X-Brexal-Key, api-key, or Authorization: Bearer <key>."""
    key = (
        x_nexvora_key
        or request.headers.get("X-Brexal-Key")
        or request.headers.get("api-key")
    )
    if not key:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.lower().startswith("bearer "):
            key = auth_header[7:].strip()

    if not key:
        raise HTTPException(
            status_code=401,
            detail="Missing client key (provide X-Nexvora-Key, api-key, or Authorization: Bearer <key>)",
        )

    app = db.query(App).filter(App.client_key == key).first()
    if not app:
        raise HTTPException(status_code=401, detail="Invalid client key")
    return app


def _extract_otlp_attr(attrs: list[dict] | None, key: str, default: str = "") -> str:
    if not attrs:
        return default
    for item in attrs:
        if item.get("key") == key:
            val = item.get("value") or {}
            if "stringValue" in val:
                return str(val["stringValue"])
            if "intValue" in val:
                return str(val["intValue"])
            if "doubleValue" in val:
                return str(val["doubleValue"])
            if "boolValue" in val:
                return str(val["boolValue"])
    return default


def _otlp_attrs_to_dict(attrs: list[dict] | None) -> dict[str, Any]:
    out: dict[str, Any] = {}
    if not attrs:
        return out
    for item in attrs:
        k = item.get("key")
        val = item.get("value") or {}
        if not k:
            continue
        for vkey in ("stringValue", "intValue", "doubleValue", "boolValue"):
            if vkey in val:
                out[k] = val[vkey]
                break
    return out


def _numeric_datapoint_value(dp: dict) -> float:
    if "asDouble" in dp and dp["asDouble"] is not None:
        return float(dp["asDouble"])
    if "asInt" in dp and dp["asInt"] is not None:
        return float(dp["asInt"])
    if "sum" in dp and dp["sum"] is not None:
        return float(dp["sum"])
    return 0.0


def _auto_create_self_healing_bug(db: Session, app: App, title: str, stack_trace: str, url: str = "", severity_str: str = "high") -> Bug:
    from services.ai_service import generate_fix_diff
    try:
        sev = SeverityEnum(severity_str)
    except ValueError:
        sev = SeverityEnum.high

    ai_fix = generate_fix_diff(title, f"Ingested from {url or 'application runtime'}", stack_trace)
    bug = Bug(
        app_id=app.id,
        title=title[:480],
        description=f"Auto-captured error on `{url or 'runtime'}`.\n\n```\n{stack_trace[:3000]}\n```",
        severity=sev,
        status=BugStatusEnum.open,
        is_automated=True,
        tags_json=["auto-captured", "self-healing-ready"],
        metadata_json={"stack_trace": stack_trace[:4000], "url": url, "ai_fix": ai_fix},
    )
    db.add(bug)
    return bug


@router.post("/api/ingest/error", status_code=status.HTTP_201_CREATED)
async def ingest_error(
    data: ErrorIngestRequest,
    request: Request,
    x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"),
    db: Session = Depends(get_db),
):
    app = _resolve_app_from_headers(request, db, x_nexvora_key)

    message = data.message or "Unknown Error"
    url = data.url or ""
    line = data.line or ""
    col = data.column or ""
    stack = data.stack or ""
    user_agent = data.userAgent or ""

    metadata = {"stack": stack, "userAgent": user_agent, "url": url}

    parsed_timestamp = None
    try:
        if data.timestamp:
            parsed_timestamp = datetime.fromisoformat(data.timestamp.replace("Z", "+00:00"))
    except Exception:
        pass

    error_log = AppErrorLog(
        app_id=app.id,
        message=message,
        stack_trace=stack,
        url=url,
        line=line,
        column=col,
        user_agent=user_agent,
        metadata_json=metadata,
        timestamp=parsed_timestamp or datetime.now(timezone.utc),
    )
    db.add(error_log)

    created_bug_id = None
    if data.auto_create_bug:
        bug = _auto_create_self_healing_bug(
            db, app, message, stack or f"File \"{url or 'app/handler.py'}\", line {line or 1}", url, data.severity or "high"
        )
        db.flush()
        created_bug_id = bug.id

    db.commit()
    return {
        "message": "Error logged successfully",
        "log_id": error_log.id,
        "bug_id": created_bug_id,
    }


@router.options("/api/ingest/error", status_code=status.HTTP_204_NO_CONTENT)
async def ingest_error_options():
    return None


@router.post("/api/ingest/metrics", status_code=status.HTTP_201_CREATED)
async def ingest_metrics(
    data: MetricsIngestRequest,
    request: Request,
    x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"),
    db: Session = Depends(get_db),
):
    app = _resolve_app_from_headers(request, db, x_nexvora_key)

    metric = ServerMetric(
        app_id=app.id,
        cpu_percent=data.cpu_percent,
        ram_percent=data.ram_percent,
        disk_percent=data.disk_percent,
    )
    db.add(metric)
    db.commit()
    return {"message": "Metrics recorded", "id": metric.id}


@router.options("/api/ingest/metrics", status_code=status.HTTP_204_NO_CONTENT)
async def ingest_metrics_options():
    return None


# ─── Standard OpenTelemetry (OTLP/HTTP JSON) Endpoints ────────────────────────

@router.post("/v1/metrics")
@router.post("/api/v1/metrics")
async def ingest_otlp_metrics(
    request: Request,
    x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"),
    db: Session = Depends(get_db),
):
    """Ingest standard OpenTelemetry Protocol (OTLP/HTTP JSON) ExportMetricsServiceRequest."""
    app = _resolve_app_from_headers(request, db, x_nexvora_key)
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid OTLP/JSON payload")

    resource_metrics = payload.get("resourceMetrics", [])
    accepted_points = 0
    cpu_val = None
    ram_val = None
    disk_val = None

    for rm in resource_metrics:
        res_attrs = (rm.get("resource") or {}).get("attributes")
        service_name = _extract_otlp_attr(res_attrs, "service.name", app.name or "otel-service")

        for sm in rm.get("scopeMetrics", []):
            for metric in sm.get("metrics", []):
                name = metric.get("name", "unnamed.metric")
                unit = metric.get("unit", "")
                data_points = (
                    (metric.get("gauge") or {}).get("dataPoints")
                    or (metric.get("sum") or {}).get("dataPoints")
                    or (metric.get("histogram") or {}).get("dataPoints")
                    or []
                )
                for dp in data_points:
                    val = _numeric_datapoint_value(dp)
                    attrs = _otlp_attrs_to_dict(dp.get("attributes"))
                    point = OtelMetricPoint(
                        app_id=app.id,
                        service_name=service_name,
                        metric_name=name,
                        unit=unit,
                        value=val,
                        attributes_json=attrs,
                    )
                    db.add(point)
                    accepted_points += 1

                    lname = name.lower()
                    if "cpu" in lname and cpu_val is None:
                        cpu_val = val * 100.0 if 0.0 <= val <= 1.0 else val
                    elif ("mem" in lname or "ram" in lname) and ram_val is None:
                        ram_val = val * 100.0 if 0.0 <= val <= 1.0 else val
                    elif "disk" in lname and disk_val is None:
                        disk_val = val * 100.0 if 0.0 <= val <= 1.0 else val

    if cpu_val is not None or ram_val is not None or disk_val is not None:
        db.add(
            ServerMetric(
                app_id=app.id,
                cpu_percent=round(cpu_val or 0.0, 2),
                ram_percent=round(ram_val or 0.0, 2),
                disk_percent=round(disk_val or 0.0, 2),
            )
        )

    db.commit()
    return {"partialSuccess": {}, "acceptedMetrics": accepted_points}


@router.post("/v1/traces")
@router.post("/api/v1/traces")
async def ingest_otlp_traces(
    request: Request,
    x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"),
    db: Session = Depends(get_db),
):
    """Ingest standard OpenTelemetry Protocol (OTLP/HTTP JSON) ExportTraceServiceRequest."""
    app = _resolve_app_from_headers(request, db, x_nexvora_key)
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid OTLP/JSON trace payload")

    resource_spans = payload.get("resourceSpans", [])
    accepted_spans = 0
    error_spans = 0

    for rs in resource_spans:
        res_attrs = (rs.get("resource") or {}).get("attributes")
        service_name = _extract_otlp_attr(res_attrs, "service.name", app.name or "otel-service")

        for ss in rs.get("scopeSpans", []):
            for span in ss.get("spans", []):
                trace_id = span.get("traceId") or uuid.uuid4().hex
                span_id = span.get("spanId") or uuid.uuid4().hex[:16]
                parent_span_id = span.get("parentSpanId") or ""
                span_name = span.get("name", "unnamed.span")
                kind = int(span.get("kind") or 1)

                start_ns = int(span.get("startTimeUnixNano") or 0)
                end_ns = int(span.get("endTimeUnixNano") or 0)
                duration_ms = round(max(0.0, (end_ns - start_ns) / 1_000_000.0), 3) if end_ns >= start_ns and start_ns > 0 else 0.0

                status_obj = span.get("status") or {}
                raw_code = status_obj.get("code", 0)
                if isinstance(raw_code, str):
                    code_map = {"STATUS_CODE_UNSET": 0, "STATUS_CODE_OK": 1, "STATUS_CODE_ERROR": 2}
                    status_code = code_map.get(raw_code.upper(), 0)
                else:
                    status_code = int(raw_code or 0)
                status_msg = status_obj.get("message", "")
                attrs = _otlp_attrs_to_dict(span.get("attributes"))

                record = OtelTraceSpan(
                    app_id=app.id,
                    trace_id=trace_id,
                    span_id=span_id,
                    parent_span_id=parent_span_id,
                    service_name=service_name,
                    span_name=span_name,
                    kind=kind,
                    status_code=status_code,
                    status_message=status_msg,
                    duration_ms=duration_ms,
                    attributes_json=attrs,
                )
                db.add(record)
                accepted_spans += 1

                if status_code == 2 or int(attrs.get("http.status_code", 0) or 0) >= 500:
                    error_spans += 1
                    err_msg = status_msg or f"OTLP Error Span in {service_name}: {span_name}"
                    stack = str(attrs.get("exception.stacktrace") or attrs.get("exception.message") or "")
                    db.add(
                        AppErrorLog(
                            app_id=app.id,
                            message=err_msg,
                            stack_trace=stack,
                            url=str(attrs.get("http.target") or attrs.get("url.path") or span_name),
                            metadata_json={"trace_id": trace_id, "span_id": span_id, "service": service_name, "otlp": True},
                        )
                    )

    db.commit()
    return {"partialSuccess": {}, "acceptedSpans": accepted_spans, "errorSpans": error_spans}


@router.post("/v1/logs")
@router.post("/api/v1/logs")
async def ingest_otlp_logs(
    request: Request,
    x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"),
    db: Session = Depends(get_db),
):
    """Ingest standard OpenTelemetry Protocol (OTLP/HTTP JSON) ExportLogsServiceRequest."""
    app = _resolve_app_from_headers(request, db, x_nexvora_key)
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid OTLP/JSON logs payload")

    resource_logs = payload.get("resourceLogs", [])
    accepted_logs = 0

    for rl in resource_logs:
        res_attrs = (rl.get("resource") or {}).get("attributes")
        service_name = _extract_otlp_attr(res_attrs, "service.name", app.name or "otel-service")

        for sl in rl.get("scopeLogs", []):
            for rec in sl.get("logRecords", []):
                body_obj = rec.get("body") or {}
                msg = str(body_obj.get("stringValue") or body_obj or "OTLP log event")
                severity_text = rec.get("severityText") or "INFO"
                attrs = _otlp_attrs_to_dict(rec.get("attributes"))
                attrs["severity"] = severity_text
                attrs["service"] = service_name
                if rec.get("traceId"):
                    attrs["trace_id"] = rec["traceId"]

                db.add(
                    AppErrorLog(
                        app_id=app.id,
                        message=f"[{severity_text}] {msg}",
                        stack_trace=str(attrs.get("exception.stacktrace") or ""),
                        url=str(attrs.get("http.target") or attrs.get("url.path") or service_name),
                        metadata_json=attrs,
                    )
                )
                accepted_logs += 1

    db.commit()
    return {"partialSuccess": {}, "acceptedLogs": accepted_logs}
