#!/usr/bin/env python3
"""
Add summary and scope_keywords to reference.json for downloaded specifications.

Usage:
  ./scripts/enrich-reference-summaries.py
  ./scripts/enrich-reference-summaries.py --body ETSI
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STANDARDS = ROOT / "standards"

from spec_summarizer import (  # noqa: E402
    DOWNLOADED_STATUSES,
    enrich_reference_document,
    fallback_spec_summary,
)
from datetime import datetime, timezone


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--standards-root", type=Path, default=STANDARDS)
    parser.add_argument("--body", help="Only process one SDO folder (e.g. ETSI)")
    parser.add_argument("--dry-run", action="store_true", help="Print counts only")
    args = parser.parse_args()

    standards_root = args.standards_root.resolve()
    if not standards_root.is_dir():
        print(f"Not found: {standards_root}", file=sys.stderr)
        return 1

    updated = skipped = errors = 0
    for ref_path in sorted(standards_root.rglob("reference.json")):
        if args.body and ref_path.parts[-3] != args.body:
            continue
        try:
            doc = json.loads(ref_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as exc:
            errors += 1
            print(f"✗ {ref_path}: {exc}", file=sys.stderr)
            continue
        before = json.dumps(
            {
                "summary": doc.get("summary"),
                "scope_keywords": doc.get("scope_keywords"),
            },
            sort_keys=True,
        )
        if doc.get("status") in DOWNLOADED_STATUSES:
            enriched = enrich_reference_document(doc, ref_path.parent, ref_root=ROOT)
        else:
            enriched = dict(doc)
            summary = fallback_spec_summary(enriched)
            if summary:
                enriched["summary"] = summary
                enriched["scope_keywords"] = enriched.get("scope_keywords") or []
                enriched["summary_meta"] = {
                    "generated_at": datetime.now(timezone.utc).isoformat(),
                    "status": "fallback",
                    "sources": ["designation", "parent_legal_regulations", "reason"],
                }
        after = json.dumps(
            {
                "summary": enriched.get("summary"),
                "scope_keywords": enriched.get("scope_keywords"),
            },
            sort_keys=True,
        )
        if before == after:
            skipped += 1
            continue
        if args.dry_run:
            print(f"would update {ref_path.relative_to(ROOT)}")
            updated += 1
            continue
        ref_path.write_text(json.dumps(enriched, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        updated += 1
        label = f"{enriched.get('body')} {enriched.get('designation')}"
        kw = len(enriched.get("scope_keywords") or [])
        print(f"• {label} — {kw} keywords")

    print(f"Updated {updated}, skipped {skipped}, errors {errors}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
