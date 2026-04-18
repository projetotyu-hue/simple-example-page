import bcrypt
import jwt
import datetime
from backend.db import get_db_connection

SECRET_KEY = "super_secret_secure_key_sentinel_shield" # Em prod, usar variável de ambiente

def verify_credentials(username, password):
    """Verifica usuário e senha no banco de dados."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user:
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return True
    return False

def generate_token(username):
    """Gera um JWT para sessão válida por 24 horas."""
    payload = {
        'username': username,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verifica e decodifica o JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
