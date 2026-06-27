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


@ai_dashboard_bp.route('/api/predictions/run', methods=['POST'])
@login_required
def run_prediction_api():
    """Manually trigger the Failure Prediction Engine for the current app."""
    from app import db_session
    from services.prediction_engine import run_prediction
    s = db_session()
    try:
        app_id = session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        result = run_prediction(s, app_id)
        return jsonify({'prediction': result}), 200
    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()


@ai_dashboard_bp.route('/api/predictions/latest', methods=['GET'])
@login_required
def get_latest_prediction():
    """Get the most recent failure prediction for the current app."""
    from app import db_session
    from models import FailurePrediction
    s = db_session()
    try:
        app_id = session.get('current_app_id')
        if not app_id:
            return jsonify({'error': 'No app selected'}), 400

        prediction = s.query(FailurePrediction).filter_by(
            app_id=app_id
        ).order_by(FailurePrediction.created_at.desc()).first()

        if not prediction:
            return jsonify({'prediction': None}), 200

        return jsonify({'prediction': prediction.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()
