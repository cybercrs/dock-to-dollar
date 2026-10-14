"""Package Dock to Dollar browser assets under /js/ without changing site root."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = ("index.html", "original.css", "style.css", "content.js", "engine.js", "app.js")


def build(output):
    output.mkdir(parents=True, exist_ok=True)
    sizes, hashes = {}, {}
    for name in FILES:
        data = (HERE / name).read_bytes()
        (output / name).write_bytes(data)
        sizes[name] = len(data)
        hashes[name] = hashlib.sha256(data).hexdigest()
    manifest = {
        "name": "Dock to Dollar",
        "entrypoint": "index.html",
        "canonical_directory": "js/",
        "runtime_dependencies": [],
        "files_bytes": sizes,
        "application_bytes": sum(sizes.values()),
        "files_sha256": hashes,
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))
    return manifest


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=HERE / "dist")
    parser.add_argument(
        "--site-output",
        type=Path,
        help="Add only the /js/ directory to this existing static site",
    )
    args = parser.parse_args()
    build(args.site_output / "js" if args.site_output else args.output)
