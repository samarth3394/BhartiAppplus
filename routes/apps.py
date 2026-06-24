"""Multi-App Management routes — app CRUD and settings."""

from flask import Blueprint, jsonify, request, render_template, session as flask_session
from flask_login import login_required, current_user
from models import App, AppMember, ActivityLog

apps_bp = Blueprint('apps', __name__)


@apps_bp.route('/apps')
@login_required
def apps_page():
    return render_template('apps.html')


@apps_bp.route('/api/apps', methods=['GET'])
@login_required
def list_apps():
    from app import db_session
    s = db_session()
    try:
        # Get owned apps
        owned = s.query(App).filter_by(owner_id=current_user.id).all()

        # Get apps where user is a member
        member_apps = s.query(App).join(AppMember).filter(
            AppMember.user_id == current_user.id,
        ).all()

        all_apps = {}
        for a in owned:
            all_apps[a.id] = {**a.to_dict(), 'is_owner': True}
        for a in member_apps:
            if a.id not in all_apps:
                member = s.query(AppMember).filter_by(
                    app_id=a.id, user_id=current_user.id
                ).first()
                all_apps[a.id] = {
                    **a.to_dict(),
                    'is_owner': False,
                    'role': member.role.value if member else 'viewer',
                }

        return jsonify({
            'apps': list(all_apps.values()),
            'current_app_id': flask_session.get('current_app_id'),
        })
    finally:
        s.close()


@apps_bp.route('/api/apps', methods=['POST'])
@login_required
def create_app():
    from app import db_session
    s = db_session()
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        if not name:
            return jsonify({'error': 'App name is required'}), 400

        url = data.get('url', '').strip()
        description = data.get('description', '').strip()

        new_app = App(
            name=name,
            url=url,
            description=description,
            owner_id=current_user.id,
        )
        s.add(new_app)

        log = ActivityLog(
            app_id=new_app.id,
            user_id=current_user.id,
            action=f'Created app: {name}',
            entity_type='app',
            entity_id=new_app.id,
        )
        s.add(log)

        s.commit()

        # Auto-switch to new app
        flask_session['current_app_id'] = new_app.id

        return jsonify({'message': 'App created', 'app': new_app.to_dict()}), 201
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@apps_bp.route('/api/apps/<app_id>', methods=['PUT'])
@login_required
def update_app(app_id):
    from app import db_session
    s = db_session()
    try:
        app_obj = s.query(App).filter_by(id=app_id).first()
        if not app_obj:
            return jsonify({'error': 'App not found'}), 404

        if app_obj.owner_id != current_user.id:
            return jsonify({'error': 'Only the owner can update app settings'}), 403

        data = request.get_json()

        if 'name' in data:
            app_obj.name = data['name'].strip()
        if 'url' in data:
            app_obj.url = data['url'].strip()
        if 'description' in data:
            app_obj.description = data['description'].strip()
        if 'is_active' in data:
            app_obj.is_active = data['is_active']
        if 'settings' in data:
            app_obj.settings = data['settings']
            from sqlalchemy.orm.attributes import flag_modified
            flag_modified(app_obj, 'settings')

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Updated app settings: {app_obj.name}',
            entity_type='app',
            entity_id=app_id,
        )
        s.add(log)

        s.commit()
        return jsonify({'message': 'App updated', 'app': app_obj.to_dict()})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@apps_bp.route('/api/apps/<app_id>', methods=['DELETE'])
@login_required
def delete_app(app_id):
    from app import db_session
    s = db_session()
    try:
        app_obj = s.query(App).filter_by(id=app_id).first()
        if not app_obj:
            return jsonify({'error': 'App not found'}), 404

        if app_obj.owner_id != current_user.id:
            return jsonify({'error': 'Only the owner can delete an app'}), 403

        app_name = app_obj.name
        s.delete(app_obj)
        s.commit()

        # Clear current app if it was the deleted one
        if flask_session.get('current_app_id') == app_id:
            flask_session.pop('current_app_id', None)

        return jsonify({'message': f'App "{app_name}" deleted'})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()
