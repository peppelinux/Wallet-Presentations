# GDC 2026 — Italian Federation for VC & Wallet — Marp deck

ROOT         := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
DECK         := $(ROOT)deck.md
THEME        := $(ROOT)it-wallet-dtd.css
MARPC        := $(ROOT).marprc.yml
DIAGRAM_MMD  := $(wildcard $(ROOT)diagrams/*.mmd)
DIAGRAM_SVG  := $(DIAGRAM_MMD:.mmd=.svg)
HTML         := $(ROOT)deck.html
PDF          := $(ROOT)deck.pdf
PPTX         := $(ROOT)deck.pptx

MERMAID ?= npx --yes @mermaid-js/mermaid-cli@latest -p "$(ROOT)scripts/puppeteer-no-sandbox.json"
MARP ?= npx --yes @marp-team/marp-cli

.PHONY: all html pdf pptx diagrams clean help rebuild

all: $(HTML) $(PDF) $(PPTX)
	@echo "Deck OK — $(notdir $(HTML)) $(notdir $(PDF)) $(notdir $(PPTX))"

help:
	@echo "Targets: all (default), html, pdf, pptx, diagrams, clean, rebuild"

rebuild: clean
	$(MAKE) all

$(ROOT)diagrams/%.svg: $(ROOT)diagrams/%.mmd
	cd "$(ROOT)diagrams" && $(MERMAID) -i "$(notdir $<)" -o "$(notdir $@)" -b transparent

diagrams: $(DIAGRAM_SVG)

html: $(HTML)
pdf: $(PDF)
pptx: $(PPTX)

MARP_FLAGS := --allow-local-files --no-stdin

$(HTML): $(DECK) $(DIAGRAM_SVG) $(THEME) $(MARPC)
	cd "$(ROOT)" && $(MARP) deck.md -o deck.html $(MARP_FLAGS)

$(PDF): $(DECK) $(DIAGRAM_SVG) $(THEME) $(MARPC)
	cd "$(ROOT)" && $(MARP) deck.md -o deck.pdf $(MARP_FLAGS)

$(PPTX): $(DECK) $(DIAGRAM_SVG) $(THEME) $(ROOT)scripts/build_native_pptx.py $(ROOT)scripts/requirements-pptx.txt
	@python3 -c "import pptx, PIL" 2>/dev/null || python3 -m pip install -q -r "$(ROOT)scripts/requirements-pptx.txt"
	cd "$(ROOT)" && python3 scripts/build_native_pptx.py

clean:
	rm -f "$(HTML)" "$(PDF)" "$(PPTX)"
