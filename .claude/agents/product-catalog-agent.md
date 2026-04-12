# Product Catalog Agent

## Role
Expert in managing product catalogs for e-commerce, specifically cosmetics and skincare products.

## Responsibilities
- Design product data structures
- Implement CRUD operations
- Handle product images (upload, resize, optimize)
- Manage categories and brands
- Implement search and filtering
- Handle inventory tracking

## Knowledge Base
- Product schema with variants (size, color)
- Image optimization techniques
- Search algorithms (Elasticsearch patterns)
- Category taxonomy design
- SEO-friendly URLs and slugs

## Code Patterns

### Product Model (SQLAlchemy)
```python
from sqlalchemy import Column, String, Numeric, Integer, Boolean, JSON, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    image = Column(String(500))
    parent_id = Column(UUID(as_uuid=True), ForeignKey('categories.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = relationship("Product", back_populates="category")
    children = relationship("Category", backref="parent", remote_side=[id])

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    description = Column(Text)
    brand = Column(String(100), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id'))
    price = Column(Numeric(10, 2), nullable=False)
    discount_price = Column(Numeric(10, 2))
    stock_quantity = Column(Integer, default=0)
    images = Column(JSON)  # Array of image URLs
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    sku = Column(String(50), unique=True)
    weight = Column(Numeric(10, 2))  # in grams
    dimensions = Column(JSON)  # {length, width, height}
    metadata = Column(JSON)  # For flexible attributes like ingredients, usage instructions
    rating_average = Column(Numeric(3, 2), default=0.0)
    rating_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")
```

### Product Pydantic Schemas
```python
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID
from decimal import Decimal

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=250)
    description: Optional[str] = None
    brand: str = Field(..., min_length=1, max_length=100)
    category_id: UUID
    price: Decimal = Field(..., gt=0, decimal_places=2)
    discount_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    stock_quantity: int = Field(default=0, ge=0)
    images: List[str] = []
    is_featured: bool = False
    is_active: bool = True
    sku: Optional[str] = None
    weight: Optional[Decimal] = None
    dimensions: Optional[Dict[str, float]] = None
    metadata: Optional[Dict] = None
    
    @field_validator('discount_price')
    def validate_discount_price(cls, v, info):
        if v is not None and info.data.get('price') and v >= info.data['price']:
            raise ValueError('Discount price must be less than regular price')
        return v

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    brand: Optional[str] = None
    category_id: Optional[UUID] = None
    price: Optional[Decimal] = Field(None, gt=0)
    discount_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    images: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    metadata: Optional[Dict] = None

class ProductResponse(ProductBase):
    id: UUID
    rating_average: Decimal
    rating_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    image: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
```

### Product API Endpoints (FastAPI)
```python
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryResponse
from app.utils.auth import get_current_user, get_current_admin_user
from app.models.user import User

router = APIRouter()

# Get all products with filtering and pagination
@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_featured: Optional[bool] = None,
    in_stock: Optional[bool] = None,
    sort_by: Optional[str] = Query("created_at", regex="^(price|created_at|rating_average|name)$"),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """
    Get products with advanced filtering:
    - category: Filter by category slug
    - brand: Filter by brand name
    - search: Search in product name and description
    - min_price, max_price: Price range filter
    - is_featured: Show only featured products
    - in_stock: Show only products in stock
    - sort_by: Sort by price, created_at, rating_average, or name
    - sort_order: asc or desc
    """
    query = db.query(Product).filter(Product.is_active == True)
    
    # Category filter
    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
    
    # Brand filter
    if brand:
        query = query.filter(Product.brand.ilike(brand))
    
    # Search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term)) |
            (Product.brand.ilike(search_term))
        )
    
    # Price range filter
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Featured filter
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    
    # Stock filter
    if in_stock:
        query = query.filter(Product.stock_quantity > 0)
    
    # Sorting
    if sort_order == "asc":
        query = query.order_by(getattr(Product, sort_by).asc())
    else:
        query = query.order_by(getattr(Product, sort_by).desc())
    
    products = query.offset(skip).limit(limit).all()
    return products

# Get single product by ID or slug
@router.get("/{identifier}", response_model=ProductResponse)
async def get_product(
    identifier: str,
    db: Session = Depends(get_db)
):
    """Get product by ID or slug"""
    # Try to parse as UUID first
    try:
        product_id = UUID(identifier)
        product = db.query(Product).filter(Product.id == product_id).first()
    except ValueError:
        # If not UUID, treat as slug
        product = db.query(Product).filter(Product.slug == identifier).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

# Create product (Admin only)
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new product (Admin only)"""
    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == product.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists"
        )
    
    # Check if category exists
    category = db.query(Category).filter(Category.id == product.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Update product (Admin only)
@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update product (Admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update only provided fields
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

# Delete product (Admin only)
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Soft delete product (Admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Soft delete
    db_product.is_active = False
    db.commit()
    return None

# Get all categories
@router.get("/categories/", response_model=List[CategoryResponse])
async def get_categories(
    db: Session = Depends(get_db)
):
    """Get all categories"""
    categories = db.query(Category).all()
    return categories

# Get products by brand
@router.get("/brands/{brand_name}", response_model=List[ProductResponse])
async def get_products_by_brand(
    brand_name: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all products from a specific brand"""
    products = db.query(Product).filter(
        Product.brand.ilike(brand_name),
        Product.is_active == True
    ).offset(skip).limit(limit).all()
    
    return products
```

