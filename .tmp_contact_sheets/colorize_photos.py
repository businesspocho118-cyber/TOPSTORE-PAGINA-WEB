from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
import re
import shutil
import unicodedata


ROOT = Path(r"C:\Users\JOHANPRO\Desktop\FOTOS PRENDAS NUEVO").resolve()
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}

COLOR_ALIASES: list[tuple[str, str]] = [
    ("blanco negro", "Blanco Negro"),
    ("negro azul", "Negro Azul"),
    ("azul marino", "Azul Marino"),
    ("azul oscuro", "Azul Oscuro"),
    ("azul claro", "Azul Claro"),
    ("gris oscuro", "Gris Oscuro"),
    ("verde menta", "Verde Menta"),
    ("multicolor", "Multicolor"),
    ("surtidos", "Surtidos"),
    ("vinotinto", "Vinotinto"),
    ("rosados", "Rosado"),
    ("rosadas", "Rosado"),
    ("rosado", "Rosado"),
    ("rosada", "Rosado"),
    ("blancos", "Blanco"),
    ("blancas", "Blanco"),
    ("blanco", "Blanco"),
    ("blanca", "Blanco"),
    ("negros", "Negro"),
    ("negras", "Negro"),
    ("negro", "Negro"),
    ("negra", "Negro"),
    ("marron", "Marron"),
    ("morado", "Morado"),
    ("morada", "Morado"),
    ("rojo", "Rojo"),
    ("roja", "Rojo"),
    ("lila", "Lila"),
    ("gris", "Gris"),
    ("azul", "Azul"),
]

PRODUCT_FOLDER_RENAMES = {
    "chaqueta deportiva blanca hombre": "chaqueta deportiva hombre",
    "medias deportivas blanco negro mujer": "medias deportivas mujer",
    "medias deportivas multicolor mujer": "medias deportivas mujer",
}


def normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(char for char in decomposed if unicodedata.category(char) != "Mn")


def detect_color(path: Path, color_folder_hint: str | None) -> str:
    text = normalize(" ".join(path.with_suffix("").parts))
    for alias, display in COLOR_ALIASES:
        if re.search(rf"\b{re.escape(alias)}\b", text):
            return display
    if color_folder_hint:
        return color_folder_hint
    raise RuntimeError(f"No color detected for {path}")


def detect_orientation(filename: str) -> str:
    text = normalize(Path(filename).stem)
    labels: list[str] = []

    if "frontal" in text or "frente" in text:
        labels.append("FRONTAL")
    elif "espaldas" in text or "espalda" in text:
        labels.append("ESPALDAS")
    if "lateral" in text:
        labels.append("LATERAL")
    if "detalle" in text:
        labels.append("DETALLE")
    if not labels and re.search(r"\bset\b", text):
        labels.append("SET")

    if not labels:
        labels.append("FRONTAL")

    return " ".join(labels)


def product_from_accessory(parts: tuple[str, ...]) -> tuple[str, Path, str | None]:
    if len(parts) == 2:
        product = "audifonos"
        color_hint = None
    elif len(parts) == 3:
        product = "audifonos"
        color_hint = parts[1]
    else:
        product = parts[1]
        color_hint = parts[2] if len(parts) >= 4 else None
    return product, ROOT / "accesorios" / product, color_hint


def product_from_garment(parts: tuple[str, ...]) -> tuple[str, Path, str | None]:
    gender = parts[0]
    product = PRODUCT_FOLDER_RENAMES.get(parts[1], parts[1])
    color_hint = parts[2] if len(parts) >= 4 else None
    return product, ROOT / gender / product, color_hint


