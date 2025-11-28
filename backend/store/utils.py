"""
Utility functions for the store app.
"""
from django.conf import settings
from .models import AuditLog


def log_admin_action(user, action_type, model_name, object_id, changes=None):
    """Log admin action to audit log."""
    from django.contrib.auth.models import AnonymousUser
    import json
    
    if isinstance(user, AnonymousUser):
        return
    
    # Convert changes to JSON-serializable format
    if changes:
        try:
            # Try to serialize to ensure it's valid JSON
            json.dumps(changes)
        except (TypeError, ValueError):
            # If it contains non-serializable data, convert to string representation
            changes = {k: str(v) for k, v in changes.items()}
    
    try:
        AuditLog.objects.create(
            admin_user=user,
            action_type=action_type,
            model_name=model_name,
            object_id=str(object_id),
            changes=changes or {}
        )
    except Exception as e:
        # Log error but don't fail the request
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to create audit log: {e}")


def calculate_order_totals(subtotal, discount=0, shipping_cost=0):
    """Calculate order totals."""
    from decimal import Decimal
    
    subtotal = Decimal(str(subtotal))
    discount = Decimal(str(discount))
    shipping_cost = Decimal(str(shipping_cost))
    
    total = subtotal - discount + shipping_cost
    
    return {
        'subtotal': subtotal,
        'discount': discount,
        'shipping_cost': shipping_cost,
        'total': total
    }


def process_payment(amount, method='card', email=None):
    """
    Mock payment processor.
    Returns success/failure based on deterministic rules.
    """
    # Mock payment logic - in production, integrate with real gateway
    # For demo: fail if amount > 10000 or email contains 'fail'
    if amount > 10000:
        return {
            'success': False,
            'message': 'Payment amount too large',
            'transaction_id': None
        }
    
    if email and 'fail' in email.lower():
        return {
            'success': False,
            'message': 'Payment declined by mock processor',
            'transaction_id': None
        }
    
    # Generate mock transaction ID
    import uuid
    transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
    
    return {
        'success': True,
        'message': 'Payment processed successfully',
        'transaction_id': transaction_id
    }

