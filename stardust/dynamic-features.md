# Dynamic features — poptop

## Listings contract
none (no listing blocks; 6 static pages)

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | booking-form | Booking inquiry form (name, email, phone, event type/date, guests, referral, message) posting to Formspree `xnjrkdnj` | F | /contact | embed-passthrough | block | self | pending | form service kept as-is; fields authored as block rows, form id as config row | owner: Formspree account stays the endpoint | contact/index.html:455-458 `formspree('initForm', { formElement: '#booking-form', formId: 'xnjrkdnj' })` |
| 2 | cta-form | Homepage closing-CTA inquiry form, same Formspree id | F | / | embed-passthrough | block | self | pending | reuses `form` block (compact variant) | — | index.html:300-303 `#cta-form` |
| 3 | nav-toggle | Mobile nav open/close | X | all | rebuild-native | runtime | self | pending | boilerplate header block (CSS checkbox in source) | — | `.nav-toggle`, `.nav-toggle-label` in main.css |
| 4 | hero-words | Animated hero headline words | X | / | rebuild-native | block | self | pending | CSS-only in hero block, honours prefers-reduced-motion | — | `.hero-word--a/b/c` in main.css |
| 5 | process-video | Process mp4 | V | /inspiration | rebuild-native | block | self | pending | mp4 via da-media-upload (#161), root-relative, poster as authored img | — | inspiration/index.html:419 `/assets/images/process00000000.mp4` |
| 6 | json-ld | Organization/LocalBusiness structured data | X | all | static-snapshot | content | self | pending | carried in page metadata per deploy | — | `<script type="application/ld+json">` on every page |

## Decision batch
none — every row is `self`. The forms collect contact details only (not `regulated-pii`), so the existing Formspree endpoint is wired as-is.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
