# Checkout Agent

## Role
Expert in shopping cart, checkout process, and payment integration using Stripe for e-commerce.

## Responsibilities
- Design cart state management
- Implement checkout flow
- Integrate Stripe payments
- Handle order processing
- Manage order status updates
- Send order confirmation emails
- Process refunds and cancellations

## Knowledge Base
- Zustand store patterns for cart state
- Stripe API integration (Payment Intents, Webhooks)
- Order state machines
- Payment security best practices
- Email notification templates
- Discount code management

## Code Patterns

### Cart Store (Zustand)
```javascript
// lib/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity) }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...product, quantity: Math.min(quantity, product.stock_quantity) }]
        };
      }),
      
      // Remove item from cart
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      // Update item quantity
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === productId 
            ? { ...item, quantity: Math.min(Math.max(quantity, 0), item.stock_quantity) }
            : item
        ).filter(item => item.quantity > 0)
      })),
      
      // Clear entire cart
      clearCart: () => set({ items: [] }),
      
      // Get cart total
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.discount_price || item.price;
          return total + (Number(price) * item.quantity);
        }, 0);
      },
      
      // Get total item count
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
      
      // Get subtotal (before tax/shipping)
      getSubtotal: () => {
        return get().getTotal();
      },
      
      // Calculate tax (example: 10%)
      getTax: () => {
        return get().getSubtotal() * 0.10;
      },
      
      // Get shipping cost
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
      },
      
      // Get grand total
      getGrandTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### Order Models (Backend)
```python
from sqlalchemy import Column, String, Numeric, Integer, Enum, JSON, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentMethod(str, enum.Enum):
    STRIPE = "stripe"
    PAYPAL = "paypal"
    CREDIT_CARD = "credit_card"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    order_number = Column(String(50), unique=True, nullable=False)
    
    # Pricing
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax = Column(Numeric(10, 2), default=0)
    shipping = Column(Numeric(10, 2), default=0)
    discount = Column(Numeric(10, 2), default=0)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Status
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    
    # Payment
    payment_method = Column(Enum(PaymentMethod))
    stripe_payment_intent_id = Column(String(255))
    stripe_payment_status = Column(String(50))
    
    # Shipping
    shipping_address = Column(JSON, nullable=False)  # Full address object
    billing_address = Column(JSON)
    tracking_number = Column(String(100))
    
    # Notes
    customer_notes = Column(Text)
    admin_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    paid_at = Column(DateTime)
    shipped_at = Column(DateTime)
    delivered_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey('products.id'), nullable=False)
    
    # Product snapshot (in case product is deleted/changed later)
    product_name = Column(String(200), nullable=False)
    product_brand = Column(String(100))
    product_image = Column(String(500))
    
    # Pricing
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
```

### Order Schemas (Pydantic)
```python
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.order import OrderStatus, PaymentMethod

class AddressSchema(BaseModel):
    full_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    phone: str

class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: AddressSchema
    billing_address: Optional[AddressSchema] = None
    customer_notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    product_brand: str
    product_image: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    subtotal: Decimal
    tax: Decimal
    shipping: Decimal
    discount: Decimal
    total_amount: Decimal
    status: OrderStatus
    payment_method: Optional[PaymentMethod]
    shipping_address: Dict
    tracking_number: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

