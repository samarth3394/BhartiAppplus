import os
import tempfile
import pytest
from datetime import datetime, timedelta, timezone

_tmp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_tmp_db.close()
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp_db.name}"

import services.ai_service as ai_service  # noqa: E402
ai_service.GENAI_API_KEY = None  # Avoid live network calls during unit tests

from models import (  # noqa: E402
    init_db, User, App, Workspace, UptimeIncident,
    ServerMetric, OtelTraceSpan, OtelMetricPoint
)
from dependencies import get_password_hash  # noqa: E402
from routes.api_ingest import (  # noqa: E402
    ingest_error, ingest_otlp_metrics, ingest_otlp_traces, ingest_otlp_logs, ErrorIngestRequest
)
from routes.bugs import list_bugs, generate_bug_fix_diff, create_bug_pr  # noqa: E402
from routes.dashboard import dashboard_stats  # noqa: E402
from routes.ai_dashboard import update_ai_dashboard_settings, AISettingsRequest  # noqa: E402
from routes.logs import get_traces, get_logs  # noqa: E402


def _run_coro(coro):
    try:
        coro.send(None)
    except StopIteration as exc:
        return exc.value
    raise RuntimeError("Unexpected pending coroutine in synchronous test runner")


class _FakeRequest:
    def __init__(self, path: str, headers: dict | None = None, cookies: dict | None = None, payload: dict | None = None):
        self.url = type("URL", (), {"path": path})()
        self.headers = headers or {}
        self.cookies = cookies or {}
        self._payload = payload if payload is not None else {}

    async def json(self):
        return self._payload


@pytest.fixture(scope="module")
def seeded_ctx():
    _, SessionLocal = init_db(os.environ["DATABASE_URL"])
    db = SessionLocal()

    user = User(
        email="cto@brexal.test",
        password_hash=get_password_hash("password123"),
        full_name="Test CTO",
    )
    db.add(user)
    db.flush()

    ws = Workspace(name="Test Workspace", owner_id=user.id)
    db.add(ws)
    db.flush()

    test_app = App(
        workspace_id=ws.id,
        name="Payments Core",
        url="https://payments.brexal.test",
        owner_id=user.id,
        client_key="test-otlp-client-key-123",
        settings={"hourly_revenue": 10000.0, "sla_target_pct": 99.9, "currency": "USD"},
    )
    db.add(test_app)
    db.flush()

    started = datetime.now(timezone.utc) - timedelta(hours=2)
    resolved = started + timedelta(minutes=10)
    db.add(
        UptimeIncident(
            app_id=test_app.id,
            started_at=started,
            resolved_at=resolved,
            duration_seconds=600,
        )
    )
    db.commit()
    db.refresh(user)
    db.refresh(test_app)

    yield db, user, test_app

    db.close()
    try:
        os.unlink(_tmp_db.name)
    except OSError:
        pass


def test_otlp_metrics_traces_logs_pipeline(seeded_ctx):
    db, user, test_app = seeded_ctx
    auth_hdr = {"Authorization": f"Bearer {test_app.client_key}"}
    cookies = {"current_app_id": test_app.id}

    # 1. OTLP/HTTP Metrics
    metrics_payload = {
        "resourceMetrics": [
            {
                "resource": {"attributes": [{"key": "service.name", "value": {"stringValue": "checkout-svc"}}]},
                "scopeMetrics": [
                    {
                        "metrics": [
                            {
                                "name": "system.cpu.utilization",
                                "unit": "1",
                                "gauge": {"dataPoints": [{"asDouble": 0.42}]},
                            },
                            {
                                "name": "system.memory.utilization",
                                "unit": "1",
                                "gauge": {"dataPoints": [{"asDouble": 0.65}]},
                            },
                        ]
                    }
                ],
            }
        ]
    }
    m_res = _run_coro(ingest_otlp_metrics(_FakeRequest("/v1/metrics", auth_hdr, payload=metrics_payload), None, db))
    assert m_res["acceptedMetrics"] == 2
    assert db.query(OtelMetricPoint).filter_by(app_id=test_app.id).count() == 2
    latest_srv = db.query(ServerMetric).filter_by(app_id=test_app.id).first()
    assert latest_srv.cpu_percent == 42.0
    assert latest_srv.ram_percent == 65.0

    # 2. OTLP/HTTP Traces (with ERROR span)
    traces_payload = {
        "resourceSpans": [
            {
                "resource": {"attributes": [{"key": "service.name", "value": {"stringValue": "checkout-svc"}}]},
                "scopeSpans": [
                    {
                        "spans": [
                            {
                                "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
                                "spanId": "00f067aa0ba902b7",
                                "name": "POST /checkout/charge",
                                "kind": 2,
                                "startTimeUnixNano": "1700000000000000000",
                                "endTimeUnixNano": "1700000000250000000",
                                "status": {"code": 2, "message": "PoolTimeoutError on db_pool"},
                                "attributes": [
                                    {"key": "http.status_code", "value": {"intValue": "500"}},
                                    {"key": "exception.stacktrace", "value": {"stringValue": 'File "services/db_pool.py", line 84'}},
                                ],
                            }
                        ]
                    }
                ],
            }
        ]
    }
    t_res = _run_coro(ingest_otlp_traces(_FakeRequest("/v1/traces", auth_hdr, payload=traces_payload), None, db))
    assert t_res["acceptedSpans"] == 1
    assert t_res["errorSpans"] == 1
    assert db.query(OtelTraceSpan).filter_by(app_id=test_app.id).count() == 1

    # 3. OTLP/HTTP Logs
    logs_payload = {
        "resourceLogs": [
            {
                "resource": {"attributes": [{"key": "service.name", "value": {"stringValue": "checkout-svc"}}]},
                "scopeLogs": [
                    {
                        "logRecords": [
                            {
                                "severityText": "ERROR",
                                "body": {"stringValue": "Database pool connection timed out"},
                            }
                        ]
                    }
                ],
            }
        ]
    }
    l_res = _run_coro(ingest_otlp_logs(_FakeRequest("/api/v1/logs", auth_hdr, payload=logs_payload), None, db))
    assert l_res["acceptedLogs"] == 1

    traces_out = _run_coro(get_traces(_FakeRequest("/api/traces", cookies=cookies), None, 50, db, user))
    assert traces_out["total_spans"] == 1
    assert traces_out["spans"][0]["duration_ms"] == 250.0

    logs_out = _run_coro(get_logs(_FakeRequest("/api/logs", cookies=cookies), None, 50, 0, db, user))
    assert logs_out["total"] >= 2


