#!/bin/bash
# Initialize DB if not exists
python init_db.py 2>/dev/null || true
# Start server
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
