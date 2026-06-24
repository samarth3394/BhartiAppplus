from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session
from flask_login import login_user, logout_user, login_required, current_user
from models import User, utc_now
import bcrypt

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['GET'])
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.dashboard_page'))
    return render_template('auth/login.html')


@auth_bp.route('/register', methods=['GET'])
def register_page():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.dashboard_page'))
    return render_template('auth/register.html')


@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    from app import db_session
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    full_name = data.get('full_name', '').strip()

    if not email or not password or not full_name:
        return jsonify({'error': 'All fields are required'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    session_db = db_session()
    try:
        existing = session_db.query(User).filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'Email already registered'}), 409

        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = User(
            email=email,
            password_hash=password_hash,
            full_name=full_name,
        )
        session_db.add(user)
        session_db.commit()

        login_user(user)
        return jsonify({'message': 'Registration successful', 'user': user.to_dict()}), 201
    except Exception as e:
        session_db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session_db.close()


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    from app import db_session
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    session_db = db_session()
    try:
        user = session_db.query(User).filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

        user.last_login = utc_now()
        session_db.commit()

        login_user(user)
        return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200
    except Exception as e:
        session_db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session_db.close()


@auth_bp.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/api/auth/me', methods=['GET'])
@login_required
def me():
    return jsonify({'user': current_user.to_dict()}), 200
