from config import Config
from models import init_db

# Initialize database connection
engine, db_session = init_db(Config.SQLALCHEMY_DATABASE_URI)
