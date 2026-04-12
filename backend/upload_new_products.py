import requests, sys, io
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"
token = requests.post(f"{BASE_URL}/api/auth/login",
    data={"username": "admin@brandsgalaxy.com", "password": "admin123"}).json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

cats = {c["slug"]: c["id"] for c in requests.get(f"{BASE_URL}/api/products/categories").json()}
print(f"Categories: {list(cats.keys())}")

def upload_img(img_url, filename):
    try:
        r = requests.get(img_url, timeout=15)
        if r.status_code != 200:
            print(f"  img download failed: {r.status_code}")
            return None
        mime = "image/png"
        up = requests.post(f"{BASE_URL}/api/products/upload-image",
            files={"file": (filename, io.BytesIO(r.content), mime)}, headers=headers)
        if up.status_code == 200:
            return up.json()["url"]
        print(f"  img upload failed: {up.status_code} {up.text[:60]}")
    except Exception as e:
        print(f"  img error: {e}")
    return None

products = [
    # ── NEUTROGENA ──
    {
        "name": "Neutrogena Sheer Zinc Mineral Sunscreen SPF 50",
        "slug": "neutrogena-sheer-zinc-mineral-sunscreen-spf50",
        "brand": "Neutrogena",
        "category_id": cats.get("face-care"),
        "price": 6999, "stock_quantity": 40,
        "is_featured": True, "is_active": True,
        "description": "100% mineral sunscreen powered by Zinc Oxide (21.6%). Dry-Touch technology leaves non-greasy, sheer finish. Hypoallergenic, non-comedogenic. Fragrance-free, paraben-free, oxybenzone-free.",
        "extra_data": {"skin_type": "All / Sensitive", "spf": "SPF 50", "key_ingredients": "Zinc Oxide 21.6%, Feverfew Extract, Glycerin, Dimethicone", "free_of": "Fragrance, parabens, phthalates, oxybenzone", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/NeutrogenaSheerZincMineralSunscreenSPF50_523406a8-b1d1-4171-a2e3-d33a8eaa5b61.png?v=1768499971",
        "img_name": "neutrogena-zinc-spf50.png"
    },
    {
        "name": "Neutrogena Bright Boost Brightening Serum",
        "slug": "neutrogena-bright-boost-brightening-serum",
        "brand": "Neutrogena",
        "category_id": cats.get("face-care"),
        "price": 7500, "stock_quantity": 30,
        "is_featured": True, "is_active": True,
        "description": "Brightening serum with highest concentration of Neoglucosamine and naturally derived turmeric extract. Reduces dark spots, hyperpigmentation and uneven tone. Oil-free, alcohol-free, non-comedogenic.",
        "extra_data": {"skin_type": "All Skin Types", "concern": "Dark Spots, Brightening", "key_ingredients": "Acetyl Glucosamine (Neoglucosamine), Turmeric Extract, Hexylresorcinol, Glycerin", "free_of": "Oil, alcohol", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/NeutrogenaBrightBoostIlluminating_BrighteningSerum_09ab6b02-69fb-490c-8ef4-90bad168c5cf.png?v=1768500022",
        "img_name": "neutrogena-bright-boost.png"
    },
    {
        "name": "Neutrogena Rapid Wrinkle Repair Retinol Moisturizer SPF 30",
        "slug": "neutrogena-rapid-wrinkle-repair-retinol-spf30",
        "brand": "Neutrogena",
        "category_id": cats.get("face-care"),
        "price": 7500, "stock_quantity": 30,
        "is_featured": False, "is_active": True,
        "description": "Daytime moisturizer with Retinol SA, Glucose Complex, Hyaluronic Acid and SPF 30. Smooths fine lines, diminishes age spots, keeps skin hydrated all day. Paraben-free, mineral oil-free.",
        "extra_data": {"skin_type": "Normal", "use_time": "Morning (AM)", "spf": "SPF 30", "key_ingredients": "Retinol SA, Glucose Complex, Hyaluronic Acid, Avobenzone 2%", "free_of": "Parabens, mineral oil, dyes", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/NeutrogenaRapidWrinkleRepairRetinolMoisturizerwithSPF30-Day_a747577b-c30f-4343-959f-5621631c27c1.png?v=1768500029",
        "img_name": "neutrogena-wrinkle-spf30.png"
    },
    {
        "name": "Neutrogena Stubborn Acne Spot Drying Lotion",
        "slug": "neutrogena-stubborn-acne-spot-drying-lotion",
        "brand": "Neutrogena",
        "category_id": cats.get("face-care"),
        "price": 4999, "stock_quantity": 50,
        "is_featured": False, "is_active": True,
        "description": "Clinically proven overnight spot treatment with 10% Sulfur and 4% Niacinamide. Penetrates pores to dry up and clear pimples, reducing redness. Pimples look visibly clearer after one use. Fragrance-free, oil-free.",
        "extra_data": {"skin_type": "Acne-Prone", "use_time": "Night", "key_ingredients": "Sulfur 10%, Niacinamide 4%, Calamine, Zinc Oxide, Salicylic Acid", "free_of": "Fragrance, parabens, phthalates, dyes, oil", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/NeutrogenaStubbornAcneSpotDryingLotion_29ml_e3098cdb-dcc1-42a2-b43f-4bc86ac80277.png?v=1768500030",
        "img_name": "neutrogena-acne-lotion.png"
    },
    {
        "name": "Neutrogena Deep Clean Invigorating Foaming Scrub",
        "slug": "neutrogena-deep-clean-foaming-scrub",
        "brand": "Neutrogena",
        "category_id": cats.get("face-care"),
        "price": 4750, "stock_quantity": 45,
        "is_featured": False, "is_active": True,
        "description": "Deep-cleansing foaming scrub that removes dirt, oil and dead skin cells. Penetrates deep into pores for a thorough cleanse leaving skin visibly clean and refreshed.",
        "extra_data": {"skin_type": "Normal to Oily", "key_ingredients": "Glycerin, Exfoliating agents, Cleansing surfactants", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/NeutrogenaDeepClean_InvigoratingFoamingScrub_59c7fdcd-a925-46d4-a82b-ae6c0947fb90.png?v=1768500052",
        "img_name": "neutrogena-deep-clean.png"
    },
    # ── OLAY ──
    {
        "name": "Olay Collagen Peptide 24 Serum",
        "slug": "olay-collagen-peptide-24-serum",
        "brand": "Olay",
        "category_id": cats.get("face-care"),
        "price": 8500, "stock_quantity": 25,
        "is_featured": True, "is_active": True,
        "description": "Fragrance-free facial serum delivering 24-hour hydration. Visibly firms skin; with 2 weeks of use facial contours are tightened. Amino Peptides make skin smoother and firmer. Paraben-free, phthalate-free, mineral oil-free.",
        "extra_data": {"skin_type": "All Skin Types", "key_ingredients": "Palmitoyl Pentapeptide-4, Niacinamide, Glycerin, Panthenol (Pro-B5)", "free_of": "Fragrance, parabens, phthalates, mineral oil, synthetic dyes", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/OlayCollagenPeptide24Serum_afee15e8-7f20-44c5-b5b0-6073617c7a29.png?v=1768500092",
        "img_name": "olay-collagen-serum.png"
    },
    {
        "name": "Olay Regenerist Retinol24 Night Face Moisturiser",
        "slug": "olay-regenerist-retinol24-night-moisturiser",
        "brand": "Olay",
        "category_id": cats.get("face-care"),
        "price": 12500, "stock_quantity": 20,
        "is_featured": True, "is_active": True,
        "description": "Overnight moisturiser with Retinol Complex, Triple Collagen Peptide and Niacinamide. 24-hour hydration, visibly improves fine lines, wrinkles, firmness, dark spots and pores. Non-greasy, fragrance-free, suitable for sensitive skin.",
        "extra_data": {"skin_type": "All / Sensitive / Oily / Dry / Acne-Prone", "use_time": "Night (PM)", "key_ingredients": "Retinol + Retinyl Propionate, Niacinamide, Triple Collagen Peptide, Glycerin", "free_of": "Fragrance", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/OlayRegeneristRetinol24NightFaceMoisturiser_eda2337d-0b1a-4ea7-985c-6293a4f143b6.png?v=1768500093",
        "img_name": "olay-retinol24-night.png"
    },
    {
        "name": "Olay Regenerist Micro-Sculpting Cream",
        "slug": "olay-regenerist-micro-sculpting-cream",
        "brand": "Olay",
        "category_id": cats.get("face-care"),
        "price": 9500, "stock_quantity": 25,
        "is_featured": True, "is_active": True,
        "description": "Bestselling anti-aging moisturizer. Improves elasticity, tightens and lifts skin, restores firmness and smooths texture. Triple Collagen Peptide, Amino Peptides, Niacinamide and Hyaluronic Acid. Lightweight, non-greasy.",
        "extra_data": {"skin_type": "Normal / Dry / Combination", "key_ingredients": "Palmitoyl Pentapeptide-4, Niacinamide, Sodium Hyaluronate, Panthenol, Vitamin E, Aloe Vera, Green Tea", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/OlayRegeneristMicro-SculptingCream_4b0b0dfa-eb0d-4c5a-94e3-c792fe887851.png?v=1768499969",
        "img_name": "olay-micro-sculpting.png"
    },
    {
        "name": "Olay Regenerist Advanced Anti-Aging Day Cream",
        "slug": "olay-regenerist-advanced-anti-aging-day-cream",
        "brand": "Olay",
        "category_id": cats.get("face-care"),
        "price": 7500, "stock_quantity": 30,
        "is_featured": False, "is_active": True,
        "description": "Daytime regenerating cream delivering Niacinamide, Amino Peptides and Hyaluronic Acid 10 layers deep. Promotes surface cell turnover, corrects appearance of wrinkles for a firmer, smoother complexion.",
        "extra_data": {"skin_type": "Normal / Dry / Combination", "use_time": "Morning (AM)", "key_ingredients": "Niacinamide, Amino-Peptides, Hyaluronic Acid, Glycerin, Retinol", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/Olay-Face-Moisturizer-Regenerist_3d13303a-447b-49f3-a938-3eff46df411a.png?v=1768500003",
        "img_name": "olay-regenerist-day.png"
    },
    {
        "name": "Olay Retinol24 Max Night Serum",
        "slug": "olay-retinol24-max-night-serum",
        "brand": "Olay",
        "category_id": cats.get("face-care"),
        "price": 8500, "stock_quantity": 20,
        "is_featured": False, "is_active": True,
        "description": "Overnight serum with MAX Retinol24 Complex. Retinol + Niacinamide + Peptides for maximum anti-aging. Visibly reduces fine lines, firms, brightens and improves skin texture. Fragrance-free.",
        "extra_data": {"skin_type": "All Skin Types", "use_time": "Night (PM)", "key_ingredients": "Retinol (MAX Retinol24 Complex), Niacinamide, Amino-Peptides, Hyaluronic Acid", "free_of": "Fragrance", "origin": "USA"},
        "img_url": "https://bloomify.pk/cdn/shop/files/OlayRetinol24MaxNightSerum_d9a8f4b4-789c-47d8-9de8-96d5dab0f7f9.png?v=1768500092",
        "img_name": "olay-retinol24-serum.png"
    },
    # ── CERAVE (new only) ──
    {
        "name": "CeraVe Hydrating Hyaluronic Acid Serum",
        "slug": "cerave-hydrating-hyaluronic-acid-serum",
        "brand": "CeraVe",
        "category_id": cats.get("face-care"),
        "price": 6500, "stock_quantity": 35,
        "is_featured": True, "is_active": True,
        "description": "Lightweight facial serum with 3 essential ceramides, hyaluronic acid (3 molecular weights) and vitamin B5. Replenishes hydration, improves dry lines, restores skin barrier. 24-hour hydration. Fragrance-free, paraben-free, non-comedogenic.",
        "extra_data": {"skin_type": "Normal to Dry", "key_ingredients": "Hyaluronic Acid (3 weights), Ceramides (NP, AP, EOP), Panthenol (B5), Glycerin, Cholesterol", "free_of": "Fragrance, parabens", "origin": "Canada"},
        "img_url": "https://bloomify.pk/cdn/shop/files/CeraVeHydratingHyaluronicAcidSerum_93050a6f-cc3b-4730-8f45-b028e675a651.png?v=1768500129",
        "img_name": "cerave-ha-serum.png"
    },
    {
        "name": "CeraVe Skin Renewing Retinol Serum",
        "slug": "cerave-skin-renewing-retinol-serum",
        "brand": "CeraVe",
        "category_id": cats.get("face-care"),
        "price": 6500, "stock_quantity": 30,
        "is_featured": False, "is_active": True,
        "description": "Gentle daily retinol serum with encapsulated retinol (controlled slow release), 3 essential ceramides, niacinamide and hyaluronic acid. Reduces fine lines, smooths texture, enhances radiance, restores skin barrier. Fragrance-free, non-comedogenic.",
        "extra_data": {"skin_type": "All Skin Types", "use_time": "Night (PM)", "key_ingredients": "Encapsulated Retinol, Ceramides (NP, AP, EOP), Niacinamide, Hyaluronic Acid, Shea Butter", "free_of": "Fragrance", "origin": "Canada", "variants": [{"size": "30ml", "price": 6500, "stock": 30}]},
        "img_url": "https://bloomify.pk/cdn/shop/files/CeraVeSkinRenewingRetinolSerum30ml_9fdf2bd8-07da-4e8e-9fa2-def12b1111af.png?v=1768500130",
        "img_name": "cerave-retinol-serum.png"
    },
    {
        "name": "CeraVe Skin Renewing Vitamin C Serum",
        "slug": "cerave-skin-renewing-vitamin-c-serum",
        "brand": "CeraVe",
        "category_id": cats.get("face-care"),
        "price": 7450, "stock_quantity": 30,
        "is_featured": False, "is_active": True,
        "description": "Brightening antioxidant serum with 10% pure Vitamin C (L-Ascorbic Acid), 3 essential ceramides, hyaluronic acid and vitamin B5. Visibly brightens complexion, supports radiant skin, restores protective barrier. Allergy tested, fragrance-free, paraben-free.",
        "extra_data": {"skin_type": "All / Sensitive", "concern": "Brightening, Antioxidant", "key_ingredients": "Ascorbic Acid (Vitamin C 10%), Ceramides (NP, AP, EOP), Hyaluronic Acid, Panthenol (B5), Vitamin E", "free_of": "Fragrance, parabens", "origin": "Canada"},
        "img_url": "https://bloomify.pk/cdn/shop/files/CeraVeSkinRenewingVitaminCSerum_6dd97c48-0430-4f9b-87e1-43cc39e54965.png?v=1768500131",
        "img_name": "cerave-vitc-serum.png"
    },
    {
        "name": "CeraVe Hydrating Mineral Sunscreen Face SPF 30",
        "slug": "cerave-hydrating-mineral-sunscreen-spf30",
        "brand": "CeraVe",
        "category_id": cats.get("face-care"),
        "price": 5500, "stock_quantity": 40,
        "is_featured": False, "is_active": True,
        "description": "Broad spectrum mineral sunscreen with 100% mineral UV filters. 3 essential ceramides, niacinamide and hyaluronic acid for daily hydration and protection. Non-comedogenic, fragrance-free, suitable for sensitive skin.",
        "extra_data": {"skin_type": "All / Sensitive", "spf": "SPF 30", "key_ingredients": "Titanium Dioxide 6%, Zinc Oxide 5%, Ceramides (NP, AP, EOP), Niacinamide, Hyaluronic Acid", "free_of": "Fragrance, oxybenzone", "origin": "Canada"},
        "img_url": "https://bloomify.pk/cdn/shop/files/CeraVeHydratingMineralSunscreenFaceSPF30_5bf11b8d-3612-443e-af0d-941cfbde2ad2.png?v=1768500139",
        "img_name": "cerave-mineral-spf30.png"
    },
]

success = 0
skipped = 0
for p in products:
    img_url  = p.pop("img_url")
    img_name = p.pop("img_name")
    static_url = upload_img(img_url, img_name)
    p["images"] = [static_url] if static_url else []
    r = requests.post(f"{BASE_URL}/api/products/", json=p, headers=headers)
    if r.status_code == 201:
        print(f"OK   {p['name'][:50]}  img={'yes' if static_url else 'NO'}")
        success += 1
    elif r.status_code == 400 and "slug" in r.text:
        print(f"SKIP {p['name'][:50]} (exists)")
        skipped += 1
    else:
        print(f"ERR  {p['name'][:50]} -> {r.status_code}: {r.text[:80]}")

print(f"\nDone: {success} added, {skipped} skipped")
