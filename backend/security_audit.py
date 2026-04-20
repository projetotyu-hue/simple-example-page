import re
import os
import time
from datetime import datetime, timedelta
from collections import defaultdict
from functools import wraps
from flask import request, jsonify, g
from db import get_db_connection


class SecurityAuditor:
    def __init__(self):
        self.findings = []
        self.alerts = []
        self.rate_limits = defaultdict(list)
        self.failed_logins = defaultdict(list)
        self.security_checks = {
            "rate_limiting": False,
            "csrf_protection": False,
            "xss_protection": False,
            "input_validation": False,
            "headers_security": False,
            "session_control": False,
            "permission_check": False,
        }
        self.risk_levels = {
            "critical": [],
            "high": [],
            "medium": [],
            "low": [],
            "attention": [],
        }

    def analyze_code(self, code_content, filename):
        findings = []

        if not filename.endswith('.html'):
            if re.search(r'select\s+.*\s+from\s+.*\+.*\)', code_content, re.IGNORECASE):
                findings.append({
                    "type": "SQL Injection",
                    "file": filename,
                    "risk": "critical",
                    "description": "Possível SQL Injection detectado",
                })

            if re.search(r'exec\s*\(|eval\s*\(', code_content):
                findings.append({
                    "type": "Code Injection",
                    "file": filename,
                    "risk": "critical",
                    "description": "Uso de exec/eval detectado",
                })

            if re.search(r'innerHTML\s*=', code_content):
                findings.append({
                    "type": "XSS",
                    "file": filename,
                    "risk": "high",
                    "description": "Possível vetor XSS com innerHTML",
                })

        if "password" in code_content.lower() and "hardcoded" in code_content.lower():
            findings.append({
                "type": "Hardcoded Secret",
                "file": filename,
                "risk": "critical",
                "description": "Senha ou chave hardcoded detectada",
            })

        if "_secret" in code_content.lower() or "_key" in code_content.lower():
            if not re.search(r'os\.environ|getenv|\.env', code_content):
                findings.append({
                    "type": "Hardcoded Secret",
                    "file": filename,
                    "risk": "high",
                    "description": "Chave secrets pode estar hardcoded",
                })

        if "verify_token" not in code_content and "/api/" in code_content:
            if "methods=" in code_content and "GET" in code_content:
                findings.append({
                    "type": "No Auth Check",
                    "file": filename,
                    "risk": "high",
                    "description": "Endpoint API pode não ter verificação de autenticação",
                })

        return findings

    def check_endpoint(self, endpoint_path, code_content):
        issues = []

        if "/admin/" in endpoint_path or "/api/admin" in endpoint_path:
            if "verify_token" not in code_content:
                issues.append({
                    "endpoint": endpoint_path,
                    "issue": "Rota administrativa sem verificação de token",
                    "risk": "high",
                })

        if "request.args" in code_content or "request.form" in code_content:
            if "escape" not in code_content.lower() and "sanitize" not in code_content.lower():
                issues.append({
                    "endpoint": endpoint_path,
                    "issue": "Parâmetros sem sanitização",
                    "risk": "medium",
                })

        return issues

    def check_rate_limit(self, ip, limit=60, window=60):
        now = time.time()
        self.rate_limits[ip] = [
            t for t in self.rate_limits[ip] if now - t < window
        ]

        if len(self.rate_limits[ip]) >= limit:
            return False

        self.rate_limits[ip].append(now)
        return True

    def check_failed_logins(self, ip, limit=5, window=300):
        now = time.time()
        self.failed_logins[ip] = [
            t for t in self.failed_logins[ip] if now - t < window
        ]

        if len(self.failed_logins[ip]) >= limit:
            return True

        self.failed_logins[ip].append(now)
        return False

    def record_alert(self, alert_type, severity, message, details=None):
        alert = {
            "timestamp": datetime.now().isoformat(),
            "type": alert_type,
            "severity": severity,
            "message": message,
            "details": details or {},
        }
        self.alerts.append(alert)

        if severity in self.risk_levels:
            self.risk_levels[severity].append(alert)

        self.log_security_event(alert_type, message, severity, details)

    def log_security_event(self, event_type, description, risk, details=None):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO security_logs (event_type, description, risk, details, created_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (event_type, description, risk, str(details or {}), datetime.now().isoformat()))
            conn.commit()
            conn.close()
        except:
            pass

    def validate_input(self, data, rules=None):
        if rules is None:
            rules = {}

        errors = []

        for field, value in data.items():
            if field in rules:
                rule = rules[field]

                if rule.get("required") and not value:
                    errors.append(f"Campo {field} é obrigatório")

                if rule.get("type") == "email" and value:
                    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
                        errors.append(f"Campo {field} deve ser email válido")

                if rule.get("type") == "cpf" and value:
                    if not re.match(r'^\d{11}$', re.sub(r'\D', '', value)):
                        errors.append(f"Campo {field} deve ser CPF válido")

                if rule.get("type") == "card" and value:
                    if not re.match(r'^\d{13,16}$', re.sub(r'\D', '', value)):
                        errors.append(f"Campo {field} deve ser número de cartão válido")

                if "max_length" in rule and len(str(value)) > rule["max_length"]:
                    errors.append(f"Campo {field} excede tamanho máximo")

        return errors

    def sanitize_input(self, value):
        if isinstance(value, str):
            value = value.strip()
            value = re.sub(r'<script[^>]*>.*?</script>', '', value, flags=re.IGNORECASE)
            value = re.sub(r'javascript:', '', value, flags=re.IGNORECASE)
            value = re.sub(r'on\w+\s*=', '', value, flags=re.IGNORECASE)
        return value

    def get_security_report(self):
        return {
            "timestamp": datetime.now().isoformat(),
            "alerts": self.alerts[-50:],
            "risk_summary": {
                "critical": len(self.risk_levels["critical"]),
                "high": len(self.risk_levels["high"]),
                "medium": len(self.risk_levels["medium"]),
                "low": len(self.risk_levels["low"]),
            },
            "checks": self.security_checks,
        }

    def enable_security_check(self, check_name):
        if check_name in self.security_checks:
            self.security_checks[check_name] = True

    def verify_all_checks(self):
        missing = []
        for check, enabled in self.security_checks.items():
            if not enabled:
                missing.append(check)
        return missing


