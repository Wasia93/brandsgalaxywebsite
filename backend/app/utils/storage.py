"""
Supabase Storage helper.
Falls back to local static/ folder if Supabase credentials are not set.
"""
import os, uuid
from app.config import settings


def upload_image(contents: bytes, original_filename: str, content_type: str) -> str:
    """
    Upload image and return the URL.
    - If SUPABASE_URL + SUPABASE_SERVICE_KEY are set → upload to Supabase Storage
    - Otherwise → save to local static/products/ (dev fallback)
    """
    ext = original_filename.rsplit(".", 1)[-1].lower() if "." in original_filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"

    # ── Supabase Storage ──────────────────────────────────────────
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        from supabase import create_client
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

        client.storage.from_(settings.SUPABASE_BUCKET).upload(
            path=filename,
            file=contents,
            file_options={"content-type": content_type, "upsert": "true"},
        )

        public_url = client.storage.from_(settings.SUPABASE_BUCKET).get_public_url(filename)
        return public_url

    # ── Local fallback (development) ─────────────────────────────
    dest = os.path.join("static", "products", filename)
    os.makedirs("static/products", exist_ok=True)
    with open(dest, "wb") as f:
        f.write(contents)
    return f"/static/products/{filename}"
