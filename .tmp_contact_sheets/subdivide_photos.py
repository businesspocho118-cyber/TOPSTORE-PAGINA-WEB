from __future__ import annotations

from collections import Counter
from pathlib import Path
import shutil
import sys


ROOT = Path(r"C:\Users\JOHANPRO\Desktop\FOTOS PRENDAS NUEVO").resolve()


def specific_folder(relative_path: Path) -> str:
    parts = relative_path.parts
    gender = parts[0]
    old = parts[1] if len(parts) >= 3 else parts[0]
    name = relative_path.name

    if gender == "accesorios":
        return "accesorios"

    already_specific = {
        "HOMBRES": {
            "buzo compresor hombre",
            "camiseta compresora hombre",
            "camiseta own it hombre",
            "camiseta sin mangas con capucha hombre",
            "camiseta sin mangas deportiva hombre",
            "camiseta sin mangas logo hombre",
            "camiseta sin mangas rayo hombre",
            "camiseta sin mangas workout hombre",
            "chaqueta deportiva blanca hombre",
        },
        "MUJERES": {
            "camiseta crop mujer",
            "chaqueta compresora con cierre mujer",
            "conjunto legging camiseta corta mujer",
            "conjunto pantalon campana mujer",
            "conjunto short manga corta mujer",
            "enterizo largo espalda abierta mujer",
            "enterizo short espalda abierta mujer",
            "legging levanta cola mujer",
            "medias deportivas blanco negro mujer",
            "medias deportivas multicolor mujer",
            "pantalon campana mujer",
            "set tops deportivos mujer",
            "short levanta cola mujer",
            "top deportivo cruzado mujer",
        },
    }

    if old in already_specific.get(gender, set()):
        return f"{gender}/{old}"

    if gender == "HOMBRES":
        if old == "camisetas hombre":
            if "blanca ajustada" in name:
                return "HOMBRES/camiseta compresora hombre"
            if "gris espalda" in name or "negra logo" in name:
                return "HOMBRES/camiseta own it hombre"
        if old == "camisetas sin mangas hombre":
            if "estampada" in name:
                return "HOMBRES/camiseta sin mangas workout hombre"
            if "deportiva" in name:
                return "HOMBRES/camiseta sin mangas deportiva hombre"
            if "capucha" in name:
                return "HOMBRES/camiseta sin mangas con capucha hombre"
            if "rayo" in name:
                return "HOMBRES/camiseta sin mangas rayo hombre"
            if "logo" in name:
                return "HOMBRES/camiseta sin mangas logo hombre"
        if old == "chaquetas hombre":
            return "HOMBRES/chaqueta deportiva blanca hombre"
        if old == "buzos hombre":
            return "HOMBRES/buzo compresor hombre"

    if gender == "MUJERES":
        mapping = {
            "camisetas mujer": "MUJERES/camiseta crop mujer",
            "chaquetas mujer": "MUJERES/chaqueta compresora con cierre mujer",
            "conjuntos legging mujer": "MUJERES/conjunto legging camiseta corta mujer",
            "conjuntos pantalon mujer": "MUJERES/conjunto pantalon campana mujer",
            "conjuntos short mujer": "MUJERES/conjunto short manga corta mujer",
            "enterizos mujer": "MUJERES/enterizo largo espalda abierta mujer",
            "enterizos short mujer": "MUJERES/enterizo short espalda abierta mujer",
            "leggings mujer": "MUJERES/legging levanta cola mujer",
            "pantalones campana mujer": "MUJERES/pantalon campana mujer",
            "shorts mujer": "MUJERES/short levanta cola mujer",
        }
        if old in mapping:
            return mapping[old]
        if old == "medias mujer":
            if "multicolor" in name:
                return "MUJERES/medias deportivas multicolor mujer"
            return "MUJERES/medias deportivas blanco negro mujer"
        if old == "tops deportivos mujer":
            if name.startswith("tops deportivos mujer"):
                return "MUJERES/set tops deportivos mujer"
            return "MUJERES/top deportivo cruzado mujer"

    raise RuntimeError(f"No rule for {relative_path}")


def build_plan() -> list[tuple[Path, Path, str]]:
    if not ROOT.exists() or not ROOT.is_dir():
        raise RuntimeError(f"Root not found: {ROOT}")

    rows: list[tuple[Path, Path, str]] = []
    files = sorted(path for path in ROOT.rglob("*") if path.is_file())
    for src in files:
        rel = src.relative_to(ROOT)
        folder = specific_folder(rel)
        dest = ROOT.joinpath(*folder.split("/"), src.name).resolve()
        dest.relative_to(ROOT)
        rows.append((src.resolve(), dest, folder))
    return rows


def validate(rows: list[tuple[Path, Path, str]]) -> None:
    seen: set[str] = set()
    for src, dest, _folder in rows:
        if not src.exists():
            raise RuntimeError(f"Source missing: {src}")
        key = str(dest).lower()
        if key in seen:
            raise RuntimeError(f"Duplicate destination: {dest}")
        seen.add(key)
        if dest.exists() and src != dest:
            raise RuntimeError(f"Destination exists, refusing overwrite: {dest}")


def remove_empty_old_dirs() -> list[str]:
    old_dirs = [
        "HOMBRES/buzos hombre",
        "HOMBRES/camisetas hombre",
        "HOMBRES/camisetas sin mangas hombre",
        "HOMBRES/chaquetas hombre",
        "MUJERES/camisetas mujer",
        "MUJERES/chaquetas mujer",
        "MUJERES/conjuntos legging mujer",
        "MUJERES/conjuntos pantalon mujer",
        "MUJERES/conjuntos short mujer",
        "MUJERES/enterizos mujer",
        "MUJERES/enterizos short mujer",
        "MUJERES/leggings mujer",
        "MUJERES/medias mujer",
        "MUJERES/pantalones campana mujer",
        "MUJERES/shorts mujer",
        "MUJERES/tops deportivos mujer",
    ]

    removed: list[str] = []
    for folder in old_dirs:
        directory = ROOT.joinpath(*folder.split("/"))
        if directory.exists() and directory.is_dir():
            try:
                directory.rmdir()
                removed.append(folder)
            except OSError:
                pass
    return removed


def print_counts(rows: list[tuple[Path, Path, str]]) -> None:
    counts = Counter(folder for _src, _dest, folder in rows)
    for folder, count in sorted(counts.items()):
        print(f"{count:3} {folder}", flush=True)


def main() -> int:
    apply = "--apply" in sys.argv
    rows = build_plan()
    validate(rows)
    if not apply:
        print("DRY RUN", flush=True)
        print_counts(rows)
        print(f"Total files: {len(rows)}", flush=True)
        return 0

    moved = 0
    for src, dest, _folder in rows:
        if src == dest:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dest))
        moved += 1

    removed = remove_empty_old_dirs()
    final_rows = build_plan()
    print(f"Moved files: {moved}", flush=True)
    print(f"Removed empty broad folders: {len(removed)}", flush=True)
    print_counts(final_rows)
    print(f"Total files: {len(final_rows)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
