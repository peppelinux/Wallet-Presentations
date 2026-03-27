---
marp: true
theme: workshop-barcelona
paginate: true
footer: 'Session 3: ITU Workshop on &quot;Trustable and Interoperable Digital Identities for Human and Agentic AI&quot;, (Geneva, Switzerland, 30–31 March 2026)'
style: |
  /* Overrides on top of ./workshop-barcelona.css (Barcelona IT Workshop ODP palette) */
  /* Pin deck footer to bottom of every slide (extra bottom padding so content clears it) */
  section {
    position: relative;
    box-sizing: border-box;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: calc(56px + 2.75em);
  }
  section > footer {
    position: absolute;
    left: 56px;
    right: 56px;
    bottom: 56px;
    margin: 0;
    font-size: 0.55em;
    line-height: 1.25;
    z-index: 0;
  }
  /* Content paints above footer; white patch keeps type readable over footer line */
  section > *:not(footer) {
    position: relative;
    z-index: 1;
  }
  section:not(.lead-blue) > *:not(footer) {
    background: rgba(255, 255, 255, 0.98);
    padding: 0.2em 0.45em;
    border-radius: 3px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
  /* Title slide only (Thank-you slide stays default .lead) */
  section.lead.lead-blue {
    background: #0056ab;
    background-image: none;
    color: #fff;
    text-align: left;
    justify-content: flex-start;
    align-items: stretch;
  }
  section.lead.lead-blue :is(h1, marp-h1) {
    background: none;
    color: #fff;
    border: none;
    padding: 0;
    margin: 0.85em 0 0.4em 0;
    box-shadow: none;
    text-align: left;
  }
  section.lead.lead-blue p,
  section.lead.lead-blue strong { color: rgba(255, 255, 255, 0.95); }
  section.lead.lead-blue strong { color: #fff; font-weight: 600; }
  section.lead.lead-blue footer { color: rgba(255, 255, 255, 0.78); }
  section.lead.lead-blue::after { color: rgba(255, 255, 255, 0.75); }
  section.lead.lead-blue p.lead-meta { font-size: 0.78em; line-height: 1.35; margin: 0.85em 0 0; max-width: 100%; opacity: 0.95; text-align: left; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .small { font-size: 0.85em; }
  section img[alt="diagram"] { max-height: 380px; width: auto; max-width: 100%; margin: 0.25em auto; display: block; }
  section.compact-takeaways { font-size: 20px; }
  section.compact-takeaways li { margin: 0.1em 0; }
  section.compact-takeaways table { font-size: 0.78em; }
  section.tl-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 1.25rem;
    align-items: start;
  }
  section.tl-split > h2 { grid-column: 1 / -1; grid-row: 1; margin-bottom: 0.2em; }
  section.tl-split > table { grid-column: 1; grid-row: 2; margin: 0; align-self: start; }
  section.tl-split > p { grid-column: 2; grid-row: 2; margin: 0; align-self: center; }
  section.tl-split img[alt="diagram"] { max-height: 340px; margin: 0 auto; }
  section.compact-graph h2 { margin: 0 0 0.2em 0; font-size: 1.35em; line-height: 1.2; }
  section.compact-graph ul { margin: 0.15em 0; padding-left: 1.1em; font-size: 0.88em; line-height: 1.28; }
  section.compact-graph li { margin: 0.06em 0; }
  section.compact-graph li::marker { font-size: 0.95em; }
  section.compact-graph img[alt="diagram"] { max-height: 240px; margin: 0.2em auto 0; }
  /* Trust topology: two columns — generic patterns (left) · eIDAS distributed (right) */
  section.topology-slide h2 { margin: 0 0 0.35em 0; font-size: 1.15em; line-height: 1.15; }
  section.topology-slide .topology-cols {
    display: grid;
    grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
    gap: 0.55rem 0.9rem;
    align-items: start;
    width: 100%;
  }
  section.topology-slide .topology-cols > div { min-width: 0; text-align: center; }
  section.topology-slide .topology-col-eidas {
    align-self: start;
    padding-top: 0;
    box-sizing: border-box;
  }
  section.topology-slide .topology-col-eidas > p {
    margin: 0;
  }
  section.topology-slide .topology-cols img[alt="diagram"] {
    max-height: clamp(370px, 76vh, 560px);
    width: 100%;
    max-width: 100%;
    height: auto;
    object-fit: contain;
    object-position: top center;
    margin: 0 auto;
    display: block;
  }
  section.topology-slide .topology-col-eidas img[alt="diagram"] {
    margin-top: 0 !important;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: auto;
  }
  section.wscd-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 1.2rem;
    align-items: start;
  }
  section.wscd-split > h2 { grid-column: 1 / -1; grid-row: 1; margin: 0 0 0.2em 0; font-size: 1.35em; line-height: 1.2; text-align: left; }
  section.wscd-split > ul { grid-column: 1; grid-row: 2; margin: 0; padding-left: 1.1em; font-size: 0.88em; line-height: 1.28; align-self: start; }
  section.wscd-split > ul li { margin: 0.06em 0; }
  section.wscd-split > ul li::marker { font-size: 0.95em; }
  section.wscd-split > p { grid-column: 2; grid-row: 2; margin: 0; align-self: center; }
  section.wscd-split img[alt="diagram"] { max-height: 360px; margin: 0 auto; }
  section.why-matters > ul { margin: 0.1em 0 0; }
  section.why-matters > p { margin: 0; }
  section.why-matters img[alt="diagram"] { margin: 0.05em auto 0; max-height: 450px; width: auto; }
  section.agenda p.agenda-tagline {
    text-align: center;
    margin: 0.7em 0 0 0;
    font-size: 0.98em;
    line-height: 1.35;
    font-weight: 600;
  }
---

<!-- _class: lead lead-blue -->
# Trust management in the EUDI Wallet ecosystem

**~12 minute overview with Giuseppe De Marco**, _Technical Project Manager - Dipartimento per la trasformazione digitale, Presidency of the Council of Ministers of Italy_

---

<!-- _class: agenda -->
## eIDAS Trust Infrastructure Topics

1. **Why** trust management is a cross-cutting concern  
2. **Governance**: Member States, Commission, trusted lists, sector schemes — **plus eIDAS / PKI continuity**  
3. **Enrollment**: registrars, certificates, transparency  
4. **Runtime**: issuance, presentation, user-visible assurance  
5. **Assurance & lifecycle**: certification, Trust Mark, revocation  

<p class="agenda-tagline"><i>Trust is about <strong>risk</strong> and <strong>cost reduction</strong>, common infrastructure works when it <strong>scales</strong>.</i></p>

---

<!-- _class: topology-slide -->
## Trust infrastructure topologies

<div class="topology-cols">
<div>

![diagram](diagrams/d13-trust-topologies-patterns.svg)

</div>
<div class="topology-col-eidas">

![diagram](diagrams/d14-eidas-distributed-trust.svg)

</div>
</div>

---

## eIDAS Trust Infrastructure Responsibilities matrix

Who **registers** vs who **publishes** Trusted Lists (TL) — wallet consumption depends on both.

| Entity type | Registration | TL compilation (EC / MS TLP) | MS TLP role |
|-------------|----------------|------------------------------|-------------|
| **PID Provider** | MS **Registrar** | **European Commission** (EU PID TL) | None |
| **Attestation Provider** | MS **Registrar** | **MS TLP**: QTSP TL (QEAA); national TL (non-qualified EAA); **PuB-EAA** → **EC** TL | Compiles / signs / publishes national TLs; notifies EC |
| **Wallet-Relying Party** | MS **Registrar** | **N/A** (WRPAC + **Registry**) | None |
| **Wallet Provider** | *Notification only* (MS → EC) | **European Commission** | N/A (pilot) |
| **WRPAC Provider** | *Notification only* (MS → EC) | **European Commission** | N/A (pilot) |
| **WRPRC Provider** | *Notification only* (MS → EC) | **European Commission** | N/A (pilot) |

---

<!-- _class: why-matters -->
## Why it matters

- Many **independent actors**, no EU-wide single “login authority”; trust is **registration + crypto + published anchors + supervision**. Cross-border programmes agree **shared rulebooks and semantics** inside the same patterns. 

![diagram](diagrams/d01-why-it-matters.svg)

---

<!-- _class: compact-takeaways -->
## Specification counts vs trust requirements (order of magnitude)

**SDO** = *Standards Developing Organisation* (ETSI, ISO/IEC, IETF, W3C, CEN, …). **Specification** = a named standard, RFC, or technical spec document — not a legal act and not an ARF “Topic …” link.

| What we count | Specifications |
| --- | ---: |
| **ARF main document** — each **own row** in the *References* table for a standard or protocol (ISO, ETSI, RFC, W3C, OIDF, …); **excludes** EU acts/CIRs and Topic links | **44** |
| **`docs/technical-specifications/`** — EC Wallet TS1–TS11 | **11** |
| **Public STS roadmap** (GitHub tracker; see `docs/technical-specifications/README.md`) | **~200** items under watch; a smaller **essential** subset for the Wallet |

---

## Wallet Unit at the centre

- **Wallet Solution** = Instance + **WSCA/WSCD** + keystores; **WUA / WIA** prove the wallet to **issuers** before PID or attestation delivery.

![diagram](diagrams/d02-wallet-unit.svg)

---

<!-- _class: tl-split -->
## Trusted lists and the Commission

| Layer | Role |
|-------|------|
| **Member States** | Notify entities; national registries and approval policies. |
| **Commission** | Specs, validation, **Trusted Lists**, **LoTL**, OJEU. |
| **Publication** | Signed/sealed lists → **trust anchors** for verifiers. |

![diagram](diagrams/d03-trusted-lists.svg)

---

<!-- _class: wscd-split -->
## WSCD assurance vs “another Trusted List”

- **Lists name Wallet Providers**, not each **WSCD**: trust via **WUA** + provider anchor (**§6.6.2.3.1**, **TS3**); WUA states **WSCA/WSCD** (or keystore) facts.
- **WUA** = signed **certification**, **keys**, and (PID) **binding** of PID material to that WSCD (**§6.6.2.3.2–3.3**). **LoA High** → PID Provider **checks** those claims — not a **LoT row per chip**.
- **PID Providers**: supported Wallet LoTEs only. **Attestation Providers**: **every** certified wallet (**§6.6.2.3.1**); **no** central WSCD vendor list.

![diagram](diagrams/d04-wscd-assurance.svg)

---

<!-- _class: compact-graph -->
## Pre-existing trust frameworks

- **Legal**: **EUDI** amends **eIDAS**; **qualified artefact paths** still use **QTSPs**, **qualified certs**, **EU trusted lists / TSP**.
- **Technical** (**§6.1**): **X.509** for PID, QEAA, PuB-EAA, access/registration certs; wallet lists follow **TS 119 612 / LoTL** (same family as trust-service lists).
- **Deployment**: Member States may use **several CAs** or **reuse** national PKI / practice as **Access CA** / **Registrar**.
- **Non-qualified EAA** can follow **other trust models** (not only EU-wide PKI lists).

![diagram](diagrams/d05-eidas-continuity.svg)

---

<!-- _class: compact-graph -->
## Registration & “who may do what”

- **MS policy** → **Registrar** → **registry**; optional **registration certificates** encode **scopes** (attributes, use, attestation types).

![diagram](diagrams/d06-registration.svg)

---

## Sector bodies & attestation schemes

- **Attestation Scheme Providers** publish **Rulebooks** (+ **machine-readable schemes** in the catalogue). Besides the **Commission** (e.g. PID, mDL), ARF §5.4.2 allows **public administration, sectoral or cross-border organisations**—so e.g. education/health/mobility communities define **shared semantics** and **type-specific trust/presentation rules** without duplicating formats.
- The **Commission** still **operates the catalogues** (attributes + schemes, **TS11**); **Trusted Lists** remain the anchor for **who** may issue—**catalogue listing does not force acceptance** or automatic **cross-border recognition** (§5.5.3).
- **PuB-EAA** ties issuance to an **Authentic Source** (national/sector **data root**); the **responsible public-sector body** and **conformity** rules apply as in the Regulation / ARF §3.7.

![diagram](diagrams/d07-sector-schemes.svg)

---

## Certificates and transparency

- **Access certs** authenticate protocol endpoints; **registration certs** prove **registered identity & entitlements** (where issued). **SCT** on access certs (**Topic 55**).

![diagram](diagrams/d08-certificates-ct.svg)

---

## Trust when **issuing** credentials

- **Before request**: issuer **access cert**, **registration** / **Registrar**, **entitlement** to credential type. **After receipt**: verify **signature** (lists + law for qualified; **Rulebook** for non-qualified EAA).

![diagram](diagrams/d09-issuing.svg)

---

## Trust when **presenting** to relying parties

- **RPI** proves itself with **access cert**; wallet trusts **RP Access CA** lists. **RP** verifies presented credentials like the wallet. User can compare **request vs Registrar** (**Topics 44, 6**).

![diagram](diagrams/d10-presenting.svg)

---

## Certification, Trust Mark, supervision

- **NAB → CAB** accreditation; **CAB** certifies **wallet solutions** and audits **QTSPs**. **Supervisory bodies** oversee ecosystem actors. **Trust Mark** links UI to **Commission** certification info.

![diagram](diagrams/d11-certification.svg)

---

## Lifecycle: suspension, cancellation, revocation

- **List updates**, **cert revocation**, **WUA revocation** (**Topic 38**). PID provider checks **who may request** wallet revocation (**WURevocation_12**).

![diagram](diagrams/d12-lifecycle.svg)


---

## Wallet-unit discovery — cost, effort, timing

From a **Wallet Instance** perspective (*policy discovery & trust evaluation*, WP4 `eudi-wallet-trust-and-entitlement-discovery.md`):

| Aspect | What drives it |
|--------|----------------|
| **Network / latency** | **LoTL** → one or more **TSL fetches**; **OCSP/CRL** for WRPAC; optional **Registry** API (if no WRPRC in request); **WRPRC status-list** HTTP; issuance path repeats TL + revocation for **issuer** WRPAC/WRPRC. |
| **Steady-state vs cold** | **Cached TSL** until `NextUpdate` (TS 119 612 §5.3.15) lowers amortized cost; **first run / expired cache** = full chain; **offline**: cached-only or **reject** (doc §7.2). |
| **Implementation effort** | X.509 path validation + **SCT** checks; **JWT/CWT** WRPRC verification against **WRPRC Provider** TL; **entitlement** parsing & **RPRC_21** attribute allow-list; **multi-register** aggregation & conflict rules (§2.4); UX for **uncovered** attributes & **user default policy** (§4.3). |
| **User-perceived timing** | All trust steps run **before / during** consent (**RPA_07**); slow or failing Registry/TLP **blocks or degrades** to user-only policy (§4.3.2). |

**Order-of-magnitude (implementation planning, not normative):** expect **several sequential network dependencies** on the “happy path”; design **parallel fetch** where independent (e.g. OCSP while parsing TSL); **+1 round-trip** when WRPRC must be **pulled from Registry**; **multi-sector** RPs add **register queries** per applicable register.

---

## Complexity evaluation (wallet-side discovery)

| Factor | Lower complexity | Higher complexity |
|--------|------------------|-------------------|
| **Counterparty** | RP presents **WRPRC in-band**; single MS register | **No WRPRC** → Registry + possible **sectoral / cross-border** registers |
| **Trust material** | Cached **LoTL/TSL**; stapled OCSP | Cold cache; **CRL** only; **pivot LoTL** / OJEU rotation |
| **Policy** | All requested attrs **in WRPRC** | **Uncovered** attrs → **user-autonomous** flow + logging (**RPA_10a**) |
| **Cross-border** | Same MS as wallet’s cached TSL set | **Foreign TSL** + possibly foreign Registry endpoints |
| **Issuance vs presentation** | Reuse one **TL validation stack** | **Two** flows (§2.1 vs §2.2) with different metadata surfaces |

**Engineering takeaway:** treat discovery as a **state machine** with **branching** (WRPRC present / Registry / multi-WRPRC) and **explicit degradation** (offline, WRPRC unavailable); complexity scales with **number of registers** and **strictness** of entitlement checks, not only PKCS#7/COSE crypto.

---

<!-- _class: compact-takeaways -->
## Takeaways

- Trust is **layered**: **policy + registration + lists + certificates + transparency + UI**. No single operator — **common formats**, **notification**, and **verification rules** bind the EU perimeter.
- **ARF Annex 2 HLRs “about trust”:** repo extract `docs/development-issues/trusted-list-registration-trust-evaluation-matrix.md` — **133 unique** requirement IDs (trusted lists, registration, trust evaluation; matrix cites **ARF v2.7.3** Annex 2).
- **Those 133 IDs, grouped by primary purpose** (each ID counted once; briefing partition — see matrix for the authoritative list):

| Purpose | # HLRs |
|---------|-------:|
| **Credential signature verification** (PID / QEAA / PuB-EAA / EAA — Trusted List or Rulebook anchors) | **8** |
| **Party authentication & evidence** (issuer & RP **access** / **registration** certs, ACA / RP-CA **Trusted Lists**, **SCT** on access certs) | **17** |
| **Wallet Provider notification & WUA** (trust anchors for WUA, lifecycle incl. WUA revocation / PID-driven checks) | **11** |
| **Access CA policy & Certificate Transparency** (common CP, logging, monitors, SCT issuance, CA suspension) | **13** |
| **Member State registration & vetting** (registries, APIs, confidence level, suspension policies, access-cert profile) | **23** |
| **Registration certificates** (Commission CP & TS, contents, binding to RP instances, wallet **RPRC** checks) | **26** |
| **Intermediaries** (register, evidence, presentation request shaping) | **7** |
| **Commission: notify, compile, publish Trusted Lists** (GenNot / TLPub + per–participant-type notification & list formats) | **28** |
| **Total** | **133** |
