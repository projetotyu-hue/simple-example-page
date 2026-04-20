from db import get_db_connection

def record_metric(ip, country, state, city, device, os_name, browser, origin):
    """Records an access metric to the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO metrics (ip, country, state, city, device, os, browser, origin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (ip, country, state, city, device, os_name, browser, origin))
    conn.commit()
    conn.close()

def get_metrics_summary():
    """Retrieves aggregated metrics for the dashboard"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total accesses
    cursor.execute('SELECT COUNT(*) as total FROM metrics')
    total_accesses = cursor.fetchone()['total']

    # Devices count
    cursor.execute('SELECT device, COUNT(*) as count FROM metrics GROUP BY device')
    devices = {row['device']: row['count'] for row in cursor.fetchall()}

    # Regions (States) count
    cursor.execute('SELECT state, COUNT(*) as count FROM metrics WHERE state IS NOT NULL AND state != "" GROUP BY state')
    regions = {row['state']: row['count'] for row in cursor.fetchall()}

    # Browsers count
    cursor.execute('SELECT browser, COUNT(*) as count FROM metrics GROUP BY browser')
    browsers = {row['browser']: row['count'] for row in cursor.fetchall()}

    conn.close()
    
    return {
        "total_accesses": total_accesses,
        "devices": devices,
        "regions": regions,
        "browsers": browsers
    }
