# Presenter pacing — ~12 minutes

Use this file alongside `deck.md`. It does not need Marp compilation.

| Slide / block        | Suggested time | Focus |
|----------------------|----------------|--------|
| Title                | 0:30           | Set scope: ARF trust model, EU-wide wallet ecosystem. |
| Agenda               | 0:45           | Tell audience you will stay high-level; deep dives are in ARF annexes. |
| Why it matters       | 1:00           | Distributed actors; users need assurance without a single EU login authority. |
| Wallet Unit centre   | 1:00           | WUA/WIA; why issuers must trust the wallet endpoint. |
| Trusted lists        | 1:05           | MS → Commission → LoTL; lists as trust anchors. |
| WSCD vs lists        | 1:00           | **Wallet Provider** on list → anchor to verify **WUA**; **WUA payload** carries WSCD certification / keys; **no per-vendor WSCD LoT**. PID vs Attestation Provider LoTE rules §6.6.2.3.1. |
| eIDAS / PKI continuity | 0:55       | Not standalone: **amending eIDAS**, X.509 + ETSI lists; MS may **reuse CAs** (§6.1); non-QEAA may differ. |
| Registration         | 0:55           | Registrar role; confidence levels; registration certificate semantics. |
| Sector & schemes     | 1:00           | Sector/cross-border **Scheme Providers**, catalogues vs Trusted Lists; PuB-EAA + **Authentic Sources**. |
| Certificates / CT  | 0:55           | Access vs registration certs; SCT as tamper-evidence story (short). |
| Issuance path        | 1:15           | Validate credential signatures; validate issuer before request. |
| Presentation path    | 1:15           | RP auth; user checks registration; intermediaries one line if needed. |
| Certification + Mark | 1:00           | CAB/NAB; Trust Mark as **user-visible** link to certification facts. |
| Lifecycle            | 0:55           | Revocation and list updates; wallet provider cancellation example. |
| Takeaways + Thanks   | 0:45           | Layered model; point to repo paths for follow-up. |

**Total** ≈ 12:00–12:45 depending on pace (trim **Sector & schemes** or **Wallet centre** if you must stay under 12:00).

### Optional talking points if you have extra time

- **Intermediaries**: wallet shows both intermediary and intermediated RP; verify registered relationship (**Topic 52**).
- **Non-qualified EAAs**: rulebook-specific trust instead of only EU trusted lists; **individual providers** may extend Rulebooks for domestic-only attributes (ARF §5.4.2).
- **Discussion paper**: `docs/discussion-topics/u-eudi-wallet-trust-mark.md` for Trust Mark context.
