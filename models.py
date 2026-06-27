import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    create_engine, Column, String, Text, Boolean, Integer, Float,
    DateTime, ForeignKey, Enum, JSON
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import enum

Base = declarative_base()


# ─── Enums ────────────────────────────────────────────────────────────────

class RoleEnum(enum.Enum):
    admin = "admin"
    developer = "developer"
    viewer = "viewer"


class SeverityEnum(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class BugStatusEnum(enum.Enum):
    open = "open"
    in_progress = "in_progress"
    testing = "testing"
    resolved = "resolved"


class FrequencyEnum(enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


# ─── Helper ───────────────────────────────────────────────────────────────

def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


# ─── Users ────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), default='')
    created_at = Column(DateTime, default=utc_now)
    last_login = Column(DateTime, default=utc_now)

    # Relationships
    owned_apps = relationship('App', back_populates='owner', lazy='dynamic')
    memberships = relationship('AppMember', back_populates='user', lazy='dynamic', foreign_keys='AppMember.user_id')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }


# ─── Apps ─────────────────────────────────────────────────────────────────

class App(Base):
    __tablename__ = 'apps'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    url = Column(String(500), default='')
    description = Column(Text, default='')
    client_key = Column(String(100), unique=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=utc_now)
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, default=lambda: {
        'monitoring_enabled': True,
        'check_interval': 5,
        'alert_email': True,
        'alert_whatsapp': False,
    })

    # Relationships
    owner = relationship('User', back_populates='owned_apps')
    members = relationship('AppMember', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    uptime_checks = relationship('UptimeCheck', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    uptime_incidents = relationship('UptimeIncident', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    bugs = relationship('Bug', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    maintenance_tasks = relationship('MaintenanceTask', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    activity_logs = relationship('ActivityLog', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    server_metrics = relationship('ServerMetric', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')
    roadmap_features = relationship('RoadmapFeature', back_populates='app', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'description': self.description,
            'client_key': self.client_key,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'settings': self.settings,
        }


# ─── App Members ──────────────────────────────────────────────────────────

class AppMember(Base):
    __tablename__ = 'app_members'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.developer)
    invite_email = Column(String(255), default='')
    invite_token = Column(String(100), unique=True, nullable=True)
    invited_by = Column(String(36), ForeignKey('users.id'), nullable=True)
    invited_at = Column(DateTime, default=utc_now)
    accepted_at = Column(DateTime, nullable=True)

    # Relationships
    app = relationship('App', back_populates='members')
    user = relationship('User', back_populates='memberships', foreign_keys=[user_id])
    inviter = relationship('User', foreign_keys=[invited_by])

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'user_id': self.user_id,
            'role': self.role.value if self.role else None,
            'invite_email': self.invite_email,
            'invited_at': self.invited_at.isoformat() if self.invited_at else None,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None,
            'user': self.user.to_dict() if self.user else None,
        }


# ─── Uptime Checks ───────────────────────────────────────────────────────

class UptimeCheck(Base):
    __tablename__ = 'uptime_checks'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Float, nullable=True)
    is_up = Column(Boolean, default=True)
    checked_at = Column(DateTime, default=utc_now, index=True)
    ssl_expiry_date = Column(DateTime, nullable=True)
    error_message = Column(Text, default='')

    # Relationships
    app = relationship('App', back_populates='uptime_checks')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'status_code': self.status_code,
            'response_time_ms': self.response_time_ms,
            'is_up': self.is_up,
            'checked_at': self.checked_at.isoformat() if self.checked_at else None,
            'ssl_expiry_date': self.ssl_expiry_date.isoformat() if self.ssl_expiry_date else None,
            'error_message': self.error_message,
        }


class UptimeIncident(Base):
    __tablename__ = 'uptime_incidents'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    started_at = Column(DateTime, default=utc_now)
    resolved_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=0)
    alert_sent = Column(Boolean, default=False)

    # Relationships
    app = relationship('App', back_populates='uptime_incidents')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'duration_seconds': self.duration_seconds,
            'alert_sent': self.alert_sent,
        }

# ─── AI Incidents (Root Cause Analysis) ───────────────────────────────────

class AiIncident(Base):
    __tablename__ = 'ai_incidents'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    incident_id = Column(String(36), ForeignKey('uptime_incidents.id'), nullable=False)
    root_cause = Column(Text, default='')
    confidence = Column(Float, default=0.0)
    revenue_impact = Column(String(50), default='unknown')  # low, medium, high, critical
    raw_ai_response = Column(Text, default='')
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    app = relationship('App')
    incident = relationship('UptimeIncident')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'incident_id': self.incident_id,
            'root_cause': self.root_cause,
            'confidence': self.confidence,
            'revenue_impact': self.revenue_impact,
            'raw_ai_response': self.raw_ai_response,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── Bugs ─────────────────────────────────────────────────────────────────

class Bug(Base):
    __tablename__ = 'bugs'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, default='')
    severity = Column(Enum(SeverityEnum), default=SeverityEnum.medium)
    status = Column(Enum(BugStatusEnum), default=BugStatusEnum.open)
    reported_by = Column(String(36), ForeignKey('users.id'), nullable=True)
    is_automated = Column(Boolean, default=False)
    metadata_json = Column(JSON, nullable=True)
    tags_json = Column(JSON, default=list)
    assigned_to = Column(String(36), ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    app = relationship('App', back_populates='bugs')
    reporter = relationship('User', foreign_keys=[reported_by])
    assignee = relationship('User', foreign_keys=[assigned_to])
    attachments = relationship('BugAttachment', back_populates='bug', lazy='dynamic', cascade='all, delete-orphan')
    history = relationship('BugHistory', back_populates='bug', lazy='dynamic', cascade='all, delete-orphan')
    comments = relationship('BugComment', back_populates='bug', lazy='dynamic', cascade='all, delete-orphan', order_by='BugComment.created_at.asc()')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'title': self.title,
            'description': self.description,
            'severity': self.severity.value if self.severity else None,
            'status': self.status.value if self.status else None,
            'reported_by': self.reported_by,
            'is_automated': self.is_automated,
            'metadata_json': self.metadata_json,
            'assigned_to': self.assigned_to,
            'reporter': self.reporter.to_dict() if self.reporter else None,
            'assignee': self.assignee.to_dict() if self.assignee else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'attachment_count': self.attachments.count() if self.attachments else 0,
            'tags': self.tags_json or [],
            'comment_count': self.comments.count() if self.comments else 0,
        }

