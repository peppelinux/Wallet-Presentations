# GDC 2026 — Italian Federation for VC & Wallet — Marp deck

ROOT         := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
DECK         := $(ROOT)deck.md
THEME        := $(ROOT)workshop-barcelona.css
MARPC        := $(ROOT).marprc.yml
DIAGRAM_MMD  := $(wildcard $(ROOT)diagrams/*.mmd)
DIAGRAM_SVG  := $(DIAGRAM_MMD:.mmd=.svg)
HTML         := $(ROOT)deck.html
PDF          := $(ROOT)deck.pdf

MERMAID ?= npx --yes @mermaid-js/mermaid-cli@latest
MARP ?= npx --yes @marp-team/marp-cli

.PHONY: all html pdf diagrams clean help rebuild

all: $(HTML) $(PDF)
	@echo "Deck OK — $(notdir $(HTML)) $(notdir $(PDF))"

help:
	@echo "Targets: all (default), html, pdf, diagrams, clean, rebuild"

rebuild: clean
	$(MAKE) all

$(ROOT)diagrams/%.svg: $(ROOT)diagrams/%.mmd
	cd "$(ROOT)diagrams" && $(MERMAID) -i "$(notdir $<)" -o "$(notdir $@)" -b transparent

diagrams: $(DIAGRAM_SVG)

html: $(HTML)
pdf: $(PDF)

MARP_FLAGS := --allow-local-files --no-stdin

$(HTML): $(DECK) $(DIAGRAM_SVG) $(THEME) $(MARPC)
	cd "$(ROOT)" && $(MARP) deck.md -o deck.html $(MARP_FLAGS)

$(PDF): $(DECK) $(DIAGRAM_SVG) $(THEME) $(MARPC)
	cd "$(ROOT)" && $(MARP) deck.md -o deck.pdf $(MARP_FLAGS)

clean:
	rm -f "$(HTML)" "$(PDF)"
