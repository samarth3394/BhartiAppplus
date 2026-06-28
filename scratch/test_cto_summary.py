from dependencies import get_db
from services.ai_service import generate_cto_summary
from models import App

db = next(get_db())
app = db.query(App).order_by(App.created_at.desc()).first()
if app:
    print(f"Testing generate_cto_summary for app {app.name} ({app.id})")
    try:
        result = generate_cto_summary(db, str(app.id))
        print(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
else:
    print("No apps found.")
