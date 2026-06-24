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

    scheduler.start()
    print(f"[OK] Scheduler started - uptime checks every {check_interval_minutes} minutes")
    return scheduler


def shutdown_scheduler():
    """Gracefully shutdown the scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        print("[STOP] Scheduler stopped")
