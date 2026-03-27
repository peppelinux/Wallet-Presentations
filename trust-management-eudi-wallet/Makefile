# Trust-management deck: Mermaid → SVG, then Marp → deck.html + deck.pdf
#
# Run Make from this presentation folder (same directory as this Makefile):
#   cd presentations/trust-management-eudi-wallet
#   make              # default: all
#   make -j$(nproc)   # parallel Mermaid (and parallel html/pdf if independent)
#   make clean all    # force full rebuild
#
# From repo root (same effect):
#   make -C presentations/trust-management-eudi-wallet
#   make trust-wallet-deck    # shortcut in the repository root Makefile

ROOT         := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
DECK         := $(ROOT)deck.md
THEME        := $(ROOT)workshop-barcelona.css
MARPC        := $(ROOT).marprc.yml
DIAGRAM_MMD  := $(wildcard $(ROOT)diagrams/*.mmd)
DIAGRAM_SVG  := $(DIAGRAM_MMD:.mmd=.svg)
HTML         := $(ROOT)deck.html
PDF          := $(ROOT)deck.pdf

# Same tool as render-diagrams.sh; override e.g. MERMAID='mmdc' if installed globally.
MERMAID ?= npx --yes @mermaid-js/mermaid-cli@latest

# Same pattern as render-diagrams.sh; override if marp is installed globally: make MARP='marp'
MARP ?= npx --yes @marp-team/marp-cli

.PHONY: all html pdf diagrams clean help rebuild

# Phony `all`: always runs this recipe after prerequisites so `make` never looks “stuck”
# when outputs are merely up to date (incremental build). Use `make rebuild` to force Marp + refresh.
all: $(HTML) $(PDF)
	@echo "Deck OK — $(notdir $(HTML)) $(notdir $(PDF)) (use 'make rebuild' to force a full rebuild)"

help:
	@echo "Usage: cd to this folder (presentations/trust-management-eudi-wallet), then:"
	@echo ""
	@echo "Targets:"
	@echo "  all (default) — diagrams (per .mmd → .svg when needed), then deck.html + deck.pdf"
	@echo "  rebuild         — clean + all (force Marp; diagrams only if .mmd newer than .svg)"
	@echo "  html / pdf      — build one output"
	@echo "  diagrams        — build any diagrams/*.svg that are missing or older than .mmd"
	@echo "  clean           — remove deck.html, deck.pdf"
	@echo ""
	@echo 'Parallel Mermaid:  make -j$$(nproc) diagrams   or   ./render-diagrams.sh'
	@echo "Force all SVGs:    rm -f diagrams/*.svg && make diagrams"
	@echo ""
	@echo "If you see 'Nothing to be done for all' / «Nessuna operazione...»: outputs are"
	@echo "newer than deck.md and theme — that is normal. Run: make rebuild"
	@echo ""
	@echo "Variables: MARP, MERMAID (defaults use npx)"
	@echo ""
	@echo "Note: Repository root has a different Makefile (MkDocs/Pandoc). Use this file"
	@echo "      from the presentation directory, or from repo root:"
	@echo "        make -C presentations/trust-management-eudi-wallet"
	@echo "        make trust-wallet-deck"

# One recipe per file — safe under `make -j`.
$(ROOT)diagrams/%.svg: $(ROOT)diagrams/%.mmd
	cd "$(ROOT)diagrams" && $(MERMAID) -i "$(notdir $<)" -o "$(notdir $@)" -b transparent

diagrams: $(DIAGRAM_SVG)

# Avoid running mermaid-cli twice on: make -j2 html pdf
html: $(HTML)
pdf: $(PDF)

rebuild: clean
	$(MAKE) all

MARP_FLAGS := --allow-local-files --no-stdin

$(HTML): $(DECK) $(DIAGRAM_SVG) $(THEME) $(MARPC)
	cd "$(ROOT)" && $(MARP) deck.md -o deck.html $(MARP_FLAGS)

$(PDF): $(DECK) $(DIAGRAM_SVG) $(THEME) $(MARPC)
	cd "$(ROOT)" && $(MARP) deck.md -o deck.pdf $(MARP_FLAGS)

clean:
	rm -f "$(HTML)" "$(PDF)"
