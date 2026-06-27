"""
APScheduler Configuration
Sets up background jobs for uptime monitoring and maintenance reminders.
"""

from apscheduler.schedulers.background import BackgroundScheduler
from services.uptime_service import run_all_uptime_checks


scheduler = BackgroundScheduler(daemon=True)


def init_scheduler(Session, check_interval_minutes=5):
    """Initialize and start the background scheduler."""
    # Uptime monitoring — runs every N minutes
    scheduler.add_job(
        func=run_all_uptime_checks,
        trigger='interval',
        minutes=check_interval_minutes,
        args=[Session],
        id='uptime_check',
        name='Uptime Monitor',
        replace_existing=True,
        misfire_grace_time=60,
    )

    # Weekly AI CTO Report — runs every Monday at 09:00
    # For testing, we could use interval, but cron is better for production.
    scheduler.add_job(
        func=_run_weekly_cto_reports,
        trigger='cron',
        day_of_week='mon',
        hour=9,
        minute=0,
        args=[Session],
        id='weekly_cto_report',
        name='Weekly AI CTO Report',
        replace_existing=True,
    )

    scheduler.start()
    print(f"[OK] Scheduler started - uptime checks every {check_interval_minutes} minutes")
    return scheduler

def _run_weekly_cto_reports(Session):
    """Background task to generate and email the weekly AI CTO report for all apps."""
    from models import App
    from services.ai_service import generate_cto_summary
    from services.alert_service import send_weekly_cto_report
    
    session = Session()
    try:
        apps = session.query(App).filter(App.is_active == True).all()
        for app in apps:
            print(f"[Weekly Report] Generating for {app.name}...")
            result = generate_cto_summary(session, app.id)
            if result.get('status') == 'success':
                send_weekly_cto_report(app, result['data'])
            else:
                print(f"[Weekly Report] Failed for {app.name}: {result.get('message')}")
    except Exception as e:
        print(f"[Weekly Report] Job error: {e}")
    finally:
        session.close()


def shutdown_scheduler():
    """Gracefully shutdown the scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        print("[STOP] Scheduler stopped")
