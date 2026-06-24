from flask import Blueprint, jsonify, render_template, request, session as flask_session
from flask_login import login_required, current_user
from models import App, ServerMetric
from datetime import datetime, timedelta, timezone

server_bp = Blueprint('server', __name__)

@server_bp.route('/server')
@login_required
def server_page():
    return render_template('server.html')

@server_bp.route('/api/server/metrics', methods=['GET'])
@login_required
def get_metrics():
    app_id = flask_session.get('current_app_id')
    if not app_id:
        return jsonify({'error': 'No app selected'}), 400

    from app import db_session
    s = db_session()
    try:
        # Check if user has access to app
        app = s.query(App).filter_by(id=app_id).first()
        if not app:
            return jsonify({'error': 'App not found'}), 404

        period = request.args.get('period', '1h')
        hours = 1
        if period == '24h':
            hours = 24
        elif period == '7d':
            hours = 24 * 7

        cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)

        metrics = s.query(ServerMetric).filter(
            ServerMetric.app_id == app.id,
            ServerMetric.timestamp >= cutoff
        ).order_by(ServerMetric.timestamp.asc()).all()

        return jsonify({
            'metrics': [m.to_dict() for m in metrics]
        }), 200

    finally:
        s.close()
