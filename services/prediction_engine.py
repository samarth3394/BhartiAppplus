"""
Failure Prediction Engine — Pandas-powered trend analysis.
Collects 7-day monitor data, calculates trends, assigns confidence scores,
and triggers alerts when confidence exceeds 70%.
"""

import numpy as np
from datetime import datetime, timedelta, timezone

try:
    import pandas as pd
except ImportError:
    pd = None


def collect_7day_data(session, app_id):
    """Collect 7 days of uptime checks and server metrics for an app."""
    from models import UptimeCheck, ServerMetric

    cutoff = datetime.now(timezone.utc) - timedelta(days=7)

    uptime_checks = session.query(UptimeCheck).filter(
        UptimeCheck.app_id == app_id,
        UptimeCheck.checked_at >= cutoff
    ).order_by(UptimeCheck.checked_at.asc()).all()

    server_metrics = session.query(ServerMetric).filter(
        ServerMetric.app_id == app_id,
        ServerMetric.recorded_at >= cutoff
    ).order_by(ServerMetric.recorded_at.asc()).all()

    return uptime_checks, server_metrics


def _calculate_trend_slope(values):
    """Calculate the slope of a linear regression line through the data points.
    A positive slope means the value is increasing over time.
    Returns slope per data-point index.
    """
    if not values or len(values) < 2:
        return 0.0
    x = np.arange(len(values), dtype=float)
    y = np.array(values, dtype=float)
    # Handle constant arrays
    if np.std(y) == 0:
        return 0.0
    # Linear regression: y = mx + b
    n = len(x)
    slope = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / \
            (n * np.sum(x ** 2) - np.sum(x) ** 2)
    return float(slope)


def analyze_trends(uptime_checks, server_metrics):
    """Analyze trends in the collected data using Pandas.
    Returns a dict with trend info and a confidence score (0-100).
    """
    if pd is None:
        return {
            'confidence': 0.0,
            'trends': {},
            'error': 'pandas is not installed'
        }

    # --- Uptime Trend Analysis ---
    response_times = []
    error_count = 0
    total_checks = 0

    if uptime_checks:
        uptime_data = []
        for check in uptime_checks:
            uptime_data.append({
                'checked_at': check.checked_at,
                'response_time_ms': check.response_time_ms or 0,
                'is_up': 1 if check.is_up else 0,
                'status_code': check.status_code or 0,
            })

        df_uptime = pd.DataFrame(uptime_data)
        total_checks = len(df_uptime)

        # Response time trend
        response_times = df_uptime['response_time_ms'].tolist()

        # Error rate (non-2xx status codes or is_up=False)
        error_count = len(df_uptime[
            (df_uptime['is_up'] == 0) |
            ((df_uptime['status_code'] >= 500) & (df_uptime['status_code'] > 0))
        ])

    # --- Server Metrics Trend Analysis ---
    memory_values = []
    cpu_values = []

    if server_metrics:
        metrics_data = []
        for metric in server_metrics:
            metrics_data.append({
                'recorded_at': metric.recorded_at,
                'cpu_percent': metric.cpu_percent or 0,
                'memory_percent': metric.memory_percent or 0,
                'disk_percent': metric.disk_percent or 0,
            })

        df_metrics = pd.DataFrame(metrics_data)
        memory_values = df_metrics['memory_percent'].tolist()
        cpu_values = df_metrics['cpu_percent'].tolist()

    # --- Calculate Trend Slopes ---
    response_time_slope = _calculate_trend_slope(response_times)
    memory_slope = _calculate_trend_slope(memory_values)
    cpu_slope = _calculate_trend_slope(cpu_values)
    error_rate = (error_count / total_checks * 100) if total_checks > 0 else 0

    # --- Confidence Scoring ---
    # Each factor contributes to the overall crash confidence
    confidence = 0.0

    # Factor 1: Response time climbing (slope > 5ms per check = concern)
    if response_time_slope > 0:
        rt_score = min(response_time_slope / 10.0 * 30, 30)  # Max 30 points
        confidence += rt_score

    # Factor 2: Error rate increasing (> 5% errors = danger)
    if error_rate > 0:
        err_score = min(error_rate / 20.0 * 30, 30)  # Max 30 points
        confidence += err_score

    # Factor 3: Memory climbing (slope > 0.5% per check = danger)
    if memory_slope > 0:
        mem_score = min(memory_slope / 2.0 * 20, 20)  # Max 20 points
        confidence += mem_score

    # Factor 4: CPU climbing
    if cpu_slope > 0:
        cpu_score = min(cpu_slope / 2.0 * 20, 20)  # Max 20 points
        confidence += cpu_score

    # Clamp to 0-100
    confidence = min(max(round(confidence, 1), 0), 100)

    # If we have almost no data, reduce confidence significantly
    if total_checks < 5 and len(memory_values) < 5:
        confidence = min(confidence, 25.0)

    trends = {
        'response_time': {
            'slope': round(response_time_slope, 3),
            'direction': 'climbing' if response_time_slope > 1 else 'stable' if abs(response_time_slope) <= 1 else 'improving',
            'avg_ms': round(np.mean(response_times), 1) if response_times else 0,
            'data_points': len(response_times),
        },
        'error_rate': {
            'percentage': round(error_rate, 1),
            'total_errors': error_count,
            'total_checks': total_checks,
            'direction': 'critical' if error_rate > 10 else 'warning' if error_rate > 5 else 'healthy',
        },
        'memory': {
            'slope': round(memory_slope, 3),
            'direction': 'climbing' if memory_slope > 0.3 else 'stable' if abs(memory_slope) <= 0.3 else 'improving',
            'avg_percent': round(np.mean(memory_values), 1) if memory_values else 0,
            'data_points': len(memory_values),
        },
        'cpu': {
            'slope': round(cpu_slope, 3),
            'direction': 'climbing' if cpu_slope > 0.3 else 'stable' if abs(cpu_slope) <= 0.3 else 'improving',
            'avg_percent': round(np.mean(cpu_values), 1) if cpu_values else 0,
            'data_points': len(cpu_values),
        },
    }

    return {
        'confidence': confidence,
        'trends': trends,
    }


