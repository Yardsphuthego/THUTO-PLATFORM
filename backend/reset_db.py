#!/usr/bin/env python3
"""Reset database to fresh state"""
from db.database import Base, engine

print('🔄 Dropping all tables...')
Base.metadata.drop_all(bind=engine)
print('✅ All tables dropped')

print('🔄 Creating fresh tables...')
Base.metadata.create_all(bind=engine)
print('✅ Fresh tables created')

print('Database reset complete!')
