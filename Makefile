# Wallet-Presentations — full eIDAS corpus pipeline
#
#   make all     # regulations (Cellar) → markdown → technical standards
#   make legal   # eidas-legal-tech-references only

.PHONY: all legal help clean

WORKERS ?= 10

help:
	@echo "Wallet-Presentations — top-level targets"
	@echo ""
	@echo "  make all      eIDAS method: legal texts + markdown + standards"
	@echo "  make legal    Same as all (eidas-legal-tech-references/)"
	@echo "  make clean    Clean legal artifacts and referenced standards"
	@echo ""
	@echo "  See eidas-legal-tech-references/README.md for the full method (legal + implementers)."
	@echo ""
	@echo "  WORKERS=10    Parallel downloads (Cellar + standards)"

all legal:
	$(MAKE) -C eidas-legal-tech-references all WORKERS=$(WORKERS)

clean:
	$(MAKE) -C eidas-legal-tech-references clean WORKERS=$(WORKERS)
