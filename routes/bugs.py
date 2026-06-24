"""Bug Tracker routes — full CRUD, status pipeline, attachments, audit trail."""

import os
import uuid
from flask import Blueprint, jsonify, request, render_template, current_app
from flask_login import login_required, current_user
from datetime import datetime, timezone
from models import (
    Bug, BugAttachment, BugHistory, BugStatusEnum, SeverityEnum,
    ActivityLog, AppMember, RoleEnum
)

bugs_bp = Blueprint('bugs', __name__)


@bugs_bp.route('/bugs')
@login_required
def bugs_page():
    return render_template('bugs.html')


@bugs_bp.route('/api/bugs', methods=['GET'])
@login_required
def list_bugs():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # Filters
        status = request.args.get('status')
        severity = request.args.get('severity')
        assignee = request.args.get('assignee')
        search = request.args.get('search', '').strip()

        query = s.query(Bug).filter_by(app_id=app_id)

        if status:
            try:
                query = query.filter(Bug.status == BugStatusEnum(status))
            except ValueError:
                pass

        if severity:
            try:
                query = query.filter(Bug.severity == SeverityEnum(severity))
            except ValueError:
                pass

        if assignee:
            query = query.filter(Bug.assigned_to == assignee)

        if search:
            query = query.filter(Bug.title.ilike(f'%{search}%'))

        sort = request.args.get('sort', 'newest')
        if sort == 'oldest':
            query = query.order_by(Bug.created_at.asc())
        elif sort == 'severity':
            query = query.order_by(Bug.severity.desc())
        else:
            query = query.order_by(Bug.created_at.desc())

        bugs = query.all()
        return jsonify({'bugs': [b.to_dict() for b in bugs]})
    finally:
        s.close()


