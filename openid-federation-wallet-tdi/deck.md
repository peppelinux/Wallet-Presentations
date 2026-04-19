---
marp: true
theme: workshop-barcelona
paginate: true
footer: '4th International Workshop on Trends in Digital Identity — Verona, 20 April 2026 · Giuseppe De Marco'
---

<!-- _class: lead lead-blue -->
# OpenID Federation 1.0 and EUDIW trusted lists / X.509 PKIs in IT-Wallet

The state of play of two different trust management systems in the Italian IT-Wallet.

**with Giuseppe De Marco**, _Technical Project Manager — Dipartimento per la trasformazione digitale, Presidency of the Council of Ministers of Italy_

---

## Today in 4 parts

1. **OpenID Federation in IT-Wallet** — final alignment with **Federation 1.0**, federation **endpoints**, **national** rollout.  
2. **EUDIW trust management** — overview, responsibility matrix, design concerns, domestic gaps.
3. **Costs** — many sources vs one federation chain; dual evaluation paths; participant obligations.  
4. **Evolution** — onboarding APIs, ACME + Federation, OpenID Federation Wallet Architecture draft maturity, why not “federation trust proxies” over foreign lists.

---

## Part 0 — Legacy SPID/CIE vs IT-Wallet based **Federation 1.0** (short intro)

Two different Federations, using two different Trust Anchors.

pre-1.0 OIDC federation drafts are used in the legacy SPID/CIE profile. 

