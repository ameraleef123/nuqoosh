# Nuqush — Template Identity Matrix (30)

> Every template is a real identity: background system + glass intensity + palette + type pair + motion signature + section order.
> Every template is designed and QA'd **first** with `fixtures/no-experience.json`, then with `fixtures/full.json`.
> Per-template identity sheets are written in Phase 2 / Phase 5 (`design-system/nuqush/templates/<id>.md`) after running the skill's style search for that mood.

## Shared rules (apply to all 28)

- Empty sections are never rendered. Section order below lists the **maximum** set; the renderer drops any empty section without leaving a heading or gap.
- Phone number is omitted from the DOM when empty.
- Every template ships light **and** dark; the pair below marks which one is the *lean* (the mood the template was designed around).
- Glass intensity tiers map to `.glass-subtle` / `.glass` / `.glass-strong` (see MASTER.md → Glass tokens). A template may tune blur ±4px and alpha ±0.08 inside its own tier.
- Type pairs: Arabic display face + Arabic body face. Latin comes from the same families (all listed faces ship a Latin subset with matching vertical metrics), so mixed-script lines share one baseline.
- Motion signatures (all built on the six MASTER signatures; the signature only changes *character*, never *which* properties are animated):
  - **crisp** — expo.out, shorter (hero 450ms, reveal 300ms), orbs slow (36s)
  - **soft** — power1.out, longer (hero 650ms, reveal 400ms), orbs 28s
  - **drift** — orbs are the star: larger, 3 layers, 24s; hero 600ms
  - **editorial** — fades only, no orbs, no char split (word split instead)
  - **glow** — opacity pulses on accent halos (8–12s loop), hero 550ms
  - **rise** — everything enters from y:16, reveal 350ms, stagger 0.03

Section order variants (E = experience, only rendered when non-empty):
- **A (projects-first):** hero → projects → volunteering/activities → E → education → skills → links
- **B (study-first):** hero → education → projects → volunteering/activities → E → skills → links
- **C (skills-first):** hero → skills → projects → volunteering/activities → E → education → links

## Matrix