class BugComment(Base):
    __tablename__ = 'bug_comments'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bug_id = Column(String(36), ForeignKey('bugs.id'), nullable=False)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    bug = relationship('Bug', back_populates='comments')
    user = relationship('User', foreign_keys=[user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'bug_id': self.bug_id,
            'user_id': self.user_id,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None,
        }

class BugAttachment(Base):
    __tablename__ = 'bug_attachments'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bug_id = Column(String(36), ForeignKey('bugs.id'), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    uploaded_by = Column(String(36), ForeignKey('users.id'), nullable=False)
    uploaded_at = Column(DateTime, default=utc_now)

    # Relationships
    bug = relationship('Bug', back_populates='attachments')
    uploader = relationship('User', foreign_keys=[uploaded_by])

    def to_dict(self):
        return {
            'id': self.id,
            'bug_id': self.bug_id,
            'filename': self.filename,
            'file_size': self.file_size,
            'uploaded_by': self.uploaded_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None,
            'uploader': self.uploader.to_dict() if self.uploader else None,
        }


class BugHistory(Base):
    __tablename__ = 'bug_history'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bug_id = Column(String(36), ForeignKey('bugs.id'), nullable=False)
    changed_by = Column(String(36), ForeignKey('users.id'), nullable=False)
    field_changed = Column(String(100), nullable=False)
    old_value = Column(Text, default='')
    new_value = Column(Text, default='')
    changed_at = Column(DateTime, default=utc_now)

    # Relationships
    bug = relationship('Bug', back_populates='history')
    changer = relationship('User', foreign_keys=[changed_by])

    def to_dict(self):
        return {
            'id': self.id,
            'bug_id': self.bug_id,
            'changed_by': self.changed_by,
            'field_changed': self.field_changed,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'changed_at': self.changed_at.isoformat() if self.changed_at else None,
            'changer': self.changer.to_dict() if self.changer else None,
        }


# ─── Maintenance Tasks ───────────────────────────────────────────────────

class MaintenanceTask(Base):
    __tablename__ = 'maintenance_tasks'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, default='')
    frequency = Column(Enum(FrequencyEnum), default=FrequencyEnum.weekly)
    due_date = Column(DateTime, nullable=False)
    created_by = Column(String(36), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=utc_now)
    is_active = Column(Boolean, default=True)

    # Relationships
    app = relationship('App', back_populates='maintenance_tasks')
    creator = relationship('User', foreign_keys=[created_by])
    completions = relationship('TaskCompletion', back_populates='task', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        last_completion = self.completions.order_by(TaskCompletion.completed_at.desc()).first()
        return {
            'id': self.id,
            'app_id': self.app_id,
            'title': self.title,
            'description': self.description,
            'frequency': self.frequency.value if self.frequency else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'last_completed': last_completion.completed_at.isoformat() if last_completion else None,
            'last_completed_by': last_completion.completer.full_name if last_completion and last_completion.completer else None,
        }


class TaskCompletion(Base):
    __tablename__ = 'task_completions'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    task_id = Column(String(36), ForeignKey('maintenance_tasks.id'), nullable=False)
    completed_by = Column(String(36), ForeignKey('users.id'), nullable=False)
    completed_at = Column(DateTime, default=utc_now)
    notes = Column(Text, default='')

    # Relationships
    task = relationship('MaintenanceTask', back_populates='completions')
    completer = relationship('User', foreign_keys=[completed_by])

    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'completed_by': self.completed_by,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'notes': self.notes,
            'completer': self.completer.to_dict() if self.completer else None,
        }


# ─── Activity Log ─────────────────────────────────────────────────────────

class ActivityLog(Base):
    __tablename__ = 'activity_log'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True)
    action = Column(Text, nullable=False)
    entity_type = Column(String(50), default='')
    entity_id = Column(String(36), default='')
    metadata_json = Column(JSON, default=lambda: {})
    created_at = Column(DateTime, default=utc_now, index=True)

    # Relationships
    app = relationship('App', back_populates='activity_logs')
    user = relationship('User', foreign_keys=[user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'user_id': self.user_id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'metadata': self.metadata_json,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict() if self.user else None,
        }


# ─── Server Metrics ───────────────────────────────────────────────────────

class ServerMetric(Base):
    __tablename__ = 'server_metrics'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    cpu_percent = Column(Float, default=0.0)
    ram_percent = Column(Float, default=0.0)
    disk_percent = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=utc_now, index=True)

    # Relationships
    app = relationship('App', back_populates='server_metrics')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'cpu_percent': self.cpu_percent,
            'ram_percent': self.ram_percent,
            'disk_percent': self.disk_percent,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }

# ─── Roadmap Features ─────────────────────────────────────────────────────

class RoadmapFeature(Base):
    __tablename__ = 'roadmap_features'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, default='')
    status = Column(String(50), default='planned') # planned, in_progress, completed
    priority = Column(String(50), default='medium') # low, medium, high, urgent
    start_date = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    app = relationship('App', back_populates='roadmap_features')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }




# ─── Failure Predictions ──────────────────────────────────────────────────

class FailurePrediction(Base):
    __tablename__ = 'failure_predictions'

    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_id = Column(String(36), ForeignKey('apps.id'), nullable=False)
    confidence_percentage = Column(Float, nullable=False, default=0.0)
    trend_summary = Column(JSON, default=dict)
    action_suggested = Column(Text, default='')
    is_alert_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    app = relationship('App')

    def to_dict(self):
        return {
            'id': self.id,
            'app_id': self.app_id,
            'confidence_percentage': self.confidence_percentage,
            'trend_summary': self.trend_summary,
            'action_suggested': self.action_suggested,
            'is_alert_sent': self.is_alert_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── Database Setup ───────────────────────────────────────────────────────

def init_db(db_uri):
    """Initialize the database and create all tables."""
    engine = create_engine(db_uri, echo=False)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return engine, Session