The overall approach is unchanged, [spid-cie-oidc-django](https://github.com/italia/spid-cie-oidc-django/pull/324) exemplifies how **retrocompatibility is achievable**.

---

## Part 1 — Profile delta: **metadata** (IT-Wallet / Federation 1.0)

The **national IT-Wallet rules** align with **OpenID Federation 1.0** and the **OpenID Federation Wallet Architecture** draft. 

**Metadata beyond base Federation:** **`federation_entity`** (required); RP **`openid_credential_verifier`**; PID/(Q)EAA providers publish **`openid_credential_issuer`** and (where applicable) **`oauth_authorization_server`** metadata types — **combined** in one entity configuration or **split** across entities (Credential Issuer then carries **`authorization_servers`** pointing at the AS); leaf **`federation_entity`** details such as **`logo_uri` in SVG** and **PEC** in `contacts` where the profile tightens presentation.

**Metadata beyond base Federation Wallet Arch:** **`wallet_solution`** describing a Wallet Provider and its "_sole_" Wallet Solution.

---

## Part 1 — Federation Profile delta in **OpenID4VCI** Metadata

- **`jwks` by value:** **`openid_credential_issuer`** and **`oauth_authorization_server`** both require a **`jwks`** JSON object **carried by value** (with `OID-FED` §5.2.1 / `JWK` references) — national **credential issuer metadata** profile.
- **Issuance flow:** PAR to obtain a one-time **`request_uri`**, then authorize with **`request_uri`** only (no PAR body replay); **`redirect_uri`** must match the signed Request Object — **IT-Wallet** low-level issuance and authorization-endpoint rules.
- **Further issuer metadata (national profile):** **REQUIRED** — **`trust_frameworks_supported`** (e.g. CIE, eIDAS, L2+document proof) in the authorization flow; per–credential-configuration **`schema_id`** and **`authentic_sources`** (national schema + authentic-source registries); **`status_list_aggregation_endpoint`** (Token Status List aggregation); **SVG**-first **display** rules for issuer and credential artwork where the profile mandates them. **OPTIONAL** — **`batch_credential_issuance`** (and its **`batch_size`** when present).

---

## Part 1 — Federation Profile delta in **OpenID4VP** Metadata

- **Attested URIs:** **`openid_credential_verifier`** (when `client_id` = **`openid_federation`**) carries pre-registered **`request_uris`**, **`response_uris`**, and **`redirect_uris`** so the wallet rejects **endpoint mix-up** (`WP_081`, `WP_091a`, `WP_094a`; remote-presentation test matrix). The same URI lists are defined in **`OID-FED-WALLET`** (draft; checks align with OpenID4VP).

_With **`x509_hash`**, equivalent **`client_metadata`** is carried **in the request** instead._

- **Verifier presentation & privacy:** **`encrypted_response_enc_values_supported`** for **`direct_post.jwt`**, **`logo_uri`** as **SVG**; conditional **`erasure_endpoint`** when the RP requests strongly identifying claims. **`erasure_endpoint`** is **IT-Wallet–specific** (national **relying party / credential verifier** metadata).

---

## Part 1 — The remark about Wallet Instances using OpenID Federation

- **Wallet + federation:** Wallet Instance **must not** publish discoverable online metadata; federation endpoints are all **public without client credentials** that identify callers.

---

## Part 1 — OpenID Federation *Wallet Architectures* (draft)

- Reference: **[OpenID Federation Wallet Architectures 1.0](https://openid.net/specs/openid-federation-wallet-1_0.html)** (draft; cited as **`OID-FED-WALLET`** in the **IT-Wallet standards** list).
- **Wallet Provider entity configuration** in IT-Wallet requires `metadata` to include **`wallet_solution`** and **`federation_entity`**.
- **Issuance path nuance:** PID / (Q)EAA issuance to the wallet follows **OpenID4VCI** flows under the same **IT-Wallet** rules; the **Federation `wallet_solution` metadata** addresses *wallet-solution discovery and typing* in the federation layer, not a replacement for credential-issuer metadata.

---

<!-- _class: federation-api-compact -->
## Part 1 — Federation API surface (Trust Anchor / Intermediate)

| API | HTTP | Roles | Norm | Body |
|-----|------|-------|------|------|
| Entity config | `GET /.well-known/openid-federation` | TA,Int,WP,RP,CI | MUST | `entity-statement+jwt` |
| List | `GET …/list` | TA,Int | MUST | JSON |
| Fetch | `GET …/fetch?sub=` | TA,Int | MUST | JWT |
| TM status | `POST …/trust_mark_status` | TA,Int | SHOULD | JSON |
| TM list | `GET …/trust_marked_list` | TA,Int | MAY† | JWT |
| Hist keys | `GET …/historical_keys` | TA,Int | OIDF MAY→**IT-W MUST** | JWT |
| Sub events | `GET …/subordinate_events?sub=` | TA,Int | ext. | `entity-events+jwt` |
| Resolve | `federation_resolve_endpoint` | any | §8.3 MAY | — |

---

## Part 1 — Subordinate Events (extension draft)

- IT-Wallet documents the **Federation Subordinate Events Endpoint** as defined in **`OID-FED-SUBORDINATE-EVENTS`**: [openid-federation-subordinate-events-1_0](https://openid.net/specs/openid-federation-subordinate-events-1_0.html).  
- Purpose: historical **registration / revocation / JWKS update** events for immediate subordinates — transparency for lifecycle and audits (**Federation Subordinate Events** in the **IT-Wallet** trust model).

---

## Part 1 — Wallet solution selection & custom URI mitigation

- **UX reference:** wallet solution selection page in the national proxy preview — [iam-proxy-italia IT-Wallet preview](https://italia.github.io/iam-proxy-italia/preview/sec-fix-3.2.1/it-wallet.html) (domestic pattern for presenting available wallet solutions to the user).  
- **Security context:** custom URI / wallet-invocation schemes are a recurring EUDIW ecosystem concern; a **hosted HTML selection step** mitigates some phishing / confused-deputy issues compared with naked custom URI handlers alone.  
- **Federation scale-out:** loading many federated wallet solutions may need a **bulk / paginated listing** beyond plain `federation_list_endpoint` — see **OpenID Federation Extended Subordinate Listing 1.0** draft: [openid-federation-extended-listing-1_0-01](https://openid.net/specs/openid-federation-extended-listing-1_0-01.html) (*next steps*).

---

## Part 2 — EUDIW trust management (overview)

- **Hierarchical authoritative listing model:** participants register nationally; **trusted lists / LoTE** and **ARF** matrices describe who publishes what (PID TL at EC, many wallet-provider / WRPAC lists, sector-specific registration artefacts, …).

---

<!-- _class: why-matters -->
## Does everything fit within it?

<div class="why-split">

<div class="why-split-left">

- **Duplication:** one **entity** playing multiple roles requires **separate trusted-list appearances**. Trusted Lists are **provided in both XML and JSON format**.
- **Verifier burden:** Wallets/RPs must **resolve identity across different lists**. Possible **trust drift**.
- **Domestic gaps:** PID / PuB-EAA / Wallet Solutions trusted lists are **hosted at EC**; Member States may still implement **other national approaches**.

</div>

<div class="why-split-right">

![diagram](../trust-management-eudi-wallet/diagrams/d01-why-it-matters.svg)

</div>

</div>

---

- **Design pressure (summary):** the same actor can sit on **several trusted lists** and formats (**duplication** of checks); **verifiers** must correlate **many list and status lookups** plus **registration artefacts**; **WSCD** assurance is bounded (hardware limits what non-repudiation can claim); **registration** is a **graph** (MS vs EC roles, notifications vs full registration), not one hop to a single TL.  
- **Key tension:** many **independent trust surfaces** at presentation and issuance time, not one hierarchical metadata graph.

---

## Part 2 — Responsibility matrix (condensed)

Mirror of ARF / WP4-style view (who registers whom, who publishes which TL / LoTE):

| Role | Registration | TL / LoTE publication | Notes |
|------|----------------|----------------------|--------|
| PID Provider | MS registrar | **EC** EU PID TL | MS TLP not compiler for EU PID TL |
| EAA / QEAA | MS registrar | MS national TLs; **PuB-EAA** via **EC** TL | Several list “surfaces” |
| Wallet Provider | notification MS→EC | **EC** wallet-provider TL | Operational evaluation at EC side |
| WRP / WRPAC / WRPRC | registrar vs notification | mix of **MS** APIs + **EC** LoTE | RP registration API (TS5 family) |

---

## Part 2 — Trusted lists: singularities & concerns

- **One legal entity, multiple roles** ⇒ **multiple TL rows / appearances** — duplicated validation work.  
- **JSON + XML** artefacts for the same semantic ⇒ parser / policy duplication risk.  
- **Verifier burden:** one relying party may need **several lists, status services, and registration-backed certs** resolved together before policy is clear.  
- **Trust drift:** different **publication cycles**, cache TTLs, and revocation channels.

---

## Part 2 — Domestic gap & Italian choice

- **EC-hosted lists** (PID, Pub-EAA, Wallet Provider, WRPAC, …) **do not** map 1:1 onto **national-only** trust needs: Member States remain free to operate **additional** national infrastructures.  
- **Italian approach (this talk’s framing):** keep **OpenID Federation** as the **national, JWT-first trust plane** for wallet ecosystem participants, while **EUDIW ARF / TL obligations** are satisfied where mandated (X.509 access certs, EC lists, registrar APIs) — **avoid forcing one technology to emulate the other**.  
- **Implication:** full “harmonisation” into a single mechanism is **not** pursued; **interworking** and **clear client signalling** matter more.

---

## Part 2 — RP Registration API & dual client identifiers

- **Registrar / RP registration:** EUDIW ARF expects machine-readable RP registration and status (national **Registrar** + **ARF TS5**-style APIs — see ARF documentation).  
- **Presentation signalling** (national **remote presentation** flow): wallets support **`client_id_prefixes_supported`**: **`openid_federation`** vs **`x509_hash`**.  
  - **`openid_federation:`** prefix ⇒ trust chain / entity configuration **`sub`** must match.  
  - **`x509_hash:`** prefix ⇒ hash of RP TLS / request **`x5c`** must match embedded hash.  
- **Why it matters:** RPs can **standardise on X.509** presentation to **align verifier code** closer to pure EUDIW X.509 paths, while federation-native RPs keep **`openid_federation:`** metadata resolution.

---

## Part 3 — Cost lens: multiplicity vs federation chain

- **EUDIW path:** presentation may touch **TLS / access cert**, **OCSP/CRL**, **one or more registration certificates**, **several status lists / registry APIs**, **discovery** — **five-ish trust surfaces** before app logic.  
- **OpenID Federation path:** one **trust chain** of signed statements + optional trust marks + historical JWKS + (in IT-Wallet) **subordinate events** — fewer *kinds* of artefacts, still non-trivial operationally.  
- **Critique:** duplicated **revocation / freshness** semantics across X.509 and JWT worlds if both are always evaluated.

---

## Part 3 — Two trust-evaluation approaches, one ecosystem

- **History:** at IT-Wallet kick-off, **OpenID Federation** was the more **mature, implementable** horizontal trust layer for a **national** federation.  
- **Today:** Federation **1.0** track is comparatively **stable**; ARF / TS / LoTE still **move quickly** — reasonable to **integrate European profile pieces where legally required**, without collapsing national federation design.  
- **Strategy:** **incremental convergence** on outputs (what verifiers can prove) rather than forcing one protocol stack everywhere.

---

## Part 3 — Participant costs (everyone publishes JWT metadata)

- **Every federation entity** exposes **`/.well-known/openid-federation`** as **`application/entity-statement+jwt`**, signed, with **`jwks`** (and national rules on **`x5c`** usage) — **IT-Wallet** trust model.  
- **Mitigation for RPs:** choose **`x509_hash`** presentation where acceptable to **reuse X.509-heavy verifier patterns** from EUDIW discussions and **trim live federation fetches** on the hot path (still subject to national profile rules).

---

## Part 4 — Evolution: onboarding & “federation-wide registration”

- **Today:** parts of onboarding lean on **custom / national APIs** and registries (not a single OIDF profile).  
- **Possible direction (idea):** analogous to **OIDC Dynamic Client Registration**, a **federation-scoped registration draft** could register an entity **with the federation authority**, not with a single OP — *discussion for standards*, not a commitment.

---

## Part 4 — X.509 provisioning & ACME

- **Current state:** national **access / federation entity X.509** processes are partly **bespoke** compared with commodity ACME automation.  
- **IETF direction:** [draft-ietf-acme-openid-federation](https://datatracker.ietf.org/doc/draft-ietf-acme-openid-federation/) — bind ACME issuance to federation entity identifiers to **reuse ACME clients** instead of one-off custom enrollment APIs (*hypothesis / future work*).

---

## Part 4 — Wallet Federation draft & trust proxies

- **`OID-FED-WALLET` remains a draft** — Italy intends to **harden practice first**, feeding evidence into standardisation rather than rushing optional features.  
- **No appetite (today) for “trust proxies”** that would call Federation APIs to **re-evaluate foreign TLs / revocations** on behalf of wallets: risks include **privacy** (who is probed), **SPoF**, and **trust drift** when proxy caches diverge from wallet-local policy / TTLs.

---

## References (bookmark)

| Topic | URL |
|------|-----|
| OpenID Federation 1.0 (ex. draft 46 cited in docs) | https://openid.net/specs/openid-federation-1_0-46.html |
| Federation Wallet Architectures | https://openid.net/specs/openid-federation-wallet-1_0.html |
| Subordinate Events | https://openid.net/specs/openid-federation-subordinate-events-1_0.html |
| Extended Subordinate Listing draft-01 | https://openid.net/specs/openid-federation-extended-listing-1_0-01.html |
| IT-Wallet specifications (repository) | https://github.com/italia/eidas-it-wallet-docs |
| ACME + OpenID Federation (IETF draft) | https://datatracker.ietf.org/doc/draft-ietf-acme-openid-federation/ |

---

<!-- _class: lead lead-blue thank-you-slide -->
# Thank you

**Questions?**

