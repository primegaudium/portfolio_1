#!/usr/bin/env python3
"""
compress-images.py
Run from your project root:
    python compress-images.py

Compresses all slide background images to ≤500KB with minimal
quality loss. Keeps originals as *.orig.* so you can revert.

Dependencies: pip install Pillow
"""

from pathlib import Path
from PIL import Image
import shutil, sys

TARGET_MAX_BYTES  = 500 * 1024   # 500 KB hard limit
TARGET_LONG_EDGE  = 1920         # max width or height in pixels
JPEG_QUALITY_INIT = 82           # start quality for JPEG
PNG_COMPRESS_LVLS = [6, 7, 8, 9] # progressive PNG compress levels

IMAGES_DIR = Path("assets/images")

def compress_jpeg(path: Path) -> int:
    """Compress JPEG, returns final file size in bytes."""
    img = Image.open(path).convert("RGB")

    # Downscale if larger than TARGET_LONG_EDGE on either axis
    w, h = img.size
    if max(w, h) > TARGET_LONG_EDGE:
        scale = TARGET_LONG_EDGE / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        print(f"  Resized {path.name}: {w}×{h} → {img.width}×{img.height}")

    quality = JPEG_QUALITY_INIT
    while quality >= 55:
        img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
        size = path.stat().st_size
        if size <= TARGET_MAX_BYTES:
            return size
        quality -= 5

    # Last resort — just save at minimum quality
    img.save(path, "JPEG", quality=55, optimize=True, progressive=True)
    return path.stat().st_size


def compress_png(path: Path) -> int:
    """Compress PNG, returns final file size in bytes."""
    img = Image.open(path)

    # Downscale if needed
    w, h = img.size
    if max(w, h) > TARGET_LONG_EDGE:
        scale = TARGET_LONG_EDGE / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        print(f"  Resized {path.name}: {w}×{h} → {img.width}×{img.height}")

    # Try progressive compression levels
    for lvl in PNG_COMPRESS_LVLS:
        img.save(path, "PNG", optimize=True, compress_level=lvl)
        size = path.stat().st_size
        if size <= TARGET_MAX_BYTES:
            return size

    # If still too big, convert to JPEG (saves as .jpg beside the .png)
    # and let the user know they should update the filename reference
    jpg_path = path.with_suffix(".jpg")
    img.convert("RGB").save(jpg_path, "JPEG", quality=75, optimize=True, progressive=True)
    jpg_size = jpg_path.stat().st_size
    print(f"  ⚠  PNG still large after compression. Saved JPEG version as {jpg_path.name} ({jpg_size//1024} KB).")
    print(f"     If you use the .jpg, update the media path in slides-data.js too.")
    return path.stat().st_size


def process(path: Path) -> None:
    orig_size = path.stat().st_size
    if orig_size <= TARGET_MAX_BYTES:
        print(f"  ✓ {path.name} already ≤500 KB ({orig_size//1024} KB) — skipped")
        return

    # Back up original
    backup = path.with_suffix(".orig" + path.suffix)
    if not backup.exists():
        shutil.copy2(path, backup)

    print(f"  Compressing {path.name} ({orig_size//1024} KB) …", end=" ", flush=True)

    ext = path.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        final = compress_jpeg(path)
    elif ext == ".png":
        final = compress_png(path)
    else:
        print("unknown format, skipped")
        return

    reduction = (1 - final / orig_size) * 100
    print(f"→ {final//1024} KB  ({reduction:.0f}% smaller)")


if __name__ == "__main__":
    if not IMAGES_DIR.exists():
        print(f"Error: {IMAGES_DIR} not found. Run from your project root.")
        sys.exit(1)

    images = sorted(
        p for p in IMAGES_DIR.iterdir()
        if p.suffix.lower() in (".jpg", ".jpeg", ".png")
    )

    if not images:
        print(f"No images found in {IMAGES_DIR}")
        sys.exit(0)

    print(f"\nCompressing {len(images)} image(s) in {IMAGES_DIR}/\n")
    for img_path in images:
        process(img_path)

    print("\nDone. Originals saved as *.orig.* — delete them once you're happy.")
    print("Then redeploy: vercel --prod\n")