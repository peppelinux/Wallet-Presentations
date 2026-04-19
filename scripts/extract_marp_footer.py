#!/usr/bin/env python3
"""Print Marp/YAML `footer:` value from the first front matter block of deck.md (stdout, UTF-8)."""
from __future__ import annotations

import html
import re
import sys
from pathlib import Path


def extract_footer(deck_path: Path) -> str:
    raw = deck_path.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", raw, re.S)
    if not m:
        return ""
    for line in m.group(1).splitlines():
        s = line.strip()
        if not s.lower().startswith("footer:"):
            continue
        val = s.split(":", 1)[1].strip()
        if len(val) >= 2 and val[0] in "'\"" and val[0] == val[-1]:
            val = val[1:-1]
        return html.unescape(val)
    return ""


def main() -> None:
    if len(sys.argv) != 2:
        print("usage: extract_marp_footer.py <deck.md>", file=sys.stderr)
        sys.exit(2)
    print(extract_footer(Path(sys.argv[1])), end="")


if __name__ == "__main__":
    main()
