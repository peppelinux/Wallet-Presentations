# Session questions — OpenID Federation Part 1 (GDC 2026)

Short answers from IT-Wallet practice. For the case-study slot and the handoff to Part 2.

---

## Questions from the session description

### What is the current feedback on Federation, and what are the plans in current and upcoming versions?

Federation 1.0 (Final, Feb 2026) and 1.1 (Final, May 2026) are stable as a trust-establishment protocol. Feedback is “the core is reliable, practical, and stable.” We learned that a national registrar needs more operational APIs than the one mandated by the core specifications. Auditors need history after revocation. **Extended Subordinate Listing** and **Subordinate Events** are in Implementer’s Draft vote this week (closes 4 Sep 2026). Italy already treats events as MUST.

Italy runs *Wallet Architectures 1.0** (draft) with the purpose to consolidate it in production before the draft grows optional features.

Participants Onboarding/Registrations and X.509 certs issuance are still custom. 

ACME bound to a federation identifier using previous federation-scoped registration facilitate the implementation of automatic X.509 certificates.

 Cross-federation “trust proxies” that re-evaluate foreign lists on behalf of wallets doens't seems appetible today (privacy, SPoF, cache drift).

---

### What current use cases are being solved, and how can OpenID Federation achieve some of them?

Federation does not issue or present credentials. It answers who may participate, with which keys, metadata, and policies — online and offline. Ecosystems bind that answer to a protocol.

The TA registers Wallet Providers, Credential Issuers and RPs. The wallet evaluates the RP chain before presenting; the issuer evaluates the Wallet Provider chain plus a Wallet Attestation. The issuer does not see which RP was used.

Government login (SPID/CIE, Swedish healthcare, NL/FI, eduGAIN): the same chains, with OIDC metadata instead of OpenID4VCI/VP. Open finance (Australia) demonstrates why listing must paginate. RP intermediaries (eIDAS Art. 5b(8)) map to OIDF Intermediates plus a Trust Mark so the wallet can show who registered the RP.

Finance and AI agents are the same job, a leaf with typed metadata and a chain to a TA the counterpart already trusts, but they still need protocol profiles, as wallets needed Wallet Architectures. 

Data quality, UX, and qualified-signature law sit beside this plane, not inside it.

---

### What are some of the best practices for Trust Registries in the current OIDFed?

The registry is the Trust Anchor (and its Intermediates) plus the Federation API — not a separate product.

Register once per perimeter; delegate with Intermediates and keep `max_path_length` / `allowed_leaf_entity_types` tight. Leaves self-issue Entity Configuration; superiors attest keys and apply metadata policy. Revocation is the absence of a valid subordinate statement. Keep Trust Mark status on its own endpoint so it cannot disagree with `/fetch`.

Publish historical keys (and events, if the profile requires them). Distribute TA keys out of band. Leave federation endpoints public and unauthenticated so the TA never learns which wallet asked about which RP. Register the Wallet Provider, not the instance.

Use Trust Marks for roles, not marketing. Keep semantic catalogues (claims, credential types) next to the federation graph, not inside it. Once an X.509 is issued, PKIX owns its life; Federation represents and underlying infrastructure to automize their issuance.

---

### David’s question: can ecosystem operators embed local social, privacy, and sustainability values in their Trust Lists, and restrict Wallet / RP / Issuer membership?

Yes. Restricting membership is what a Trust Anchor is for. No subordinate statement means not a member.

Values become enforceable only if they are operationalized: admission rules (jurisdiction, DPIA, sector licence, “no advertising use”), Trust Marks that split Wallet / Issuer / RP roles, and `metadata_policy` for machine-checkable privacy (what an RP may request, which formats an issuer may advertise). Constraints stop an Intermediate accredited only for RPs from onboarding a Wallet Provider.

A sustainability PDF on a website is not checked at presentation time. A foreign TA will apply *its* values; sovereignty is per trust plane, chosen by which TA keys a wallet ships. Do not outsource that choice to a proxy.

Italy already does this with a governmental TA (contacts, attested URIs, erasure endpoint, intermediary marks).

EU lists may represent a different, expanded, sovereignty driven by a wider community.

---

## Questions we believe should be put to open discussion

### Should we consider the coexistence of multiple methods and frameworks for trust assessment?

Yes. Coexistence is the end state. Federation asks whether an *entity* is a member, with these keys and this metadata. 

TSL / LoTE / X.509 ask whether a *certificate* or trust service is qualified or notified. A status list asks whether a *credential* is still valid. Those are different assessments, published by different legal bodies.

Make the method explicit (`openid_federation:` vs `x509_hash:`). Do not treat both stacks as one revocation channel. Converge on what a verifier can prove, not on a single protocol. Silent fallback (“try Federation, then TSL, then a PDF”) is how due diligence may die.

Part 2: a minimum set of facts every method must prove, versus a single-stack mandate. Italy argues for the former.

---

### Does using OpenID Federation alongside EUDIW trust registries mean doubling implementation efforts and costs?

It doubles *surfaces* if you run both end-to-end on every request. It need not double *effort* if each plane keeps its job.

A national wallet already needs a JWT-first plane (metadata, policy, marks, offline chains, wallet attestation). EUDIW lists do not carry that, and they do not disappear: they remain for Union publication and qualified-trust continuity. 

The expensive mistake is dual-evaluating Federation, LoTE, and OCSP on the domestic hot path. The expensive organisation is two teams maintaining two truths about the same legal person — fix that with one registrar process and two projections, and with PKIX owning certs while Federation owns membership.

We do not yet have euro figures for RP cost or fraud. ACME bound to the federation identifier is how participant enrolment should get cheaper.

Part 2: what is the minimum EUDIW-list check a Federation-native wallet still owes on a cross-border presentation — and can it stay off the domestic hot path?
