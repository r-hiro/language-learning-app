from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "characters-concept-traditional.png"
OUT_DIR = ROOT / "assets" / "characters"
SIZE = 512

CHARACTERS = {
    "japanese": (20, 210, 430, 700),
    "english": (420, 180, 835, 670),
    "korean": (820, 220, 1240, 710),
}

EXPRESSIONS = ("normal", "happy", "sad", "wonder", "smile", "cry")


def font(size):
    candidates = [
        "C:/Windows/Fonts/meiryo.ttc",
        "C:/Windows/Fonts/seguiemj.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def fit_square(source, box):
    crop = source.crop(box).convert("RGBA")
    crop.thumbnail((SIZE - 20, SIZE - 20), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (255, 250, 242, 255))
    x = (SIZE - crop.width) // 2
    y = (SIZE - crop.height) // 2
    canvas.alpha_composite(crop, (x, y))
    return canvas


def tint(img, color, alpha):
    overlay = Image.new("RGBA", img.size, color + (alpha,))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_star(draw, cx, cy, r, color):
    points = [
        (cx, cy - r),
        (cx + r * 0.25, cy - r * 0.25),
        (cx + r, cy),
        (cx + r * 0.25, cy + r * 0.25),
        (cx, cy + r),
        (cx - r * 0.25, cy + r * 0.25),
        (cx - r, cy),
        (cx - r * 0.25, cy - r * 0.25),
    ]
    draw.polygon(points, fill=color)


def add_cheeks(draw, strength=70):
    for x, y in ((160, 365), (360, 365)):
        draw.ellipse((x - 28, y - 12, x + 28, y + 12), fill=(255, 116, 138, strength))


def add_tears(draw, count=1):
    tear_color = (72, 165, 245, 190)
    positions = [(342, 320), (178, 320)] if count > 1 else [(342, 320)]
    for x, y in positions:
        draw.ellipse((x - 10, y - 5, x + 10, y + 30), fill=tear_color)
        draw.polygon(((x, y - 17), (x - 11, y + 6), (x + 11, y + 6)), fill=tear_color)
        draw.ellipse((x - 4, y + 3, x + 3, y + 13), fill=(255, 255, 255, 120))


def add_expression(base, expression):
    img = base.copy()
    if expression == "normal":
        return img

    if expression == "happy":
        img = tint(ImageEnhance.Color(img).enhance(1.12), (255, 241, 170), 30)
    elif expression == "smile":
        img = tint(ImageEnhance.Color(img).enhance(1.05), (255, 231, 236), 22)
    elif expression in ("sad", "cry"):
        img = tint(ImageEnhance.Color(img).enhance(0.78), (128, 190, 255), 42 if expression == "cry" else 28)
    elif expression == "wonder":
        img = tint(ImageEnhance.Color(img).enhance(0.92), (236, 224, 255), 34)

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    if expression == "happy":
        add_cheeks(draw, 95)
        for spec in ((95, 95, 23), (405, 120, 18), (395, 330, 16), (112, 360, 15)):
            draw_star(draw, *spec, (255, 195, 54, 230))
        draw.text((384, 66), "◎", fill=(47, 125, 69, 240), font=font(54))
    elif expression == "smile":
        add_cheeks(draw, 65)
        draw.text((395, 90), "♪", fill=(217, 95, 75, 220), font=font(60))
        draw_star(draw, 105, 120, 15, (255, 202, 91, 190))
    elif expression == "sad":
        add_tears(draw, 1)
        draw.text((390, 78), "...", fill=(68, 103, 150, 230), font=font(44))
    elif expression == "wonder":
        draw.text((84, 78), "?", fill=(111, 85, 190, 230), font=font(72))
        draw.text((382, 96), "?", fill=(111, 85, 190, 200), font=font(58))
        draw_star(draw, 118, 360, 14, (255, 196, 77, 190))
    elif expression == "cry":
        add_tears(draw, 2)
        draw.text((388, 68), "!", fill=(185, 79, 63, 230), font=font(62))

    overlay = overlay.filter(ImageFilter.GaussianBlur(0.15))
    return Image.alpha_composite(img, overlay)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE)
    for character, box in CHARACTERS.items():
        base = fit_square(source, box)
        for expression in EXPRESSIONS:
            out = add_expression(base, expression)
            out.save(OUT_DIR / f"{character}-{expression}.png")


if __name__ == "__main__":
    main()
