from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid, random, string, threading, urllib.request, urllib.parse, os

from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.utils.auth import get_current_user, get_current_admin_user

router = APIRouter()

# --- Pricing constants ---
TAX_RATE = 0.04
SHIPPING_KARACHI = 350
SHIPPING_OTHER = 450
FREE_SHIPPING_THRESHOLD = 5000


# --- Schemas ---
class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    product_brand: Optional[str] = None
    product_image: Optional[str] = None
    quantity: int
    unit_price: float


class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    address: str
    city: str


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: ShippingAddress
    payment_method: str          # "cod" or "bank_transfer"
    customer_notes: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str


def _generate_order_number() -> str:
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"BG-{datetime.utcnow().strftime('%Y%m%d')}-{suffix}"


def _whatsapp_notify(order_number, full_name, phone, items_text, total, city, payment_method):
    """Send WhatsApp notification via CallMeBot (fire-and-forget, runs in background thread)."""
    api_key = os.getenv("CALLMEBOT_API_KEY", "")
    if not api_key:
        return
    msg = (
        f"New Order: {order_number}\n"
        f"Customer: {full_name} | {phone}\n"
        f"Items: {items_text}\n"
        f"Total: Rs. {total:,.0f}\n"
        f"City: {city} | {payment_method.upper()}"
    )
    url = (
        f"https://api.callmebot.com/whatsapp.php"
        f"?phone=923413157159"
        f"&text={urllib.parse.quote(msg)}"
        f"&apikey={api_key}"
    )
    try:
        urllib.request.urlopen(url, timeout=10)
    except Exception:
        pass


# --- Routes ---

@router.post("/")
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    allowed_methods = {"cod", "bank_transfer"}
    if payload.payment_method not in allowed_methods:
        raise HTTPException(status_code=400, detail="Invalid payment method")

    # --- Calculate totals ---
    subtotal = sum(item.unit_price * item.quantity for item in payload.items)

    city_lower = payload.shipping_address.city.lower()
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        shipping = 0
    elif "karachi" in city_lower:
        shipping = SHIPPING_KARACHI
    else:
        shipping = SHIPPING_OTHER

    base = subtotal + shipping
    tax = round(base * TAX_RATE, 2)
    total = round(base + tax, 2)

    # --- Create order ---
    order = Order(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        order_number=_generate_order_number(),
        subtotal=round(subtotal, 2),
        shipping=shipping,
        tax=tax,
        discount=0,
        total_amount=total,
        status=OrderStatus.PENDING,
        payment_method=payload.payment_method,
        shipping_address=payload.shipping_address.dict(),
        customer_notes=payload.customer_notes,
    )
    db.add(order)
    db.flush()

    for item in payload.items:
        db.add(OrderItem(
            id=str(uuid.uuid4()),
            order_id=order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            product_brand=item.product_brand,
            product_image=item.product_image,
            quantity=item.quantity,
            unit_price=round(item.unit_price, 2),
            total_price=round(item.unit_price * item.quantity, 2),
        ))

    db.commit()
    db.refresh(order)

    # Fire WhatsApp notification in background — doesn't delay response
    items_text = ", ".join(f"{i.product_name} x{i.quantity}" for i in payload.items)
    threading.Thread(
        target=_whatsapp_notify,
        args=(
            order.order_number,
            payload.shipping_address.full_name,
            payload.shipping_address.phone,
            items_text,
            float(order.total_amount),
            payload.shipping_address.city,
            payload.payment_method,
        ),
        daemon=True,
    ).start()

    return {
        "order_number": order.order_number,
        "subtotal": float(order.subtotal),
        "shipping": float(order.shipping),
        "tax": float(order.tax),
        "total": float(order.total_amount),
        "status": order.status,
        "payment_method": order.payment_method,
    }


@router.get("/admin")
def get_all_orders_admin(
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin_user),
):
    """Admin: get all orders with full details."""
    query = db.query(Order).order_by(Order.created_at.desc())
    if status:
        query = query.filter(Order.status == status)
    total_count = query.count()
    orders = query.offset(skip).limit(limit).all()

    return {
        "total": total_count,
        "orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "status": o.status,
                "subtotal": float(o.subtotal),
                "shipping": float(o.shipping),
                "tax": float(o.tax),
                "total": float(o.total_amount),
                "payment_method": o.payment_method,
                "shipping_address": o.shipping_address,
                "customer_notes": o.customer_notes,
                "created_at": o.created_at.isoformat(),
                "items": [
                    {
                        "product_name": i.product_name,
                        "product_brand": i.product_brand,
                        "quantity": i.quantity,
                        "unit_price": float(i.unit_price),
                        "total_price": float(i.total_price),
                    }
                    for i in o.items
                ],
            }
            for o in orders
        ],
    }


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin_user),
):
    """Admin: update order status."""
    valid = {"pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"}
    if payload.status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Use: {', '.join(valid)}")
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    return {"success": True, "order_id": order_id, "status": payload.status}


@router.get("/my-orders")
def get_my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "status": o.status,
            "total": float(o.total_amount),
            "payment_method": o.payment_method,
            "created_at": o.created_at.isoformat(),
            "items_count": len(o.items),
        }
        for o in orders
    ]


@router.get("/{order_id}")
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "subtotal": float(order.subtotal),
        "shipping": float(order.shipping),
        "tax": float(order.tax),
        "total": float(order.total_amount),
        "payment_method": order.payment_method,
        "shipping_address": order.shipping_address,
        "customer_notes": order.customer_notes,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "product_name": i.product_name,
                "product_brand": i.product_brand,
                "quantity": i.quantity,
                "unit_price": float(i.unit_price),
                "total_price": float(i.total_price),
            }
            for i in order.items
        ],
    }
