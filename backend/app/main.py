from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.routes import auth, products, orders
from app.config import settings

# Ensure static directories exist
os.makedirs("static/products", exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    try:
        Base.metadata.create_all(bind=engine)
        from app.utils.seed import seed_database
        seed_database()
    except Exception as e:
        print(f"Startup DB init warning: {e}")
    yield


app = FastAPI(
    title="Brands Galaxy API",
    description="E-commerce API for luxury cosmetics and skincare products",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for product images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Brands Galaxy API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/debug-products")
def debug_products():
    from app.database import SessionLocal
    from app.models.product import Product
    db = SessionLocal()
    try:
        products = db.query(Product).limit(1).all()
        if products:
            p = products[0]
            return {"ok": True, "id": p.id, "name": p.name, "images": p.images, "rating_average": str(p.rating_average)}
        return {"ok": True, "count": 0}
    except Exception as e:
        return {"ok": False, "error": str(e), "type": type(e).__name__}
    finally:
        db.close()
