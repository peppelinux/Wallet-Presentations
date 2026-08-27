# Presenter pacing — ~10 minutes

Use this file alongside `deck.md`. It does not need Marp compilation.

Session: **GDC 2026**, Palexpo Geneva, **Day 2 · 12:00–12:50 · Beta** — *OpenID Federation Part 1*. This deck is the **Italian case study** slot (~10 min) inside that 50-minute session. Assume the room has already heard **what Federation is**; do not re-teach the protocol.

| Slide | Suggested time | Focus |
|-------|----------------|--------|
| Title | 0:20 | National production federation for VC & wallet — not a spec walkthrough. |
| Agenda | 0:25 | Four beats; this is the “who is using it / learnings” segment. **Skip if the moderator already framed the slot.** |
| The Italian choice | 1:15 | Governmental TA; wallet instance ≠ entity; two federations (SPID/CIE pre-1.0 vs IT-Wallet 1.0). |
| Topology | 0:50 | Point at leaves vs intermediary vs WIA. Revocation = unpublished statement. |
| What Federation carries | 0:50 | Chain, marks, public APIs as privacy. Do **not** read the TDI API matrix. |
| Runtime | 1:10 | Issuance vs presentation; issuer cannot observe RP; offline = TTL + `trust_chain`. |
| National vs EUDIW lists | 0:50 | JWT-first national plane; `openid_federation:` vs `x509_hash:`; PKIX owns cert lifecycle. |
| Production evidence | 1:00 | 12M / licences / health / 37% IO. Name the limitation: no fraud/cost study yet. |
| Two federations, one browser | 0:40 | Point **left = CIE/SPID**, **right = IT-Wallet TA**. Same OIDF machinery, different generations. **Cut first if over time.** |
| Learnings | 1:10 | SSI vs SAML vs Federation; no trust proxies; Phase 2 private WPs still nascent. |
| Roadmap → Part 2 | 0:40 | Events, extended listing, ACME+Federation, Wallet Architecture draft. Hand the mic to Part 2. |
| Thanks | 0:10 | QR to this deck. |

**Total** ≈ 9:00–10:00. If the chair gives you **8 minutes**, drop **Agenda** and **Two federations, one browser**.

### Talking points (do not put on slides)

- **Legal hook:** Art. 64-quater CAD (DL 19/2024); technical specs are the implementation profile, CC-0, LTS 1.4.x vs `eudiw` track.
- **Governance:** DTD strategy; IPZS infrastructure + public attestations; PagoPA / IO as the Phase 1 wallet surface.
- **Authentic sources in Phase 1:** MIT/DG Motor Vehicles (licence), MEF/RGS (health card), INPS (EU Disability Card).
- **SPID/CIE migration:** [spid-cie-oidc-django PR 324](https://github.com/italia/spid-cie-oidc-django/pull/324) as the retrocompatibility example — only if someone asks “do you throw away OIDC?”.
- **Privacy line if challenged:** Wallet Instances **must not** publish metadata; federation endpoints have **no caller identity**; historical keys keep long-lived attestations verifiable.
- **Do not over-claim:** telemetry is **opt-in ~70%**; activation ≠ understanding of selective disclosure; private-sector federation is **Phase 2**.

### If a question eats the slot

Park it for **Part 2** (due diligence, Wallet Architecture draft, cross-federation interworking). Offer the GitHub Pages QR.
