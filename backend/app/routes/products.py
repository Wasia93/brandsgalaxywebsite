from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryResponse
from app.utils.auth import get_current_admin_user
from app.utils.storage import upload_image

router = APIRouter()

# Public endpoints
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
    """Get products with advanced filtering"""
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
    
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term)) |
            (Product.brand.ilike(search_term))
        )
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    
    if in_stock:
        query = query.filter(Product.stock_quantity > 0)
    
    # Sorting
    if sort_order == "asc":
        query = query.order_by(getattr(Product, sort_by).asc())
    else:
        query = query.order_by(getattr(Product, sort_by).desc())
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    categories = db.query(Category).all()
    return categories

@router.get("/brands", response_model=List[str])
async def get_brands(db: Session = Depends(get_db)):
    """Get all unique brands"""
    brands = db.query(Product.brand).filter(Product.is_active == True).distinct().all()
    return [brand[0] for brand in brands]

@router.get("/{identifier}", response_model=ProductResponse)
async def get_product(
    identifier: str,
    db: Session = Depends(get_db)
):
    """Get product by ID or slug"""
    # Try by slug first
    product = db.query(Product).filter(Product.slug == identifier).first()
    
    # If not found, try by ID
    if not product:
        product = db.query(Product).filter(Product.id == identifier).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

# Admin endpoints
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create a new product (Admin only)"""
    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == product.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists"
        )
    
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update product (Admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
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


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    current_user=Depends(get_current_admin_user),
):
    """Upload a product image (Admin only). Returns the static URL."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, WEBP, GIF",
        )

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5 MB.",
        )

    url = upload_image(contents, file.filename, file.content_type)
    return {"url": url, "filename": url.split("/")[-1]}