def generate_action_suggested(confidence, trends):
    """Generate a human-readable action suggestion based on the analysis."""
    actions = []

    if confidence >= 80:
        actions.append("🚨 CRITICAL: Very high probability of system failure within 48 hours.")
    elif confidence >= 70:
        actions.append("⚠️ WARNING: Significant risk of degraded performance or crash within 48 hours.")
    elif confidence >= 40:
        actions.append("📊 MONITOR: Some concerning trends detected. Keep a close watch.")
    else:
        actions.append("✅ HEALTHY: No significant risk detected at this time.")

    rt = trends.get('response_time', {})
    if rt.get('direction') == 'climbing':
        actions.append(f"• Response time is climbing (avg: {rt.get('avg_ms', 0)}ms). Consider scaling or optimizing slow endpoints.")

    err = trends.get('error_rate', {})
    if err.get('direction') in ('warning', 'critical'):
        actions.append(f"• Error rate at {err.get('percentage', 0)}%. Investigate server logs for recurring 5xx errors.")

    mem = trends.get('memory', {})
    if mem.get('direction') == 'climbing':
        actions.append(f"• Memory usage climbing (avg: {mem.get('avg_percent', 0)}%). Check for memory leaks or increase RAM.")

    cpu = trends.get('cpu', {})
    if cpu.get('direction') == 'climbing':
        actions.append(f"• CPU usage climbing (avg: {cpu.get('avg_percent', 0)}%). Consider load balancing or code optimization.")

    return "\n".join(actions)


def run_prediction(session, app_id):
    """Main entry point: collect data, analyze, save prediction, trigger alerts."""
    from models import FailurePrediction

    # Step 1: Collect data
    uptime_checks, server_metrics = collect_7day_data(session, app_id)

    # Step 2: Analyze trends
    result = analyze_trends(uptime_checks, server_metrics)

    confidence = result['confidence']
    trends = result['trends']

    # Step 3: Generate action
    action = generate_action_suggested(confidence, trends)

    # Step 4: Save prediction
    prediction = FailurePrediction(
        app_id=app_id,
        confidence_percentage=confidence,
        trend_summary=trends,
        action_suggested=action,
        is_alert_sent=False,
    )
    session.add(prediction)

    # Step 5: Send alert if confidence > 70%
    alert_sent = False
    if confidence >= 70:
        from services.alert_service import send_prediction_alert
        alert_sent = send_prediction_alert(session, prediction, app_id)
        prediction.is_alert_sent = alert_sent

    session.commit()

    return prediction.to_dict()
