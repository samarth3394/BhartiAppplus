"""
Uptime Monitoring Service
Performs HTTP checks and SSL certificate validation for monitored apps.
"""

import requests
import ssl
import socket
from datetime import datetime, timezone
from urllib.parse import urlparse
from models import UptimeCheck, UptimeIncident, App, ActivityLog


def check_app_uptime(session, app):
    """
    Perform an HTTP check on the app's URL.
    Returns the UptimeCheck record created.
    """
    if not app.url:
        return None

    url = app.url
    if not url.startswith('http'):
        url = 'https://' + url

    check = UptimeCheck(app_id=app.id)

    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
        check.status_code = response.status_code
        check.response_time_ms = response.elapsed.total_seconds() * 1000
        check.is_up = response.status_code < 400
        check.error_message = '' if check.is_up else f'HTTP {response.status_code}'
    except requests.exceptions.Timeout:
        check.is_up = False
        check.error_message = 'Connection timed out'
        check.response_time_ms = 10000
    except requests.exceptions.ConnectionError:
        check.is_up = False
        check.error_message = 'Connection refused'
    except requests.exceptions.RequestException as e:
        check.is_up = False
        check.error_message = str(e)[:500]

    # Check SSL certificate
    try:
        ssl_expiry = get_ssl_expiry(url)
        if ssl_expiry:
            check.ssl_expiry_date = ssl_expiry
    except Exception:
        pass

    session.add(check)

    # Handle incidents
    _handle_incident(session, app, check)

    session.commit()
    return check


def get_ssl_expiry(url):
    """Extract SSL certificate expiry date from a URL."""
    parsed = urlparse(url)
    hostname = parsed.hostname
    port = parsed.port or 443

    if parsed.scheme == 'http':
        return None

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                expiry_str = cert.get('notAfter', '')
                if expiry_str:
                    return datetime.strptime(expiry_str, '%b %d %H:%M:%S %Y %Z').replace(tzinfo=timezone.utc)
    except Exception:
        return None

    return None


def _handle_incident(session, app, check):
    """Detect and manage uptime incidents."""
    # Get the previous check
    prev_check = session.query(UptimeCheck).filter(
        UptimeCheck.app_id == app.id,
        UptimeCheck.id != check.id
    ).order_by(UptimeCheck.checked_at.desc()).first()

    if not check.is_up:
        # Check if there's an active (unresolved) incident
        active_incident = session.query(UptimeIncident).filter(
            UptimeIncident.app_id == app.id,
            UptimeIncident.resolved_at.is_(None)
        ).first()

        if not active_incident:
            # Create new incident
            incident = UptimeIncident(
                app_id=app.id,
                alert_sent=False
            )
            session.add(incident)

            # Log activity
            log = ActivityLog(
                app_id=app.id,
                action=f'App went DOWN — {check.error_message}',
                entity_type='incident',
                entity_id=incident.id,
            )
            session.add(log)

    elif check.is_up and prev_check and not prev_check.is_up:
        # App came back up — resolve incident
        active_incident = session.query(UptimeIncident).filter(
            UptimeIncident.app_id == app.id,
            UptimeIncident.resolved_at.is_(None)
        ).first()

        if active_incident:
            now = datetime.now(timezone.utc)
            active_incident.resolved_at = now
            duration = (now - active_incident.started_at).total_seconds()
            active_incident.duration_seconds = int(duration)

            log = ActivityLog(
                app_id=app.id,
                action=f'App is back UP — was down for {int(duration)}s',
                entity_type='incident',
                entity_id=active_incident.id,
            )
            session.add(log)


def run_all_uptime_checks(Session):
    """Run uptime checks for all active apps. Called by the scheduler."""
    session = Session()
    try:
        apps = session.query(App).filter(App.is_active == True, App.url != '').all()
        for app in apps:
            settings = app.settings or {}
            if settings.get('monitoring_enabled', True):
                try:
                    check_app_uptime(session, app)
                except Exception as e:
                    print(f"Error checking {app.name}: {e}")
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Uptime check error: {e}")
    finally:
        session.close()
