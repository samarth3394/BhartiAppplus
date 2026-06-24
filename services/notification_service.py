"""
Notification Service
Handles email alerts for downtime, SSL expiry, and team invites.
"""

from flask_mail import Message


def send_downtime_alert(mail, app, check):
    """Send email alert when app goes down."""
    try:
        msg = Message(
            subject=f'🚨 Alert: {app.name} is DOWN!',
            recipients=[app.owner.email] if app.owner else [],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">⚠️ App Down Alert</h2>
                </div>
                <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p><strong>App:</strong> {app.name}</p>
                    <p><strong>URL:</strong> {app.url}</p>
                    <p><strong>Error:</strong> {check.error_message}</p>
                    <p><strong>Time:</strong> {check.checked_at}</p>
                    <br>
                    <p style="color: #94a3b8;">This is an automated alert from AppPulse AI.</p>
                </div>
            </div>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send downtime alert: {e}")
        return False


def send_recovery_alert(mail, app, incident):
    """Send email alert when app recovers."""
    try:
        duration_mins = incident.duration_seconds // 60
        msg = Message(
            subject=f'✅ Recovered: {app.name} is back UP!',
            recipients=[app.owner.email] if app.owner else [],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">✅ App Recovered</h2>
                </div>
                <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p><strong>App:</strong> {app.name}</p>
                    <p><strong>URL:</strong> {app.url}</p>
                    <p><strong>Downtime Duration:</strong> {duration_mins} minutes</p>
                    <br>
                    <p style="color: #94a3b8;">This is an automated alert from AppPulse AI.</p>
                </div>
            </div>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send recovery alert: {e}")
        return False


def send_ssl_expiry_alert(mail, app, days_remaining):
    """Send email alert for SSL certificate expiring soon."""
    try:
        msg = Message(
            subject=f'🔒 SSL Expiry Warning: {app.name} — {days_remaining} days left!',
            recipients=[app.owner.email] if app.owner else [],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #f59e0b; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">🔒 SSL Certificate Expiring Soon</h2>
                </div>
                <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p><strong>App:</strong> {app.name}</p>
                    <p><strong>URL:</strong> {app.url}</p>
                    <p><strong>Days Until Expiry:</strong> {days_remaining} days</p>
                    <p>Please renew your SSL certificate as soon as possible.</p>
                    <br>
                    <p style="color: #94a3b8;">This is an automated alert from AppPulse AI.</p>
                </div>
            </div>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send SSL alert: {e}")
        return False


def send_invite_email(mail, invite_email, app_name, inviter_name, invite_link):
    """Send team invite email."""
    try:
        msg = Message(
            subject=f'🎉 You\'ve been invited to {app_name} on AppPulse AI',
            recipients=[invite_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">🎉 Team Invitation</h2>
                </div>
                <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
                    <p><strong>{inviter_name}</strong> has invited you to collaborate on <strong>{app_name}</strong>.</p>
                    <br>
                    <a href="{invite_link}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Accept Invitation</a>
                    <br><br>
                    <p style="color: #94a3b8;">This invitation expires in 7 days.</p>
                </div>
            </div>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send invite email: {e}")
        return False
