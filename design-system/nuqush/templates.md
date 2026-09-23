# Nuqush — Template Identity Matrix (36)

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
| 31 | rafif | رَفيف | رفّة هوا خفيفة — Quiver | light | pale air (#F2F7FA), 3 pale slow orbs + a Lottie of drifting line bundles | subtle | #0E6D8A / #7DD3FC | Cairo / IBM Plex Sans Arabic | soft | B | ✓ |
| 32 | siq | سِيق | ممرّ محفور بالصخر — The Siq | dark | rose rock (#1C0F0B) + a Lottie canyon as a covering scene | strong | #B8452F / #E8836B | Cairo / IBM Plex Sans Arabic | crisp | C | ✓ |
| 33 | takwin | تَكوين | أشكال بسيطة مرتّبة بقصد — Composition | light | warm white (#FAF6EE) + a visible 5rem grid, no orbs, a Lottie of hollow drifting forms | default | #1E3A8A / #8BA6F0 (highlight #F0B429) | Cairo / IBM Plex Sans Arabic | crisp | B | ✓ |
| 34 | muheet | مُحيط | قاع هادي وضوء نازل — The deep | dark | a depth gradient (#0E3A4C → #061D27), CSS light shafts, a drawn wreck on the floor, a Lottie shoal in the middle water | default | #0B707E / #4FD1C5 | Cairo / IBM Plex Sans Arabic | drift | C | ✓ |
| 35 | fayi | فَيء | ضوء بعد الظهر — Afternoon shade | light | warm grey (#F4F1EC) with a shade wash at the sun's angle, and a Lottie of leaf shadows drifting down it | default | #6B4D6E / #C9A8CD | Cairo / IBM Plex Sans Arabic | soft | B | ✓ |
| 36 | himma | هِمّة | اندفاع وشغف — Drive | light | warm blush (#FFF7F4) + embers drifting up, colourised to one crimson | default | #C41E4F / #FF7A95 (stamp #F5A524) | Cairo / IBM Plex Sans Arabic | rise | A | ✓ |

**Free tier (14):** صقيع، بلّور، ورقة، فجر، نسيم، حبر، بادِرة، ثُرَيّا، رَفيف، سِيق، تَكوين، مُحيط، فَيء، هِمّة — 9 light-leaning, 5 dark-leaning. Thirteen are built; نسيم is the one still on paper. The range is deliberate — ice, prism, dawn, ink, paper, leaf, night, air, rock, grid, sea, shade and ember — so a free page never looks like a demoted version of a paid one.

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

Two deviations from the ورقة row above, both deliberate:
- **The accent is Petra rose, not ink.** The all-ink palette measured fine and looked dead; one warm accent on the margin rule, the folios, the seal and the links is what makes the sheet read as paper rather than as a grey UI card.
- **Its backdrop flies over the page, not under it.** Every other template puts its background art behind the cards, but ورقة's sheets are opaque and full-width, so anything behind them is never seen. A paper plane passes above a desk anyway. Measured: a plane crossing a sheet darkens type and paper alike, leaving ink at 12.18:1 and the accent at 4.74:1.
**Phase 5 batches (6 each):** [3,4,5,6,10,11] → [12,13,15,18,19,23] → [8,9,14,16,17,22] → [20,21,24,26,27,28].

## Accent contrast (measured with `scripts/contrast.py`)

Accents marked as *light* are used for text/CTA on paper (#FAF7F2) and must pass ≥4.5:1; *dark* accents are used on #0F0D17. Any accent in this table that fails when a template is built is darkened (light) or lightened (dark) before the template ships. The MASTER accents are pre-verified; per-template accents are verified in that template's identity sheet.
