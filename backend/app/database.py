from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

_is_sqlite = "sqlite" in settings.DATABASE_URL

# Add sslmode=require to postgres URL if not already present
_db_url = settings.DATABASE_URL
if not _is_sqlite and "sslmode" not in _db_url:
    _db_url += "?sslmode=require" if "?" not in _db_url else "&sslmode=require"

engine = create_engine(
    _db_url,
    connect_args={"check_same_thread": False} if _is_sqlite else {},
    pool_pre_ping=True,
    pool_size=5 if not _is_sqlite else 1,
    max_overflow=10 if not _is_sqlite else 0,
    pool_timeout=30,
    pool_recycle=300,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
