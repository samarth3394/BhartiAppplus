from flask import Blueprint, jsonify, render_template, session
from flask_login import login_required, current_user
from services.ai_service import generate_cto_summary

ai_dashboard_bp = Blueprint('ai_dashboard', __name__)

@ai_dashboard_bp.route('/ai-dashboard')
@login_required
def ai_dashboard_page():
    return render_template('ai_dashboard.html')

@ai_dashboard_bp.route('/api/ai-dashboard/summary', methods=['GET'])
@login_required
def get_ai_summary():
    from app import db_session
    s = db_session()
    try:
        app_id = session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400
            
        result = generate_cto_summary(s, app_id)
        if result['status'] == 'error':
            return jsonify({'error': result['message']}), 500
            
        return jsonify({'summary': result['data']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()
