"""Team Management routes — members, invites, roles, activity log."""

import uuid
from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required, current_user
from datetime import datetime, timedelta, timezone
from models import (
    App, AppMember, User, RoleEnum, ActivityLog
)

teams_bp = Blueprint('teams', __name__)


@teams_bp.route('/teams')
@login_required
def teams_page():
    return render_template('teams.html')


@teams_bp.route('/api/teams/members', methods=['GET'])
@login_required
def list_members():
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

        members = s.query(AppMember).filter_by(app_id=app_id).all()

        # Include owner
        owner = s.query(User).filter_by(id=app.owner_id).first()
        member_list = []

        if owner:
            member_list.append({
                'id': 'owner',
                'user': owner.to_dict(),
                'role': 'admin',
                'is_owner': True,
                'joined_at': app.created_at.isoformat() if app.created_at else None,
            })

        for m in members:
            member_list.append({
                'id': m.id,
                'user': m.user.to_dict() if m.user else {'email': m.invite_email, 'full_name': m.invite_email},
                'role': m.role.value if m.role else 'developer',
                'is_owner': False,
                'is_pending': m.accepted_at is None,
                'joined_at': m.accepted_at.isoformat() if m.accepted_at else None,
                'invited_at': m.invited_at.isoformat() if m.invited_at else None,
            })

        return jsonify({'members': member_list})
    finally:
        s.close()


@teams_bp.route('/api/teams/invite', methods=['POST'])
@login_required
def invite_member():
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
            # Check if user is admin
            member = s.query(AppMember).filter_by(
                app_id=app_id, user_id=current_user.id, role=RoleEnum.admin
            ).first()
            if not member:
                return jsonify({'error': 'Only admins can invite members'}), 403

        data = request.get_json()
        email = data.get('email', '').strip().lower()
        role_str = data.get('role', 'developer')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        try:
            role = RoleEnum(role_str)
        except ValueError:
            role = RoleEnum.developer

        # Check if already a member
        existing_user = s.query(User).filter_by(email=email).first()
        if existing_user:
            if existing_user.id == app.owner_id:
                return jsonify({'error': 'This user is already the owner'}), 400

            existing_member = s.query(AppMember).filter_by(
                app_id=app_id, user_id=existing_user.id
            ).first()
            if existing_member:
                return jsonify({'error': 'User is already a member'}), 400

        # Check pending invite
        pending = s.query(AppMember).filter_by(
            app_id=app_id, invite_email=email, accepted_at=None
        ).first()
        if pending:
            return jsonify({'error': 'Invitation already pending for this email'}), 400

        invite_token = uuid.uuid4().hex

        member = AppMember(
            app_id=app_id,
            user_id=existing_user.id if existing_user else None,
            role=role,
            invite_email=email,
            invite_token=invite_token,
            invited_by=current_user.id,
            accepted_at=datetime.now(timezone.utc) if existing_user else None,
        )
        s.add(member)

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Invited {email} as {role.value}',
            entity_type='member',
            entity_id=member.id,
        )
        s.add(log)

        s.commit()

        return jsonify({
            'message': f'Invitation sent to {email}',
            'member': member.to_dict(),
            'invite_token': invite_token,
        }), 201
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@teams_bp.route('/api/teams/members/<member_id>', methods=['PUT'])
@login_required
def update_member_role(member_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        app = s.query(App).filter_by(id=app_id).first()
        if not app or app.owner_id != current_user.id:
            return jsonify({'error': 'Only the owner can change roles'}), 403

        member = s.query(AppMember).filter_by(id=member_id, app_id=app_id).first()
        if not member:
            return jsonify({'error': 'Member not found'}), 404

        data = request.get_json()
        role_str = data.get('role')
        if role_str:
            try:
                old_role = member.role.value
                member.role = RoleEnum(role_str)
                log = ActivityLog(
                    app_id=app_id,
                    user_id=current_user.id,
                    action=f'Changed {member.invite_email or "member"} role from {old_role} to {role_str}',
                    entity_type='member',
                    entity_id=member.id,
                )
                s.add(log)
            except ValueError:
                return jsonify({'error': 'Invalid role'}), 400

        s.commit()
        return jsonify({'message': 'Role updated', 'member': member.to_dict()})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@teams_bp.route('/api/teams/members/<member_id>', methods=['DELETE'])
@login_required
def remove_member(member_id):
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        app = s.query(App).filter_by(id=app_id).first()
        if not app or app.owner_id != current_user.id:
            return jsonify({'error': 'Only the owner can remove members'}), 403

        member = s.query(AppMember).filter_by(id=member_id, app_id=app_id).first()
        if not member:
            return jsonify({'error': 'Member not found'}), 404

        log = ActivityLog(
            app_id=app_id,
            user_id=current_user.id,
            action=f'Removed {member.invite_email or "member"} from team',
            entity_type='member',
            entity_id=member.id,
        )
        s.add(log)

        s.delete(member)
        s.commit()
        return jsonify({'message': 'Member removed'})
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@teams_bp.route('/api/teams/activity', methods=['GET'])
@login_required
def team_activity():
    from app import db_session
    from flask import session as flask_session
    s = db_session()
    try:
        app_id = flask_session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        # Filters
        user_id = request.args.get('user_id')
        entity_type = request.args.get('entity_type')

        query = s.query(ActivityLog).filter_by(app_id=app_id)

        if user_id:
            query = query.filter_by(user_id=user_id)
        if entity_type:
            query = query.filter_by(entity_type=entity_type)

        activities = query.order_by(ActivityLog.created_at.desc()).limit(100).all()

        return jsonify({
            'activities': [a.to_dict() for a in activities]
        })
    finally:
        s.close()


@teams_bp.route('/invite/<token>', methods=['GET'])
def accept_invite(token):
    """Handle invite acceptance via link."""
    from app import db_session
    s = db_session()
    try:
        member = s.query(AppMember).filter_by(invite_token=token).first()
        if not member:
            return render_template('auth/login.html', error='Invalid or expired invitation.')

        if member.accepted_at:
            return render_template('auth/login.html', error='Invitation already accepted.')

        # Check expiry (7 days)
        if member.invited_at:
            expiry = member.invited_at + timedelta(days=7)
            if datetime.now(timezone.utc) > expiry:
                return render_template('auth/login.html', error='Invitation has expired.')

        # If user exists, auto-accept
        if current_user and current_user.is_authenticated:
            member.user_id = current_user.id
            member.accepted_at = datetime.now(timezone.utc)
            s.commit()
            return render_template('auth/login.html', success='Invitation accepted! You can now access the app.')

        # Redirect to register/login
        return render_template('auth/register.html', invite_token=token)
    finally:
        s.close()
