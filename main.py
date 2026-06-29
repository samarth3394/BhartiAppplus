from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from config import Config
from dependencies import get_current_user_optional, get_db
from fastapi import Depends
from sqlalchemy.orm import Session

from routes.auth import router as auth_router
from routes.apps import router as apps_router
from routes.dashboard import router as dashboard_router
from routes.uptime import router as uptime_router
from routes.bugs import router as bugs_router
from routes.maintenance import router as maintenance_router
from routes.teams import router as teams_router
from routes.roadmap import router as roadmap_router
from routes.ai_dashboard import router as ai_dashboard_router
from routes.api_ingest import router as api_ingest_router
from routes.server import router as server_router

app = FastAPI(title="Nexvora", description="All-in-one intelligent app maintenance and monitoring platform.")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files and Templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Register Routers
app.include_router(auth_router)
app.include_router(apps_router)
app.include_router(dashboard_router)
app.include_router(uptime_router)
app.include_router(bugs_router)
app.include_router(maintenance_router)
app.include_router(teams_router)
app.include_router(roadmap_router)
app.include_router(ai_dashboard_router)
app.include_router(api_ingest_router)
app.include_router(server_router)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # If the user is unauthenticated (401) and trying to access an HTML page (not an API), redirect to login
    if exc.status_code == 401 and not request.url.path.startswith("/api/"):
        return RedirectResponse(url="/auth/login", status_code=303)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.on_event("startup")
async def startup_event():
    import os
    from config import Config
    from database import db_session
    from services.scheduler import init_scheduler
    
    # Initialize DB (if needed)
    from models import init_db
    init_db(Config.SQLALCHEMY_DATABASE_URI)
    
    # In FastAPI with uvicorn workers, you may want to ensure scheduler only runs once.
    # For now, start it directly.
    def get_db_session_fn():
        return db_session()
        
    init_scheduler(get_db_session_fn, check_interval_minutes=Config.UPTIME_CHECK_INTERVAL_MINUTES)
    print("FastAPI application started. Scheduler initialized.")

@app.get("/")
async def root(request: Request, user = Depends(get_current_user_optional)):
    if user:
        return RedirectResponse(url="/dashboard", status_code=303)
    return RedirectResponse(url="/auth/login", status_code=303)

@app.get("/why-nexvora")
async def why_nexvora(request: Request):
    return templates.TemplateResponse("why_nexvora.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
