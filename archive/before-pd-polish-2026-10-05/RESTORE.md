# Before PD polish — October 5, 2026

This folder holds the original version of every file that was changed in the
"product designer" polish pass, in the same folder layout as the site.

## Undo everything
Copy everything in this folder (except this RESTORE.md) back into `site/`,
replacing the files there. Then delete the files the pass added:

- `site/pd-polish.css`
- `site/assets/fonts/` (inter-*.woff and LICENSE-Inter.txt)

Or just ask Claude: "restore the before-pd-polish backup".

## Undo one change
Each change is listed below with the files it touched. Copy only those files back.

| # | Change | Files |
|---|--------|-------|
| 1 | CMUsed "card at a glance": labels stack under the card on phones | hci/cmused/cmused.css |
| 2 | About timeline on phones: fade cue, current chapter scrolls into view, opaque sticky bar | about/about.css, about/about.js |
| 3 | Fonts: DM Mono gets a monospace fallback; "SF Pro" resolves to bundled Inter on Windows/Android | pd-polish.css (new), assets/fonts (new), every CSS file with a DM Mono label |
| 4 | Tiny labels raised: 7–8px → 10px, 9–10px → 11px (DM Mono labels only) | the same CSS files as #3 |
| 5 | Header nearly opaque, so titles no longer ghost through | pd-polish.css |
| 6 | Resume page removed (resume/index.html now redirects home; route entries removed) | resume/index.html, app.js, menu.js, route-entry.js |
| 7 | "ARCH / PD / PM" spelled out as Architecture / Product design / Leadership | all page index.html files, menu.js, category.js, project/project.js, walk-gallery.js, home-arrival.js |
| 8 | Shorter page covers on Product design, Leadership, Architecture, About | pd-polish.css |
| 9 | "At a glance" summary on CMUsed and OpenGym | hci/cmused/index.html, hci/opengym/index.html, hci/cmused/cmused.css |
| 10 | CMUsed: removed "Most people only look / Conversations stall / New supply is thin" and the 0-listings tiles | hci/cmused/index.html, hci/cmused/cmused.js |
| 11 | Home ME section: "Beyond the work" + "What I do" replaced by "What I'm looking for"; later cards renumbered | index.html, me-portal.css |
| 12 | MY ___? skills: product design tools first | my-picker.js |
| 13 | Unused MetaBalls.css no longer loaded on the home page | index.html |
| 14 | OpenGym: new screenshots and redesigned-flow section (if done) | hci/opengym/index.html, assets/pd/ |

Every page also got one new line at the end of `<head>` loading `pd-polish.css`.
