# EDS conversion log — poptop

## Locked block names (owner-confirmed 2026-11-14)
| Unit | Kind | Tier | Used on | Notes |
|---|---|---|---|---|
| hero | block (bespoke) | template-slotted | home | bg media + animated headline words (CSS, reduced-motion safe) |
| page-hero | block | template-slotted | about, contact, faq, inspiration, partners | eyebrow + H1 + lede + image |
| cards | block (collection) | reconstructive | home, about, inspiration, partners | variants: overlay (home events), image (inspiration gallery), numbered (about services, home how-it-works), compact (partners) |
| columns | block (collection) | reconstructive | about (origin, events-we-serve), contact (info) | |
| quote | block (collection) | template-slotted | about (review) | |
| form | block | reconstructive | contact, home closing CTA | field rows authored; submits to Formspree `xnjrkdnj` (config row); variant compact on home |
| video | block via auto-block | — | inspiration | authored as a root-relative mp4 link (D1, #161); buildAutoBlocks wraps it |
| cta | default content | — | home, about, faq, inspiration, partners | Section Metadata `style: cta`; button = `<strong><a>` |
| faq | default content | — | faq | Section Metadata `style: faq`; h3 + p pairs |
| header / footer | chrome | — | all | `/nav`, `/footer` documents, `Robots: noindex` |

Section heads (eyebrow/H2/lede above a grid) are default content before the block (ENCODE: section heads).
Card variant budget: 4 (D6/D9 ceiling).

## Triage updates (about, 2026-11-14)
- events-we-serve → default content, style `list` (heading + plain list; no structure a block adds).
- booking band on about is light → style `cta-light`; faq / inspiration / partners use dark `cta`.
- D1 advisories justified: `page-hero` = bespoke full-bleed photo hero with a three-size headline;
  `cards numbered` = repeating units (3 tiles); `quote` = Block Collection quote pattern (D11).
- No favicon on the source (`/favicon.ico` 404, no `<link rel=icon>`): boilerplate icon ships until the owner supplies one.

## Triage updates (remaining pages, 2026-11-14)
- contact: info is default content beside the `form` block (no `columns`: D2 forbids a block inside a block).
- faq: Q/A pairs are a `faq` block (D5: one row per Q/A), not a section style.
- home closing section: default content + `form compact` in a `cta-split` section; photo badge = bold text in the photo paragraph.
- home event-card and closing photos were hotlinked from static.wixstatic.com: downloaded at 2x and hosted in DA.
- Formspree submission field names now equal the authored labels; two contact fields changed name
  ("Referral Source" → "How did you hear about Poptop?", "About Your Event" → "Tell us about your event").
- Not carried over (adjust when live): inspiration CTA's decorative "★ ★ ★"; marquee scrolls one copy (not a seamless loop).
