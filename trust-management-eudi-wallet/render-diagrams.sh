#!/usr/bin/env bash
# Delegate to Makefile so each .mmd → .svg runs in parallel under `make -j`.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
if command -v nproc >/dev/null 2>&1; then
  JOBS="${JOBS:-$(nproc)}"
elif command -v getconf >/dev/null 2>&1; then
  JOBS="${JOBS:-$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)}"
else
  JOBS="${JOBS:-4}"
fi
exec make -C "$ROOT" -j"$JOBS" diagrams
