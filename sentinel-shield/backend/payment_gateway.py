import requests
import json
import os
from card_secure import encrypt_card, mask_card, mask_cpf
from db import get_db_connection
from analytics import record_sale
from logs import log_event

MERCADOPAGO_ACCESS_TOKEN = os.environ.get('MERCADOPAGO_ACCESS_TOKEN', '')

GATEWAY_CONFIGS = {
    "mercadopago": {
        "enabled": bool(MERCADOPAGO_ACCESS_TOKEN),
        "api_url": "https://api.mercadopago.com",
        "access_token": MERCADOPAGO_ACCESS_TOKEN
    },
    "stripe": {
        "enabled": False,
        "api_url": "https://api.stripe.com",
        "api_key": os.environ.get('STRIPE_API_KEY', '')
    },
    "pagseguro": {
        "enabled": False,
        "api_url": "https://ws.pagseguro.uol.com.br",
        "email": os.environ.get('PAGSEGURO_EMAIL', ''),
        "token": os.environ.get('PAGSEGURO_TOKEN', '')
    }
}

def process_payment(card_data, gateway="mercadopago"):
    config = GATEWAY_CONFIGS.get(gateway, {})

    if not config.get("enabled"):
        return {"success": False, "error": "Gateway não configurado"}

    if gateway == "mercadopago":
        return process_mercadopago(card_data, config)
    elif gateway == "stripe":
        return process_stripe(card_data, config)
    elif gateway == "pagseguro":
        return process_pagseguro(card_data, config)

    return {"success": False, "error": "Gateway desconhecido"}

def process_mercadopago(card_data, config):
    try:
        card_number = card_data.get('card_number', '').replace(' ', '')
        expiry = card_data.get('expiry', '')
        cvv = card_data.get('cvv', '')
        cpf = card_data.get('cpf', '')
        amount = card_data.get('amount', 100)
        email = card_data.get('email', 'client@email.com')
        ip = card_data.get('ip', '127.0.0.1')

        month, year = expiry.split('/')
        expiry_year = f"20{year}"
        card_token = get_mercadopago_token(card_number, month, expiry_year, cvv, cpf, email, config)

        if not card_token:
            return {"success": False, "error": "Falha ao criar token do cartão"}

        payment_data = {
            "transaction_amount": float(amount),
            "token": card_token,
            "payment_method_id": "mastercard",
            "payer": {
                "email": email,
                "identification": {
                    "type": "CPF",
                    "number": cpf
                }
            }
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {config['access_token']}"
        }

        response = requests.post(
            f"{config['api_url']}/v1/payments",
            json=payment_data,
            headers=headers,
            timeout=30
        )

        result = response.json()

        if response.status_code in [200, 201]:
            encrypted = encrypt_card(card_number, expiry, cvv, cpf)

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO cards (card_number, card_name, expiry, cvv, cpf, ip)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (encrypted, card_data.get('card_name', 'Cliente'), expiry, '***', '***', ip))
            conn.commit()
            conn.close()

            record_sale(
                product_name=card_data.get('product_name', 'Produto'),
                amount=float(amount),
                status='completed',
                customer_name=card_data.get('card_name', ''),
                customer_email=email,
                payment_method='mercadopago',
                transaction_id=result.get('id', ''),
                ip=ip
            )

            log_event('PAYMENT_SUCCESS', card_data.get('card_name', ''), ip, f'Valor: R${amount}', 'Payment')

            return {
                "success": True,
                "transaction_id": result.get('id'),
                "status": result.get('status'),
                "status_detail": result.get('status_detail')
            }
        else:
            error_msg = result.get('error', 'Erro desconhecido')
            log_event('PAYMENT_FAILED', card_data.get('card_name', ''), ip, error_msg, 'Payment')
            return {"success": False, "error": error_msg}

    except Exception as e:
        return {"success": False, "error": str(e)}

def get_mercadopago_token(card_number, month, year, cvv, cpf, email, config):
    try:
        card_data = {
            "card_number": card_number,
            "expiration_month": month,
            "expiration_year": year,
            "security_code": cvv,
            "cardholder": {
                "identification": {
                    "type": "CPF",
                    "number": cpf
                },
                "email": email
            }
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {config['access_token']}"
        }

        response = requests.post(
            f"{config['api_url']}/v1/card_tokens",
            json=card_data,
            headers=headers,
            timeout=30
        )

        if response.status_code in [200, 201]:
            return response.json().get('id')

    except:
        pass

    return None

def process_stripe(card_data, config):
    return {"success": False, "error": "Stripe não implementado"}

def process_pagseguro(card_data, config):
    return {"success": False, "error": "PagSeguro não implementado"}

def get_gateway_status():
    status = {}
    for name, config in GATEWAY_CONFIGS.items():
        status[name] = {
            "enabled": config.get("enabled", False),
            "configured": bool(config.get("access_token") or config.get("api_key") or config.get("token"))
        }
    return status

def get_payment_methods():
    return {
        "mercadopago": ["credit_card"],
        "stripe": ["credit_card", "debit_card"],
        "pagseguro": ["credit_card", "debit_card", "boleto"]
    }