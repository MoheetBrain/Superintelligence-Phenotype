# Content review: Hamiltonian Recovery website

Reviewed 19 November 2026. Covers `src/content/site.ts` (home page copy and company details) and `src/content/legal.ts` (Privacy Policy and Website Terms). `src/content/types.ts` was not changed; no schema change is needed.

## 1. Company verification

### What was checked

| Source | Retrieved | Result |
| --- | --- | --- |
| Companies House overview, <https://find-and-update.company-information.service.gov.uk/company/17347944> | 19 Nov 2026, about 13:17 UTC (HTTP 200) | Name HAMILTONIAN LABS LTD; company number 17347944; status Active; type "Private limited Company"; incorporated 20 July 2026; registered office "10 Westway, Room 3.28, London, Acton, United Kingdom, W12 0DD"; SIC 62012, 72110, 72190, 74909. First accounts due 20 April 2028; first confirmation statement due 2 August 2027. |
| Companies House filing history (same company) | 19 Nov 2026 | One filing: 20 Jul 2026, type NEWINC (incorporation, statement of capital GBP 1, model articles adopted), 11 pages. Its document ID matches the PDF below. |
| Incorporation document (PDF), filing-history document `MzUzMzM3MTY5M2FkaXF6a2N4` | 19 Nov 2026 | PDF 1.4, 11 pages, 291,586 bytes, SHA-256 `8edcc99fc75592ef8f5cb21e8536c9f32533e551bff7d260ad1d91c3251b14aa`. Text extracted with pypdf 7.1.1 in an isolated virtual environment. |

### Result: jurisdiction confirmed as England and Wales

- **Page 1, Certificate of Incorporation** (Registrar of Companies for England and Wales, given at Companies House, Cardiff, 20 July 2026). It certifies that HAMILTONIAN LABS LTD is incorporated under the Companies Act 2006 as a private company limited by shares, and that "the situation of its registered office is in England and Wales".
- **Page 2, form IN01**: "Situation of Registered Office: England and Wales". Company type: private company limited by shares.

`company.jurisdiction` therefore stays as `'England and Wales'`. The Website Terms choose the law and courts of England and Wales.

### Registered office

The register shows a single comma-joined string. `registeredOffice` is `['10 Westway, Room 3.28', 'London, Acton', 'United Kingdom', 'W12 0DD']`:

- joined with `', '`, it reproduces the register entry character for character;
- the grouping follows the address lines on form IN01 (`10 WESTWAY, ROOM 3.28` / `LONDON, ACTON` / `UNITED KINGDOM W12 0DD`).

The public page does not show how the address is split into fields (premises, line 1, locality and so on). That split is available only through the authenticated Companies House API. **Render the address joined with `', '` (or one array item per line) and never reorder it.**

`companyType` is "Private limited company", which is the register's wording in normal sentence case. The certificate's fuller form is "private company limited by shares".

Personal details of officers and subscribers in the IN01 were not copied into the site or this document.

## 2. Claims checklist

| Rule | Status | How it is met |
| --- | --- | --- |
| No guarantee of recovery | Met | The word "guarantee" appears only in the Terms, in "No guarantee of outcome" and "We do not guarantee…". The hero note describes a process ("Each finding is checked…"), not an outcome. |
| No claim that every customer has recoverable money | Met | The copy says items "can remain unresolved". The Terms say the examples "are not statements that any particular organisation has recoverable amounts". The contact heading is phrased as a question. |
| No implied existing recoveries, clients, case studies, history, team, accountants or auditors | Met | The About section says "Hamiltonian Recovery is a new service." The sectors disclaimer says they "do not describe existing client relationships". "We work alongside established recovery auditors" became "is designed to work alongside". "Who we work with" became "Who it is for". The Privacy Policy refers to "professional advisers" without naming accountants or auditors. The site has no testimonials, figures, logos or people. |
| No "industry-leading" or superior detection claims | Met | No comparative or superlative claims. "Independent", "evidence-led" and "AI-assisted" describe method only. |
| No VAT number, FCA authorisation, ISO 27001, SOC 2, penetration testing, audit accreditation or ICO registration | Met | None are stated. The Security section says only "appropriate technical and organisational measures". The ICO is mentioned only as the regulator people can complain to. |
| No unconditional fee percentages | Met | The copy contains no percentages or currency amounts. |
| No promise that every engagement is free or contingency-only | Met | The required sentence is present verbatim: "Contingency-fee arrangements are available for suitable recovery engagements, subject to an agreed scope and contract." A new sentence adds that proof-of-value and specialist work "may be charged on a different basis". The Terms say fee references are "not a commitment to offer any particular arrangement". "Free of charge" refers only to use of the website. |
| Trading brand not presented as a separate company | Met | The site says "Hamiltonian Recovery is a service of Hamiltonian Labs Ltd" and, in About, the Privacy Policy and the Terms, "not a separate company". The Terms identify Hamiltonian Labs Ltd as the operator. |
| Names of prospective target companies must not appear | Met | A case-insensitive search of the whole working tree (excluding `node_modules` and `.git`) for each name in the brief found no matches. The names are deliberately not repeated in this document. |
| Required proposition wording | Met | The three pillars are verbatim: "Performance-aligned fees", "Independently verified findings", "Client-controlled recovery decisions". |
| Anomaly ≠ recovery distinction | Met | The callout says credits already recognised, claimed, scheduled for settlement or previously recovered are "not a new recovery". Step 03 removes anything already recognised, claimed or resolved. |
| Contact form explanation accurate | Met | The form text says it opens a pre-addressed email in the visitor's own email application, that nothing is sent until they send it, and that the site does not transmit or store what they type. The Privacy Policy and Terms say the same. |
| Required labels kept | Met | Kept unchanged: the headline "Recover money hidden in your supplier accounts.", the hero supporting copy, "Request a Confidential Recovery Review", "How It Works", "Request a Confidential Review" and the substance of the four steps. |