| # | id | Name | Mood (one line, the student's feeling) | Lean | Background system | Glass | Accent (light / dark) | Type pair (display / body) | Motion | Order | Free |
|---|----|------|----------------------------------------|------|-------------------|-------|------------------------|-----------------------------|--------|-------|------|
| 1 | saqee | صقيع | برد نظيف وواضح — Frost | light | ice-blue → white mesh, 2 pastel orbs (#CFE9FF, #E6F0FF) | strong | #1D5FBF / #8FC1FF | Cairo / IBM Plex Sans Arabic | crisp | A | ✓ |
| 2 | ballour | بلّور | لمعان متعدّد الألوان — Crystal | light | prismatic pastel mesh (lavender #C9B8FF, blush #F5A79E, honey #FFE7B8) | default | #4C3FD1 / #A99CFF | Almarai / IBM Plex Sans Arabic | drift | A | ✓ |
| 3 | nada | ندى | نقاط صباح خضراء — Dew | light | mint mesh (#CFF3E6, #E8FBF4) + tiny droplet dots | subtle | #0F7A5F / #5EEAD4 | Tajawal / Noto Sans Arabic | soft | B | |
| 4 | sarab | سراب | حرارة رمل بعيد — Mirage | light | warm sand → heat-shimmer horizontal gradient, 1 orb | subtle | #B8452F / #FF8A7A | Tajawal / Noto Sans Arabic | soft | A | |
| 5 | waraqa | ورقة | ورق وحبر، بلا ضجيج — Paper | light | kraft desk (#E9DFCB) + warm ivory sheets (#FDFAF3), grain, fold creases, no orbs; Lottie paper planes glide OVER the page | opaque (no blur — paper is not glass) | #B8452F / #F0A07A | Noto Naskh Arabic / IBM Plex Sans Arabic | editorial | B | ✓ |
| 6 | hams | همس | هادئ لدرجة الهمس — Whisper | light | very muted lilac-grey wash | subtle | #6B5FA8 / #B9AEE8 | Cairo (300/500) / Almarai | soft | C | |
| 7 | fajr | فجر | أوّل ضوء — Dawn | dark→light | vertical indigo (#1E1838) → peach horizon (#FFB88C) | strong | #FFB88C / #FFB88C | Cairo / IBM Plex Sans Arabic | rise | A | ✓ |
| 8 | shafaq | شفق | آخر ضوء بنفسجي — Twilight | dark | violet → magenta glow mesh (#3A2A6E, #7C3AED, #DB2777) | default | #E879F9 / #E879F9 | Cairo / Noto Sans Arabic | glow | A | |
| 9 | ghasaq | غسق | جمر تحت رماد — Dusk | dark | deep plum (#2A1029) + ember orange orb | default | #FB923C / #FB923C | Almarai / IBM Plex Sans Arabic | drift | B | |
| 10 | rathath | رذاذ | مطر خفيف على زجاج — Drizzle | light | cool grey-blue + fine dot grid | subtle | #2563EB / #93C5FD | IBM Plex Sans Arabic / IBM Plex Sans Arabic | crisp | C | |
| 11 | dabab | ضباب | طبقات بيضاء ناعمة — Fog | light | layered white-grey blur blobs, blur 20 | strong | #475569 / #CBD5E1 | Cairo / Almarai | soft | A | |
| 12 | zabad | زبد | رغوة بحر — Sea foam | light | aqua-white foam mesh (#D9FBF8, #F0FFFE), rounded 24px | default | #0E7490 / #67E8F9 | Tajawal / Noto Sans Arabic | drift | A | |
| 13 | lu'lu' | لؤلؤ | لمعة صدفة — Pearl | light | conic iridescent sheen (very low saturation) | strong | #7C6FBF / #C4B5FD | Noto Naskh Arabic / Almarai | glow | B | |
| 14 | aqeeq | عقيق | حجر أحمر بخطوط ذهب — Agate | dark | banded red-brown (#3B1212 → #7A2E1E) + gold hairlines | default | #F5B942 / #F5B942 | Amiri / Almarai | editorial | B | |
| 15 | fayrouz | فيروز | لون البتراء والبحر — Turquoise | light | turquoise + sand split (#2DD4BF, #F1E4C8) | default | #0F766E / #5EEAD4 | Noto Kufi Arabic / Noto Sans Arabic | rise | A | |
| 16 | yaqout | ياقوت | أحمر عميق فخم — Ruby | dark | garnet (#2B0A12) + crimson orb | strong | #FB7185 / #FB7185 | Amiri / IBM Plex Sans Arabic | glow | C | |
| 17 | kahraman | كهرمان | دفء ذهبي — Amber | dark | brown-black (#1C1208) + amber halo | default | #F5B942 / #F5B942 | Cairo / Almarai | glow | A | |
| 18 | marjan | مرجان | مرح دافئ — Coral | light | coral + cream mesh (#FFB4A8, #FFF4EC) | default | #B8452F / #FF8A7A | Readex Pro / Readex Pro | rise | A | |
| 19 | naseem | نسيم | هواء وفراغ — Breeze | light | sky-blue wash, lots of whitespace, 1 slow orb | subtle | #0369A1 / #7DD3FC | Cairo / IBM Plex Sans Arabic | soft | B | ✓ |
| 20 | zilal | ظلال | رمادي هادئ، بلا لون — Shadows | dark | monochrome charcoal, soft grey glass, no colour orbs | subtle | #E5E7EB / #E5E7EB | IBM Plex Sans Arabic / IBM Plex Sans Arabic | editorial | C | |
| 21 | wameed | وميض | ومضة سماوية — Glint | dark | near-black (#07090F) + electric cyan streaks | default | #22D3EE / #22D3EE | Noto Kufi Arabic / Noto Sans Arabic | crisp | C | |
| 22 | sadeem | سديم | فضاء بعيد — Nebula | dark | cosmic mesh (indigo #6D5DF6, teal #2DD4BF, magenta), 3 big orbs | strong | #A99CFF / #A99CFF | Cairo / Noto Sans Arabic | drift | A | |
| 23 | bareeq | بريق | غبار ذهب على عاج — Sparkle | light | ivory (#FFFDF7) + gold-dust radial, tiny glints | subtle | #A16207 / #F5B942 | Noto Naskh Arabic / Almarai | glow | B | |
| 24 | sada | صدى | حلقات حبر متّسعة — Echo | light | concentric ring pattern, ink monochrome | subtle | #1A1523 / #F4F1FA | Cairo / IBM Plex Sans Arabic | editorial | C | |
| 25 | hibr | حبر | أسود حبر، أبيض ورق — Ink | dark | ink-black (#0F0D17) + soft ink-blot ambient orbs (violet-grey) | default | #A99CFF / #A99CFF | Noto Naskh Arabic / IBM Plex Sans Arabic | editorial | A | ✓ |
| 26 | raml | رمل | كثبان دافئة — Sand | light | dune gradient (#F1E4C8 → #E7CFA3), grain | subtle | #92400E / #FCD34D | Tajawal / Almarai | soft | A | |
| 27 | sahab | سحاب | غيم أبيض على أزرق — Clouds | light | blue-white cloud blobs (blur 20) | strong | #1D4ED8 / #93C5FD | Almarai / Noto Sans Arabic | drift | B | |
| 28 | thalj | ثلج | أبيض ناصع بظلّ أزرق — Snow | light | pure white + crisp cool shadows, no orbs | strong (blur 12) | #1E40AF / #93C5FD | Cairo / IBM Plex Sans Arabic | crisp | A | |
| 29 | badira | بادِرة | أوّل خضرة تطلع — Sprout | light | leaf mesh (#CFE8D2, #E4F0D6) + a Lottie wheat field anchored to the foot of the viewport | default | #2F6B45 / #8FD0A0 | Cairo / IBM Plex Sans Arabic | rise | C | ✓ |
| 30 | thurayya | ثُرَيّا | نجوم صغيرة كثيرة — Pleiades | dark | night (#080A17) + a Lottie star field, tiled and masked out at the horizon | default | #7D5F10 / #F5B942 | Cairo / IBM Plex Sans Arabic | glow | A | ✓ |

**Free tier (8):** صقيع، بلّور، ورقة، فجر، نسيم، حبر، بادِرة، ثُرَيّا — 4 light-leaning, 2 dark-leaning; 2 calm, 2 vivid, 2 editorial. Chosen so a free page never looks like a demoted version of a paid one.

**Phase 2 build order:** صقيع (1), بلّور (2), فجر (7), حبر (25).
**Built since:** ورقة (5) — first of the Phase 5 batch, and the first template whose page colour is a *surface* rather than the paper: cards are opaque sheets laid on a kraft desk, each with a stack-of-leaves shadow. The hero is a page torn out of a notebook (blue rules, terracotta margin, pressed seal, carved rosette, folded corner, an origami crane sketched in the far margin); projects are numbered ledger rows with a margin rule; sections are numbered with a CSS counter in the reader's own numerals; study-first (order B) keeps education at the top instead of pairing it with contact.

**Built since ورقة:** بادِرة (29) — a new identity, not one of the 28 planned. The name means both the seedling that first breaks the soil and the first sign a person shows of what they will become, which is the argument of this whole product stated in one word.

It was built to share no silhouette with the five before it, and it is the first of each of these:
- **green**, where the others are ice, prism, dawn, ink and kraft
- **bento** rather than a stack, so section tiles are sized by how much the student actually wrote
- **skills-first** (order C), the last unused section order
- **`card: 'branch'`** — projects are buds on a stem that runs down the section, because the claim is that the student is growing rather than finished
- **`backgroundFit: 'band'`** — the backdrop is anchored to the foot of the viewport rather than tiled or covering, so the page grows out of a wheat field

A bento tile is about a third of the page, and the shared heading column left roughly 250px for content: «الجامعة الأردنية» broke over two lines and the skill pills stacked one per row. `SectionShell` now takes `stacked`, set whenever the layout is bento, and puts the heading above the content with the art beside it.

**Built since بادِرة:** ثُرَيّا (30) — the Pleiades, a cluster of small stars that are faint alone and unmistakable together, and also the ordinary word for a chandelier. It is the second half of what بادِرة argues: a CV of a dozen small things is not an empty CV.

It is the first template that is dark AND vivid — فجر is dark and warm, حبر is dark and silent — and it introduces three things the codebase did not have:
- **`motion: 'glow'`**, the fifth signature and the only one whose character is a loop rather than an entrance: the halo behind the portrait breathes, everything else enters normally
- **`hero: 'orbit'`**, the seventh hero layout — the avatar sits at the CENTRE of the Lottie's concentric orbits, so the student is the star of their own chart. Nothing else in the set puts the portrait inside the art
- **`card: 'lume'`** — a tile lit along its top edge by a fading accent gradient, and glowing at its border on hover

Light mode is not a washed-out night. It is the same sky printed as a star chart on parchment: the star field and the orbit rings are inverted to ink, and the gold darkens to #7D5F10 so it can carry text.

The binding measurement is a solid star behind text. Bare on the page it is 1.06:1 in dark and 4.44:1 in light — both failures — so two things were done: the sky is masked out over the bottom of the viewport, the way a real one thins at the horizon, and the footer (the only text that ever sits on the page rather than on a card) was given the template's own glass. The star opacity itself is set by the gold: at 0.35 the accent measured 4.30:1 where a card crosses a star, so light runs at 0.22.

Two deviations from the ورقة row above, both deliberate:
- **The accent is Petra rose, not ink.** The all-ink palette measured fine and looked dead; one warm accent on the margin rule, the folios, the seal and the links is what makes the sheet read as paper rather than as a grey UI card.
- **Its backdrop flies over the page, not under it.** Every other template puts its background art behind the cards, but ورقة's sheets are opaque and full-width, so anything behind them is never seen. A paper plane passes above a desk anyway. Measured: a plane crossing a sheet darkens type and paper alike, leaving ink at 12.18:1 and the accent at 4.74:1.
**Phase 5 batches (6 each):** [3,4,5,6,10,11] → [12,13,15,18,19,23] → [8,9,14,16,17,22] → [20,21,24,26,27,28].

## Accent contrast (measured with `scripts/contrast.py`)

Accents marked as *light* are used for text/CTA on paper (#FAF7F2) and must pass ≥4.5:1; *dark* accents are used on #0F0D17. Any accent in this table that fails when a template is built is darkened (light) or lightened (dark) before the template ships. The MASTER accents are pre-verified; per-template accents are verified in that template's identity sheet.
