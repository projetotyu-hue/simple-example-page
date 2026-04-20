import hashlib
import os
from cryptography.fernet import Fernet

KEY_FILE = os.path.join(os.path.dirname(__file__), '../database/.key')

def get_key():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, 'rb') as f:
            return f.read()
    key = Fernet.generate_key()
    with open(KEY_FILE, 'wb') as f:
        f.write(key)
    return key

def encrypt_card(card_number, expiry, cvv, cpf):
    try:
        key = get_key()
        f = Fernet(key)

        data = f"{card_number}|{expiry}|{cvv}|{cpf}"
        encrypted = f.encrypt(data.encode())

        return encrypted.decode()
    except:
        return hashlib.sha256(f"{card_number}{cpf}".encode()).hexdigest()

def mask_card(card_number):
    if not card_number or len(card_number) < 4:
        return "**** **** **** ****"
    return f"**** **** **** {card_number[-4:]}"

def mask_cpf(cpf):
    if not cpf or len(cpf) < 4:
        return "***.***.***-**"
    return f"***.***.***-{cpf[-2:]}"