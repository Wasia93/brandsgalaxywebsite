from app.database import SessionLocal
from app.models.user import User
from app.models.product import Product, Category
from app.utils.auth import get_password_hash


def seed_database():
    """Seed database with initial data"""
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Category).count() > 0:
            print("Database already seeded")
            return

        print("Seeding database...")

        # Create admin user
        admin = User(
            email="admin@brandsgalaxy.com",
            password_hash=get_password_hash("admin123"),
            full_name="Admin User",
            is_admin=True,
            is_active=True,
            email_verified=True
        )
        db.add(admin)

        # Create categories
        categories = [
            Category(name="Skincare", slug="skincare", description="Premium skincare products for all skin types"),
            Category(name="Cosmetics", slug="cosmetics", description="Luxury cosmetics and makeup"),
            Category(name="Face Care", slug="face-care", description="Face cleansers, moisturizers, and treatments"),
            Category(name="Body Care", slug="body-care", description="Body lotions, creams, and washes"),
            Category(name="Makeup", slug="makeup", description="Foundation, lipstick, eyeshadow, and more"),
        ]

        for cat in categories:
            db.add(cat)

        db.commit()

        # Get category IDs
        skincare_id = db.query(Category).filter(Category.slug == "skincare").first().id
        cosmetics_id = db.query(Category).filter(Category.slug == "cosmetics").first().id
        face_care_id = db.query(Category).filter(Category.slug == "face-care").first().id
        body_care_id = db.query(Category).filter(Category.slug == "body-care").first().id
        makeup_id = db.query(Category).filter(Category.slug == "makeup").first().id

        # Sample products from top brands
        products = [
            # MAC Products
            Product(
                name="MAC Studio Fix Fluid Foundation SPF 15",
                slug="mac-studio-fix-fluid-foundation",
                description="Full coverage foundation with a natural matte finish. Provides 24-hour wear and helps control oil.",
                brand="MAC",
                category_id=makeup_id,
                price=39.00,
                stock_quantity=50,
                images=["/static/products/mac-foundation.jpg"],
                is_featured=True,
                sku="MAC-SFF-001",
                extra_data={
                    "coverage": "Full",
                    "finish": "Matte",
                    "spf": "SPF 15",
                    "size": "30ml"
                }
            ),
            Product(
                name="MAC Matte Lipstick - Ruby Woo",
                slug="mac-ruby-woo-lipstick",
                description="Iconic blue-red matte lipstick. Long-lasting, highly pigmented color.",
                brand="MAC",
                category_id=makeup_id,
                price=26.00,
                stock_quantity=75,
                images=["/static/products/mac-lipstick.jpg"],
                is_featured=True,
                sku="MAC-LIP-001",
                extra_data={
                    "finish": "Matte",
                    "color": "Ruby Woo (Blue Red)",
                    "size": "3g"
                }
            ),

            # CeraVe Products
            Product(
                name="CeraVe Hydrating Facial Cleanser",
                slug="cerave-hydrating-cleanser",
                description="Gentle cleanser with hyaluronic acid and ceramides. Hydrates and restores protective skin barrier.",
                brand="CeraVe",
                category_id=face_care_id,
                price=16.99,
                stock_quantity=100,
                images=["/static/products/cerave-cleanser.jpg"],
                is_featured=True,
                sku="CRV-CLN-001",
                extra_data={
                    "skin_type": "Normal to Dry",
                    "key_ingredients": ["Hyaluronic Acid", "Ceramides", "MVE Technology"],
                    "size": "355ml"
                }
            ),
            Product(
                name="CeraVe Moisturizing Cream",
                slug="cerave-moisturizing-cream",
                description="Rich, non-greasy cream with ceramides and hyaluronic acid. 24-hour hydration for face and body.",
                brand="CeraVe",
                category_id=skincare_id,
                price=19.99,
                stock_quantity=80,
                images=["/static/products/cerave-cream.jpg"],
                is_featured=True,
                sku="CRV-CRM-001",
                extra_data={
                    "skin_type": "All skin types",
                    "key_ingredients": ["Ceramides", "Hyaluronic Acid"],
                    "size": "453g"
                }
            ),
            Product(
                name="CeraVe Daily Moisturizing Lotion",
                slug="cerave-daily-lotion",
                description="Lightweight, oil-free lotion with ceramides for all-day hydration.",
                brand="CeraVe",
                category_id=body_care_id,
                price=14.99,
                stock_quantity=90,
                images=["/static/products/cerave-lotion.jpg"],
                sku="CRV-LOT-001",
                extra_data={
                    "skin_type": "Normal to Dry",
                    "key_ingredients": ["Ceramides", "Hyaluronic Acid"],
                    "size": "355ml"
                }
            ),

            # L'Oreal Products
            Product(
                name="L'Oreal Revitalift Derm Intensives Hyaluronic Acid Serum",
                slug="loreal-hyaluronic-serum",
                description="Pure hyaluronic acid serum that plumps skin and reduces wrinkles. Dermatologist-tested.",
                brand="L'Oreal",
                category_id=skincare_id,
                price=29.99,
                discount_price=24.99,
                stock_quantity=60,
                images=["/static/products/loreal-serum.jpg"],
                is_featured=True,
                sku="LOR-SER-001",
                extra_data={
                    "skin_type": "All skin types",
                    "key_ingredients": ["1.5% Pure Hyaluronic Acid"],
                    "size": "30ml"
                }
            ),
            Product(
                name="L'Oreal True Match Foundation",
                slug="loreal-true-match-foundation",
                description="Perfectly matches your skin tone and texture. Dermatologist tested.",
                brand="L'Oreal",
                category_id=makeup_id,
                price=15.99,
                stock_quantity=70,
                images=["/static/products/loreal-foundation.jpg"],
                sku="LOR-FND-001",
                extra_data={
                    "coverage": "Medium",
                    "finish": "Natural",
                    "size": "30ml"
                }
            ),

            # Aveeno Products
            Product(
                name="Aveeno Daily Moisturizing Lotion",
                slug="aveeno-daily-moisturizing-lotion",
                description="Clinically proven to improve the health of dry skin in just 1 day with natural colloidal oatmeal.",
                brand="Aveeno",
                category_id=body_care_id,
                price=12.99,
                stock_quantity=100,
                images=["/static/products/aveeno-lotion.jpg"],
                is_featured=False,
                sku="AVN-LOT-001",
                extra_data={
                    "skin_type": "Dry, Sensitive",
                    "key_ingredients": ["Colloidal Oatmeal", "Rich Emollients"],
                    "size": "354ml"
                }
            ),
            Product(
                name="Aveeno Positively Radiant Daily Moisturizer SPF 30",
                slug="aveeno-radiant-moisturizer-spf30",
                description="Oil-free moisturizer with Total Soy Complex and SPF 30 sun protection.",
                brand="Aveeno",
                category_id=face_care_id,
                price=17.99,
                stock_quantity=65,
                images=["/static/products/aveeno-radiant.jpg"],
                sku="AVN-RAD-001",
                extra_data={
                    "skin_type": "All skin types",
                    "spf": "SPF 30",
                    "key_ingredients": ["Total Soy Complex"],
                    "size": "75ml"
                }
            ),

            # Cetaphil Products
            Product(
                name="Cetaphil Gentle Skin Cleanser",
                slug="cetaphil-gentle-cleanser",
                description="Dermatologist recommended gentle cleanser for all skin types. Soap-free, fragrance-free.",
                brand="Cetaphil",
                category_id=face_care_id,
                price=13.99,
                stock_quantity=120,
                images=["/static/products/cetaphil-cleanser.jpg"],
                is_featured=True,
                sku="CTP-CLN-001",
                extra_data={
                    "skin_type": "All skin types, including sensitive",
                    "key_features": ["Soap-free", "Fragrance-free", "Non-comedogenic"],
                    "size": "473ml"
                }
            ),
            Product(
                name="Cetaphil Moisturizing Cream",
                slug="cetaphil-moisturizing-cream",
                description="Rich, long-lasting cream for very dry, sensitive skin. Clinically proven to bind water to skin.",
                brand="Cetaphil",
                category_id=skincare_id,
                price=15.99,
                stock_quantity=85,
                images=["/static/products/cetaphil-cream.jpg"],
                sku="CTP-CRM-001",
                extra_data={
                    "skin_type": "Very dry, sensitive",
                    "key_features": ["Fragrance-free", "Non-greasy", "Non-comedogenic"],
                    "size": "453g"
                }
            ),
            Product(
                name="Cetaphil Daily Facial Moisturizer SPF 50",
                slug="cetaphil-daily-spf50",
                description="Broad spectrum UVA/UVB protection with hydrating formula. Oil-free and non-comedogenic.",
                brand="Cetaphil",
                category_id=face_care_id,
                price=18.99,
                stock_quantity=70,
                images=["/static/products/cetaphil-spf.jpg"],
                sku="CTP-SPF-001",
                extra_data={
                    "skin_type": "All skin types",
                    "spf": "SPF 50",
                    "key_features": ["Broad Spectrum", "Oil-free", "Non-comedogenic"],
                    "size": "50ml"
                }
            ),
        ]

        for product in products:
            db.add(product)

        db.commit()
        print(f"Database seeded successfully with {len(products)} products!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