## 3. Notable copy changes in `site.ts`

- **What we recover:** the card titles now match the service's five categories: unapplied supplier credit notes; duplicate and incorrect payments; supplier rebates and contractual entitlements; post-acquisition reconciliation; supplier statements and outstanding credits. Vague phrasing was replaced, such as "reversals that were never recognised".
- **Step 04 and fees:** "Fees follow … verified realised outcomes" implied every fee was outcome-based. It now says fees are as set out in the contract and are linked to verified, realised recoveries only "where so agreed".
- **Recovery-audit firms:** the copy no longer implies existing partnerships. "Audit-firm partnership" became "Recovery-audit partnership", so it is not mistaken for statutory audit.
- **About:** added registration in England and Wales, the statement that Hamiltonian Recovery is not a separate company, and a restrained mention of "AI-assisted analysis". The facts list now includes "Registered in" and "Registered office".
- **Consistency:** "your" is used throughout instead of "the customer's". The navigation CTA is in title case. Typographic apostrophes are used. The mailto subject now matches the form subject ("Confidential Recovery Review enquiry"). The meta description is shortened to 162 characters.

## 4. Legal documents in `legal.ts`

- **Privacy Policy (`/privacy/`)** covers:
  - the controller's identity and contact details;
  - scope, including a warning not to send confidential records, and that engagement data is governed by the engagement contract;
  - the data collected: enquiry emails and hosting request logs;
  - how the enquiry form works;
  - purposes and UK GDPR lawful bases: legitimate interests, steps before a contract, legal obligation;
  - what we do not do: no selling, no profiling, no solely automated decisions;
  - no cookies or tracking, and self-hosted fonts;
  - recipients: Vercel Inc., email providers, advisers, authorities, a successor;
  - international transfers, with safeguards described generically;
  - retention as our policy: 24 months, six years, and hosting logs;
  - security, data subject rights, complaints (to us first, acknowledged within 30 days, and to the ICO at ico.org.uk), changes and contact.
- **Website Terms (`/terms/`)** cover:
  - who we are, and the relationship between the trading name and the company;
  - acceptable use;
  - information only: not financial, accounting, tax or legal advice, no offer, and any engagement requires a separate written contract that prevails;
  - no guarantee of outcome;
  - accuracy and availability;
  - intellectual property;
  - links to other websites;
  - enquiries by email;
  - liability, with carve-outs for liability that cannot be excluded by law;
  - privacy, governing law and exclusive jurisdiction of England and Wales, changes and contact.
- Both documents build the company number, registered office and email from the `company` object in `site.ts`, so there is one source of truth.

## 5. Residual items for the owner

1. **Pre-launch check: cookies and hosting on the production domain.** On 19 Nov 2026, `https://superintel.site/` was still served by the previous host through Cloudflare (`server: cloudflare`, with no Vercel headers). It set a `__cf_bm` bot-management cookie. The policy states the intended setup: Vercel hosting and no cookies. After DNS is switched to Vercel:
   - confirm the responses show `server: Vercel` and no `Set-Cookie` header;
   - do not enable Vercel Web Analytics, Speed Insights or the Vercel Toolbar on production;
   - make sure the frontend uses no `localStorage` or `sessionStorage`, and makes no third-party requests (fonts, scripts, images).

   If a Cloudflare proxy is kept, update "Information we collect", "Cookies and tracking" and "Who we share it with" to name Cloudflare, Inc. and describe the strictly necessary security cookie.
2. **Email providers.** The MX records for `hamiltonianlabs.co` point to Cloudflare Email Routing (`route1`–`route3.mx.cloudflare.net`, with a Cloudflare SPF include), which forwards to a mailbox provider that has not been identified. The policy refers generically to "the service providers that route, deliver and store email sent to our domain". Confirm both providers, and name them if you prefer.
3. **Retention periods.** These are stated as our policy: non-progressing enquiries kept for up to 24 months from last contact; engagement correspondence kept for up to six years after the engagement ends. Confirm that you will actually operate them, including deleting old enquiry emails.
4. **ICO data protection fee.** The site makes no claim of ICO registration. Check separately whether the company must pay the ICO data protection fee.
5. **Trading disclosures (Companies Act 2006 and the 2015 Trading Disclosures Regulations).** The website must show the registered name, company number, place of registration and registered office.
   - The data is in `company`. The frontend should show it in the footer of every page, including the legal pages.
   - Business emails should carry the same details, for example in the email signature.
6. **Domain.** The site's canonical origin is `https://superintel.site`, while the company website is `hamiltonianlabs.co`. A Finance Director may notice the mismatch. Consider serving the site from a `hamiltonianlabs.co` address; if you do, update `site.origin`.
7. **Company website.** `https://www.hamiltonianlabs.co/` responded (HTTP 200) on 19 Nov 2026, but its content was not reviewed. Make sure it does not contradict this site, for example by implying clients or results.
8. **Legal review.** The documents are proportionate to a static, brochure-style website. They are not a substitute for legal advice. Consider having a solicitor review them before any engagement documents are drafted.
9. **Hero supporting copy.** It was kept verbatim as instructed. It begins "Independent reconciliation technology helps businesses…". If the owner wants it to name the service directly, it could become "Our independent reconciliation technology…".
