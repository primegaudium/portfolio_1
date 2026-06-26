#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import sys

IMAGES_DIR   = Path("assets/images")
THUMBS_DIR   = Path("assets/images/thumbs")
THUMB_WIDTH  = 80
JPEG_QUALITY = 55
SUPPORTED    = {".jpg", ".jpeg", ".png", ".webp"}

def generate_thumb(src):
    dest    = THUMBS_DIR / (src.stem + ".jpg")
    img     = Image.open(src).convert("RGB")
    w, h    = img.size
    thumb_h = int(h * THUMB_WIDTH / w)
    thumb   = img.resize((THUMB_WIDTH, thumb_h), Image.LANCZOS)
    thumb.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    print(f"  {src.name:<40} {src.stat().st_size//1024:>5}KB  ->  {dest.name} ({dest.stat().st_size}B)")

if __name__ == "__main__":
    THUMBS_DIR.mkdir(parents=True, exist_ok=True)
    images = [p for p in IMAGES_DIR.iterdir() if p.is_file() and p.suffix.lower() in SUPPORTED]
    print(f"\nGenerating {len(images)} thumbnails...\n")
    for img_path in images:
        generate_thumb(img_path)
    print(f"\nDone. Commit assets/images/thumbs/ and redeploy.\n")