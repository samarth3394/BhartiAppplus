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

import time

def _call_gemini_with_retry(model, prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            return model.generate_content(prompt)
        except Exception as e:
            if '429' in str(e) and attempt < max_retries - 1:
                time.sleep(8)
            else:
                raise e


def analyze_root_cause(bug_title, bug_description, logs=None):
    """Analyze a bug and provide Root Cause Analysis and Auto-Fix Recommendations."""
    if not GENAI_API_KEY or not genai:
        return "AI Analysis is disabled. Please configure GEMINI_API_KEY in .env and ensure google-generativeai is installed."
        
    model = genai.GenerativeModel('gemini-flash-latest')
    
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
        response = _call_gemini_with_retry(model, prompt)
        return response.text
    except Exception as e:
        return f"AI Analysis failed: {str(e)}"

def generate_cto_summary(session, app_id):
    """Generate a high-level CTO dashboard summary using Gemini AI with Business Impact."""
    if not GENAI_API_KEY or not genai:
        return {"status": "error", "message": "Gemini API Key is not configured."}
        
    from models import App, Bug, UptimeCheck, MaintenanceTask, UptimeIncident
    from datetime import datetime, timedelta, timezone
    
    # Gather Data
    app = session.query(App).filter_by(id=app_id).first()
    if not app:
        return {"status": "error", "message": "App not found."}
        
    settings = app.settings or {}
    hourly_revenue = float(settings.get('hourly_revenue', 0.0))
    
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    
    recent_bugs = session.query(Bug).filter_by(app_id=app_id).order_by(Bug.created_at.desc()).limit(10).all()
    recent_uptime = session.query(UptimeCheck).filter_by(app_id=app_id).order_by(UptimeCheck.checked_at.desc()).limit(10).all()
    tasks = session.query(MaintenanceTask).filter_by(app_id=app_id, is_active=True).all()
    
    # Calculate Weekly Downtime
    incidents = session.query(UptimeIncident).filter(
        UptimeIncident.app_id == app_id,
        UptimeIncident.started_at >= seven_days_ago
    ).all()
    
    total_downtime_seconds = sum([i.duration_seconds for i in incidents if i.duration_seconds])
    # Also add active incident duration if still down
    active_incident = session.query(UptimeIncident).filter(
        UptimeIncident.app_id == app_id,
        UptimeIncident.resolved_at.is_(None)
    ).first()
    if active_incident:
        active_dur = (now - active_incident.started_at).total_seconds()
        total_downtime_seconds += int(active_dur)
        
    downtime_minutes = total_downtime_seconds / 60.0
    revenue_impact = (downtime_minutes / 60.0) * hourly_revenue
    
    bug_summary = "\\n".join([f"- {b.severity.value.upper()}: {b.title} ({b.status.value})" for b in recent_bugs])
    uptime_summary = "\\n".join([f"- HTTP {u.status_code}: {u.response_time_ms}ms at {u.checked_at}" for u in recent_uptime])
    task_summary = "\\n".join([f"- {t.title} (Priority: {t.priority.value}, Status: {t.status.value})" for t in tasks])
    
    prompt = f"""
You are an AI CTO analyzing an application's health and business performance.
Based on the following recent data, provide a structured executive summary. Include:
1. Overall System Health Assessment (Score out of 100)
2. Business & Revenue Impact (Analyze the revenue lost due to downtime)
3. Key Risks / Immediate Actions Needed (based on bugs/tasks)
4. Strategic Advice for the engineering team.

Please use markdown formatting. Keep it professional, concise, and actionable.

=== BUSINESS METRICS (LAST 7 DAYS) ===
Estimated Hourly Revenue: ${hourly_revenue:.2f}
Total Downtime: {downtime_minutes:.1f} minutes
Estimated Revenue Loss: ${revenue_impact:.2f}

=== RECENT BUGS ===
{bug_summary or 'No recent bugs.'}

=== RECENT UPTIME CHECKS ===
{uptime_summary or 'No uptime data.'}

=== PENDING MAINTENANCE TASKS ===
{task_summary or 'No pending tasks.'}
"""
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        response = _call_gemini_with_retry(model, prompt)
        
        # Include raw stats in output for the UI to use if needed
        data = {
            'report': response.text,
            'metrics': {
                'downtime_minutes': round(downtime_minutes, 1),
                'revenue_loss': round(revenue_impact, 2),
                'hourly_revenue': round(hourly_revenue, 2)
            }
        }
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": f"AI Generation failed: {str(e)}"}


def analyze_incident_root_cause(app_name, app_url, error_message, duration_seconds, recent_checks):
    """
    Analyze a downtime incident using Gemini API.
    Returns a structured dict with root_cause, confidence, and revenue_impact.
    """
    if not GENAI_API_KEY or not genai:
        return {
            'root_cause': 'AI Analysis unavailable — GEMINI_API_KEY not configured.',
            'confidence': 0.0,
            'revenue_impact': 'unknown',
            'raw': ''
        }

    # Build context from recent checks
    checks_summary = ""
    if recent_checks:
        for c in recent_checks[-10:]:
            status = "UP" if c.is_up else "DOWN"
            checks_summary += f"  - {c.checked_at}: {status} | {c.status_code or 'N/A'} | {c.response_time_ms or 0}ms | {c.error_message or ''}\n"

    prompt = f"""You are an expert DevOps AI analyzing a downtime incident.

APPLICATION: {app_name}
URL: {app_url}
ERROR: {error_message}
DOWNTIME DURATION: {duration_seconds} seconds

RECENT MONITORING CHECKS:
{checks_summary or 'No check data available.'}

Please respond in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{{
    "root_cause": "A clear, human-readable explanation of why this downtime happened (2-3 sentences max)",
    "confidence": 85,
    "revenue_impact": "medium"
}}

Rules for your response:
- "root_cause": Be specific and actionable. Mention the likely technical cause.
- "confidence": A number from 0 to 100 representing how confident you are in this analysis.
- "revenue_impact": One of: "low", "medium", "high", "critical" — based on the downtime duration and likely user impact.
"""

    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        response = _call_gemini_with_retry(model, prompt)
        raw_text = response.text.strip()

        # Parse JSON from response
        import json
        # Try to extract JSON from potential markdown code blocks
        clean = raw_text
        if '```' in clean:
            clean = clean.split('```')[1]
            if clean.startswith('json'):
                clean = clean[4:]
            clean = clean.strip()

        parsed = json.loads(clean)
        return {
            'root_cause': parsed.get('root_cause', 'Unable to determine root cause.'),
            'confidence': float(parsed.get('confidence', 50)),
            'revenue_impact': parsed.get('revenue_impact', 'unknown'),
            'raw': raw_text,
        }
    except json.JSONDecodeError:
        # If JSON parsing fails, use the raw text as root cause
        return {
            'root_cause': raw_text[:500] if raw_text else 'AI analysis returned invalid format.',
            'confidence': 50.0,
            'revenue_impact': 'unknown',
            'raw': raw_text,
        }
    except Exception as e:
        return {
            'root_cause': f'AI Analysis failed: {str(e)}',
            'confidence': 0.0,
            'revenue_impact': 'unknown',
            'raw': str(e),
        }
