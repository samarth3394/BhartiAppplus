"""
Alert Service — Send WhatsApp and Email alerts for failure predictions.
WhatsApp is currently stubbed (logged to console).
Email uses Flask-Mail if SMTP is configured.
"""

import logging

logger = logging.getLogger(__name__)


def send_prediction_alert(session, prediction, app_id):
    """Send alerts when failure prediction confidence exceeds 70%."""
    from models import App
    app = session.query(App).filter_by(id=app_id).first()
    app_name = app.name if app else 'Unknown App'

    confidence = prediction.confidence_percentage
    action = prediction.action_suggested

    alert_message = (
        f"🚨 FAILURE PREDICTION ALERT\n"
        f"App: {app_name}\n"
        f"Crash Probability: {confidence}% chance of failure within 48 hours\n\n"
        f"Details:\n{action}"
    )

    email_sent = _send_email_alert(app, alert_message)
    whatsapp_sent = _send_whatsapp_alert(app, alert_message)

    return email_sent or whatsapp_sent


def _send_email_alert(app, message):
    """Send email alert using Flask-Mail."""
    try:
        from flask import current_app
        from flask_mail import Message, Mail

        mail = Mail(current_app)

        settings = app.settings or {}
        recipient = settings.get('alert_email_address', '')

        if not recipient or not settings.get('alert_email', False):
            logger.info("[Email Alert] Email alerting disabled or no recipient configured.")
            return False

        msg = Message(
            subject=f"⚠️ Failure Prediction Alert — {app.name}",
            recipients=[recipient],
            body=message,
        )
        mail.send(msg)
        logger.info(f"[Email Alert] Sent to {recipient}")
        return True
    except Exception as e:
        logger.warning(f"[Email Alert] Failed to send: {e}")
        return False


def _send_whatsapp_alert(app, message):
    """
    Send WhatsApp alert via Twilio API.
    Currently STUBBED — logs the message to the console.
    To enable, integrate Twilio: pip install twilio
    """
    settings = app.settings or {}
    whatsapp_enabled = settings.get('alert_whatsapp', False)

    if not whatsapp_enabled:
        logger.info("[WhatsApp Alert] WhatsApp alerting is disabled for this app.")
        return False

    # --- STUB: Replace with actual Twilio integration ---
    logger.info("=" * 60)
    logger.info("[WhatsApp Alert] STUB — Would send the following message:")
    logger.info(message)
    logger.info("=" * 60)

    # Uncomment below when Twilio is integrated:
    # from twilio.rest import Client
    # account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    # auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    # client = Client(account_sid, auth_token)
    # msg = client.messages.create(
    #     from_='whatsapp:+14155238886',
    #     body=message,
    #     to=f'whatsapp:{phone_number}'
    # )

    return True  # Stub always returns True
