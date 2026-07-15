from config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

ws = session.execute(text("SELECT * FROM workspaces LIMIT 1")).fetchone()
print("Workspace:", dict(ws._mapping))

session.execute(text(f"INSERT INTO apps (id, name, owner_id, workspace_id) VALUES ('test-id', 'test-app', 'd1bef8ab-53cd-445b-91ae-e13b759f073b', '{ws.id}')"))
session.commit()

app = session.execute(text("SELECT * FROM apps WHERE id='test-id'")).fetchone()
print("App:", dict(app._mapping))

session.execute(text("DELETE FROM apps WHERE id='test-id'"))
session.commit()
