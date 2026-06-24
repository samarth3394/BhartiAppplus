from flask import Blueprint, jsonify, request
from models import App, Bug, BugStatusEnum, SeverityEnum
from datetime import datetime, timezone
import json

api_ingest_bp = Blueprint('api_ingest', __name__)

@api_ingest_bp.route('/api/ingest/error', methods=['POST', 'OPTIONS'])
def ingest_error():
    # Handle CORS preflight for external websites
    if request.method == 'OPTIONS':
        return '', 204

    from app import db_session
    s = db_session()
    try:
        # Get client key from headers
        client_key = request.headers.get('X-Nexvora-Key')
        if not client_key:
            return jsonify({'error': 'Missing X-Nexvora-Key header'}), 401

        # Find the app
        app = s.query(App).filter_by(client_key=client_key).first()
        if not app:
            return jsonify({'error': 'Invalid client key'}), 401

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        # Extract error details
        message = data.get('message', 'Unknown Error')
        url = data.get('url', '')
        line = data.get('line', '')
        col = data.get('column', '')
        stack = data.get('stack', '')
        user_agent = data.get('userAgent', '')
        timestamp = data.get('timestamp', datetime.now(timezone.utc).isoformat())

        title = f"[Auto] {message[:100]}"
        description = f"Automated error report from {url}\n\n**Error:** {message}\n**Line:** {line}:{col}"

        metadata = {
            'stack': stack,
            'userAgent': user_agent,
            'url': url,
            'timestamp': timestamp
        }

        # Create bug
        bug = Bug(
            app_id=app.id,
            title=title,
            description=description,
            severity=SeverityEnum.high,
            status=BugStatusEnum.open,
            is_automated=True,
            metadata_json=metadata,
            reported_by=None  # Automated bugs have no reporter
        )
        s.add(bug)
        s.commit()

        return jsonify({'message': 'Error ingested successfully', 'bug_id': bug.id}), 201

    except Exception as e:
        s.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        s.close()
