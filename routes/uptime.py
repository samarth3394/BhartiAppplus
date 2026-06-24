"""Uptime Monitor routes — monitoring config, history, incidents."""

from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required, current_user
from datetime import datetime, timedelta, timezone
from models import App, UptimeCheck, UptimeIncident, ActivityLog

uptime_bp = Blueprint('uptime', __name__)


@uptime_bp.route('/uptime')
@login_required
def uptime_page():
    return render_template('uptime.html')


@uptime_bp.route('/api/uptime/status')
@login_required
def uptime_status():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        app = s.query(App).filter_by(id=app_id).first()
        if not app:
            return jsonify({'error': 'App not found'}), 404

        # Latest check
        latest = s.query(UptimeCheck).filter_by(app_id=app_id).order_by(
            UptimeCheck.checked_at.desc()
        ).first()

        # Active incident
        active_incident = s.query(UptimeIncident).filter(
            UptimeIncident.app_id == app_id,
            UptimeIncident.resolved_at.is_(None)
        ).first()

        # Stats for different periods
        now = datetime.now(timezone.utc)
        periods = {'24h': 24, '7d': 168, '30d': 720}
        stats = {}
        for label, hours in periods.items():
            since = now - timedelta(hours=hours)
            checks = s.query(UptimeCheck).filter(
                UptimeCheck.app_id == app_id,
                UptimeCheck.checked_at >= since
            ).all()
            if checks:
                up_count = sum(1 for c in checks if c.is_up)
                avg_response = sum(c.response_time_ms or 0 for c in checks) / len(checks)
                stats[label] = {
                    'uptime_pct': round((up_count / len(checks)) * 100, 2),
                    'avg_response_ms': round(avg_response, 1),
                    'total_checks': len(checks),
                }
            else:
                stats[label] = {'uptime_pct': 100, 'avg_response_ms': 0, 'total_checks': 0}

        return jsonify({
            'app': app.to_dict(),
            'is_up': latest.is_up if latest else True,
            'latest_check': latest.to_dict() if latest else None,
            'active_incident': active_incident.to_dict() if active_incident else None,
            'stats': stats,
            'ssl_expiry': latest.ssl_expiry_date.isoformat() if latest and latest.ssl_expiry_date else None,
        })
    finally:
        s.close()


@uptime_bp.route('/api/uptime/history')
@login_required
def uptime_history():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        period = request.args.get('period', '24h')
        hours_map = {'24h': 24, '7d': 168, '30d': 720}
        hours = hours_map.get(period, 24)

        since = datetime.now(timezone.utc) - timedelta(hours=hours)
        checks = s.query(UptimeCheck).filter(
            UptimeCheck.app_id == app_id,
            UptimeCheck.checked_at >= since
        ).order_by(UptimeCheck.checked_at.asc()).all()

        return jsonify({
            'checks': [c.to_dict() for c in checks],
            'period': period,
        })
    finally:
        s.close()


@uptime_bp.route('/api/uptime/incidents')
@login_required
def uptime_incidents():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        incidents = s.query(UptimeIncident).filter_by(
            app_id=app_id
        ).order_by(UptimeIncident.started_at.desc()).limit(50).all()

        return jsonify({
            'incidents': [i.to_dict() for i in incidents]
        })
    finally:
        s.close()


@uptime_bp.route('/api/uptime/configure', methods=['POST'])
@login_required
def configure_monitoring():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        app = s.query(App).filter_by(id=app_id).first()
        if not app:
            return jsonify({'error': 'App not found'}), 404

        if app.owner_id != current_user.id:
            return jsonify({'error': 'Only the app owner can change monitoring settings'}), 403

        data = request.get_json()
        url = data.get('url', '').strip()
        monitoring_enabled = data.get('monitoring_enabled', True)

        if url:
            app.url = url

        settings = app.settings or {}
        settings['monitoring_enabled'] = monitoring_enabled
        app.settings = settings
        # Force SQLAlchemy to detect JSON change
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(app, 'settings')

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Updated monitoring settings',
            entity_type='uptime',
            entity_id=app_id,
        )
        s.add(log)
        s.commit()

        return jsonify({'message': 'Settings updated', 'app': app.to_dict()})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()
