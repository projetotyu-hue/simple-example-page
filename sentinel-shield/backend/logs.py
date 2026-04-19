from db import get_db_connection

def log_event(event_type, username, ip, status, device):
    """Logs an event to the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO logs (event_type, username, ip, status, device)
        VALUES (?, ?, ?, ?, ?)
    ''', (event_type, username, ip, status, device))
    conn.commit()
    conn.close()

def get_recent_logs(limit=10):
    """Retrieves recent logs"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?', (limit,))
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return logs