@bugs_bp.route('/api/bugs', methods=['POST'])
@login_required
def create_bug():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # Permission check
        _check_permission(s, app_id, min_role=RoleEnum.developer)

        data = request.get_json()
        title = data.get('title', '').strip()
        if not title:
            return jsonify({'error': 'Title is required'}), 400

        severity_str = data.get('severity', 'medium')
        try:
            severity = SeverityEnum(severity_str)
        except ValueError:
            severity = SeverityEnum.medium

        bug = Bug(
            app_id=app_id,
            title=title,
            description=data.get('description', ''),
            severity=severity,
            status=BugStatusEnum.open,
            reported_by=current_user.id,
            assigned_to=data.get('assigned_to'),
        )
        s.add(bug)

        # History entry
        history = BugHistory(
            bug_id=bug.id,
            changed_by=current_user.id,
            field_changed='created',
            old_value='',
            new_value=title,
        )
        s.add(history)

        # Activity log
        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Created bug: {title}',
            entity_type='bug',
            entity_id=bug.id,
            metadata_json={'severity': severity.value},
        )
        s.add(log)

        s.commit()
        return jsonify({'message': 'Bug created', 'bug': bug.to_dict()}), 201
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@bugs_bp.route('/api/bugs/<bug_id>', methods=['PUT'])
@login_required
def update_bug(bug_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        _check_permission(s, app_id, min_role=RoleEnum.developer)

        bug = s.query(Bug).filter_by(id=bug_id, app_id=app_id).first()
        if not bug:
            return jsonify({'error': 'Bug not found'}), 404

        data = request.get_json()

        # Track changes
        changes = []

        if 'title' in data and data['title'] != bug.title:
            changes.append(('title', bug.title, data['title']))
            bug.title = data['title']

        if 'description' in data and data['description'] != bug.description:
            changes.append(('description', bug.description[:100], data['description'][:100]))
            bug.description = data['description']

        if 'severity' in data:
            try:
                new_severity = SeverityEnum(data['severity'])
                if new_severity != bug.severity:
                    changes.append(('severity', bug.severity.value, new_severity.value))
                    bug.severity = new_severity
            except ValueError:
                pass

        if 'status' in data:
            try:
                new_status = BugStatusEnum(data['status'])
                if new_status != bug.status:
                    changes.append(('status', bug.status.value, new_status.value))
                    bug.status = new_status
                    if new_status == BugStatusEnum.resolved:
                        bug.resolved_at = datetime.now(timezone.utc)
            except ValueError:
                pass

        if 'assigned_to' in data:
            if data['assigned_to'] != bug.assigned_to:
                changes.append(('assigned_to', bug.assigned_to or 'unassigned', data['assigned_to'] or 'unassigned'))
                bug.assigned_to = data['assigned_to'] or None

        bug.updated_at = datetime.now(timezone.utc)

        # Record history
        for field, old_val, new_val in changes:
            history = BugHistory(
                bug_id=bug.id,
                changed_by=current_user.id,
                field_changed=field,
                old_value=str(old_val),
                new_value=str(new_val),
            )
            s.add(history)

        # Activity log
        if changes:
            fields_changed = ', '.join(c[0] for c in changes)
            log = ActivityLog(
                app_id=app_id,
                user_id=current_user.id,
                action=f'Updated bug "{bug.title}": {fields_changed}',
                entity_type='bug',
                entity_id=bug.id,
            )
            s.add(log)

        s.commit()
        return jsonify({'message': 'Bug updated', 'bug': bug.to_dict()})
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@bugs_bp.route('/api/bugs/<bug_id>', methods=['DELETE'])
@login_required
def delete_bug(bug_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        _check_permission(s, app_id, min_role=RoleEnum.admin)

        bug = s.query(Bug).filter_by(id=bug_id, app_id=app_id).first()
        if not bug:
            return jsonify({'error': 'Bug not found'}), 404

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Deleted bug: {bug.title}',
            entity_type='bug',
            entity_id=bug.id,
        )
        s.add(log)

        s.delete(bug)
        s.commit()
        return jsonify({'message': 'Bug deleted'})
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@bugs_bp.route('/api/bugs/<bug_id>/attachments', methods=['POST'])
@login_required
def upload_attachment(bug_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        bug = s.query(Bug).filter_by(id=bug_id, app_id=app_id).first()
        if not bug:
            return jsonify({'error': 'Bug not found'}), 404

        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save file
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        upload_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)

        attachment = BugAttachment(
            bug_id=bug.id,
            filename=file.filename,
            file_path=filename,
            file_size=os.path.getsize(file_path),
            uploaded_by=current_user.id,
        )
        s.add(attachment)
        s.commit()

        return jsonify({'message': 'File uploaded', 'attachment': attachment.to_dict()}), 201
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@bugs_bp.route('/api/bugs/<bug_id>/attachments', methods=['GET'])
@login_required
def list_attachments(bug_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        attachments = s.query(BugAttachment).filter_by(bug_id=bug_id).order_by(
            BugAttachment.uploaded_at.desc()
        ).all()

        return jsonify({'attachments': [a.to_dict() for a in attachments]})
    finally:
        s.close()


@bugs_bp.route('/api/bugs/<bug_id>/history', methods=['GET'])
@login_required
def bug_history(bug_id):
    from app import db_session
    s = db_session()
    try:
        history = s.query(BugHistory).filter_by(bug_id=bug_id).order_by(
            BugHistory.changed_at.desc()
        ).all()

        return jsonify({'history': [h.to_dict() for h in history]})
    finally:
        s.close()


def _check_permission(session, app_id, min_role=RoleEnum.developer):
    """Check if current user has the minimum required role for the app."""
    from models import App
    app = session.query(App).filter_by(id=app_id).first()
    if not app:
        raise PermissionError('App not found')

    if app.owner_id == current_user.id:
        return  # Owner has full access

    member = session.query(AppMember).filter_by(
        app_id=app_id, user_id=current_user.id
    ).first()

    if not member:
        raise PermissionError('You are not a member of this app')

    role_hierarchy = {RoleEnum.admin: 3, RoleEnum.developer: 2, RoleEnum.viewer: 1}
    if role_hierarchy.get(member.role, 0) < role_hierarchy.get(min_role, 0):
        raise PermissionError(f'Insufficient permissions. Required: {min_role.value}')
