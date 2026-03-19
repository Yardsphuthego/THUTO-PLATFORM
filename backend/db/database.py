from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

# Use DATABASE_URL from config, fallback to SQLite for local development
DATABASE_URL = (settings.database_url or "sqlite:///./thuto_voting.db").strip()
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

IS_SQLITE = DATABASE_URL.startswith("sqlite")

# SQLite requires check_same_thread; PostgreSQL does not.
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if IS_SQLITE else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def ensure_schema_updates():
    """Apply lightweight additive schema updates for existing databases."""
    with engine.begin() as connection:
        table_names = set(inspect(connection).get_table_names())

        def add_column_if_missing(table_name: str, column_name: str, column_sql: str) -> None:
            if table_name not in table_names:
                return

            existing_columns = {
                column["name"] for column in inspect(connection).get_columns(table_name)
            }
            if column_name in existing_columns:
                return

            connection.execute(
                text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_sql}")
            )

        # Users table updates
        add_column_if_missing("users", "university_id", "INTEGER")
        add_column_if_missing("users", "profile_picture", "VARCHAR")
        add_column_if_missing("users", "last_login", "TIMESTAMP")

        # Elections table updates
        add_column_if_missing("elections", "university_id", "INTEGER")

        # Candidates table updates
        add_column_if_missing("candidates", "candidate_name", "VARCHAR")
        add_column_if_missing("candidates", "party_name", "VARCHAR")
        add_column_if_missing("candidates", "candidate_photo", "TEXT")
        add_column_if_missing("candidates", "party_logo", "TEXT")

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