auditor = SecurityAuditor()


def rate_limit(limit=60, window=60):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            if not auditor.check_rate_limit(ip, limit, window):
                auditor.record_alert(
                    "RATE_LIMIT_EXCEEDED",
                    "high",
                    f"IP {ip} excedeu limite de requisições",
                    {"ip": ip, "limit": limit, "window": window}
                )
                return jsonify({"error": "Too many requests"}), 429
            return f(*args, **kwargs)
        return wrapped
    return decorator


def security_validation(rules):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            data = request.get_json() or {}
            errors = auditor.validate_input(data, rules)
            if errors:
                auditor.record_alert(
                    "VALIDATION_FAILED",
                    "medium",
                    "Validação de entrada falhou",
                    {"errors": errors}
                )
                return jsonify({"error": "Validation failed", "details": errors}), 400
            return f(*args, **kwargs)
        return wrapped
    return decorator


def require_permissions(*required_roles):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            from auth import verify_token
            token = request.cookies.get('auth_token')
            if not token:
                auditor.record_alert(
                    "AUTH_MISSING",
                    "high",
                    "Acesso sem autenticação",
                    {"path": request.path}
                )
                return jsonify({"error": "Unauthorized"}), 401

            payload = verify_token(token)
            if not payload:
                auditor.record_alert(
                    "AUTH_INVALID",
                    "high",
                    "Token inválido ou expirado",
                    {"path": request.path}
                )
                return jsonify({"error": "Invalid token"}), 401

            user_role = payload.get('role', 'user')
            if user_role not in required_roles:
                auditor.record_alert(
                    "PERMISSION_DENIED",
                    "high",
                    f"Usuário {payload.get('username')} sem permissão",
                    {"required": required_roles, "user_role": user_role}
                )
                return jsonify({"error": "Forbidden"}), 403

            g.user = payload
            return f(*args, **kwargs)
        return wrapped
    return decorator


def security_monitor(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        ip = request.headers.get('X-Forwarded-For', request.remote_addr)

        if auditor.check_failed_logins(ip):
            auditor.record_alert(
                "BRUTE_FORCE_DETECTED",
                "critical",
                f"Possível ataque de força bruta do IP {ip}",
                {"ip": ip}
            )

        result = f(*args, **kwargs)

        if hasattr(result, 'status_code'):
            if result.status_code >= 400:
                auditor.log_security_event(
                    "REQUEST_FAILED",
                    f"Status {result.status_code}",
                    "medium",
                    {"path": request.path, "ip": ip}
                )

        return result
    return wrapped