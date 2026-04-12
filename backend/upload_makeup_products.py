import requests, sys, io
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"
token = requests.post(f"{BASE_URL}/api/auth/login",
    data={"username": "admin@brandsgalaxy.com", "password": "admin123"}).json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
cats = {c["slug"]: c["id"] for c in requests.get(f"{BASE_URL}/api/products/categories").json()}
makeup_id = cats["makeup"]

def upload_img(img_url, filename):
    try:
        r = requests.get(img_url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code != 200:
            return None
        ext = filename.split(".")[-1].lower()
        mime = "image/webp" if ext == "webp" else ("image/png" if ext == "png" else "image/jpeg")
        up = requests.post(f"{BASE_URL}/api/products/upload-image",
            files={"file": (filename, io.BytesIO(r.content), mime)}, headers=headers)
        return up.json()["url"] if up.status_code == 200 else None
    except Exception as e:
        print(f"  img err: {e}")
        return None

products = [
    # ── TARTE ──
    {
        "name": "Tarte Shape Tape Concealer",
        "slug": "tarte-shape-tape-concealer",
        "brand": "Tarte", "category_id": makeup_id,
        "price": 7700, "stock_quantity": 40, "is_featured": True, "is_active": True,
        "description": "Tarte's best-selling full-coverage concealer with a matte finish. Lightweight formula covers dark circles, blemishes and imperfections. Vegan and cruelty-free.",
        "extra_data": {"concern": "Full Coverage, Dark Circles", "finish": "Matte", "key_ingredients": "Shea Butter, Vitamin C, Antioxidants", "free_of": "Parabens, mineral oil, phthalates", "origin": "USA",
            "variants": [{"size": "12N Fair Neutral", "price": 7700, "stock": 10}, {"size": "20B Light", "price": 7700, "stock": 10}, {"size": "27B Light-Medium", "price": 7700, "stock": 10}, {"size": "35N Medium", "price": 8400, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-shape-tapetm-concealer-cosmetic-holic-4.jpg",
        "img_name": "tarte-shape-tape.jpg"
    },
    {
        "name": "Tarte Amazonian Clay 12-Hour Blush - Exposed",
        "slug": "tarte-amazonian-clay-blush-exposed",
        "brand": "Tarte", "category_id": makeup_id,
        "price": 4999, "stock_quantity": 35, "is_featured": True, "is_active": True,
        "description": "Creamy, long-wearing Amazonian Clay blush in shade Exposed. 12-hour wear formula infused with Amazonian Clay for a natural flush. Vegan and cruelty-free.",
        "extra_data": {"shade": "Exposed", "finish": "Matte", "wear_time": "12 Hours", "key_ingredients": "Amazonian Clay, Vitamin E", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/2876-Amazonian-clay-12-hour-blush-exposed-MAIN.jpg",
        "img_name": "tarte-blush-exposed.jpg"
    },
    {
        "name": "Tarte Amazonian Clay 12-Hour Blush - Dazzled",
        "slug": "tarte-amazonian-clay-blush-dazzled",
        "brand": "Tarte", "category_id": makeup_id,
        "price": 8199, "stock_quantity": 25, "is_featured": False, "is_active": True,
        "description": "Amazonian Clay 12-hour blush in radiant shade Dazzled. Buildable color with a natural finish. Infused with Amazonian Clay for long-lasting wear.",
        "extra_data": {"shade": "Dazzled", "finish": "Satin", "wear_time": "12 Hours", "key_ingredients": "Amazonian Clay, Vitamin E", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-amazonian-clay-12-hour-blush-dazzled-cosmetic-holic-1.jpg",
        "img_name": "tarte-blush-dazzled.jpg"
    },
    {
        "name": "Tarte Maneater Blush & Glow Cheek Plump",
        "slug": "tarte-maneater-blush-glow-cheek-plump",
        "brand": "Tarte", "category_id": makeup_id,
        "price": 9800, "stock_quantity": 30, "is_featured": True, "is_active": True,
        "description": "Innovative liquid blush with plumping effect for a dewy glow. Available in multiple shades. Infused with hyaluronic acid for a plump, healthy look.",
        "extra_data": {"finish": "Dewy Glow", "key_ingredients": "Hyaluronic Acid, Amazonian Clay", "origin": "USA",
            "variants": [{"size": "Berry", "price": 9800, "stock": 10}, {"size": "Coral", "price": 9800, "stock": 10}, {"size": "Pink", "price": 9800, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-maneater-blush-and-glow-cheek-plump-cosmetic-holic-4.jpg",
        "img_name": "tarte-maneater-blush.jpg"
    },
    {
        "name": "Tarte Glow Tape Highlighter",
        "slug": "tarte-glow-tape-highlighter",
        "brand": "Tarte", "category_id": makeup_id,
        "price": 8899, "stock_quantity": 25, "is_featured": False, "is_active": True,
        "description": "Buildable, blendable highlighting stick for a lit-from-within glow. Sweat, humidity and transfer resistant. Vegan and cruelty-free.",
        "extra_data": {"finish": "Luminous Glow", "key_ingredients": "Amazonian Clay, Antioxidants", "origin": "USA",
            "variants": [{"size": "Bronze Glow", "price": 8899, "stock": 15}, {"size": "Pearl Glow", "price": 8899, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-glow-tapetm-highlighter-cosmetic-holic-5.jpg",
        "img_name": "tarte-glow-tape.jpg"
    },
    {
        "name": "Tarte Lights Camera Lashes 4-in-1 Mascara",
        "slug": "tarte-lights-camera-lashes-mascara",
        "brand": "Tarte", "category_id": makeup_id,
        "price": 5999, "stock_quantity": 40, "is_featured": False, "is_active": True,
        "description": "4-in-1 mascara that lengthens, volumizes, lifts and curls lashes. Ophthalmologist tested formula. Vegan and cruelty-free.",
        "extra_data": {"shade": "Black", "key_ingredients": "Castor Oil, Rice Bran Wax, Vitamin E", "free_of": "Parabens", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/6-lights-camera-lashes-4-in-1-mascara-black-MAIN2-0.jpg",
        "img_name": "tarte-mascara.jpg"
    },
    # ── MAC ──
    {
        "name": "MAC Retro Matte Lipstick - Ruby Woo",
        "slug": "mac-retro-matte-lipstick-ruby-woo",
        "brand": "MAC", "category_id": makeup_id,
        "price": 7000, "stock_quantity": 50, "is_featured": True, "is_active": True,
        "description": "MAC's iconic true blue-red matte lipstick. The ultimate classic red. Long-wearing, retro matte finish. Intensely pigmented and bold.",
        "extra_data": {"shade": "Ruby Woo", "finish": "Retro Matte", "key_ingredients": "Vitamin E, Aloe Vera", "origin": "USA/Canada"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/mac-retro-matte-lipstick-ruby-woo-cosmetic-holic.jpg",
        "img_name": "mac-ruby-woo.jpg"
    },
    {
        "name": "MAC M.A.CXIMAL Silky Matte Lipstick",
        "slug": "mac-macximal-silky-matte-lipstick",
        "brand": "MAC", "category_id": makeup_id,
        "price": 8999, "stock_quantity": 40, "is_featured": True, "is_active": True,
        "description": "Maximally pigmented, silky matte lipstick with a comfortable, cushiony feel. Up to 10-hour wear. Available in multiple shades.",
        "extra_data": {"finish": "Silky Matte", "wear_time": "10 Hours", "key_ingredients": "Hyaluronic Acid, Vitamin E", "origin": "USA/Canada",
            "variants": [{"size": "Mehr", "price": 8999, "stock": 10}, {"size": "Velvet Teddy", "price": 8999, "stock": 10}, {"size": "Ruby Woo", "price": 8999, "stock": 10}, {"size": "Cafe Mocha", "price": 8999, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/mac-macximal-silky-matte-lipstick-cosmetic-holic.jpg",
        "img_name": "mac-macximal.jpg"
    },
    {
        "name": "MAC Studio Fix Fluid Foundation SPF 15",
        "slug": "mac-studio-fix-fluid-foundation-spf15",
        "brand": "MAC", "category_id": makeup_id,
        "price": 9199, "stock_quantity": 30, "is_featured": True, "is_active": True,
        "description": "Long-wearing, full-coverage liquid foundation with SPF 15. Leaves a natural matte finish that controls oil. Suitable for all skin types.",
        "extra_data": {"finish": "Natural Matte", "spf": "SPF 15", "coverage": "Full Coverage", "key_ingredients": "SPF 15 Filters, Silica", "origin": "USA/Canada",
            "variants": [{"size": "NC10", "price": 9199, "stock": 8}, {"size": "NC15", "price": 9199, "stock": 8}, {"size": "NC20", "price": 9199, "stock": 8}, {"size": "NC25", "price": 9199, "stock": 6}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/mac-studio-fix-fluid-foundation-spf-15-cosmetic-holic-5.webp",
        "img_name": "mac-studio-fix-fluid.webp"
    },
    {
        "name": "MAC Fix+ Matte Makeup Setting Spray",
        "slug": "mac-fix-plus-matte-setting-spray",
        "brand": "MAC", "category_id": makeup_id,
        "price": 9500, "stock_quantity": 35, "is_featured": False, "is_active": True,
        "description": "Weightless setting spray that locks makeup in place with a matte finish. Controls shine all day. Infused with green tea, chamomile and cucumber.",
        "extra_data": {"size": "100ml", "finish": "Matte", "key_ingredients": "Green Tea, Chamomile, Cucumber Extract", "origin": "USA/Canada"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/mac-fix-matte-makeup-setting-spray-100ml-cosmetic-holic-1.webp",
        "img_name": "mac-fix-matte-spray.webp"
    },
    {
        "name": "MAC Locked Kiss Ink 24HR Lipcolour",
        "slug": "mac-locked-kiss-ink-24hr-lipcolour",
        "brand": "MAC", "category_id": makeup_id,
        "price": 6499, "stock_quantity": 30, "is_featured": False, "is_active": True,
        "description": "24-hour long-wearing liquid lipstick with an ultra-precise applicator. Lightweight ink formula delivers bold, intense color.",
        "extra_data": {"finish": "Matte Ink", "wear_time": "24 Hours", "key_ingredients": "Film Formers, Pigments", "origin": "USA/Canada",
            "variants": [{"size": "Gossip", "price": 6499, "stock": 10}, {"size": "Most Curious", "price": 6499, "stock": 10}, {"size": "Upgraded", "price": 6499, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/mac-locked-kiss-ink-24hr-lipcolour-cosmetic-holic.jpg",
        "img_name": "mac-locked-kiss.jpg"
    },
    {
        "name": "MAC Strobe Cream Gold Lite",
        "slug": "mac-strobe-cream-gold-lite",
        "brand": "MAC", "category_id": makeup_id,
        "price": 10499, "stock_quantity": 20, "is_featured": False, "is_active": True,
        "description": "Luminous, pearlescent moisturizer that adds a healthy glow to skin. Can be used alone or mixed with foundation. 50ml.",
        "extra_data": {"shade": "Gold Lite", "size": "50ml", "finish": "Luminous Pearl", "key_ingredients": "Mica, Vitamin E", "origin": "USA/Canada"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/mac-strobe-cream-gold-lite-50ml-cosmetic-holic.jpg",
        "img_name": "mac-strobe-cream.jpg"
    },
    # ── HUDA BEAUTY ──
    {
        "name": "Huda Beauty Power Bullet Matte Lipstick",
        "slug": "huda-beauty-power-bullet-matte-lipstick",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 8500, "stock_quantity": 40, "is_featured": True, "is_active": True,
        "description": "Intensely pigmented matte lipstick with a comfortable, creamy formula. Available in 18 stunning shades. Long-lasting wear with a bold matte finish.",
        "extra_data": {"finish": "Matte", "key_ingredients": "Shea Butter, Vitamin E, Rose Hip Oil", "origin": "USA",
            "variants": [{"size": "Joyride", "price": 8500, "stock": 8}, {"size": "Interview", "price": 8500, "stock": 8}, {"size": "Dirty Thirty", "price": 8500, "stock": 8}, {"size": "Prom Night", "price": 8500, "stock": 8}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/products/huda-beauty-power-bullet-matte-lipstick-cosmetic-holic-2.webp",
        "img_name": "huda-power-bullet.webp"
    },
    {
        "name": "Huda Beauty FAUX FILLER Extra Shine Lip Gloss",
        "slug": "huda-beauty-faux-filler-lip-gloss",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 10999, "stock_quantity": 25, "is_featured": True, "is_active": True,
        "description": "High-shine lip gloss with a plumping effect. Gives the appearance of fuller, more voluminous lips with a glass-like shine.",
        "extra_data": {"shade": "Glassy", "finish": "Glass Shine", "key_ingredients": "Hyaluronic Acid, Peptides", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-faux-filler-extra-shine-lip-gloss-cosmetic-holic-1.jpg",
        "img_name": "huda-faux-filler.jpg"
    },
    {
        "name": "Huda Beauty Rose Gold Remastered Eyeshadow Palette",
        "slug": "huda-beauty-rose-gold-remastered-palette",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 14999, "stock_quantity": 20, "is_featured": True, "is_active": True,
        "description": "Iconic 18-shade eyeshadow palette featuring warm rose gold hues, shimmers and mattes. Remastered formula for improved blendability and pigmentation.",
        "extra_data": {"shades": "18 shades", "finish": "Matte & Shimmer", "key_ingredients": "Mica, Talc, Vitamin E", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-rose-gold-remastered-eyeshadow-palette-cosmetic-holic-1.jpg",
        "img_name": "huda-rose-gold-palette.jpg"
    },
    {
        "name": "Huda Beauty Empowered Eyeshadow Palette",
        "slug": "huda-beauty-empowered-eyeshadow-palette",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 18999, "stock_quantity": 15, "is_featured": False, "is_active": True,
        "description": "Versatile eyeshadow palette with rich, buildable pigments in warm neutral and bold tones. Perfect for both everyday and dramatic looks.",
        "extra_data": {"finish": "Matte, Shimmer & Glitter", "key_ingredients": "Mica, Vitamin E, Jojoba Oil", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-empowered-eyeshadow-palette-cosmetic-holic-7.jpg",
        "img_name": "huda-empowered-palette.jpg"
    },
    {
        "name": "Huda Beauty FauxFilter Luminous Matte Foundation",
        "slug": "huda-beauty-fauxfilter-luminous-matte-foundation",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 13999, "stock_quantity": 20, "is_featured": True, "is_active": True,
        "description": "Full-coverage foundation with a luminous matte finish. Buildable formula that blurs imperfections for an airbrushed look. Long-wearing.",
        "extra_data": {"coverage": "Full Coverage", "finish": "Luminous Matte", "key_ingredients": "Hyaluronic Acid, Vitamin C", "origin": "USA",
            "variants": [{"size": "130G Panna Cotta", "price": 13999, "stock": 20}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/HB-FFoundation-Packshot-PannaCota-4.jpg",
        "img_name": "huda-fauxfilter-foundation.jpg"
    },
    {
        "name": "Huda Beauty Tantour Contour & Bronzer Cream",
        "slug": "huda-beauty-tantour-contour-bronzer-cream",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 8499, "stock_quantity": 30, "is_featured": False, "is_active": True,
        "description": "Creamy contour and bronzer in one. Buildable formula that blends seamlessly for natural-looking definition and warmth.",
        "extra_data": {"finish": "Natural Matte", "key_ingredients": "Shea Butter, Vitamin E", "origin": "USA",
            "variants": [{"size": "Fair", "price": 8499, "stock": 10}, {"size": "Light", "price": 8499, "stock": 10}, {"size": "Medium", "price": 8499, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-tantour-contour-bronzer-cream-cosmetic-holic.jpg",
        "img_name": "huda-tantour.jpg"
    },
    {
        "name": "Huda Beauty LEGIT LASHES Volumizing Mascara",
        "slug": "huda-beauty-legit-lashes-mascara",
        "brand": "Huda Beauty", "category_id": makeup_id,
        "price": 6999, "stock_quantity": 35, "is_featured": False, "is_active": True,
        "description": "Double-ended mascara with volumizing and lengthening formulas. One end volumizes while the other separates and lengthens for dramatic, full lashes.",
        "extra_data": {"key_ingredients": "Castor Oil, Vitamin E, Beeswax", "origin": "USA"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-legit-lashes-double-ended-mascara-cosmetic-holic.jpg",
        "img_name": "huda-legit-lashes.jpg"
    },
    # ── CHARLOTTE TILBURY ──
    {
        "name": "Charlotte Tilbury Matte Revolution Lipstick",
        "slug": "charlotte-tilbury-matte-revolution-lipstick",
        "brand": "Charlotte Tilbury", "category_id": makeup_id,
        "price": 10999, "stock_quantity": 30, "is_featured": True, "is_active": True,
        "description": "Iconic matte lipstick with a comfortable, non-drying formula. Intensely pigmented for all-day color. Charlotte Tilbury's bestselling lipstick.",
        "extra_data": {"finish": "Matte", "key_ingredients": "Hyaluronic Acid, Vitamin E, Collagen Boosters", "origin": "UK",
            "variants": [{"size": "Pillow Talk Original", "price": 10999, "stock": 10}, {"size": "Walk of No Shame", "price": 10999, "stock": 10}, {"size": "M.I. Kiss", "price": 10999, "stock": 10}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-matte-revolution-lipstick-cosmetic-holic-5.jpg",
        "img_name": "ct-matte-revolution.jpg"
    },
    {
        "name": "Charlotte Tilbury Hollywood Flawless Filter",
        "slug": "charlotte-tilbury-hollywood-flawless-filter",
        "brand": "Charlotte Tilbury", "category_id": makeup_id,
        "price": 14500, "stock_quantity": 25, "is_featured": True, "is_active": True,
        "description": "Multi-use complexion booster, primer and highlighter in one. Creates an airbrushed, blurred, glowing complexion. Can be used alone or mixed with foundation.",
        "extra_data": {"size": "30ml", "finish": "Luminous Glow", "key_ingredients": "Hyaluronic Acid, Vitamin C, Skin-Perfecting Pigments", "origin": "UK",
            "variants": [{"size": "1 Fair", "price": 14500, "stock": 8}, {"size": "2 Light", "price": 14500, "stock": 8}, {"size": "3 Light/Medium", "price": 14500, "stock": 8}, {"size": "4.5 Medium", "price": 14500, "stock": 9}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-hollywood-flawless-filter-30ml-cosmetic-holic-4.jpg",
        "img_name": "ct-flawless-filter.jpg"
    },
    {
        "name": "Charlotte Tilbury Airbrush Flawless Foundation",
        "slug": "charlotte-tilbury-airbrush-flawless-foundation",
        "brand": "Charlotte Tilbury", "category_id": makeup_id,
        "price": 14999, "stock_quantity": 20, "is_featured": True, "is_active": True,
        "description": "24-hour long-wearing full-coverage foundation with an airbrushed matte finish. Blurs pores and imperfections for flawless-looking skin.",
        "extra_data": {"coverage": "Full Coverage", "finish": "Airbrushed Matte", "wear_time": "24 Hours", "key_ingredients": "Hyaluronic Acid, Vitamin E", "origin": "UK",
            "variants": [{"size": "1 Neutral", "price": 14999, "stock": 5}, {"size": "3 Neutral", "price": 14999, "stock": 5}, {"size": "5 Neutral", "price": 14999, "stock": 5}, {"size": "7.5 Neutral", "price": 14999, "stock": 5}]},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-airbrush-flawless-foundation-cosmetic-holic-3.jpg",
        "img_name": "ct-airbrush-foundation.jpg"
    },
    {
        "name": "Charlotte Tilbury Airbrush Flawless Setting Spray",
        "slug": "charlotte-tilbury-airbrush-flawless-setting-spray",
        "brand": "Charlotte Tilbury", "category_id": makeup_id,
        "price": 12999, "stock_quantity": 25, "is_featured": False, "is_active": True,
        "description": "Setting spray that makes makeup look airbrushed and flawless. Blurs pores, reduces shine and sets makeup for long-lasting wear.",
        "extra_data": {"size": "100ml", "key_ingredients": "Hyaluronic Acid, Vitamin E, Aloe Vera", "origin": "UK"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-airbrush-flawless-setting-spray-100ml-cosmetic-holic-1.jpg",
        "img_name": "ct-setting-spray.jpg"
    },
    {
        "name": "Charlotte Tilbury Hollywood Contour Wand",
        "slug": "charlotte-tilbury-hollywood-contour-wand",
        "brand": "Charlotte Tilbury", "category_id": makeup_id,
        "price": 13999, "stock_quantity": 20, "is_featured": False, "is_active": True,
        "description": "Dual-ended contour wand for defining and highlighting. Creates natural-looking sculpted cheekbones. Easy to blend formula.",
        "extra_data": {"shade": "Fair Medium", "finish": "Natural Matte", "key_ingredients": "Vitamin E, Skin-Smoothing Complex", "origin": "UK"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-hollywood-contour-wand-fair-medium-cosmetic-holic-1.jpg",
        "img_name": "ct-contour-wand.jpg"
    },
    {
        "name": "Charlotte Tilbury Beauty Verse Eyeshadow Palette",
        "slug": "charlotte-tilbury-beauty-verse-palette",
        "brand": "Charlotte Tilbury", "category_id": makeup_id,
        "price": 19999, "stock_quantity": 15, "is_featured": True, "is_active": True,
        "description": "Luxury eyeshadow palette with Charlotte Tilbury's signature Hollywood glamour shades. A mix of mattes, shimmers and glitters for endless eye looks.",
        "extra_data": {"finish": "Matte, Shimmer & Glitter", "key_ingredients": "Mica, Vitamin E, Jojoba Oil", "origin": "UK"},
        "img_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-beauty-verse-palette-cosmetic-holic-1.jpg",
        "img_name": "ct-beauty-verse.jpg"
    },
]

success = skipped = 0
for p in products:
    img_url = p.pop("img_url")
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
