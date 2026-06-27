"""Maintenance Checklist routes — task CRUD, completion, auto-recurrence."""

from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required, current_user
from datetime import datetime, timedelta, timezone
from models import (
    MaintenanceTask, TaskCompletion, FrequencyEnum, ActivityLog,
    AppMember, RoleEnum
)

maintenance_bp = Blueprint('maintenance', __name__)

def _check_permission(session, app_id, min_role=RoleEnum.developer):
    """Check if current user has the minimum required role for the app."""
    member = session.query(AppMember).filter_by(
        app_id=app_id, user_id=current_user.id
    ).first()

    if not member:
        raise PermissionError('You are not a member of this app.')

    role_hierarchy = {RoleEnum.admin: 3, RoleEnum.developer: 2, RoleEnum.viewer: 1}
    if role_hierarchy.get(member.role, 0) < role_hierarchy.get(min_role, 0):
        raise PermissionError(f'Insufficient permissions. Required: {min_role.value}')
    
    return member

@maintenance_bp.route('/maintenance')
@login_required
def maintenance_page():
    return render_template('maintenance.html')


@maintenance_bp.route('/api/maintenance', methods=['GET'])
@login_required
def list_tasks():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400
            
        # Get member role so frontend knows what buttons to show
        member = s.query(AppMember).filter_by(app_id=app_id, user_id=current_user.id).first()
        role = member.role.value if member else 'viewer'

        tasks = s.query(MaintenanceTask).filter_by(
            app_id=app_id, is_active=True
        ).order_by(MaintenanceTask.due_date.asc()).all()

        now = datetime.now(timezone.utc)
        categorized = {
            'overdue': [],
            'today': [],
            'upcoming': [],
        }

        for task in tasks:
            task_dict = task.to_dict()
            if task.due_date:
                due = task.due_date.replace(tzinfo=timezone.utc) if task.due_date.tzinfo is None else task.due_date
                if due.date() < now.date():
                    categorized['overdue'].append(task_dict)
                elif due.date() == now.date():
                    categorized['today'].append(task_dict)
                else:
                    categorized['upcoming'].append(task_dict)
            else:
                categorized['upcoming'].append(task_dict)

        return jsonify({
            'tasks': categorized,
            'total': len(tasks),
            'role': role
        })
    finally:
        s.close()


@maintenance_bp.route('/api/maintenance', methods=['POST'])
@login_required
def create_task():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # RBAC Check: Need Developer role to create task
        try:
            _check_permission(s, app_id, min_role=RoleEnum.developer)
        except PermissionError as e:
            return jsonify({'error': str(e)}), 403

        data = request.get_json()
        title = data.get('title', '').strip()
        if not title:
            return jsonify({'error': 'Title is required'}), 400

        frequency_str = data.get('frequency', 'weekly')
        try:
            frequency = FrequencyEnum(frequency_str)
        except ValueError:
            frequency = FrequencyEnum.weekly

        due_date_str = data.get('due_date')
        if due_date_str:
            try:
                due_date = datetime.fromisoformat(due_date_str).replace(tzinfo=timezone.utc)
            except ValueError:
                due_date = datetime.now(timezone.utc) + timedelta(days=1)
        else:
            # Default due dates based on frequency
            if frequency == FrequencyEnum.daily:
                due_date = datetime.now(timezone.utc) + timedelta(days=1)
            elif frequency == FrequencyEnum.weekly:
                due_date = datetime.now(timezone.utc) + timedelta(weeks=1)
            else:
                due_date = datetime.now(timezone.utc) + timedelta(days=30)

        task = MaintenanceTask(
            app_id=app_id,
            title=title,
            description=data.get('description', ''),
            frequency=frequency,
            due_date=due_date,
            created_by=current_user.id,
        )
        s.add(task)

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Created maintenance task: {title}',
            entity_type='task',
            entity_id=task.id,
            metadata_json={'frequency': frequency.value},
        )
        s.add(log)

        s.commit()
        return jsonify({'message': 'Task created', 'task': task.to_dict()}), 201
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@maintenance_bp.route('/api/maintenance/<task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # RBAC Check
        try:
            _check_permission(s, app_id, min_role=RoleEnum.developer)
        except PermissionError as e:
            return jsonify({'error': str(e)}), 403

        task = s.query(MaintenanceTask).filter_by(id=task_id, app_id=app_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        data = request.get_json()

        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'frequency' in data:
            try:
                task.frequency = FrequencyEnum(data['frequency'])
            except ValueError:
                pass
        if 'due_date' in data:
            try:
                task.due_date = datetime.fromisoformat(data['due_date']).replace(tzinfo=timezone.utc)
            except ValueError:
                pass
        if 'is_active' in data:
            task.is_active = data['is_active']

        s.commit()
        return jsonify({'message': 'Task updated', 'task': task.to_dict()})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@maintenance_bp.route('/api/maintenance/<task_id>/complete', methods=['POST'])
@login_required
def complete_task(task_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # RBAC Check
        try:
            _check_permission(s, app_id, min_role=RoleEnum.developer)
        except PermissionError as e:
            return jsonify({'error': str(e)}), 403

        task = s.query(MaintenanceTask).filter_by(id=task_id, app_id=app_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        data = request.get_json() or {}

        # Record completion
        completion = TaskCompletion(
            task_id=task.id,
            completed_by=current_user.id,
            notes=data.get('notes', ''),
        )
        s.add(completion)

        # Auto-recurrence — calculate next due date
        now = datetime.now(timezone.utc)
        if task.frequency == FrequencyEnum.daily:
            task.due_date = now + timedelta(days=1)
        elif task.frequency == FrequencyEnum.weekly:
            task.due_date = now + timedelta(weeks=1)
        elif task.frequency == FrequencyEnum.monthly:
            task.due_date = now + timedelta(days=30)

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Completed maintenance task: {task.title}',
            entity_type='task',
            entity_id=task.id,
        )
        s.add(log)

        s.commit()
        return jsonify({
            'message': 'Task completed',
            'task': task.to_dict(),
            'completion': completion.to_dict(),
        })
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@maintenance_bp.route('/api/maintenance/<task_id>/history', methods=['GET'])
@login_required
def task_history(task_id):
    from app import db_session
    s = db_session()
    try:
        completions = s.query(TaskCompletion).filter_by(task_id=task_id).order_by(
            TaskCompletion.completed_at.desc()
        ).all()

        return jsonify({
            'completions': [c.to_dict() for c in completions]
        })
    finally:
        s.close()


@maintenance_bp.route('/api/maintenance/<task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # RBAC Check: Need Admin role to delete task
        try:
            _check_permission(s, app_id, min_role=RoleEnum.admin)
        except PermissionError as e:
            return jsonify({'error': str(e)}), 403

        task = s.query(MaintenanceTask).filter_by(id=task_id, app_id=app_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Deleted maintenance task: {task.title}',
            entity_type='task',
            entity_id=task.id,
        )
        s.add(log)

        s.delete(task)
        s.commit()
        return jsonify({'message': 'Task deleted'})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()
