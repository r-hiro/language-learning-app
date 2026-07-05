from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SHEET = ROOT / "assets" / "characters-expression-sheet.png"
OUT_DIR = ROOT / "assets" / "characters"

CHARACTERS = ("japanese", "english", "korean")
EXPRESSIONS = ("normal", "happy", "sad", "wonder", "smile", "cry")
OUTPUT_SIZE = 512


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sheet = Image.open(SHEET).convert("RGBA")
    cell_width = sheet.width // len(EXPRESSIONS)
    cell_height = sheet.height // len(CHARACTERS)

    for row, character in enumerate(CHARACTERS):
        for column, expression in enumerate(EXPRESSIONS):
            left = column * cell_width
            top = row * cell_height
            inset = 8
            square = cell_width - inset * 2
            cell = sheet.crop((left + inset, top + inset, left + inset + square, top + inset + square))
            cell = cell.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
            canvas = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE), (255, 250, 242, 255))
            canvas.alpha_composite(cell, (0, 0))
            canvas.save(OUT_DIR / f"{character}-{expression}.png")


if __name__ == "__main__":
    main()
