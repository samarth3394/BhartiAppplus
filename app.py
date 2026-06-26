"""
Nexvora — Main Application Entry Point
All-in-one intelligent app maintenance and monitoring platform.
"""

import eventlet
eventlet.monkey_patch()

import os
from flask import Flask, redirect, url_for
from flask_login import LoginManager, current_user
from flask_mail import Mail
from config import Config
from models import init_db, User

# ─── Initialize Flask ──────────────────────────────────────────────────────

app = Flask(__name__)
app.config.from_object(Config)

# Ensure instance and upload directories exist
os.makedirs(os.path.join(os.path.dirname(__file__), 'instance'), exist_ok=True)
os.makedirs(app.config.get('UPLOAD_FOLDER', 'static/uploads'), exist_ok=True)

# ─── Database ──────────────────────────────────────────────────────────────

engine, db_session = init_db(app.config['SQLALCHEMY_DATABASE_URI'])

# ─── Flask-Login ───────────────────────────────────────────────────────────

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login_page'


@login_manager.user_loader
def load_user(user_id):
    s = db_session()
    try:
        user = s.query(User).filter_by(id=user_id).first()
        return user
    finally:
        s.close()


@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('auth.login_page'))


# ─── Flask-Mail ────────────────────────────────────────────────────────────

mail = Mail(app)

# ─── Register Blueprints ──────────────────────────────────────────────────

from auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.uptime import uptime_bp
from routes.bugs import bugs_bp
from routes.maintenance import maintenance_bp
from routes.teams import teams_bp
from routes.apps import apps_bp
from routes.api_ingest import api_ingest_bp
from routes.server import server_bp
from routes.roadmap import roadmap_bp
from routes.ai_dashboard import ai_dashboard_bp

app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(uptime_bp)
app.register_blueprint(bugs_bp)
app.register_blueprint(maintenance_bp)
app.register_blueprint(teams_bp)
app.register_blueprint(apps_bp)
app.register_blueprint(api_ingest_bp)
app.register_blueprint(server_bp)
app.register_blueprint(roadmap_bp)
app.register_blueprint(ai_dashboard_bp)


# ─── Root Route ────────────────────────────────────────────────────────────

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.dashboard_page'))
    return redirect(url_for('auth.login_page'))


# ─── Start Scheduler & Run ──────────────────────────────────────────────────

if __name__ == '__main__':
    from services.scheduler import init_scheduler
    # Only start scheduler in the main process (not reloader)
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        init_scheduler(db_session, check_interval_minutes=Config.UPTIME_CHECK_INTERVAL_MINUTES)
        
    app.run(debug=True, host='0.0.0.0', port=5000)