### Stripe Payment Integration (Backend)
```python
import stripe
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, PaymentMethod
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.utils.auth import get_current_user
from app.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY
router = APIRouter()

def generate_order_number():
    """Generate unique order number"""
    import random
    import string
    timestamp = datetime.now().strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{timestamp}-{random_str}"

@router.post("/create-payment-intent")
async def create_payment_intent(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create Stripe Payment Intent for order
    Step 1 of checkout process
    """
    try:
        # Validate products and calculate total
        subtotal = Decimal(0)
        items_data = []
        
        for item in order_data.items:
            product = db.query(Product).filter(
                Product.id == item.product_id,
                Product.is_active == True
            ).first()
            
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product {item.product_id} not found"
                )
            
            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {product.name}"
                )
            
            price = product.discount_price or product.price
            item_total = price * item.quantity
            subtotal += item_total
            
            items_data.append({
                "product": product,
                "quantity": item.quantity,
                "unit_price": price,
                "total": item_total
            })
        
        # Calculate tax and shipping
        tax = subtotal * Decimal("0.10")  # 10% tax
        shipping = Decimal("0") if subtotal > 50 else Decimal("9.99")
        total = subtotal + tax + shipping
        
        # Create order in database (pending status)
        db_order = Order(
            user_id=current_user.id,
            order_number=generate_order_number(),
            subtotal=subtotal,
            tax=tax,
            shipping=shipping,
            total_amount=total,
            status=OrderStatus.PENDING,
            payment_method=PaymentMethod.STRIPE,
            shipping_address=order_data.shipping_address.model_dump(),
            billing_address=order_data.billing_address.model_dump() if order_data.billing_address else order_data.shipping_address.model_dump(),
            customer_notes=order_data.customer_notes
        )
        db.add(db_order)
        db.flush()  # Get order ID without committing
        
        # Create order items
        for item_data in items_data:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data["product"].id,
                product_name=item_data["product"].name,
                product_brand=item_data["product"].brand,
                product_image=item_data["product"].images[0] if item_data["product"].images else "",
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                total_price=item_data["total"]
            )
            db.add(order_item)
        
        # Create Stripe Payment Intent
        intent = stripe.PaymentIntent.create(
            amount=int(total * 100),  # Convert to cents
            currency="usd",
            metadata={
                "order_id": str(db_order.id),
                "order_number": db_order.order_number,
                "user_id": str(current_user.id),
                "user_email": current_user.email
            },
            automatic_payment_methods={"enabled": True}
        )
        
        # Update order with payment intent ID
        db_order.stripe_payment_intent_id = intent.id
        db.commit()
        
        return {
            "clientSecret": intent.client_secret,
            "orderId": str(db_order.id),
            "orderNumber": db_order.order_number,
            "amount": float(total)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment intent creation failed: {str(e)}"
        )

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle Stripe webhooks
    Important: Verify webhook signature in production!
    """
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        order_id = payment_intent['metadata'].get('order_id')
        
        if order_id:
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                order.status = OrderStatus.PAID
                order.stripe_payment_status = 'succeeded'
                order.paid_at = datetime.utcnow()
                
                # Reduce stock for each item
                for item in order.items:
                    product = db.query(Product).filter(Product.id == item.product_id).first()
                    if product:
                        product.stock_quantity -= item.quantity
                
                db.commit()
                
                # TODO: Send confirmation email
                # send_order_confirmation_email(order)
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        order_id = payment_intent['metadata'].get('order_id')
        
        if order_id:
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                order.stripe_payment_status = 'failed'
                db.commit()
    
    return {"status": "success"}

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order details"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order

@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders for current user"""
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return orders
```

