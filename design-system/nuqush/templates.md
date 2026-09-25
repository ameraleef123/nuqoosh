# Nuqush — Template Identity Matrix (44)

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
| 19 | naseem | نسيم | هواء وفراغ — Breeze | light | a SATURATED sky (#BCD9F2) with white paper cards floating on it, clouds crossing, and KITES in the hero on a string down to the portrait | strong (cards near-opaque) | #0B4F8A / #9EC5FF | Cairo / IBM Plex Sans Arabic | drift | B | ✓ |
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
| 31 | rafif | رَفيف | رفّة هوا خفيفة — Quiver | light | pale air (#F2F7FA), 3 pale slow orbs + a Lottie of drifting line bundles | subtle | #0E6D8A / #7DD3FC | Cairo / IBM Plex Sans Arabic | soft | B | ✓ |
| 32 | siq | سِيق | ممرّ محفور بالصخر — The Siq | dark | rose rock (#1C0F0B) + a Lottie canyon as a covering scene | strong | #B8452F / #E8836B | Cairo / IBM Plex Sans Arabic | crisp | C | ✓ |
| 33 | takwin | تَكوين | أشكال بسيطة مرتّبة بقصد — Composition | light | warm white (#FAF6EE) + a visible 5rem grid, no orbs, a Lottie of hollow drifting forms | default | #1E3A8A / #8BA6F0 (highlight #F0B429) | Cairo / IBM Plex Sans Arabic | crisp | B | ✓ |
| 34 | muheet | مُحيط | قاع هادي وضوء نازل — The deep | dark | a depth gradient (#0E3A4C → #061D27), CSS light shafts, a drawn wreck on the floor, a Lottie shoal in the middle water | default | #0B707E / #4FD1C5 | Cairo / IBM Plex Sans Arabic | drift | C | ✓ |
| 35 | fayi | فَيء | ضوء بعد الظهر — Afternoon shade | light | warm grey (#F4F1EC) with a shade wash at the sun's angle, and a Lottie of leaf shadows drifting down it | default | #6B4D6E / #C9A8CD | Cairo / IBM Plex Sans Arabic | soft | B | ✓ |
| 36 | himma | هِمّة | اندفاع وشغف — Drive | light | warm blush (#FFF7F4) + embers drifting up, colourised to one crimson | default | #C41E4F / #FF7A95 (stamp #F5A524) | Cairo / IBM Plex Sans Arabic | rise | A | ✓ |
| 37 | mada | مَدى | إرسال هادي وبعيد يوصل — Range | dark | near-black (#06090F) ruled with a scan grid, no orbs; a transmitter MAST in the hero with range rings opening from its lamp | default | #0E6B9C / #56CCF2 | Cairo / IBM Plex Sans Arabic | crisp | C | ✓ |
| 38 | tesla | تسلا | كهربا صافية — Under voltage | dark | violet-black (#0B0714) with six DRAWN bolts pinned to the VIEWPORT and a flash layer; a drawn Tesla COIL in the hero whose corona never goes out | default (plates near-solid) | #7C22CE / #C084FC | Cairo / IBM Plex Sans Arabic | glow | B | ✓ |
| 39 | sakura | ساكورا | زهر كرز، وهدوء فيه فراغ — Blossom | light | warm ivory-rose (#FDF2F4) with DRAWN petals falling over the whole page and one Lottie cherry branch hanging into the hero | default | #8E3C5D / #F0A5C0 (hanko #F8C8D4) | Cairo / IBM Plex Sans Arabic | soft | C | ✓ |
| 40 | mashrabiya | مَشرَبيّة | خشب محفور وضوء بيتسرّب — The screen | dark | warm walnut (#1A120D) with a turned-spindle LATTICE across the page and a lit panel in the hero; the portrait sits in an opening cut through it | default | #8A4B20 / #E0913F | Cairo / IBM Plex Sans Arabic | glow | A | ✓ |
| 41 | newyork | نيويورك | أبراج وإضاءات ما بتنام — All lights | dark | night blue-black with a DRAWN city fixed behind the whole page — towers with setbacks, spires and water tanks, 469 lit windows, traffic and a crowd — glowing through deliberately thin cards | default | #A81F68 / #FF5FA2 | Cairo / IBM Plex Sans Arabic | crisp | C | ✓ |
| 42 | alam | العالم | خريطة العالم وإنت نقطة عليها — The world | light | oat atlas sheet ruled with a graticule, the world map printed across the WHOLE PAGE behind thinned cards, and the portrait a PIN planted on it | default | #0D6157 / #63D6B8 | Cairo / IBM Plex Sans Arabic | soft | B | ✓ |
| 43 | fann | فن | صالة عرض وإنت أول لوحة فيها — The gallery | light | the wall IS La Gioconda — her landscape blurred to fill the page and the painting itself centred on it; the portrait hangs in front, mounted and framed with a museum label | transparent (0.58) | #7B1FA2 / #FF3D7F + four pigments | Cairo / IBM Plex Sans Arabic | soft | A | ✓ |
| 44 | majlis | مَجلِس | طاولة اجتماع وإنت على رأسها — The table | light | cool grey sheet ruled like a plan; a meeting table DRAWN from above with the portrait in the head seat and the deal closing on it | default | #5B21B6 / #A78BFA | Cairo / IBM Plex Sans Arabic | crisp | B | ✓ |

**Marked free in the registry (22):** صقيع، بلّور، ورقة، فجر، نسيم، حبر، بادِرة، ثُرَيّا، رَفيف، سِيق، تَكوين، مُحيط، فَيء، هِمّة، مَدى، تسلا، ساكورا، مَشرَبيّة، نيويورك، العالم، فن، مَجلِس — 12 light-leaning, 10 dark-leaning. All twenty-two are built. The `free` flag is a registry field, not a pricing decision - do not lean on it as a reason to build anything. The range is deliberate — ice, prism, dawn, ink, paper, leaf, night, air, rock, grid, sea, shade and ember — so a free page never looks like a demoted version of a paid one.

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

**Built since ثُرَيّا:** رَفيف (31) — the word for the faint quiver of something light in moving air: a leaf, a wing, the surface of water. The quietest of the eight and the one with the most empty space, on the argument that a page with four things on it should look deliberate rather than unfinished.

It closes two lists. **`motion: 'soft'`** is the sixth and last signature, and the only one that changes the *easing* rather than the duration: every other template decelerates on an expo curve, which arrives fast and stops hard, while this one overrides `--ease-out` to a cubic on the template wrapper, which reaches every transition and keyframe inside it at once. **`hero: 'ribbon'`** is the eighth and last hero layout — two registers with one moving line running the full width of the card between them, the name above it and the portrait and pills below. **`card: 'float'`** has no panel at all: a hairline, a lot of air, and a 3px lift on hover.

Two things worth keeping:
- Its muted foreground is two steps darker than the palette needs (#3C4D59, 8.12:1 on the page). That is what buys 5.83:1 for the footer where a drifting line passes behind it; at the first value the same case measured 4.17:1 and failed.
- Its first hero art was replaced. That piece was built from exactly two opaque fills, a navy and a white, one masking the other, so `filter: invert(1)` painted the whole box as a solid band rather than flipping a line, and cropping it to a divider height cut the wave into a row of scallops. Blend modes could read it — `multiply` keeps the navy, `screen` keeps the white — but the result still looked like scallops, so the art itself was the problem.

  The replacement is stroke-only (0 fills, 38 strokes) and 3490x1000, which is what makes it work: `cover` crops a horizontal slice out of the middle of flowing lines rather than cutting shapes in half. Its strokes are red in the source and one `hue-rotate` takes them to the template's teal in both themes, with no inversion needed. **When picking Lottie art that has to survive a theme flip, check the fill/stroke mix first** — walk the JSON for `ty:'fl'` against `ty:'st'`.
- `LottieMark` gained a `speed` prop for this template. The current's own loop is 0.9s, which reads as busy on a page built to feel calm; it plays at 0.35.

**Built since رَفيف:** سِيق (32) — the narrow canyon you walk before the Treasury appears. Rose rock on both sides and a slot of light at the end: the passage rather than the arrival, which is the honest place for a student to be.

It is **the bold one**. Eight templates in, the whole set was calm, crafted or quiet, and a student who wanted their page to feel strong had nothing to pick. It is also the first to make the brand's own Petra rose the primary accent rather than a second voice, and the first whose surfaces are cut INTO the ground rather than laid on it: **`hero: 'gate'`** is an arch with the carved gate inside it and the portrait standing in the doorway, overlapping its lower edge, and **`card: 'carved'`** puts the top inner edge of every project in shadow and lets the bottom one catch the light — the exact inverse of ورقة's raised sheets.

Three things worth keeping:
- **Its backdrop numbers came from the art, not from judgement.** The canyon's brightest opaque pixel is #F3DDC9, sampled across the whole loop with a canvas readback, and the dark opacity of 0.7 is the largest value that keeps the rose accent above 4.5:1 where a card crosses that pixel (4.91:1). This is the same method فجر used and it should be the method for every covering scene.
- **A covering scene reaches the footer, which has no card under it.** Bare muted type over that pixel measures 1.35:1. The renderer now exposes `data-bg-fit` on the template wrapper so ONE rule gives the footer the template's glass on every cover template — which fixes فجر as well, where the same exposure had gone unmeasured.
- **Light mode does not pretend.** The canyon is a mass of saturated red whose structure lives in the contrast between wall and sky; lightening it produces a pink cloud, not a paler canyon. So light drops it to a 0.12 blush and lets the rose accent and the carved surfaces carry the identity instead.

**Built since سِيق:** تَكوين (33) — composition, in the sense an Arabic art school means it: simple elements arranged on purpose. That is literally what a student's first page is, and this is the only template that says so in its layout rather than in its mood.

It is **the graphic one**. Nine templates in, every background in the set was atmospheric — weather, paper, sky, rock, air — and this one has no scene at all: flat shapes, hard edges, a 5rem grid drawn on the page, and two colours. Radii go to zero across the whole template, because a composition is made of rectangles.

- **`hero: 'blocks'`** is the tenth and last hero layout: five cells in a grid, and the rules between them are the ruled ground showing through a 1px gap. No borders to get wrong in RTL, and no doubled lines where cells meet. One cell is filled with the highlight yellow, because a composition of five white boxes is a table.
- **`card: 'block'`** is a flat rectangle with a 3px bar down its start edge. No radius, no shadow: depth here is expressed by the grid, never by lifting something off it.
- It is the second template to use **bento**, and the first light one to use it.

Its binding measurement is the backdrop, and it is the sharpest of the set: yellow on navy is the highest-contrast pair in the template, which makes it the most dangerous thing to put behind the footer. At 0.55 opacity bare muted type over a solid stroke measured **2.62:1**; at 0.28 it is 5.30:1, and the hollow forms still read clearly precisely because the pair is so bright.

**Built since تَكوين:** مُحيط (34) — the owner's own idea, and the first template in the set that is a PLACE rather than a material or a mood. You are under the sea: light comes down from a surface you cannot see, a shoal crosses the middle water, and a wreck has been settling on the bottom for a long time. For a student the reading is the one the whole product is for — what is down here is quiet and unfinished, and the light still reaches it.

It is the only template whose page is a **depth gradient** rather than one flat ground, so scrolling reads as descending. Its backdrop is built from four separate layers, which no other template needed:

| layer | how |
|---|---|
| the water column | a CSS gradient on `[data-bg='deep']` |
| surface light | four CSS shafts, each swaying on its own slow cycle |
| the shoal | the Lottie backdrop, tiled at three depths |
| the wreck | a drawn SVG anchored to the foot of the page |

**The wreck is drawn, not fetched.** The catalogue's only sunken ship had bitmaps baked into it, and every light-ray animation in it carried a solid sky rectangle that would have painted a hard edge across the page. Both were cheaper to draw: same call as `DawnSun`.

**`hero: 'porthole'`** is the eleventh hero layout and the only one that frames its art as something you are looking THROUGH: a thick rim, eight rivets drawn as radial gradients in a single layer, a pane that darkens toward its foot, and one creature drifting behind the glass. **`card: 'pebble'`** is worn smooth and lit from above.

Two things the build taught:
- **A black silhouette needs water that is not also black.** The sea floor was #020C12 and the wreck vanished into it completely; lifting the floor to #061D27 and giving the deck a cool rim-light is what made the ship a ship.
- **The shoal is drawn in a solid navy**, which is right in the sunlit shallows and invisible at depth, so dark turns it toward the template's aqua and brightens it. Its opacity is set by the footer: bare muted type over a solid fish measures 5.31:1 light and 4.92:1 dark.

**Built since مُحيط:** فَيء (35) — not any shade, but the shadow that comes back in the afternoon and lengthens as the day goes. Arabic has a separate word for it because it is a separate thing from the morning's.

It is the one template with **no colour to speak of**. Every other page in the set is built on a hue; this one is built on a light SOURCE. There is a lit side and a shaded side, every surface throws its shadow away from the same sun, and the only chromatic note is the violet that real shadows take late in the day — which is also what stops a grey page from reading as a dead one. That lesson came from ورقة, whose first all-ink version the owner rejected on sight.

- **`hero: 'sunlit'`** is the twelfth hero layout: one card, two halves, with the shade falling across it at the sun's angle. The lit half carries who they are, the shaded half carries what they say.
- **`card: 'cast'`** is flat on the wall with one long shadow, and the template's `--glass-shadow` is an offset throw rather than a halo, so every card on the page agrees about where the sun is.
- The frond throws a **real** drop-shadow of its own silhouette: `filter: drop-shadow()` on the canvas reads the alpha, so the shadow is the shape of the leaves rather than of the box.
- **The frond sits behind the paragraph, and the sentence is read through it.** That overlap was removed once for readability and put back at the owner's request, which turned out to be the right call — a leaf shadow on a wall IS low-contrast, and the fix was strength rather than distance. The ceilings are measured: 0.32 in light keeps muted type at 5.09:1 over the darkest frond, and dark is far tighter at 0.18 (5.44:1) because there the frond is a PALE shape on a dark card. The first value, 0.55, measured 3.34:1.

**This is the template that made the RTL work visible.** Gradients and box-shadows take PHYSICAL directions, so nothing here mirrors for free: the wall wash, the hero's shade, every card shadow and the frond's own drop-shadow are each spelled out twice, once at 108deg and once at 252deg. Flip the page to English and the whole light source moves to the other side, which is the point.

Its binding measurement is the footer where the shade is deepest. At the palette's first muted value it landed on exactly 4.50:1; one step darker (#4A4641) puts it at 5.03:1.

**Built since فَيء:** هِمّة (36) — the word Arabs use about a young person with zeal: the thing someone has before they have a record, which is exactly what a student with no experience brings. It is the most on-message name in the set.

Twelve templates in, the whole thing was elegant, atmospheric, crafted or quiet. **Nothing in it was loud.** This is the loud one: a saturated crimson on warm blush, an amber stamp for the course badge, embers drifting up the page, and a hero whose art refuses to stay inside the card.

- **`hero: 'breakout'`** is the thirteenth hero layout and the only one where the art hangs OVER the card's own top edge. Every other template keeps its art inside the frame; a card that cannot hold its contents is the whole idea. It carries a warm halo behind it so the burst reads as something igniting rather than a sticker on the corner.
  Its first mark was an aperture fan, which read as a loading spinner; it was replaced with a starburst that throws itself open and pulls back in, already drawn in the template's own crimson.
- **`card: 'ember'`** is lit from BELOW — a coal, not a stone — and the glow grows taller and hotter on hover. It is the exact inverse of مُحيط's pebble.

Two measurements shaped it:
- **A template's own accent can fail against its own decoration.** A project link sits low in a card, right where the coal glows, and at the first value the crimson measured 4.34:1 against it. The coal was cooled to 0.10 (4.81:1). Nothing outside the template caused that — it was the design arguing with itself.
- **A hue-rotate cannot unify a spread of hues**, it only moves the spread. The ember art is drawn in party colours (green, blue, yellow) and rotating them kept them mixed; the fix is to flatten first — `grayscale` strips the hues, `sepia` lays one down, then `saturate` and a small rotation carry it to the crimson. Before that the page read as a birthday rather than as drive.

**Built since هِمّة:** مَدى (37) — range: the distance a signal actually reaches. It is what a radar measures, and it is what a student is trying to extend by putting a page on the internet at all.

Thirteen templates in, the set had weather, paper, sky, rock, sea, air, shade and fire, and **nothing technical** — which is odd for an audience of computing students. This is the instrument panel: near-black with one electric blue, a scan grid ruled across the page in horizontal lines the way an oscilloscope is, square corners, and no orbs, because a blurred blob has no place on an instrument.

- **`hero: 'rail'`** is the fourteenth hero layout and the only **vertical** one: the text fills the card while a narrow column runs down the end side carrying the portrait, the instrument and the pills as a stack of readings. The hairline between the two is a logical border, so it swaps sides with the language.
- **`card: 'ping'`** gives every entry a lit node in its margin that sends one ring outward when the pointer reaches it.

Two things the build taught:
- **Check art for baked-in labels before committing to it.** The first hero was a radar sweep that turned out to carry a small red "BOT" tag riding on its arm — a leftover from whatever product it was drawn for. Because the tag orbited with the sweep, no static crop could remove it; it had to be replaced. The reticle that took its place is 2 KB and clean.
- **Match the palette to the art instead of fighting it.** This template was built lime first, which forced a 128deg hue rotation on both Lotties and produced muddy olive points. Moving the palette to the blue the art was already drawn in removed the correction from the backdrop entirely and left exactly one rotation, on the reticle.

**Built since مَدى:** تسلا (38) — named by the owner, for Nikola Tesla and for the unit, which is what the word means outside the car company. One idea taken all the way: a page under voltage.

- **`hero: 'gap'`** is the fifteenth hero layout and **the only one that is not a single card**. It is two plates with a spark gap between them, and the arc jumps it — a gap only means something when something crosses it. The plates carry the glass; the header is just the grid holding them apart.
- **`card: 'live'`** is a dead wire until the pointer reaches it, and then the whole border is energised.

---

**Built since تسلا:** ساكورا (39) — the owner's pick, and the only template in the set named after a season rather than a mood.

The trap with sakura is thinking it is a colour. It is not: a pink page is a birthday card. What makes it read as Japanese is the **composition** — asymmetry, a great deal of deliberate emptiness, and one branch placed off in a corner rather than centred. So the page spends pink in exactly two places, the falling petals and the branch, and everything the reader has to read is plum on ivory.

- **`hero: 'hanging'`** is the sixteenth hero layout and **the only one that is mostly empty on purpose**. The content sits in the lower start corner and the branch hangs in the space above it. On a phone there is no room to put the branch beside the text, so the space is *reserved* with `padding-block-start` rather than defended with `min-block-size` — a min-height stops protecting anything the moment the text is long enough to grow past it, and the headline then wraps up into the flowers.
- **`card: 'petal'`** rounds three corners and cuts one square, and the cut corner is `border-start-start-radius`, so it swaps sides with the language. A thin accent bar along the cut says the corner is intended and not a rendering fault.
- **The portrait becomes a hanko** — the square seal a Japanese signature ends with. This is the whole identity in one square centimetre.

Three things the build taught:

- **A drawn asset with a direction in it needs the mask spelled in its own coordinates.** The branch has to reach *into* the text, because that overlap is the charm of it — but the trunk is dark brown, and dark ink crossing dark wood is a contrast failure, not a style. The fix is a `mask-image` that fades the art out as it approaches the text, written once: the element is mirrored for one of the two reading directions, and the fade mirrors with it.
- **Sizing timidly kills art that changes size.** The first hero drew one blossom three times; because the animation opens *and closes*, the blossoms spent a third of every cycle as specks. Three copies also ran in step, which reads as a machine rather than a tree. Different speeds and a much larger box fixed both — and then the owner supplied a real branch, which was better than either.
- **Recolouring one thing can invalidate the measurement of another.** The seal was vermilion with white initials at 4.83:1. Moving the square to baby pink took white to **1.48:1** — the ink had to move with it, to plum at 6.07:1. A colour change is never only a colour change when there is text on top of it.

**The stutter, and what it actually was.** The owner reported a light hang on this template. `scripts/perf.mjs` was written to answer it — it samples Chrome's own cumulative CPU counters across a fixed scrolling window, because frame timing on this machine was too noisy to separate one config from another: identical runs differed as much as different ones did. The first numbers it produced were also wrong, in a way worth remembering.

| | main thread per 5s of scrolling |
| --- | --- |
| as built | 3605ms |
| after both fixes | 1192ms |
| رَفيف, for comparison | 2079ms |

Two causes, and neither was the one that looked obvious:

- **The petal backdrop was a Lottie, and it had to be three of them.** The catalogue's art looked right, but it is 169 KB of JSON with every position baked frame by frame, and its petals are sized as a fraction of the composition — so it only reads correctly at about 430px wide, which means three players to cross a desktop. That layer alone cost 2500ms. It is now drawn (`components/templates/petal-fall.tsx`): twenty petals, one SVG path, nothing but `transform` and `opacity`, which the compositor runs off the main thread. The same layer now costs 200ms. **The catalogue can fail on cost as easily as on looks** — تسلا's lightning was drawn because the art was wrong, and this was drawn because the art was expensive.
- **A mask and a transform on the same element as a repainting canvas.** The branch carries both a `mask-image` (so the wood fades before it reaches the headline) and a `scaleX(-1)` (so it mirrors for one reading direction). Together on one element they drop the whole region onto the CPU raster path every frame; either one alone is free. Splitting them — the fade on a wrapper, the mirror on the art — cost one extra `div` and saved **1100ms**.

**Measure before and after, and distrust the first run.** The very first isolation run blamed the mask outright, at 35.6fps with 101 janky frames; re-running the same configs in a different order showed that number was a cold-browser artifact — wasm compilation and image decoding paid once. Later still, the numbers were inflated a second time by a stale dev-server bundle that put the page into a hydration mismatch, so React was regenerating the tree on every load. A perf result that is not reproducible in a different order, on a page with a clean console, is not a result.

---

**Built since ساكورا:** نسيم (19) — the last of the free tier, and the one that had to argue with its own identity sheet.

The sheet asked for a sky-blue **wash** with a #0369A1 accent. By the time it came to be built, صقيع, رَفيف, مُحيط and مَدى had all taken pale-blue grounds. A fifth would have been the weakest page in the set: four templates a student cannot tell apart at thumbnail size is worse than three.

So نسيم keeps the sky and gives up the wash. **It is the only template whose page is a saturated colour rather than a near-white** — an actual blue sky, with the cards floating on it as white paper. That is a difference you can see at the size people actually choose at.

- **`hero: 'margin'`** is the seventeenth hero layout. ساكورا's emptiness runs down the card; this one runs across it — a wide gutter holding only the portrait and a hairline, with the writing in a narrow column beside it. The proportions of a manuscript page, where the gutter is not wasted space but the thing that makes the text feel placed.
- **`card: 'slat'`** is wide, short, and has **no border at all** — a sheet has an edge you infer from its shadow. On a coloured ground that shadow is the whole effect, so it is longer and softer than anywhere else in the set, and tinted with the sky rather than grey.
- **It brings no art of its own.** You cannot draw air, so nothing is drawn: three clouds, each one span whose shape is a radial gradient, moving on `transform` alone. After ساكورا's stutter this was built on the compositor from the first line rather than fixed later.

Two things the build taught:

- **A coloured ground moves the binding contrast case.** On every other template the worst surface is a card over a bright decoration. Here it is the **footer on the bare sky**, because the page itself is the colour. That is what set the sky's depth: muted type measures 5.83:1 on #BCD9F2. Clouds are white over that sky, so they only ever lighten it — the bare sky is the worst case and the cloud is measured alongside it to prove it.
- **`min-inline-size` outranks `inline-size`, and a phone rule can survive into the desktop one.** The gutter hairline is `min-inline-size: 2rem` lying down on a phone and `inline-size: 1px` standing up above it — and the first kept winning, rendering a 2rem slab. A min- has to be *released*, not overridden.

**The lightning is drawn, not fetched** — the same call as مُحيط's wreck, and for the same reason: the free catalogue's entire stock of "lightning" is cartoon bolts, weather icons and physics diagrams with their labels baked in. What makes a strike read as real is not its silhouette but its **layering** — a wide soft halo, a narrower sheath, a hairline white-hot core — and its **timing**: a real strike is a stutter of two or three returns inside a tenth of a second, then nothing for seconds. Six bolts run cycles of 5, 7, 8, 9, 11 and 13 seconds so the storm never falls into step with itself, a flash layer lifts the whole page with the nearest one, and every animated property is opacity.

Two measurements shaped it:
- **The plates are nearly solid, and that is a contrast decision.** A white-hot core passing behind a translucent card dropped the accent to **3.31:1**. Raising the plate to 0.86 puts it at 5.46:1 — and an instrument plate should not be transparent to the weather anyway.
- **The storm is masked away from the foot of the page.** The footer is the one piece of text with no card under it, and no attenuation would have saved it from a white core. Lightning belongs in the sky.

Two deviations from the ورقة row above, both deliberate:
- **The accent is Petra rose, not ink.** The all-ink palette measured fine and looked dead; one warm accent on the margin rule, the folios, the seal and the links is what makes the sheet read as paper rather than as a grey UI card.
- **Its backdrop flies over the page, not under it.** Every other template puts its background art behind the cards, but ورقة's sheets are opaque and full-width, so anything behind them is never seen. A paper plane passes above a desk anyway. Measured: a plane crossing a sheet darkens type and paper alike, leaving ink at 12.18:1 and the accent at 4.74:1.
**Phase 5 batches (6 each):** [3,4,5,6,10,11] → [12,13,15,18,19,23] → [8,9,14,16,17,22] → [20,21,24,26,27,28].

## Accent contrast (measured with `scripts/contrast.py`)

Accents marked as *light* are used for text/CTA on paper (#FAF7F2) and must pass ≥4.5:1; *dark* accents are used on #0F0D17. Any accent in this table that fails when a template is built is darkened (light) or lightened (dark) before the template ships. The MASTER accents are pre-verified; per-template accents are verified in that template's identity sheet.

---

## The rebuild of نسيم, مَدى and تسلا

The owner's verdict: نسيم and مَدى were «سيء للغاية» and both needed «شغل من اول وجديد»; تسلا «لا يوحي للكهرباء» and its hero «مش حلو». Set against «ابدعت في سيق وفي محيط».

That comparison is the whole brief, and it is worth stating plainly, because two templates were built without it:

> **سِيق and مُحيط work because they are places with a body.** One is an arch you can stand in; the other is a porthole you are looking out of. In both, the portrait is INSIDE the structure. An identity built on an absence — empty space, a gutter, a scan grid, a diagram — gives the reader nothing to stand in, and it reads as a blank no matter how carefully its palette was measured.

Each rebuild applied the same test: what is the object, and where does the person stand in it?

- **نسيم** — you cannot draw air, but you can draw what air holds up. Kites fly in the far corner, a drawn string runs down across the card, and the portrait sits at the end of it. `hero: 'kite'` replaces `'margin'`, which was a wide empty gutter with a hairline in it. The sky also stopped being a flat fill and became a gradient, deepest overhead.
- **مَدى** — the word means how far a signal gets, and the first build said that with a dotted reticle. Now there is a transmitter mast, the portrait stands at its foot, and three range rings open from the lamp and run off the edge of the card. `hero: 'mast'` replaces `'rail'`. The abstract data-stream backdrop is gone.
- **تسلا** — the hero was a spark gap: two separate plates with an arc between them. An accurate diagram of Tesla's idea that read as a layout which had come apart. It is now a drawn coil (`tesla-coil.tsx`) — base, windings, toroid — with the portrait at its foot.

**Why تسلا did not feel electric, which was not a drawing problem.** Three causes, all about *when* rather than *what*:

| | before | after |
| --- | --- | --- |
| strike duty cycle | about 4% of each cycle | about 16% |
| bolt periods | 11–29s | 5–11s |
| storm layer | `position: absolute` over the whole document | `position: fixed` to the viewport |

The third mattered most: spread over a long document, five of the six bolts sat below the fold and a visitor almost never saw one. Accurate lightning timing also leaves a page dark for nearly all of every cycle — so the coil's corona never goes out at all, and its four discharges run on unrelated sub-second cycles so at least one is always lit. **Discharge is this page's resting state, not an event it waits for.**

Removing the tiled `static-sparks` backdrop took تسلا from **4365ms to 1754ms** of main thread per 5s of scrolling. All three rebuilds now sit near 1700ms; سِيق, which the owner likes, is 4546ms. That is the third time a tiled Lottie backdrop has been the most expensive thing on a page — **default to drawing an ambient backdrop rather than fetching one.**

**A process lesson, and a sharp one.** Inserting the coil hero was done by replacing the region between two anchors (`hero === 'gap'` and `hero === 'breakout'`). The `mast` branch had been added earlier and happened to sit *inside* that region, so it was silently deleted. `tsc`, `check-rtl` and all twelve content checks passed — the template simply fell through to a default hero, in both languages. It was caught only by probing the rendered DOM for elements that should have been there. **Anchor an edit on the exact thing you are replacing, never on a region between two landmarks; and after a structural edit, check the DOM, not just the build.**

---

**Built since the rebuilds:** مَشرَبيّة (40) — the first template designed to the standard the owner set, rather than corrected into it afterwards.

A mashrabiya is a screen of turned wooden spindles set into a window. You sit behind it and look out, and the light that gets through arrives cut into pieces. The test from سِيق and مُحيط was applied before a line was written: *what is the object, and where does the person stand in it?* The portrait sits in an opening cut through the screen. (The lanterns that first hung beside it were later replaced — see the hero rework below.)

The planned identity list was no help here, and that is worth recording. All twenty-three remaining names — ندى، سراب، همس، شفق، غسق، رذاذ، ضباب، زبد — are **colours and weather**, which is the same abstraction that sank the first نسيم and the first مَدى. A mood is not an object. The list should be treated as a palette bank, not a queue.

- **`background: 'lattice'`** and **`hero: 'screen'`** share one SVG `<pattern>` at two strengths: a panel behind the portrait that is meant to be read as woodwork, and a wall across the page at a twelfth of the opacity that is meant to be felt and not looked at. The browser tiles a pattern once — there is nothing per frame in either.
- **`card: 'inlay'`** has no border at all, just one brass line let into its start edge, the way a real screen is finished.
- The lattice is drawn as **interlocking circles**, not as a grid of eight-point stars. Circles are what turned spindles actually make when they are assembled, and they are what stops it reading as generic geometric wallpaper.

**It is the first warm dark page in the set.** Every other dark template is a cold one — ثُرَيّا's night sky, مُحيط's deep water, مَدى and تسلا's near-black instruments. This is a room at night with wood in it, and that separates it at thumbnail size before any detail is visible. The brass is deliberately copper-leaning (#E0913F) rather than ثُرَيّا's yellow gold (#F5B942), which was the only other warm accent on a dark ground.

**What a coloured lattice does to the contrast floor.** The wall is fixed behind the whole page, so the binding case is the footer sitting on a spindle rather than on bare ground. Measured at the wall's own opacity, muted type reads 7.06:1 (light) and 8.19:1 (dark) — the lattice is faint enough that the ground, not the spindle, stays the worst case.

Every part of it was then checked in the rendered DOM rather than only in the build, which is the habit that came out of the مَدى branch being silently deleted.

---

## Two heroes, reworked to the owner's notes

**مَشرَبيّة — the lanterns come out, a شمسة goes in.** The note was that the hero needed more soul and that the hanging lanterns had to go: «غير الفوانيس كلها ما بدي اياها اختار اشي احلى وبنفس الطابع الاسلامي».

The lanterns were the wrong *category*. Lanterns are Ramadan decoration; this template is architecture, and hanging them inside the screen made the window read as a shop display. What replaced them is a **شمسة** — the eight-fold rosette at the centre of a carved Mamluk panel, which is the motif a mashrabiya is actually built around — set in the empty corner of the room and turning once every 220 seconds.

It is drawn, and the reason matters: the catalogue's rosettes are all **loaders**. They draw and erase themselves on a loop, so a screenshot catches a half-finished scribble and a visitor sees a spinner. A rosette in a room is carved and permanent. Two star polygons and three circles, with the points computed rather than eyeballed.

The contrast lesson here was new: **a thin decorative stroke can fail even when it covers almost nothing.** Text crossing a brass line at 0.3 opacity put the accent at 3.74:1. The fix was not to fade the rosette but to drop its opacity to the measured floor and draw the lines *thicker* — the carving keeps its presence, and the colour a letter can land on is what changed.

**نيويورك — a real city, not a silhouette.** The note was «خلي كمان الابراج والاضاءات بشكل واقعي واضح... سيارات ناس هيك ابراج city center».

The skyline is now a block of the city rather than a row of boxes:

- **Crowns that name the place**: setbacks stepping in as the towers rise, spires with red beacons, and wooden water tanks on the low roofs — the most New York object on any roof in the city. A row of equal rectangles is a bar chart, not a skyline.
- **A street**: headlights running one way and tail lights the other, and forty-four people on the sidewalk. Traffic is the cheapest thing that makes a still drawing read as a city that is awake.
- 469 windows, most of them dark, because a city reads as lights precisely because most of it is not lit.

Three drawing mistakes worth recording, each caught only by looking at the render:

1. **The masses were invisible.** The far city was painted one step off the card colour, so there were lit windows floating in a void and no buildings at all. A silhouette has to read as a silhouette.
2. **The crowd stood in a perfect row.** A single multiplicative hash of `i * 71` came out almost arithmetic — a fence, not a sidewalk. Fixing it with a modulo of two hashes then piled everyone into one clump. Stratifying (one slot each, jittered inside it) was the only arrangement that read correctly.
3. **The tower stood in the paragraph on a phone.** The hero reserved its city band with `padding-block-end`, but the tower is positioned inside that band and is 1.63× as tall as it is wide — at 46vw it was 18rem tall in a 12rem band and rose straight into the text. **Reserving space only works if everything inside the reserve actually fits in it.**

**And then the reserve itself was the wrong idea.** The owner's note: «هيك ارتفاع او طول الهيرو كبير مش مناسب» — and separately, that the city background which used to run behind the whole page had gone missing. Both came from the same decision. Putting the city inside the hero meant the hero had to be tall enough to hold a skyline, which made the card enormous, and it meant the rest of the page lost its background entirely.

So the city went back to being a **page layer**, fixed to the foot of the viewport behind everything, and the hero became what it should have been: portrait and writing side by side, as tall as its own contents. The hero went from about 580px to 362px.

The thing that made the page layer work this time is that **the cards were made thinner on purpose** — 0.74 alpha in the dark theme against 0.9 everywhere else in the set — so the city glows through them instead of being hidden behind them. Full-bleed sections cover a viewport-wide backdrop almost completely; letting it through the glass is the only way a page-level city is ever seen. Measured with a lit window glowing through: accent 5.75:1, muted 7.96:1.

**And the hero got a real cityscape after all.** The owner asked for a Lottie of the city in it and named two: `city-scape-city-building` and `city-skyline-building`. The second is a daytime illustration — orange and teal blocks under a sunburst with white clouds — and nothing survives being dropped onto a night page. The first is the same line-art cityscape that had already **failed** as a page-wide band, where its buildings sat in one corner of a very wide empty frame and showed as two stray lines. At the size of a hero card, carrying its own 2002:670 ratio and anchored to the start edge, it is exactly right. **A piece of art is not good or bad on its own — it is good or bad at a size.**

It is absolutely positioned, so it adds a city and no height, and it is masked away from the writing on wide screens and moved behind the portrait on phones: the accent over one of its strokes measures 3.10:1, which is what the mask is for.

The marquee cards were sharing the portrait window's halo token, and a card wearing that glow put muted type at 4.00:1. The light spill now has its own token at a third of the strength.

---

### The corner, and a loader in disguise

The owner's note: «الزاوية الفاضية من الهيرو مش حلو تظل فاضية حط فيها اشي». The hero is a portrait on one side and writing beside it, which leaves the far corner doing nothing — and an empty corner in a night scene reads as an unfinished card rather than as air.

What went in there, after two false starts, is the owner's own pick: `taxi-app-loading`, which turns out to be **a city bent into a ring** with a cab going round it. It is left in the colours it was drawn in, at their request.

Two things that cost time and are worth writing down:

- **`media.corner` already means something.** Setting it drew the art twice — once in the hero, once floating above the card at the page corner, where the shared renderer puts a corner mark. The hero needed a slot of its own (`heroCorner`). *Check what a data field already does before reusing it.*
- **Half the catalogue's "animations" are loaders, and a loader is not decoration.** Rendered whole, this one is empty or half-drawn for about 60% of its 271 frames: it assembles the ring, holds it, then tears it down. On the page that means a corner that is blank more often than not. Proven by rendering the asset at fixed frames rather than trusting screenshots, which had been catching it at random points in the cycle.

The fix was to make the player loop only the part where the city is standing: `LottieMark` gained a **`segment`** prop (the dotLottie web player supports `[start, end]`), and the template names its range in data — `heroCornerSegment: [118, 212]`. **The same trick rescues any catalogue piece that is really a loading spinner**, and there are a lot of them: the شمسة this project rejected for مَشرَبيّة was one too, and could have been kept this way.

It is the heaviest asset in the set — 90 KB, 1174 fills, 652 strokes — and it roughly doubles the page's main-thread cost, from 1700ms to 4245ms per five seconds of scrolling. That is level with سِيق at 4342ms, which the owner has never had a complaint about, so it is being kept; but it is the number to look at first if this template ever feels slow.

---

**Built since نيويورك:** العالم (42) — the owner's pick: the world map and the globe.

Object and person, the test every template here is built to: the object is the world, and **the person is a pin stuck in it**. Not a portrait beside a map — a marker planted on it, with the ring still going out from where it landed. For a student putting a page on the internet, that is the whole reason for doing it, said in one image.

- **`hero: 'pin'`** is the eighteenth hero layout. The map fills the card, the marker stands on it with the portrait in its head, and a ring opens from its foot on a four-and-a-half second cycle. The point under the head is a `clip-path` triangle rather than the CSS border trick, which would need physical left and right to build and would fail the RTL check.
- **`background: 'atlas'`** rules the page with a graticule — the lines of latitude and longitude every map is built on — as two repeating gradients at 0 and 90 degrees. A grid is identical mirrored, so spelling it in degrees rather than keywords means it needs no RTL twin.
- **`card: 'legend'`** is an entry in a map legend: a ringed key mark in the margin and the reading beside it.

The art is 13 KB in total: a world map with gold routes running between the continents (12 KB), and a globe of bare meridians for the corner (1 KB — the smallest piece of fetched art in the set).

**Two colours that behave oppositely by theme.** The map is navy landmasses with gold routes, and the writing sits directly on it, so the binding case is text over art rather than text over a card:

| | worst colour | at 0.5 | shipped |
| --- | --- | --- | --- |
| light | navy landmass | muted 2.31:1 | 0.16 → 5.25:1 |
| dark | gold route | muted 3.25:1 | 0.32 → 5.05:1 |

On the sheet the navy is the danger because it is darker than the paper; at night the navy is *safer* than the card and the gold is the problem, because it is lighter. **Which half of a two-colour artwork is dangerous flips with the theme, so both have to be measured in both.** An atlas page wants a watermark, not a printed chart, and 0.16 is what a watermark measures.

**Then all three parts of it were wrong, and the notes were right.** The owner: the background was not good, the map was not visible at night, and the corner globe was not good either.

They were all one mistake. The map was **inside the hero card**, which left the rest of the page with nothing but a bare grid on it, and made the pin read as standing on a decoration rather than on the world. So the world moved to the page — a covering backdrop behind everything, with the cards **thinned to 0.76/0.74** so it shows through them instead of hiding behind them. The pin is now planted on the page itself.

**The night map was invisible for a reason worth writing down.** Navy landmasses on a near-black sheet have almost no contrast with it — which is exactly why every contrast measurement passed. *A measurement that passes because the art has vanished is not a pass.* The night now flips the whole map light and tints it to the template's mint, which is also what a chart looks like lit from behind.

The corner globe was a set of bare meridians and read as a wireframe rather than a planet. It is now the owner's pick, `earthh` — a rotating earth, 22 KB, complete at every frame, and already drawn in almost exactly this template's mint.

It was then still too small to read — 5rem at a fifth of an opacity, which is a smudge and not a planet. It is now **15rem at 0.7**, centred against the side of the card. The corner it sits in has no text anywhere near it, so there was never a reason for it to be either small or faint; the caution had simply been copied from decorations that do sit under writing.

It is the most expensive page in the set at **4810ms** per five seconds of scrolling, against سِيق's 4342ms: a covering backdrop is a full-viewport canvas being redrawn every frame. That is the number to look at first if this one ever feels slow.

---

**Built since العالم:** فن (43) — the owner's brief: a mix of the arts, music and painting and drama and the rest, all in one place. **It took three builds.**

**Build one was a stage** — curtains, a spotlight, hairline icons for the crafts. The reasoning was sound: a collection is not an object, and a stage is the one place that gathers the arts. The result was still wrong, because *a theatre is where art is performed, not art*. The verdict was blunt: the hero was very bad, the background was missing, the cards let nothing through, none of it looked like art.

**Build two was bold watercolour** — six pigment washes blooming across the whole page, cards thinned to 0.72 so the colour came through them. It answered every one of those notes literally and still came out wrong: blurred radial gradients in six hues are **the page every gradient generator makes**, soft pastel mush, which is the exact opposite of bold. It also had nothing visibly moving in it, and its one fetched piece turned out to be a screen wipe.

**Build three is a gallery, and it is the one that works.** A lit wall with a picture rail. The person is the first work hung on it: the portrait **mounted and framed**, with a museum label under it giving the name, the medium and the year — which is what the top of a CV already is. Two more works hang at the ends of the wall, and the four crafts sit under the writing as pigment chips.

- **`hero: 'frame'`** is the twenty-first hero layout. The wire above the frame is doing more work than the frame is: *drawing what a thing hangs from is most of what makes it read as hung rather than as a border.*
- **The label had to be given its own type scale.** Dropped into the hero it inherited display type, and the caption shouted louder than the work it named. Wall text is small, quiet and set tight.
- **The colour moved out of the page and into the art.** That is how a gallery actually works, and it is what finally made "bold" possible: the wall is quiet, the works are loud, and nothing is mush. The pigments remain decoration and never a surface for text, which is the rule that lets this stay the one template in the set built on more than one colour.

At **1926ms** it is also cheaper than either of the builds it replaced.

---

**Built since فن:** مَجلِس (44) — a business template, for a freelancer, and the body the owner named was the meeting.

**Every meeting illustration in the catalogue is unusable for the same reason: they already contain people.** Put a portrait beside a drawing of four strangers around a table and the portrait is a fifth stranger — the person is next to the picture instead of inside it, which is the failure this whole set is built to avoid. The only way somebody can be AT the table is to draw the table.

So it is drawn, seen from above: an ellipse, seats placed on the ellipse's own geometry and turned to face it, and **the head seat left empty**. That seat is where the portrait goes, overlapping the table edge the way سِيق's portrait stands in its doorway. The other seats belong to whoever is being met, which on a freelancer's page is the client.

- **`hero: 'table'`** is the twentieth hero layout, and the only fetched thing in it is the **handshake closing on the table** — because that is what a meeting is for, and it is the one event in a room where everything else is furniture.
- **`card: 'brief'`** numbers each project in the margin the way an agenda numbers its items, because a list of work shown to a client *is* an agenda.
- The page is ruled like a drafting plan, in degrees rather than keywords so the grid needs no RTL twin.

The palette is the one thing here that is not literal. A boardroom is grey and a grey page is a dull page, so the ink stays graphite and the accent is a deep violet — serious enough to send a client, and the one strong hue this set had not yet spent on a light ground. At **1473ms** it is also among the cheapest pages in the set: one 7 KB animation and an SVG that is painted once.

**Then the wall became the Mona Lisa.** «خلي الكارد شفاف والخلفية اعملها الموناليزا» — and then, seeing it: the area *around* her should be her own painted background, not a cream wall.

La Gioconda is five centuries out of copyright and the reproduction is a public-domain scan from Wikimedia Commons, resized to 560px and re-encoded to **77 KB**, served from this project. Nothing is fetched from anywhere else at runtime, which is the rule for every asset here.

She is used **twice from one file**: blown up, cropped to cover and blurred to 46px so her own sfumato landscape fills the page, and again at her true proportions in the middle. The blur is the whole trick — it is what turns a cropped photograph into a wall.

Three things that had to be measured or fixed:

- **Two layers compound.** With her landscape under the framed copy under a 0.50 card, muted type measured 3.72:1. The card went to 0.58 — still plainly transparent, she reads clearly through it — and the pair now holds 4.88:1 over her darkest passage.
- **The footer has no card, and under it is a painting.** Straight on her shadows muted type is 2.19:1. It is given the template's own glass, the same answer every covering backdrop in this set has needed.
- **`inset-inline-start: 50%` + `translateX(-50%)` is broken in Arabic.** The inset is measured from the right and the translate is always physical, so the two fought and put her 608px off the side of the screen. Centring with `inset-inline: 0; margin-inline: auto` has no direction in it — and the width needs a `100%` in its `min()`, because **an auto margin cannot centre a box wider than its container**: on a phone she was pinned to the start edge and hung 442px off the other side.

**A filter is a token too.** The globe in العالم's hero carried one `filter` for both themes while the map beside it switched, so on the oat sheet it stayed the bright cyan it was drawn in and washed out completely. Art tinted with a filter has to be declared in all three theme blocks like every other value.

An audit of every rule in the set that filters fetched art turned up four more single-filter cases — هِمّة, مَدى, سِيق and تسلا — and **all four are correct**: each either flattens the art and re-tints it to a fixed colour, which lands the same on both grounds, or only adjusts saturation, which has no theme in it. **The bug is not "one filter", it is one filter whose RESULT depends on the art's own brightness.** The same audit found a dead rule in تسلا, tinting a backdrop that was deleted when that page was made to feel electric.
