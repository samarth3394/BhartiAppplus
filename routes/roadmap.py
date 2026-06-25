from flask import Blueprint, jsonify, render_template, request, session as flask_session
from flask_login import login_required, current_user
from models import RoadmapFeature, AppMember, RoleEnum, ActivityLog
from datetime import datetime, timezone
import dateutil.parser

roadmap_bp = Blueprint('roadmap', __name__)

@roadmap_bp.route('/roadmap')
@login_required
def roadmap_page():
    return render_template('roadmap.html')

@roadmap_bp.route('/api/roadmap', methods=['GET'])
@login_required
def list_features():
    from app import db_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        features = s.query(RoadmapFeature).filter_by(app_id=app_id).order_by(
            RoadmapFeature.created_at.desc()
        ).all()

        return jsonify({'features': [f.to_dict() for f in features]})
    finally:
        s.close()

@roadmap_bp.route('/api/roadmap', methods=['POST'])
@login_required
def create_feature():
    from app import db_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        _check_permission(s, app_id, min_role=RoleEnum.developer)

        data = request.get_json()
        title = data.get('title', '').strip()
        if not title:
            return jsonify({'error': 'Title is required'}), 400

        def parse_dt(dt_str):
            if not dt_str: return None
            try:
                return dateutil.parser.isoparse(dt_str).replace(tzinfo=timezone.utc)
            except:
                return None

        feature = RoadmapFeature(
            app_id=app_id,
            title=title,
            description=data.get('description', ''),
            status=data.get('status', 'planned'),
            priority=data.get('priority', 'medium'),
            start_date=parse_dt(data.get('start_date')),
            due_date=parse_dt(data.get('due_date')),
        )
        s.add(feature)

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Created roadmap feature: {title}',
            entity_type='roadmap',
            entity_id=feature.id,
        )
        s.add(log)

        s.commit()
        return jsonify({'message': 'Feature created', 'feature': feature.to_dict()}), 201
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()

@roadmap_bp.route('/api/roadmap/<feature_id>', methods=['PUT'])
@login_required
def update_feature(feature_id):
    from app import db_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        _check_permission(s, app_id, min_role=RoleEnum.developer)

        feature = s.query(RoadmapFeature).filter_by(id=feature_id, app_id=app_id).first()
        if not feature:
            return jsonify({'error': 'Feature not found'}), 404

        data = request.get_json()
        
        if 'title' in data:
            feature.title = data['title']
        if 'description' in data:
            feature.description = data['description']
        if 'status' in data:
            feature.status = data['status']
        if 'priority' in data:
            feature.priority = data['priority']
            
        def parse_dt(dt_str):
            if not dt_str: return None
            try:
                return dateutil.parser.isoparse(dt_str).replace(tzinfo=timezone.utc)
            except:
                return None

        if 'start_date' in data:
            feature.start_date = parse_dt(data['start_date'])
        if 'due_date' in data:
            feature.due_date = parse_dt(data['due_date'])

        feature.updated_at = datetime.now(timezone.utc)

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Updated roadmap feature: {feature.title}',
            entity_type='roadmap',
            entity_id=feature.id,
        )
        s.add(log)

        s.commit()
        return jsonify({'message': 'Feature updated', 'feature': feature.to_dict()})
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()

@roadmap_bp.route('/api/roadmap/<feature_id>', methods=['DELETE'])
@login_required
def delete_feature(feature_id):
    from app import db_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        _check_permission(s, app_id, min_role=RoleEnum.admin)

        feature = s.query(RoadmapFeature).filter_by(id=feature_id, app_id=app_id).first()
        if not feature:
            return jsonify({'error': 'Feature not found'}), 404

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Deleted roadmap feature: {feature.title}',
            entity_type='roadmap',
            entity_id=feature.id,
        )
        s.add(log)

        s.delete(feature)
        s.commit()
        return jsonify({'message': 'Feature deleted'})
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()

def _check_permission(session, app_id, min_role=RoleEnum.developer):
    from models import App
    app = session.query(App).filter_by(id=app_id).first()
    if not app:
        raise PermissionError('App not found')

    if app.owner_id == current_user.id:
        return

    member = session.query(AppMember).filter_by(
        app_id=app_id, user_id=current_user.id
    ).first()

    if not member:
        raise PermissionError('You are not a member of this app')

    role_hierarchy = {RoleEnum.admin: 3, RoleEnum.developer: 2, RoleEnum.viewer: 1}
    if role_hierarchy.get(member.role, 0) < role_hierarchy.get(min_role, 0):
        raise PermissionError(f'Insufficient permissions. Required: {min_role.value}')
