from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from decimal import Decimal

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=250)
    description: Optional[str] = None
    brand: str = Field(..., min_length=1, max_length=100)
    category_id: str
    price: Decimal = Field(..., gt=0, decimal_places=2)
    discount_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    stock_quantity: int = Field(default=0, ge=0)
    images: List[str] = []
    is_featured: bool = False
    is_active: bool = True
    sku: Optional[str] = None
    weight: Optional[Decimal] = None
    extra_data: Optional[Dict] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    brand: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    discount_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    images: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    extra_data: Optional[Dict] = None

class ProductResponse(ProductBase):
    id: str
    rating_average: Decimal
    rating_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
