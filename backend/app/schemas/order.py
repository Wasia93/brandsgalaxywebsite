from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from decimal import Decimal
from app.models.order import OrderStatus, PaymentMethod

class AddressSchema(BaseModel):
    full_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "US"
    phone: str

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: AddressSchema
    billing_address: Optional[AddressSchema] = None
    customer_notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    product_brand: str
    product_image: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
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