def test_self_healing_error_to_diff_and_pr_draft(seeded_ctx):
    db, user, test_app = seeded_ctx
    cookies = {"current_app_id": test_app.id}

    err_data = ErrorIngestRequest(
        message="PoolTimeoutError acquiring DB connection",
        url="/checkout/charge",
        line="84",
        stack='File "services/db_pool.py", line 84, in get_db_connection\n    conn = pool.acquire(timeout=2.0)',
        auto_create_bug=True,
        severity="critical",
    )
    err_res = _run_coro(ingest_error(err_data, _FakeRequest("/api/ingest/error"), test_app.client_key, db))
    bug_id = err_res["bug_id"]
    assert bug_id is not None

    fix_res = _run_coro(generate_bug_fix_diff(bug_id, _FakeRequest(f"/api/bugs/{bug_id}/generate-fix", cookies=cookies), user, db))
    fix = fix_res["fix"]
    assert "--- a/" in fix["unified_diff"]
    assert "+++ b/" in fix["unified_diff"]
    assert fix["target_file"] == "services/db_pool.py"

    pr_res = _run_coro(create_bug_pr(bug_id, None, _FakeRequest(f"/api/bugs/{bug_id}/create-pr", cookies=cookies), user, db))
    assert pr_res["status"] == "draft_ready"
    assert pr_res["branch_name"] == f"brexal/fix-{bug_id[:8]}"
    assert "gh pr create" in pr_res["cli_command"]


def test_revenue_impact_observability_and_sla_burn_rate(seeded_ctx):
    db, user, test_app = seeded_ctx
    cookies = {"current_app_id": test_app.id}

    set_res = _run_coro(
        update_ai_dashboard_settings(
            AISettingsRequest(hourly_revenue=12000.0, sla_target_pct=99.9, currency="INR"),
            _FakeRequest("/api/ai-dashboard/settings", cookies=cookies),
            user,
            db,
        )
    )
    rev = set_res["revenue_impact"]
    assert rev["currency"] == "INR"
    assert round(rev["downtime_minutes_30d"], 1) == 10.0
    assert round(rev["revenue_lost_30d"], 0) == 2000.0
    assert 22.0 < rev["sla_burn_rate_pct"] < 24.5

    dash = _run_coro(dashboard_stats(_FakeRequest("/api/dashboard/stats", cookies=cookies), user, db))
    assert dash["revenue_impact"]["currency"] == "INR"
    assert dash["revenue_impact"]["open_bug_exposure_per_hour"] >= 12000.0
    assert dash["otlp"]["spans"] >= 1
    assert dash["otlp"]["metrics"] >= 2

    bugs_out = _run_coro(list_bugs(_FakeRequest("/api/bugs", cookies=cookies), None, None, None, None, "newest", user, db))
    assert bugs_out["currency"] == "INR"
    assert bugs_out["bugs"][0]["revenue_impact"]["hourly_exposure"] == 12000.0
