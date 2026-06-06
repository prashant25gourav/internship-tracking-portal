import os
import jwt
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify
"""Authentication helpers: JWT creation and decorators.

This module centralizes lightweight JWT creation and request
decorators used by the Flask app during development and demos.

Security note: `AUTH_SECRET` should be provided via environment
variables in deployment (not committed into source control).
"""

from dotenv import load_dotenv

# Load environment variables from a .env file (if present). This keeps
# secret configuration (AUTH_SECRET, ADMIN_PASSWORD, DB credentials)
# out of source control and makes local development predictable.
load_dotenv()

# Secret used to sign JWTs. Override in production via environment.
AUTH_SECRET = os.getenv('AUTH_SECRET', 'dev-change-me')


def create_token(role: str, expires_delta: timedelta = None):
    """Create a JWT token with a `role` claim.

    Keeps things minimal using PyJWT. Returns a string token.
    """
    if expires_delta is None:
        expires_delta = timedelta(hours=12)
    payload = {
        'role': role,
        'exp': datetime.utcnow() + expires_delta,
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, AUTH_SECRET, algorithm='HS256')
    # PyJWT v1 returned bytes; ensure a str is returned for callers.
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token


def jwt_required(role: str = None):
    """Decorator to protect endpoints with a JWT `Authorization: Bearer <token>`.

    Optionally restrict by `role`. Usage:
      @jwt_required()           # any valid token
      @jwt_required('admin')    # token.role must equal 'admin'
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth = request.headers.get('Authorization', '')
            if not auth.startswith('Bearer '):
                return jsonify({'success': False, 'error': {'message': 'Missing or invalid Authorization header'}}), 401
            token = auth.split(' ', 1)[1].strip()
            try:
                payload = jwt.decode(token, AUTH_SECRET, algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                return jsonify({'success': False, 'error': {'message': 'Token expired'}}), 401
            except Exception:
                return jsonify({'success': False, 'error': {'message': 'Invalid token'}}), 401

            token_role = payload.get('role')
            if role and token_role != role:
                return jsonify({'success': False, 'error': {'message': 'Insufficient role permissions'}}), 403

            # Expose payload to route handlers if they need it
            request.jwt_payload = payload

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def admin_required(fn=None):
    """Require an admin JWT.

    Convenience wrapper around `jwt_required('admin')` so routes can use
    `@admin_required` for improved readability.
    """
    decorator = jwt_required('admin')
    if fn:
        return decorator(fn)
    return decorator


def student_required(fn=None):
    """Require a student JWT.

    Convenience wrapper around `jwt_required('student')`.
    """
    decorator = jwt_required('student')
    if fn:
        return decorator(fn)
    return decorator
