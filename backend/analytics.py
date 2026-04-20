import sqlite3
import os
from datetime import datetime, timedelta
from collections import defaultdict

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/database.sqlite')

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def record_pageview(page, ip, referrer, device, os, browser, country, state, city, session_id=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO pageviews (page, ip, referrer, device, os, browser, country, state, city, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (page, ip, referrer, device, os, browser, country, state, city, session_id))
    conn.commit()
    conn.close()

def get_pageviews(limit=100, start_date=None, end_date=None):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = 'SELECT * FROM pageviews'
    params = []

    if start_date and end_date:
        query += ' WHERE timestamp BETWEEN ? AND ?'
        params = [start_date, end_date]

    query += ' ORDER BY timestamp DESC LIMIT ?'
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return rows

def get_page_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT page, COUNT(*) as views, COUNT(DISTINCT ip) as unique_visitors
        FROM pageviews
        GROUP BY page
        ORDER BY views DESC
    ''')
    pages = cursor.fetchall()

    cursor.execute('''
        SELECT DATE(timestamp) as date, COUNT(*) as views
        FROM pageviews
        WHERE timestamp >= datetime('now', '-7 days')
        GROUP BY DATE(timestamp)
        ORDER BY date
    ''')
    daily = cursor.fetchall()

    cursor.execute('''
        SELECT state, COUNT(*) as views
        FROM pageviews
        GROUP BY state
        ORDER BY views DESC
        LIMIT 10
    ''')
    by_state = cursor.fetchall()

    cursor.execute('''
        SELECT device, COUNT(*) as views
        FROM pageviews
        GROUP BY device
    ''')
    by_device = cursor.fetchall()

    conn.close()

    return {
        "pages": [{"page": p[0], "views": p[1], "unique": p[2]} for p in pages],
        "daily": [{"date": d[0], "views": d[1]} for d in daily],
        "by_state": [{"state": s[0], "views": s[1]} for s in by_state],
        "by_device": [{"device": d[0], "views": d[1]} for d in by_device]
    }

def record_sale(product_name, amount, status, customer_name, customer_email, payment_method, transaction_id, ip):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO sales (product_name, amount, status, customer_name, customer_email, payment_method, transaction_id, ip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (product_name, amount, status, customer_name, customer_email, payment_method, transaction_id, ip))
    conn.commit()
    conn.close()

def get_sales_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT COUNT(*) as total, SUM(amount) as revenue
        FROM sales
        WHERE status = 'completed'
    ''')
    total = cursor.fetchone()

    cursor.execute('''
        SELECT DATE(created_at) as date, COUNT(*) as count, SUM(amount) as revenue
        FROM sales
        WHERE status = 'completed' AND created_at >= datetime('now', '-30 days')
        GROUP BY DATE(created_at)
        ORDER BY date
    ''')
    daily = cursor.fetchall()

    cursor.execute('''
        SELECT payment_method, COUNT(*) as count
        FROM sales
        GROUP BY payment_method
    ''')
    by_method = cursor.fetchall()

    cursor.execute('''
        SELECT status, COUNT(*) as count
        FROM sales
        GROUP BY status
    ''')
    by_status = cursor.fetchall()

    conn.close()

    return {
        "total_sales": total[0] or 0,
        "revenue": total[1] or 0,
        "daily": [{"date": d[0], "count": d[1], "revenue": d[2]} for d in daily],
        "by_method": [{"method": m[0], "count": m[1]} for m in by_method],
        "by_status": [{"status": s[0], "count": s[1]} for s in by_status]
    }

def get_dashboard_summary():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM cards')
    total_cards = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM metrics')
    total_visitors = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM pageviews')
    total_pageviews = cursor.fetchone()[0]

    cursor.execute('''
        SELECT COUNT(*) FROM sales WHERE status = 'pending'
    ''')
    pending_payments = cursor.fetchone()[0]

    cursor.execute('''
        SELECT SUM(amount) FROM sales WHERE status = 'completed'
    ''')
    revenue = cursor.fetchone()[0] or 0

    cursor.execute('''
        SELECT state, COUNT(*) as count
        FROM pageviews
        GROUP BY state
        ORDER BY count DESC
        LIMIT 5
    ''')
    top_states = cursor.fetchall()

    conn.close()

    return {
        "total_cards": total_cards,
        "total_visitors": total_visitors,
        "total_pageviews": total_pageviews,
        "pending_payments": pending_payments,
        "revenue": revenue,
        "top_states": [{"state": s[0], "count": s[1]} for s in top_states]
    }