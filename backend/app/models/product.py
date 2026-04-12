from sqlalchemy import Column, String, Numeric, Integer, Boolean, JSON, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    image = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    description = Column(Text)
    brand = Column(String(100), nullable=False)
    category_id = Column(String(36), ForeignKey('categories.id'))
    price = Column(Numeric(10, 2), nullable=False)
    discount_price = Column(Numeric(10, 2))
    stock_quantity = Column(Integer, default=0)
    images = Column(JSON)  # Array of image URLs
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    sku = Column(String(50), unique=True)
    weight = Column(Numeric(10, 2))  # in grams
    extra_data = Column(JSON)  # ingredients, usage, etc.
    rating_average = Column(Numeric(3, 2), default=0.0)
    rating_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
