"""
Scraped product data from cosmeticholic.pk
Brands: Tarte, MAC, Huda Beauty, Charlotte Tilbury
Scraped: 2026-04-12
Source URLs:
  - https://cosmeticholic.pk/search?q=tarte
  - https://cosmeticholic.pk/search?q=MAC+makeup
  - https://cosmeticholic.pk/search?q=MAC+lipstick
  - https://cosmeticholic.pk/search?q=MAC+foundation+studio
  - https://cosmeticholic.pk/collections/huda-beauty
  - https://cosmeticholic.pk/search?q=huda+beauty+eyeshadow
  - https://cosmeticholic.pk/search?q=charlotte+tilbury
  - https://cosmeticholic.pk/collections/charlottes-tilbury
"""

PRODUCTS = [

    # ─────────────────────────────────────────────────────────────────────────
    # BRAND: TARTE
    # ─────────────────────────────────────────────────────────────────────────
    {
        "name": "Tarte - Shape Tape™ Concealer",
        "brand": "Tarte",
        "price_pkr": 7700,   # range 7,700–8,400 depending on shade
        "category": "concealer",
        "description": (
            "Full-coverage, long-wearing concealer formulated with Amazonian clay "
            "and antioxidant-rich tarte clay. Crease-proof and lightweight."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-shape-tapetm-concealer-cosmetic-holic-4.jpg",
        "variants": [
            "12N Fair Neutral", "12S Fair", "12B Fair Beige",
            "16N Fair-Light Neutral",
            "20B Light", "20S Light Sand",
            "22B Light Beige", "22N Light Neutral",
            "27B Light-Medium Beige", "27H Light-Medium Honey",
            "27S Light-Medium Sand", "29N Light-Medium",
            "34S Medium Sand", "35N Medium", "35H Medium Honey",
            "36S Medium-Tan Sand", "38N Medium Tan Neutral", "42S Sand",
        ],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+shape+tape+concealer",
    },
    {
        "name": "Tarte - Amazonian Clay 12-Hour Blush - Exposed",
        "brand": "Tarte",
        "price_pkr": 4999,
        "category": "blush",
        "description": (
            "Long-wearing powder blush infused with Amazonian clay that absorbs "
            "excess oil and conditions skin for up to 12 hours of wear. "
            "Shade: Exposed (soft nude pink)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/2876-Amazonian-clay-12-hour-blush-exposed-MAIN.jpg",
        "variants": ["Exposed"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+amazonian+blush",
    },
    {
        "name": "Tarte - Amazonian Clay 12-Hour Blush - Dazzled",
        "brand": "Tarte",
        "price_pkr": 8199,
        "category": "blush",
        "description": (
            "Long-wearing powder blush infused with Amazonian clay. "
            "Shade: Dazzled (vibrant berry/pink with shimmer)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-amazonian-clay-12-hour-blush-dazzled-cosmetic-holic-1.jpg",
        "variants": ["Dazzled"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+amazonian+blush",
    },
    {
        "name": "Tarte - Amazonian Clay 12-Hour Blush - Captivating",
        "brand": "Tarte",
        "price_pkr": 8199,
        "category": "blush",
        "description": (
            "Long-wearing powder blush infused with Amazonian clay. "
            "Shade: Captivating (deep rosy pink)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-amazonian-clay-12-hour-blush-captivating-cosmetic-holic-1.jpg",
        "variants": ["Captivating"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+amazonian+blush",
    },
    {
        "name": "Tarte - Amazonian Clay 12-Hour Blush - Seduce",
        "brand": "Tarte",
        "price_pkr": 8199,
        "category": "blush",
        "description": (
            "Long-wearing powder blush infused with Amazonian clay. "
            "Shade: Seduce (warm mauve/berry)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-amazonian-clay-12-hour-blush-seduce-cosmetic-holic-1.jpg",
        "variants": ["Seduce"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+amazonian+blush",
    },
    {
        "name": "Tarte - Amazonian Clay Skintuitive 12-Hour Blush - Energy",
        "brand": "Tarte",
        "price_pkr": 8999,
        "category": "blush",
        "description": (
            "Upgraded Skintuitive formula of the iconic Amazonian Clay blush. "
            "Shade: Energy (bright coral-peach)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-amazonian-clay-skintuitive-12-hour-blush-energy-cosmetic-holic.webp",
        "variants": ["Energy"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+amazonian+blush",
    },
    {
        "name": "Tarte - Maneater™ Blush & Glow™ Cheek Plump",
        "brand": "Tarte",
        "price_pkr": 9800,
        "category": "blush",
        "description": (
            "Hybrid liquid blush + highlighter formula that plumps and adds a "
            "radiant flush of colour to cheeks."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-maneater-blush-and-glow-cheek-plump-cosmetic-holic-4.jpg",
        "variants": ["Berry", "Coral", "Pink", "Buffed Peach", "Buff", "Peachy Pink"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+maneater+blush",
    },
    {
        "name": "Tarte - Blush Tape™ Liquid Blush",
        "brand": "Tarte",
        "price_pkr": 8899,
        "category": "blush",
        "description": (
            "Long-lasting liquid blush with a natural skin-like finish. "
            "Available in Pink and Peach."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-blush-tape-liquid-blush-cosmetic-holic-5.jpg",
        "variants": ["Pink", "Peach"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+blush+tape",
    },
    {
        "name": "Tarte - Glow Tape™ Highlighter",
        "brand": "Tarte",
        "price_pkr": 8899,
        "category": "highlighter",
        "description": (
            "Buildable, long-wear liquid highlighter for a radiant glow. "
            "Available in Bronze Glow and Pearl Glow."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-glow-tapetm-highlighter-cosmetic-holic-5.jpg",
        "variants": ["Bronze Glow", "Pearl Glow"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+glow+tape+highlighter",
    },
    {
        "name": "Tarte - Sculpt Tape™ Contour",
        "brand": "Tarte",
        "price_pkr": 8899,
        "category": "contour",
        "description": (
            "Blendable liquid contour for a natural sculpted look. "
            "Available in Soft Bronze and Cool Bronze."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/tarte-sculpt-tapetm-contour-cosmetic-holic-5.jpg",
        "variants": ["Soft Bronze", "Cool Bronze"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+sculpt+tape",
    },
    {
        "name": "Tarte - Lights, Camera, Lashes™ 4-in-1 Mascara - Black",
        "brand": "Tarte",
        "price_pkr": 5999,
        "category": "mascara",
        "description": (
            "4-in-1 mascara that lengthens, curls, volumizes, and conditions lashes. "
            "Formulated with Amazonian clay and vitamins C and E."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/6-lights-camera-lashes-4-in-1-mascara-black-MAIN2-0.jpg",
        "variants": ["Black"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+lights+camera+lashes",
    },
    {
        "name": "Tarte - Stay Golden Amazonian Clay Cheek Set",
        "brand": "Tarte",
        "price_pkr": 19999,
        "category": "blush",
        "description": (
            "A curated set of Amazonian Clay 12-Hour Blushes. "
            "Available in Reds & Berries and Pinks & Corals sets."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/3047-stay-golden-Amazonian-clay-cheek-set-red-MAIN.jpg",
        "variants": ["Reds & Berries", "Pinks & Corals"],
        "product_url": "https://cosmeticholic.pk/search?q=tarte+stay+golden",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # BRAND: MAC
    # ─────────────────────────────────────────────────────────────────────────
    {
        "name": "MAC - Retro Matte Lipstick - Ruby Woo",
        "brand": "MAC",
        "price_pkr": 7000,
        "category": "lipstick",
        "description": (
            "Iconic MAC matte lipstick in the cult shade Ruby Woo. "
            "Vivid, retro-matte finish with intense pigment and a true blue-red tone."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-retro-matte-lipstick-ruby-woo-cosmetic-holic.jpg",
        "variants": ["Ruby Woo"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+retro+matte+lipstick",
    },
    {
        "name": "MAC - M·A·CXIMAL Silky Matte Lipstick",
        "brand": "MAC",
        "price_pkr": 8999,
        "category": "lipstick",
        "description": (
            "Silky, ultra-comfortable matte lipstick with weightless wear and "
            "buildable colour payoff."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-macximal-silky-matte-lipstick-cosmetic-holic.jpg",
        "variants": ["Mehr", "Kinda Sexy", "Velvet Teddy", "Café Mocha", "Warm Teddy", "Ruby Woo", "Mull It To The Max"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+macximal+silky+matte",
    },
    {
        "name": "MAC - Powder Kiss Liquid Lipcolour",
        "brand": "MAC",
        "price_pkr": 5500,
        "category": "lipstick",
        "description": (
            "Lightweight, powder-soft liquid lipcolour with a comfortable matte finish "
            "and high colour payoff."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-powder-kiss-liquid-lipcolour-cosmetic-holic.jpg",
        "variants": ["Got A Callback", "Burning Love", "Devoted To Chili", "Over The Taupe", "Ruby Phew", "M·A·CSmash"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+powder+kiss+liquid",
    },
    {
        "name": "MAC - Powder Kiss Velvet Blur Slim Stick Lipstick",
        "brand": "MAC",
        "price_pkr": 5999,
        "category": "lipstick",
        "description": (
            "Slim-stick lipstick format with a velvety blur matte finish. "
            "Comfortable, long-wearing formula."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-powder-kiss-velvet-blur-slim-stick-cosmetic-holic.jpg",
        "variants": ["Pumpkin Spiced", "Nice Spice", "Dubonnet Buzz", "Devoted To Danger"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+powder+kiss+velvet+blur",
    },
    {
        "name": "MAC - Studio Fix Powder Plus Foundation - NC25",
        "brand": "MAC",
        "price_pkr": 9999,
        "category": "foundation",
        "description": (
            "2-in-1 powder foundation and setting powder. Medium-to-full buildable "
            "coverage with a natural matte finish. SPF 15."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-studio-fix-powder-plus-foundation-nc25-cosmetic-holic-1.jpg",
        "variants": ["NC10", "NC15", "NC20", "NC25", "NC30", "NC35", "NC40"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+studio+fix+powder+foundation",
    },
    {
        "name": "MAC - Studio Fix Fluid Foundation SPF 15",
        "brand": "MAC",
        "price_pkr": 9199,
        "category": "foundation",
        "description": (
            "Medium-to-full coverage liquid foundation with SPF 15. "
            "Matte, long-wearing finish suitable for all skin types."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-studio-fix-fluid-foundation-spf-15-cosmetic-holic-5.webp",
        "variants": ["NC10", "NC15", "NC20", "NC25", "NC30", "NC35", "C4"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+studio+fix+fluid+foundation",
    },
    {
        "name": "MAC - Fix+ Matte Makeup Setting Spray - 100ml",
        "brand": "MAC",
        "price_pkr": 9500,
        "category": "setting spray",
        "description": (
            "Lightweight matte-finish setting spray that locks in makeup for "
            "all-day wear. Absorbs excess shine while refreshing the skin."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-fix-matte-makeup-setting-spray-100ml-cosmetic-holic-1.webp",
        "variants": ["100ml"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+fix+matte+setting+spray",
    },
    {
        "name": "MAC - Prep + Prime Fix+ Original - 100ml",
        "brand": "MAC",
        "price_pkr": 9999,
        "category": "setting spray",
        "description": (
            "Iconic MAC Fix+ setting spray with coconut, green tea, and chamomile. "
            "Primes, sets, and refreshes makeup throughout the day."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/18485237-f42a-4d7e-854d-9c2f6f800fe8.jpg",
        "variants": ["100ml"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+prep+prime+fix+plus",
    },
    {
        "name": "MAC - Locked Kiss Ink 24HR Lipcolour",
        "brand": "MAC",
        "price_pkr": 6499,
        "category": "lipstick",
        "description": (
            "24-hour wear liquid lipcolour with a precision doe-foot applicator. "
            "Comfortable, non-drying formula that seals to lips."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-locked-kiss-ink-24hr-lipcolour-cosmetic-holic.jpg",
        "variants": ["Gossip", "Most Curious", "Upgraded"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+locked+kiss+ink",
    },
    {
        "name": "MAC - Lip Pencil - Soar",
        "brand": "MAC",
        "price_pkr": 6499,
        "category": "lip liner",
        "description": (
            "Creamy, long-wearing lip liner pencil that defines and fills lips. "
            "Shade: Soar (dusty mauve-pink)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-lip-pencil-soar-cosmetic-holic.jpg",
        "variants": ["Soar"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+lip+pencil+soar",
    },
    {
        "name": "MAC - Strobe Cream - Gold Lite - 50ml",
        "brand": "MAC",
        "price_pkr": 10499,
        "category": "highlighter",
        "description": (
            "Luminising cream that gives skin a lit-from-within glow. "
            "Can be worn alone, mixed with foundation, or layered over makeup. "
            "Shade: Gold Lite (warm golden shimmer)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-strobe-cream-gold-lite-50ml-cosmetic-holic.jpg",
        "variants": ["Gold Lite", "Pinklite"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+strobe+cream",
    },
    {
        "name": "MAC - Gilded Glamour Best-Sellers Trio (Holiday Limited Edition)",
        "brand": "MAC",
        "price_pkr": 15499,
        "category": "makeup set",
        "description": (
            "Limited edition holiday trio set featuring MAC best-seller products "
            "in a gilded gift-ready package."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/mac-gilded-glamour-best-sellers-trio-cosmetic-holic.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=MAC+gilded+glamour+trio",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # BRAND: HUDA BEAUTY
    # ─────────────────────────────────────────────────────────────────────────
    {
        "name": "Huda Beauty - Power Bullet Matte Lipstick",
        "brand": "Huda Beauty",
        "price_pkr": 8500,
        "category": "lipstick",
        "description": (
            "High-pigment matte bullet lipstick with a comfortable, non-drying formula. "
            "Available in 18 named shades ranging from nudes to bolds."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/products/huda-beauty-power-bullet-matte-lipstick-cosmetic-holic-2.webp",
        "variants": [
            "Joyride", "Interview", "Dirty Thirty", "Pool Party", "Rendez-Vous",
            "Promotion Day", "Spring Break", "Prom Night", "Girls Trip", "Pay Day",
            "Board Meeting", "Wedding Day", "El Cinco De Mayo", "Bachelorette",
            "Honeymoon", "Anniversary", "Ladies Night", "Cake Day",
        ],
        "product_url": "https://cosmeticholic.pk/products/huda-beauty-power-bullet-matte-lipstick",
    },
    {
        "name": "Huda Beauty - Liquid Matte Ultra-Comfort Transfer-Proof Lipstick",
        "brand": "Huda Beauty",
        "price_pkr": 7999,
        "category": "lipstick",
        "description": (
            "Transfer-proof, long-wearing liquid matte lipstick with an "
            "ultra-comfortable formula that does not dry out lips."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-liquid-matte-ultra-comfort-transfer-proof-lipstick-cosmetic-holic.jpg",
        "variants": ["Perfectionist"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },
    {
        "name": "Huda Beauty - FAUX FILLER Extra Shine Lip Gloss",
        "brand": "Huda Beauty",
        "price_pkr": 10999,
        "category": "lip gloss",
        "description": (
            "High-shine lip gloss with a plumping, filler-like effect. "
            "Non-sticky formula delivers a glossy, full-looking pout."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-faux-filler-extra-shine-lip-gloss-cosmetic-holic-1.jpg",
        "variants": ["Glassy"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },
    {
        "name": "Huda Beauty - Rose Gold Remastered Eyeshadow Palette",
        "brand": "Huda Beauty",
        "price_pkr": 14999,
        "category": "eyeshadow",
        "description": (
            "Iconic 18-pan eyeshadow palette featuring a range of warm rose gold, "
            "champagne, bronze, and metallic shades."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-rose-gold-remastered-eyeshadow-palette-cosmetic-holic-1.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=huda+beauty+rose+gold+remastered",
    },
    {
        "name": "Huda Beauty - The New Nude Eyeshadow Palette",
        "brand": "Huda Beauty",
        "price_pkr": 16500,
        "category": "eyeshadow",
        "description": (
            "20-pan eyeshadow palette with warm nude, brown, and subtle shimmer "
            "shades perfect for everyday and evening looks."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-the-new-nude-eyeshadow-palette-cosmetic-holic-1.webp",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=huda+beauty+new+nude+palette",
    },
    {
        "name": "Huda Beauty - Empowered Eyeshadow Palette",
        "brand": "Huda Beauty",
        "price_pkr": 18999,
        "category": "eyeshadow",
        "description": (
            "Bold 20-pan palette with a mix of matte, shimmer, and glitter shades "
            "inspired by confidence and self-expression."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-empowered-eyeshadow-palette-cosmetic-holic-7.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=huda+beauty+empowered+palette",
    },
    {
        "name": "Huda Beauty - Pretty Grunge Eyeshadow Palette",
        "brand": "Huda Beauty",
        "price_pkr": 22499,
        "category": "eyeshadow",
        "description": (
            "Edgy 20-pan eyeshadow palette with deep, moody matte and metallic "
            "shades inspired by grunge aesthetics."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-pretty-grunge-eyeshadow-palette-cosmetic-holic-1.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=huda+beauty+pretty+grunge",
    },
    {
        "name": "Huda Beauty - #FauxFilter Luminous Matte Foundation",
        "brand": "Huda Beauty",
        "price_pkr": 13999,
        "category": "foundation",
        "description": (
            "Full-coverage, lightweight foundation with a luminous matte finish. "
            "Buildable formula for a flawless, filtered skin appearance."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/HB-FFoundation-Packshot-PannaCota-4.jpg",
        "variants": ["130G Panna Cotta"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },
    {
        "name": "Huda Beauty - Easy Bake and Snatch Pressed Brightening & Setting Powder",
        "brand": "Huda Beauty",
        "price_pkr": 14899,
        "category": "setting powder",
        "description": (
            "Pressed brightening and setting powder that bakes and sets makeup "
            "for a long-lasting, luminous finish."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-easy-bake-and-snatch-pressed-brightening-and-setting-powder-cosmetic-holic-4.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },
    {
        "name": "Huda Beauty - Tantour Contour & Bronzer Cream",
        "brand": "Huda Beauty",
        "price_pkr": 8499,
        "category": "contour",
        "description": (
            "Creamy contour and bronzer in one, blendable formula for "
            "natural-looking sculpted cheekbones. Available in Fair, Light, and Medium."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-tantour-contour-bronzer-cream-cosmetic-holic.jpg",
        "variants": ["Fair", "Light", "Medium"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },
    {
        "name": "Huda Beauty - Blush Filter Liquid Blush",
        "brand": "Huda Beauty",
        "price_pkr": 11200,
        "category": "blush",
        "description": (
            "Lightweight liquid blush that blends seamlessly into skin for a "
            "natural, radiant flush of colour."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-blush-filter-liquid-blush-cosmetic-holic.jpg",
        "variants": ["Cotton Candy"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },
    {
        "name": "Huda Beauty - LEGIT LASHES Double-Ended Volumizing and Lengthening Mascara",
        "brand": "Huda Beauty",
        "price_pkr": 6999,
        "category": "mascara",
        "description": (
            "Double-ended mascara with a volumizing brush on one end and a "
            "lengthening brush on the other for customisable lash looks."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/huda-beauty-legit-lashes-double-ended-mascara-cosmetic-holic.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/collections/huda-beauty",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # BRAND: CHARLOTTE TILBURY
    # ─────────────────────────────────────────────────────────────────────────
    {
        "name": "Charlotte Tilbury - Charlotte's Magic Cream",
        "brand": "Charlotte Tilbury",
        "price_pkr": 21000,
        "category": "skincare / moisturiser",
        "description": (
            "Award-winning multi-action moisturiser that hydrates, plumps, and "
            "primes skin. Formulated with Charlotte's Magic 8 complex."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-charlotte-s-magic-cream-cosmetic-holic-5.webp",
        "variants": ["30ml", "50ml (PKR 24,900)"],
        "product_url": "https://cosmeticholic.pk/products/charlotte-tilbury-charlottes-magic-cream",
    },
    {
        "name": "Charlotte Tilbury - Matte Revolution Lipstick",
        "brand": "Charlotte Tilbury",
        "price_pkr": 10999,
        "category": "lipstick",
        "description": (
            "Iconic velvet-matte lipstick with a hydrating, long-wear formula. "
            "Available in numerous shades including the cult Pillow Talk family."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-matte-revolution-lipstick-cosmetic-holic-5.jpg",
        "variants": ["M.I. Kiss", "Pillow Talk Original", "Walk of No Shame", "Super Nudes"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+matte+revolution",
    },
    {
        "name": "Charlotte Tilbury - Hollywood Flawless Filter",
        "brand": "Charlotte Tilbury",
        "price_pkr": 14500,
        "category": "primer / highlighter",
        "description": (
            "Complexion-perfecting primer, highlighter, and setting powder in one. "
            "Creates a soft-focus, lit-from-within glow. Available in 30ml."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-hollywood-flawless-filter-30ml-cosmetic-holic-4.jpg",
        "variants": ["4.5 Medium", "1 Fair", "2 Light", "3 Light/Medium", "6 Medium/Deep"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+hollywood+flawless+filter",
    },
    {
        "name": "Charlotte Tilbury - Airbrush Flawless Foundation",
        "brand": "Charlotte Tilbury",
        "price_pkr": 14999,
        "category": "foundation",
        "description": (
            "Long-wearing, medium-to-full coverage foundation with a soft matte, "
            "airbrushed finish. SPF 15. Suitable for all skin types."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-airbrush-flawless-foundation-cosmetic-holic-3.jpg",
        "variants": ["7.5 Neutral", "1 Neutral", "3 Neutral", "5 Neutral", "9 Neutral"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+airbrush+flawless+foundation",
    },
    {
        "name": "Charlotte Tilbury - Airbrush Flawless Setting Spray",
        "brand": "Charlotte Tilbury",
        "price_pkr": 12999,
        "category": "setting spray",
        "description": (
            "Long-wear setting spray that locks in makeup for up to 24 hours. "
            "Gives a soft-matte, airbrushed finish."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-airbrush-flawless-setting-spray-100ml-cosmetic-holic-1.jpg",
        "variants": ["100ml", "34ml (PKR 7,999)"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+airbrush+setting+spray",
    },
    {
        "name": "Charlotte Tilbury - Pillow Talk Big Lip Plumpgasm",
        "brand": "Charlotte Tilbury",
        "price_pkr": 12199,
        "category": "lip gloss / plumper",
        "description": (
            "Pillow Talk-tinted lip plumping gloss that gives an instantly fuller, "
            "more voluminous pout with a glossy finish."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/039_220084_PILLOW_TALK_PLUMP_P_PLUMPGASM_FAIR_MEDIUM_OPEN_RJ_2402.webp",
        "variants": ["Fair to Medium"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+pillow+talk+plumpgasm",
    },
    {
        "name": "Charlotte Tilbury - Hot Lips 2 Lipstick",
        "brand": "Charlotte Tilbury",
        "price_pkr": 10999,
        "category": "lipstick",
        "description": (
            "Hydrating, long-wear satin-finish lipstick in the celebrity-inspired "
            "Hot Lips 2 collection. Shade: Glowing Jen (soft rose)."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-hot-lips-2-cosmetic-holic-5.webp",
        "variants": ["Glowing Jen - Soft Rose", "Kidman's Kiss (PKR 9,999)"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+hot+lips",
    },
    {
        "name": "Charlotte Tilbury - Hollywood Contour Wand",
        "brand": "Charlotte Tilbury",
        "price_pkr": 13999,
        "category": "contour",
        "description": (
            "Buildable contouring wand with a blendable cream formula that sculpts "
            "and defines cheekbones for a Hollywood-ready finish."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-hollywood-contour-wand-fair-medium-cosmetic-holic-1.jpg",
        "variants": ["Fair Medium"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+hollywood+contour+wand",
    },
    {
        "name": "Charlotte Tilbury - Glow Glide Face Architect Highlighter",
        "brand": "Charlotte Tilbury",
        "price_pkr": 9500,
        "category": "highlighter",
        "description": (
            "Lightweight liquid highlighter wand that glides on effortlessly for "
            "a blinding, skin-like glow. Shade: Champagne Glow."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-glow-glide-highlighter-cosmetic-holic.jpg",
        "variants": ["Champagne Glow", "Pillow Talk Glow (PKR 13,500)"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+glow+glide",
    },
    {
        "name": "Charlotte Tilbury - Hollywood Blush & Glow Glide Palette",
        "brand": "Charlotte Tilbury",
        "price_pkr": 12499,
        "category": "blush",
        "description": (
            "Compact palette with blush and highlighter shades for a "
            "radiant, sculpted Hollywood glow."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-hollywood-blush-and-glow-glide-palette-cosmetic-holic.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+hollywood+blush+glow",
    },
    {
        "name": "Charlotte Tilbury - Beauty Verse Palette",
        "brand": "Charlotte Tilbury",
        "price_pkr": 19999,
        "category": "eyeshadow",
        "description": (
            "Limited edition multi-pan eye palette featuring celestial-inspired "
            "shades from earthy nudes to cosmic metallics."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/charlotte-tilbury-beauty-verse-palette-cosmetic-holic-1.jpg",
        "variants": ["Default Title"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+beauty+verse+palette",
    },
    {
        "name": "Charlotte Tilbury - Award Winners Starter Kit",
        "brand": "Charlotte Tilbury",
        "price_pkr": 16999,
        "category": "makeup set",
        "description": (
            "Curated starter kit featuring Charlotte Tilbury's most iconic, "
            "award-winning products for a complete beauty look."
        ),
        "image_url": "https://cosmeticholic.pk/cdn/shop/files/TheAwardWinningStarterKit-Fair__1.jpg",
        "variants": ["Fair"],
        "product_url": "https://cosmeticholic.pk/search?q=charlotte+tilbury+award+winners+kit",
    },
]


if __name__ == "__main__":
    from collections import defaultdict

    by_brand = defaultdict(list)
    for p in PRODUCTS:
        by_brand[p["brand"]].append(p)

    for brand, products in by_brand.items():
        print(f"\n{'='*60}")
        print(f"  {brand.upper()}  ({len(products)} products)")
        print(f"{'='*60}")
        for i, p in enumerate(products, 1):
            print(f"\n  [{i}] {p['name']}")
            print(f"      Price    : PKR {p['price_pkr']:,}")
            print(f"      Category : {p['category']}")
            print(f"      Image    : {p['image_url']}")
            if p["variants"] and p["variants"] != ["Default Title"]:
                print(f"      Variants : {', '.join(p['variants'][:5])}"
                      + (" ..." if len(p["variants"]) > 5 else ""))
            print(f"      Desc     : {p['description'][:120]}...")