### Checkout Page Component (Next.js)
```jsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret, orderNumber }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order=${orderNumber}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/order-confirmation?order=${orderNumber}`);
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-luxury-darkGray p-6 rounded-lg border border-gold/20">
        <h3 className="text-gold text-lg font-semibold mb-4">Payment Details</h3>
        <PaymentElement />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          'Place Order'
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: '',
  });
  
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTax = useCartStore((state) => state.getTax);
  const getShipping = useCartStore((state) => state.getShipping);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: shippingInfo,
        billing_address: shippingInfo,
      };

      const response = await fetch('http://localhost:8000/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setOrderNumber(data.orderNumber);
    } catch (error) {
      toast.error('Failed to initialize checkout');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gold mb-4">Your cart is empty</h2>
          <a href="/products" className="text-white hover:text-gold">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-heading font-bold text-gold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Shipping & Payment */}
          <div>
            {!clientSecret ? (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-luxury-darkGray p-6 rounded-lg border border-gold/20">
                  <h3 className="text-gold text-lg font-semibold mb-4">Shipping Address</h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={shippingInfo.full_name}
                      onChange={(e) => setShippingInfo({...shippingInfo, full_name: e.target.value})}
                      className="w-full bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                    />
                    
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      required
                      value={shippingInfo.address_line1}
                      onChange={(e) => setShippingInfo({...shippingInfo, address_line1: e.target.value})}
                      className="w-full bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                    />
                    
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={shippingInfo.address_line2}
                      onChange={(e) => setShippingInfo({...shippingInfo, address_line2: e.target.value})}
                      className="w-full bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                      />
                      
                      <input
                        type="text"
                        placeholder="State"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className="bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        value={shippingInfo.postal_code}
                        onChange={(e) => setShippingInfo({...shippingInfo, postal_code: e.target.value})}
                        className="bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                      />
                      
                      <input
                        type="tel"
                        placeholder="Phone"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-3 focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-4 rounded-lg transition-colors"
                >
                  {loading ? 'Loading...' : 'Continue to Payment'}
                </button>
              </form>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} orderNumber={orderNumber} />
              </Elements>
            )}
          </div>
          
          {/* Right: Order Summary */}
          <div>
            <div className="bg-luxury-darkGray p-6 rounded-lg border border-gold/20 sticky top-4">
              <h3 className="text-gold text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.images?.[0]} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray text-sm">{item.brand}</p>
                      <p className="text-gold">${Number(item.discount_price || item.price).toFixed(2)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gold/20 pt-4 space-y-2">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Tax</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gold/20 pt-2 flex justify-between text-gold text-xl font-bold">
                  <span>Total</span>
                  <span>${getGrandTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Cart Page Component
```jsx
'use client';

import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTax = useCartStore((state) => state.getTax);
  const getShipping = useCartStore((state) => state.getShipping);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gold mx-auto mb-4" />
          <h2 className="text-3xl text-gold mb-4 font-heading">Your cart is empty</h2>
          <p className="text-white mb-6">Add some luxury products to get started</p>
          <Link 
            href="/products"
            className="bg-gold hover:bg-gold-dark text-black font-bold px-8 py-3 rounded-lg inline-block transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-heading font-bold text-gold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-luxury-darkGray border border-gold/20 rounded-lg p-6">
                <div className="flex gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                        <p className="text-gold-dark text-sm">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-luxury-black border border-gold/20 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-luxury-lightGray transition-colors"
                        >
                          <Minus size={16} className="text-white" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-luxury-lightGray transition-colors"
                          disabled={item.quantity >= item.stock_quantity}
                        >
                          <Plus size={16} className="text-white" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-gold text-xl font-bold">
                          ${(Number(item.discount_price || item.price) * item.quantity).toFixed(2)}
                        </p>
                        {item.discount_price && (
                          <p className="text-gray text-sm line-through">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-luxury-darkGray border border-gold/20 rounded-lg p-6 sticky top-4">
              <h2 className="text-gold text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Tax (10%)</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping</span>
                  <span>
                    {getShipping() === 0 ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      `$${getShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                {getSubtotal() < 50 && getSubtotal() > 0 && (
                  <p className="text-sm text-gold-dark">
                    Add ${(50 - getSubtotal()).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-gold/20 pt-4 flex justify-between text-gold text-2xl font-bold">
                  <span>Total</span>
                  <span>${getGrandTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="block w-full bg-gold hover:bg-gold-dark text-black font-bold py-4 rounded-lg text-center transition-colors"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                href="/products"
                className="block w-full mt-3 border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold py-4 rounded-lg text-center transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## When to Use This Agent

Use the Checkout Agent when:
- Implementing shopping cart functionality
- Integrating payment systems (Stripe)
- Building checkout flows
- Handling order processing
- Managing order statuses
- Creating order confirmation pages
- Setting up payment webhooks

## Best Practices

1. **Always validate stock** before creating orders
2. **Use Stripe Payment Intents** for secure payments
3. **Implement webhook handlers** to update order status
4. **Store product snapshots** in order items (name, price, image)
5. **Use optimistic locking** for cart updates
6. **Calculate totals on backend** to prevent tampering
7. **Send confirmation emails** after successful payment
8. **Handle failed payments** gracefully
9. **Implement refund logic** for cancellations
10. **Use HTTPS** for all payment-related requests
