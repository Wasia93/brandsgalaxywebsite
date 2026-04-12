"""
CeraVe Products Upload Script
Run from backend folder: python upload_cerave_products.py
"""
import requests
import json

BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@brandsgalaxy.com"
ADMIN_PASSWORD = "admin123"

# ── Login ──────────────────────────────────────────────────────
print("Logging in...")
resp = requests.post(f"{BASE_URL}/api/auth/login",
    data={"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
resp.raise_for_status()
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("✓ Logged in")

# ── Get Categories ─────────────────────────────────────────────
cats_resp = requests.get(f"{BASE_URL}/api/products/categories")
cats_resp.raise_for_status()
categories = {c["slug"]: c["id"] for c in cats_resp.json()}
print(f"✓ Categories loaded: {list(categories.keys())}")

# ── Product Definitions ────────────────────────────────────────
products = [
    {
        "name": "CeraVe Hydrating Facial Cleanser",
        "slug": "cerave-hydrating-facial-cleanser",
        "brand": "CeraVe",
        "category_id": categories.get("face-care"),
        "price": 5500,          # lowest variant price shown on product card
        "stock_quantity": 125,  # total across all sizes
        "is_featured": True,
        "is_active": True,
        "images": [],
        "description": "Gentle, non-foaming cleanser for normal to dry skin. Formulated with Hyaluronic Acid, Ceramides, and Glycerin. Developed with dermatologists. Fragrance-free, non-comedogenic.",
        "extra_data": {
            "skin_type": "Normal / Dry",
            "key_ingredients": "Ceramides (1,3,6-II), Hyaluronic Acid, Glycerin, MVE Technology",
            "origin": "Canada",
            "variants": [
                {"size": "237ml", "price": 5500, "stock": 50},
                {"size": "355ml", "price": 6800, "stock": 40},
                {"size": "473ml", "price": 8600, "stock": 35},
            ]
        }
    },
    {
        "name": "CeraVe AM Facial Moisturizing Lotion SPF 30",
        "slug": "cerave-am-facial-moisturizing-lotion-spf30",
        "brand": "CeraVe",
        "category_id": categories.get("face-care"),
        "price": 4000,
        "stock_quantity": 75,
        "is_featured": True,
        "is_active": True,
        "images": [],
        "description": "Daytime moisturizer with broad-spectrum SPF 30. Hydrates and protects skin from UVA/UVB rays. Oil-free, non-comedogenic, fragrance-free. Suitable for all skin types.",
        "extra_data": {
            "skin_type": "All Skin Types (Normal to Oily)",
            "key_ingredients": "Ceramides (1,3,6-II), Hyaluronic Acid, Niacinamide, Zinc Oxide, MVE Technology",
            "use_time": "Morning (AM)",
            "spf": "SPF 30",
            "origin": "Canada",
            "variants": [
                {"size": "59ml",  "price": 4000, "stock": 25},
                {"size": "89ml",  "price": 5500, "stock": 50},
            ]
        }
    },
    {
        "name": "CeraVe PM Facial Moisturizing Lotion",
        "slug": "cerave-pm-facial-moisturizing-lotion",
        "brand": "CeraVe",
        "category_id": categories.get("face-care"),
        "price": 5500,
        "stock_quantity": 40,
        "is_featured": True,
        "is_active": True,
        "images": [],
        "description": "Ultra-lightweight night moisturizer. Hydrates throughout the night and helps restore the skin barrier. Oil-free, fragrance-free, non-comedogenic. For normal to oily skin.",
        "extra_data": {
            "skin_type": "Normal / Oily",
            "key_ingredients": "Ceramides (1,3,6-II), Hyaluronic Acid, Niacinamide, MVE Technology",
            "use_time": "Night (PM)",
            "origin": "Canada",
            "variants": [
                {"size": "89ml",  "price": 5500, "stock": 40},
            ]
        }
    },
    {
        "name": "CeraVe Moisturizing Cream",
        "slug": "cerave-moisturizing-cream",
        "brand": "CeraVe",
        "category_id": categories.get("body-care"),
        "price": 5500,
        "stock_quantity": 115,
        "is_featured": True,
        "is_active": True,
        "images": [],
        "description": "Rich, non-greasy daily moisturizer for face, body, and hands. Suitable for dry to very dry skin. Recognized by the Canadian Dermatology Association. 24-hour hydration.",
        "extra_data": {
            "skin_type": "Dry / Very Dry / Sensitive",
            "key_ingredients": "Ceramides (1,3,6-II), Hyaluronic Acid, MVE Technology",
            "use": "Face, Body & Hands",
            "origin": "Canada",
            "variants": [
                {"size": "277g",  "price": 5500, "stock": 45},
                {"size": "453g",  "price": 7500, "stock": 40},
                {"size": "539g",  "price": 9500, "stock": 30},
            ]
        }
    },
    {
        "name": "CeraVe Foaming Facial Cleanser",
        "slug": "cerave-foaming-facial-cleanser",
        "brand": "CeraVe",
        "category_id": categories.get("face-care"),
        "price": 6000,
        "stock_quantity": 65,
        "is_featured": False,
        "is_active": True,
        "images": [],
        "description": "Gel-based foaming cleanser for normal to oily skin. Removes excess oil and dirt without disrupting the skin barrier. Fragrance-free, non-comedogenic.",
        "extra_data": {
            "skin_type": "Normal / Oily",
            "key_ingredients": "Ceramides (1,3,6-II), Hyaluronic Acid, Niacinamide, MVE Technology",
            "origin": "Canada",
            "variants": [
                {"size": "355ml", "price": 6000, "stock": 35},
                {"size": "473ml", "price": 8000, "stock": 30},
            ]
        }
    },
    {
        "name": "CeraVe Resurfacing Retinol Serum",
        "slug": "cerave-resurfacing-retinol-serum",
        "brand": "CeraVe",
        "category_id": categories.get("skincare"),
        "price": 5500,
        "stock_quantity": 25,
        "is_featured": False,
        "is_active": True,
        "images": [],
        "description": "Lightweight serum with encapsulated retinol to help minimize post-acne marks and pores. Fragrance-free, non-comedogenic. Suitable for sensitive skin.",
        "extra_data": {
            "skin_type": "All / Post-Acne / Sensitive",
            "key_ingredients": "Encapsulated Retinol, Ceramides, Niacinamide, Licorice Root Extract",
            "origin": "Canada",
            "variants": [
                {"size": "30ml",  "price": 5500, "stock": 25},
            ]
        }
    },
]

# ── Upload ─────────────────────────────────────────────────────
success = 0
skipped = 0

for p in products:
    resp = requests.post(f"{BASE_URL}/api/products/", json=p, headers=headers)
    if resp.status_code == 201:
        print(f"✓ Added: {p['name']}")
        success += 1
    elif resp.status_code == 400 and "slug" in resp.text:
        print(f"↷ Skipped (already exists): {p['name']}")
        skipped += 1
    else:
        print(f"✗ Failed: {p['name']} → {resp.status_code}: {resp.text}")

print(f"\nDone! {success} added, {skipped} skipped.")
print("Images are empty — add them from /admin after uploading your image files.")
