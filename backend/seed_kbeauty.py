"""
Run this script to add Korean Beauty category + 8 K-Beauty products.
Usage:
  cd backend
  venv\Scripts\activate      # Windows
  source venv/bin/activate   # Mac/Linux
  python seed_kbeauty.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models.product import Product, Category


PRODUCTS = [
    {
        "name": "COSRX Advanced Snail 96 Mucin Power Essence",
        "slug": "cosrx-snail-96-mucin-power-essence",
        "brand": "COSRX",
        "description": "96% snail secretion filtrate essence that repairs damaged skin, improves skin texture, and provides deep hydration. A K-Beauty bestseller for glass skin.",
        "price": 4299,
        "discount_price": 3799,
        "stock_quantity": 50,
        "is_featured": True,
        "sku": "COSRX-SNAIL-96",
        "rating_average": 4.8,
        "rating_count": 312,
        "extra_data": {
            "size": "100ml",
            "skin_type": "All skin types",
            "key_ingredients": ["Snail Secretion Filtrate 96%", "Sodium Hyaluronate"],
            "how_to_use": "After toner, apply 2-3 drops and pat gently into skin.",
            "origin": "Korea",
        },
        "images": [],
    },
    {
        "name": "Some By Mi AHA BHA PHA 30 Days Miracle Toner",
        "slug": "some-by-mi-aha-bha-pha-toner",
        "brand": "Some By Mi",
        "description": "Triple exfoliating toner with AHA, BHA, and PHA acids. Visibly reduces acne, dark spots, and uneven texture in 30 days.",
        "price": 3499,
        "discount_price": None,
        "stock_quantity": 40,
        "is_featured": True,
        "sku": "SBM-AHA-BHA-PHA",
        "rating_average": 4.7,
        "rating_count": 198,
        "extra_data": {
            "size": "150ml",
            "skin_type": "Oily, Acne-prone",
            "key_ingredients": ["AHA", "BHA", "PHA", "Tea Tree Extract"],
            "how_to_use": "Apply with cotton pad after cleansing, morning and night.",
            "origin": "Korea",
        },
        "images": [],
    },
    {
        "name": "Innisfree Green Tea Seed Serum",
        "slug": "innisfree-green-tea-seed-serum",
        "brand": "Innisfree",
        "description": "Lightweight hydrating serum with Jeju green tea extract. Delivers moisture deep into skin and keeps it hydrated for 72 hours.",
        "price": 5199,
        "discount_price": 4499,
        "stock_quantity": 35,
        "is_featured": False,
        "sku": "INF-GREENTEA-SERUM",
        "rating_average": 4.6,
        "rating_count": 145,
        "extra_data": {
            "size": "80ml",
            "skin_type": "Dry, Normal, Combination",
            "key_ingredients": ["Jeju Green Tea Water", "Green Tea Seed Oil", "Green Tea Seed Extract"],
            "how_to_use": "Apply 2-3 drops after toner, morning and night.",
            "origin": "Korea",
        },
        "images": [],
    },
    {
        "name": "Laneige Lip Sleeping Mask",
        "slug": "laneige-lip-sleeping-mask",
        "brand": "Laneige",
        "description": "Overnight lip treatment that moisturizes and exfoliates lips while you sleep. Wakes up to soft, plump lips. Berry scent.",
        "price": 2999,
        "discount_price": None,
        "stock_quantity": 60,
        "is_featured": True,
        "sku": "LANEIGE-LIP-MASK-BERRY",
        "rating_average": 4.9,
        "rating_count": 521,
        "extra_data": {
            "size": "20g",
            "skin_type": "All skin types",
            "key_ingredients": ["Moisture Wrap™", "Berry Mix Complex", "Vitamin C"],
            "how_to_use": "Apply generously to lips before bedtime. Wipe off in the morning.",
            "origin": "Korea",
            "scent": "Berry",
        },
        "images": [],
    },
    {
        "name": "TIRTIR Milk Skin Toner",
        "slug": "tirtir-milk-skin-toner",
        "brand": "TIRTIR",
        "description": "Milky toner that instantly brightens and plumps skin. Niacinamide-rich formula reduces pores and evens skin tone for the glass skin effect.",
        "price": 3799,
        "discount_price": 3299,
        "stock_quantity": 30,
        "is_featured": False,
        "sku": "TIRTIR-MILK-SKIN",
        "rating_average": 4.7,
        "rating_count": 89,
        "extra_data": {
            "size": "180ml",
            "skin_type": "All skin types",
            "key_ingredients": ["Niacinamide", "Panthenol", "Milk Protein"],
            "how_to_use": "Apply to face after cleansing with a cotton pad or hands.",
            "origin": "Korea",
        },
        "images": [],
    },
    {
        "name": "Beauty of Joseon Dynasty Cream",
        "slug": "beauty-of-joseon-dynasty-cream",
        "brand": "Beauty of Joseon",
        "description": "Traditional Korean beauty secret in a modern formula. Ginseng and rice extract deeply nourish, firm, and brighten the complexion.",
        "price": 4599,
        "discount_price": None,
        "stock_quantity": 25,
        "is_featured": True,
        "sku": "BOJ-DYNASTY-CREAM",
        "rating_average": 4.8,
        "rating_count": 203,
        "extra_data": {
            "size": "50ml",
            "skin_type": "Dry, Mature, Normal",
            "key_ingredients": ["Niacinamide 2%", "Ginseng Root Extract", "Rice Extract"],
            "how_to_use": "As the last step of your routine, apply and massage into skin.",
            "origin": "Korea",
        },
        "images": [],
    },
    {
        "name": "Klairs Midnight Blue Calming Cream",
        "slug": "klairs-midnight-blue-calming-cream",
        "brand": "Klairs",
        "description": "Soothing overnight cream with Guaiazulene (Blue Tansy) that calms redness and irritation. Perfect for sensitive and acne-prone skin.",
        "price": 4899,
        "discount_price": 4299,
        "stock_quantity": 20,
        "is_featured": False,
        "sku": "KLAIRS-MIDNIGHT-BLUE",
        "rating_average": 4.6,
        "rating_count": 167,
        "extra_data": {
            "size": "60ml",
            "skin_type": "Sensitive, Acne-prone, Combination",
            "key_ingredients": ["Guaiazulene", "Panthenol", "Allantoin"],
            "how_to_use": "Apply as final step of evening routine to clean skin.",
            "origin": "Korea",
        },
        "images": [],
    },
    {
        "name": "Anua Heartleaf 77% Soothing Toner",
        "slug": "anua-heartleaf-77-soothing-toner",
        "brand": "Anua",
        "description": "77% Heartleaf extract toner that intensely soothes, hydrates, and calms irritated skin. Minimizes pores and controls sebum.",
        "price": 3299,
        "discount_price": None,
        "stock_quantity": 45,
        "is_featured": False,
        "sku": "ANUA-HEARTLEAF-77",
        "rating_average": 4.7,
        "rating_count": 134,
        "extra_data": {
            "size": "250ml",
            "skin_type": "Oily, Sensitive, Combination",
            "key_ingredients": ["Houttuynia Cordata Extract 77%", "Niacinamide 2%", "Panthenol"],
            "how_to_use": "After cleansing, apply with hands or cotton pad morning and night.",
            "origin": "Korea",
        },
        "images": [],
    },
]


def seed_kbeauty():
    db = SessionLocal()
    try:
        # Check / create Korean Beauty category
        cat = db.query(Category).filter(Category.slug == "korean-beauty").first()
        if not cat:
            cat = Category(
                name="Korean Beauty",
                slug="korean-beauty",
                description="Authentic K-Beauty skincare and makeup from top Korean brands",
            )
            db.add(cat)
            db.commit()
            db.refresh(cat)
            print(f"Created category: Korean Beauty (id={cat.id})")
        else:
            print(f"Category already exists: Korean Beauty (id={cat.id})")

        added = 0
        skipped = 0
        for p_data in PRODUCTS:
            existing = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if existing:
                print(f"  SKIP (exists): {p_data['name']}")
                skipped += 1
                continue

            product = Product(
                name=p_data["name"],
                slug=p_data["slug"],
                description=p_data["description"],
                brand=p_data["brand"],
                category_id=cat.id,
                price=p_data["price"],
                discount_price=p_data.get("discount_price"),
                stock_quantity=p_data["stock_quantity"],
                images=p_data["images"],
                is_featured=p_data["is_featured"],
                is_active=True,
                sku=p_data["sku"],
                rating_average=p_data["rating_average"],
                rating_count=p_data["rating_count"],
                extra_data=p_data["extra_data"],
            )
            db.add(product)
            added += 1
            print(f"  ADDED: {p_data['name']}")

        db.commit()
        print(f"\nDone! Added {added} products, skipped {skipped}.")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_kbeauty()