def desired_entry(src: Path) -> tuple[Path, Path, str, str, str]:
    rel = src.relative_to(ROOT)
    parts = rel.parts
    category = parts[0]

    if category == "accesorios":
        product, product_dir, color_hint = product_from_accessory(parts)
    elif category in {"HOMBRES", "MUJERES"} and len(parts) >= 3:
        product, product_dir, color_hint = product_from_garment(parts)
    else:
        raise RuntimeError(f"Unexpected image location: {rel}")

    color = detect_color(rel, color_hint)
    orientation = detect_orientation(src.name)
    color_dir = product_dir / color
    base_name = f"{product.upper()} {color.upper()} {orientation}"
    return src, color_dir, base_name, src.suffix.lower(), color


def build_plan() -> list[tuple[Path, Path, str]]:
    files = sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )

    grouped: dict[tuple[str, str], list[tuple[Path, Path, str]]] = defaultdict(list)
    for src in files:
        src, color_dir, base_name, extension, color = desired_entry(src)
        grouped[(str(color_dir).lower(), base_name.lower())].append(
            (src.resolve(), color_dir.resolve(), extension)
        )

    plan: list[tuple[Path, Path, str]] = []
    def source_order(entry: tuple[Path, Path, str]) -> tuple[str, int]:
        source = entry[0]
        match = re.search(r" (\d+)$", source.stem)
        if match:
            return (source.stem[: match.start()].lower(), int(match.group(1)))
        return (source.stem.lower(), 1)

    for (_folder_key, base_key), entries in sorted(grouped.items()):
        for index, (src, color_dir, extension) in enumerate(sorted(entries, key=source_order), start=1):
            # Recover the display-cased base from the source entry.
            _src, _dir, base_name, _ext, color = desired_entry(src)
            suffix = "" if len(entries) == 1 or index == 1 else f" {index}"
            dest = color_dir / f"{base_name}{suffix}{extension}"
            plan.append((src, dest.resolve(), color))

    return sorted(plan, key=lambda row: str(row[0]).lower())


def validate(plan: list[tuple[Path, Path, str]]) -> None:
    seen: set[str] = set()
    sources = {str(src).lower() for src, _dest, _color in plan}

    for src, dest, _color in plan:
        src.relative_to(ROOT)
        dest.relative_to(ROOT)
        if not src.exists():
            raise RuntimeError(f"Source missing: {src}")
        key = str(dest).lower()
        if key in seen:
            raise RuntimeError(f"Duplicate destination in plan: {dest}")
        seen.add(key)
        if dest.exists() and str(dest).lower() not in sources:
            raise RuntimeError(f"Destination exists, refusing overwrite: {dest}")


def apply_plan(plan: list[tuple[Path, Path, str]]) -> int:
    moved = 0
    for src, dest, _color in plan:
        if src == dest:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dest))
        moved += 1
    return moved


def remove_empty_dirs() -> int:
    removed = 0
    protected = {ROOT, ROOT / "HOMBRES", ROOT / "MUJERES", ROOT / "accesorios"}

    for directory in sorted(
        [path for path in ROOT.rglob("*") if path.is_dir()],
        key=lambda path: len(path.parts),
        reverse=True,
    ):
        if directory in protected:
            continue
        try:
            directory.rmdir()
            removed += 1
        except OSError:
            pass
    return removed


def summarize() -> None:
    counts = Counter()
    total = 0
    for path in ROOT.rglob("*"):
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            total += 1
            rel = path.relative_to(ROOT)
            counts[str(Path(*rel.parts[:-1]))] += 1

    print(f"Total images: {total}", flush=True)
    for folder, count in sorted(counts.items()):
        print(f"{count:3} {folder}", flush=True)


def main() -> int:
    import sys

    apply = "--apply" in sys.argv
    if not ROOT.exists():
        raise RuntimeError(f"Root does not exist: {ROOT}")

    plan = build_plan()
    validate(plan)

    if not apply:
        print("DRY RUN", flush=True)
        summarize()
        print(f"Planned image moves/renames: {sum(1 for src, dest, _ in plan if src != dest)}", flush=True)
        return 0

    moved = apply_plan(plan)
    removed = remove_empty_dirs()
    print(f"Moved/renamed images: {moved}", flush=True)
    print(f"Removed empty folders: {removed}", flush=True)
    summarize()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
