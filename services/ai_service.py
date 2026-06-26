"""
AI Intelligence Layer using Gemini API.
"""

import os

try:
    import google.generativeai as genai
except ImportError:
    genai = None

# Configure Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY and genai:
    genai.configure(api_key=GENAI_API_KEY)


def analyze_root_cause(bug_title, bug_description, logs=None):
    """Analyze a bug and provide Root Cause Analysis and Auto-Fix Recommendations."""
    if not GENAI_API_KEY or not genai:
        return "AI Analysis is disabled. Please configure GEMINI_API_KEY in .env and ensure google-generativeai is installed."
        
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
You are an expert DevOps AI Copilot. Please analyze the following bug report and provide:
1. Potential Root Cause
2. Recommended Auto-Fix / Troubleshooting Steps
3. Business Impact Estimation (Low, Medium, High, Critical)

Bug Title: {bug_title}
Bug Description: {bug_description}
"""
    if logs:
        prompt += f"\nRelevant Logs:\n{logs}\n"
        
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Analysis failed: {str(e)}"

def generate_cto_summary(session, app_id):
    """Generate a high-level CTO dashboard summary using Gemini AI."""
    if not GENAI_API_KEY or not genai:
        return {"status": "error", "message": "Gemini API Key is not configured."}
        
    from models import Bug, UptimeCheck, MaintenanceTask
    from datetime import datetime, timedelta, timezone
    
    # Gather Data
    recent_bugs = session.query(Bug).filter_by(app_id=app_id).order_by(Bug.created_at.desc()).limit(10).all()
    recent_uptime = session.query(UptimeCheck).filter_by(app_id=app_id).order_by(UptimeCheck.checked_at.desc()).limit(10).all()
    tasks = session.query(MaintenanceTask).filter_by(app_id=app_id, is_active=True).all()
    
    bug_summary = "\\n".join([f"- {b.severity.value.upper()}: {b.title} ({b.status.value})" for b in recent_bugs])
    uptime_summary = "\\n".join([f"- {u.status}: {u.response_time_ms}ms at {u.checked_at}" for u in recent_uptime])
    task_summary = "\\n".join([f"- {t.title} (Priority: {t.priority.value}, Status: {t.status.value})" for t in tasks])
    
    prompt = f"""
You are an AI CTO analyzing an application's health.
Based on the following recent data, provide a structured executive summary. Include:
1. Overall System Health Assessment (Good, Warning, Critical)
2. Key Risks / Immediate Actions Needed (based on bugs/tasks)
3. Infrastructure & Performance Insights (based on uptime checks)
4. Strategic Advice for the engineering team.

Please use markdown formatting. Keep it professional, concise, and actionable.

=== RECENT BUGS ===
{bug_summary or 'No recent bugs.'}

=== RECENT UPTIME CHECKS ===
{uptime_summary or 'No uptime data.'}

=== PENDING MAINTENANCE TASKS ===
{task_summary or 'No pending tasks.'}
"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return {"status": "success", "data": response.text}
    except Exception as e:
        return {"status": "error", "message": f"AI Generation failed: {str(e)}"}



def predict_failures(uptime_data_df):
    """
    Failure Prediction Engine (using Pandas).
    Expects a pandas DataFrame of historical uptime checks.
    """
    pass