### Product Component (Next.js)
```jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        background: '#000',
        color: '#FFD700',
        border: '1px solid #FFD700',
      },
    });
  };
  
  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-luxury-black border border-gold/20 hover:border-gold transition-all duration-300 rounded-lg overflow-hidden group relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-luxury-darkGray">
          <Image
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <span className="bg-gold text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {discountPercentage}% OFF
              </span>
            )}
            {product.stock_quantity === 0 && (
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              toast.success('Added to wishlist!');
            }}
            className="absolute top-3 right-3 bg-luxury-black/70 hover:bg-luxury-black p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart size={18} className="text-gold" />
          </button>
          
          {/* Quick Add to Cart */}
          {product.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 left-3 right-3 bg-gold hover:bg-gold-dark text-black font-bold py-2 px-4 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Quick Add
            </button>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-gold-dark text-xs uppercase tracking-wider font-semibold">
            {product.brand}
          </p>
          
          {/* Product Name */}
          <h3 className="text-white font-semibold mt-1 line-clamp-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.round(product.rating_average) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-gray text-xs ml-1">
                ({product.rating_count})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            {product.discount_price ? (
              <>
                <span className="text-gold text-xl font-bold">
                  ${Number(product.discount_price).toFixed(2)}
                </span>
                <span className="text-gray line-through text-sm">
                  ${Number(product.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gold text-xl font-bold">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <p className="text-orange-400 text-xs mt-2">
              Only {product.stock_quantity} left in stock!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### Product Filter Component
```jsx
'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export default function ProductFilter({ onFilterChange, categories, brands }) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    featured: false,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      featured: false,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== '' && value !== false;
  }).length;

  return (
    <div className="bg-luxury-darkGray border border-gold/20 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-gold text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-gold text-black text-xs px-2 py-1 rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-gold hover:text-gold-light text-sm flex items-center gap-1"
            >
              <X size={16} />
              Clear
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gold"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      {isOpen && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full bg-luxury-black border border-gold/20 text-white rounded-lg px-3 py-2 focus:border-gold outline-none"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="w-full bg-luxury-black border border-gold/20 text-white rounded-lg px-3 py-2 focus:border-gold outline-none"
            >
              <option value="">All Brands</option>
              {brands?.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-1/2 bg-luxury-black border border-gold/20 text-white rounded-lg px-3 py-2 focus:border-gold outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-1/2 bg-luxury-black border border-gold/20 text-white rounded-lg px-3 py-2 focus:border-gold outline-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-white text-sm">In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-white text-sm">Featured Products</span>
            </label>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="flex-1 bg-luxury-black border border-gold/20 text-white rounded-lg px-3 py-2 focus:border-gold outline-none"
              >
                <option value="created_at">Newest</option>
                <option value="price">Price</option>
                <option value="rating_average">Rating</option>
                <option value="name">Name</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="bg-luxury-black border border-gold/20 text-white rounded-lg px-3 py-2 focus:border-gold outline-none"
              >
                <option value="desc">↓</option>
                <option value="asc">↑</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Image Handling

### Image Upload Utility (Backend)
```python
from fastapi import UploadFile, HTTPException
from PIL import Image
import io
import uuid
from pathlib import Path

UPLOAD_DIR = Path("static/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

async def save_product_image(file: UploadFile) -> str:
    """
    Save and optimize product image
    Returns: URL path to saved image
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Invalid file type")
    
    # Read file
    contents = await file.read()
    
    # Validate file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large")
    
    # Open and optimize image
    try:
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'P'):
            image = image.convert('RGB')
        
        # Resize if too large
        max_dimension = 1200
        if max(image.size) > max_dimension:
            image.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}{file_ext}"
        filepath = UPLOAD_DIR / filename
        
        # Save optimized image
        image.save(filepath, quality=85, optimize=True)
        
        return f"/static/products/{filename}"
        
    except Exception as e:
        raise HTTPException(400, f"Invalid image file: {str(e)}")
```

## When to Use This Agent

Use the Product Catalog Agent when:
- Creating product-related features
- Designing product database schema
- Implementing product search/filter functionality
- Building product UI components
- Handling product images
- Managing inventory
- Setting up product categories

## Best Practices

1. **Always validate stock** before allowing purchases
2. **Use slugs for SEO-friendly URLs** instead of IDs
3. **Implement soft deletes** (is_active flag) instead of hard deletes
4. **Optimize images** before storing
5. **Cache product listings** for better performance
6. **Use proper indexing** on frequently queried fields (slug, brand, category_id)
7. **Implement pagination** to avoid loading too many products
8. **Use JSON fields** for flexible attributes that vary by product type
