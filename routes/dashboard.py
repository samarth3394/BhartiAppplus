"""Dashboard routes — main dashboard stats and activity feed."""

from flask import Blueprint, jsonify, render_template, session
from flask_login import login_required, current_user
from datetime import datetime, timedelta, timezone
from models import (
    App, AppMember, Bug, BugStatusEnum, SeverityEnum,
    MaintenanceTask, UptimeCheck, ActivityLog, UptimeIncident, RoleEnum
)
from services.health_score import calculate_health_score, get_uptime_percentage

dashboard_bp = Blueprint('dashboard', __name__)


def _get_current_app(session_db):
    """Get the currently selected app for the user."""
    app_id = session.get('current_app_id')
    if app_id:
        app = session_db.query(App).filter_by(id=app_id).first()
        if app:
            return app

    # Fall back to first owned app
    app = session_db.query(App).filter_by(owner_id=current_user.id).first()
    if not app:
        # Check memberships
        member = session_db.query(AppMember).filter_by(user_id=current_user.id).first()
        if member:
            app = member.app
    return app


@dashboard_bp.route('/dashboard')
@login_required
def dashboard_page():
    return render_template('dashboard.html')


@dashboard_bp.route('/api/dashboard/stats')
@login_required
def dashboard_stats():
    from app import db_session
    s = db_session()
    try:
        app = _get_current_app(s)
        if not app:
            return jsonify({
                'has_app': False,
                'message': 'No app found. Create your first app to get started.'
            }), 200

        session['current_app_id'] = app.id

        # Health score
        health = calculate_health_score(s, app.id)

        # Bug counts
        total_bugs = s.query(Bug).filter_by(app_id=app.id).count()
        active_bugs = s.query(Bug).filter(
            Bug.app_id == app.id,
            Bug.status.in_([BugStatusEnum.open, BugStatusEnum.in_progress, BugStatusEnum.testing])
        ).count()
        resolved_bugs = s.query(Bug).filter(
            Bug.app_id == app.id,
            Bug.status == BugStatusEnum.resolved
        ).count()

        # Bug severity breakdown
        severity_counts = {}
        for sev in SeverityEnum:
            count = s.query(Bug).filter(
                Bug.app_id == app.id,
                Bug.severity == sev,
                Bug.status != BugStatusEnum.resolved
            ).count()
            severity_counts[sev.value] = count

        # Uptime percentages
        uptime_24h = get_uptime_percentage(s, app.id, hours=24)
        uptime_7d = get_uptime_percentage(s, app.id, hours=168)
        uptime_30d = get_uptime_percentage(s, app.id, hours=720)

        # Current status
        latest_check = s.query(UptimeCheck).filter_by(app_id=app.id).order_by(
            UptimeCheck.checked_at.desc()
        ).first()

        # Pending maintenance tasks
        now = datetime.now(timezone.utc)
        total_tasks = s.query(MaintenanceTask).filter_by(
            app_id=app.id, is_active=True
        ).count()
        overdue_tasks = s.query(MaintenanceTask).filter(
            MaintenanceTask.app_id == app.id,
            MaintenanceTask.is_active == True,
            MaintenanceTask.due_date < now
        ).count()

        # Active incidents
        active_incidents = s.query(UptimeIncident).filter(
            UptimeIncident.app_id == app.id,
            UptimeIncident.resolved_at.is_(None)
        ).count()

        # SSL info
        ssl_expiry = None
        ssl_days_remaining = None
        if latest_check and latest_check.ssl_expiry_date:
            ssl_expiry = latest_check.ssl_expiry_date.isoformat()
            ssl_days_remaining = (latest_check.ssl_expiry_date - now).days

        return jsonify({
            'has_app': True,
            'app': app.to_dict(),
            'health_score': health,
            'bugs': {
                'total': total_bugs,
                'active': active_bugs,
                'resolved': resolved_bugs,
                'severity': severity_counts,
            },
            'uptime': {
                'percentage_24h': uptime_24h,
                'percentage_7d': uptime_7d,
                'percentage_30d': uptime_30d,
                'is_up': latest_check.is_up if latest_check else True,
                'last_check': latest_check.to_dict() if latest_check else None,
                'active_incidents': active_incidents,
            },
            'maintenance': {
                'total_tasks': total_tasks,
                'overdue_tasks': overdue_tasks,
            },
            'ssl': {
                'expiry_date': ssl_expiry,
                'days_remaining': ssl_days_remaining,
            }
        })
    finally:
        s.close()


@dashboard_bp.route('/api/dashboard/activity')
@login_required
def dashboard_activity():
    from app import db_session
    s = db_session()
    try:
        app = _get_current_app(s)
        if not app:
            return jsonify({'activities': []}), 200

        activities = s.query(ActivityLog).filter_by(
            app_id=app.id
        ).order_by(ActivityLog.created_at.desc()).limit(50).all()

        return jsonify({
            'activities': [a.to_dict() for a in activities]
        })
    finally:
        s.close()


@dashboard_bp.route('/api/dashboard/apps')
@login_required
def user_apps_list():
    """Get list of all apps for the app switcher."""
    from app import db_session
    s = db_session()
    try:
        # Get owned apps
        owned = s.query(App).filter_by(owner_id=current_user.id).all()

        # Get apps where user is a member
        member_apps = s.query(App).join(AppMember).filter(
            AppMember.user_id == current_user.id,
            AppMember.accepted_at.isnot(None)
        ).all()

        all_apps = {a.id: a for a in owned}
        for a in member_apps:
            if a.id not in all_apps:
                all_apps[a.id] = a

        current_app_id = session.get('current_app_id')

        return jsonify({
            'apps': [a.to_dict() for a in all_apps.values()],
            'current_app_id': current_app_id,
        })
    finally:
        s.close()


@dashboard_bp.route('/api/dashboard/switch/<app_id>', methods=['POST'])
@login_required
def switch_app(app_id):
    from app import db_session
    s = db_session()
    try:
        # Verify user has access
        app = s.query(App).filter_by(id=app_id).first()
        if not app:
            return jsonify({'error': 'App not found'}), 404

        is_owner = app.owner_id == current_user.id
        is_member = s.query(AppMember).filter_by(
            app_id=app_id, user_id=current_user.id
        ).first()

        if not is_owner and not is_member:
            return jsonify({'error': 'Access denied'}), 403

        session['current_app_id'] = app_id
        return jsonify({'message': 'Switched app', 'app': app.to_dict()})
    finally:
        s.close()
