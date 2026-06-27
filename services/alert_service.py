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


def send_weekly_cto_report(app, summary_data):
    """
    Format and send the Weekly AI CTO Report via Email.
    summary_data is a dict containing 'report' and 'metrics'.
    """
    try:
        from flask import current_app
        from flask_mail import Message, Mail

        mail = Mail(current_app)

        settings = app.settings or {}
        recipient = settings.get('alert_email_address', '')

        if not recipient or not settings.get('alert_email', False):
            logger.info(f"[Weekly Report] Email alerting disabled or no recipient for {app.name}.")
            return False

        report_text = summary_data.get('report', '')
        metrics = summary_data.get('metrics', {})

        # Simple HTML conversion for the email
        html_report = report_text.replace('\n', '<br>')
        html_report = html_report.replace('**', '<b>').replace('**', '</b>')

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2563eb;">Weekly AI CTO Report: {app.name}</h2>
            
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #0f172a;">Business Impact (Last 7 Days)</h3>
                <p><strong>Total Downtime:</strong> {metrics.get('downtime_minutes', 0)} minutes</p>
                <p><strong>Estimated Revenue Loss:</strong> ${metrics.get('revenue_loss', 0)}</p>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
                {html_report}
            </div>
            
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 30px;">
                Sent automatically by Nexvora AI Intelligence.
            </p>
        </body>
        </html>
        """

        msg = Message(
            subject=f"📊 Weekly AI CTO Report — {app.name}",
            recipients=[recipient],
            html=html_body,
        )
        mail.send(msg)
        logger.info(f"[Weekly Report] Sent successfully to {recipient}")
        return True
    except Exception as e:
        logger.error(f"[Weekly Report] Failed to send email for {app.name}: {e}")
        return False
