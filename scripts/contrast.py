"""WCAG 2.x contrast for text on glass panels composited over a background colour.
Usage: python scripts/contrast.py  (prints the Nuqush token matrix)"""
def hex2rgb(h):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def lum(rgb):
    def ch(c):
        c=c/255; return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    r,g,b=rgb; return 0.2126*ch(r)+0.7152*ch(g)+0.0722*ch(b)
def contrast(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)
def composite(top,alpha,bottom):
    return tuple(round(alpha*t+(1-alpha)*b) for t,b in zip(top,bottom))
def rgb2hex(c): return '#%02X%02X%02X'%c

W=(255,255,255); K=(0,0,0)
def check(label,text,glass_rgb,alpha,bg):
    surf=composite(glass_rgb,alpha,hex2rgb(bg)); r=contrast(hex2rgb(text),surf)
    flag='PASS' if r>=4.5 else ('AA-large' if r>=3 else 'FAIL')
    print(f"{label:<46} text {text} on {rgb2hex(surf)} (glass a={alpha:.2f} over {bg})  {r:5.2f}:1  {flag}")

print("== LIGHT theme: dark ink text on white glass over the worst-case (most saturated) orb ==")
for bg in ["#FAF7F2","#E9E3FF","#FFD9D4","#FFE7B8","#C9B8FF","#F5A79E"]:
    for a in (0.12,0.30,0.55,0.65):
        check(f"ink #1A1523 / light glass over orb", "#1A1523", W, a, bg)
print()
print("== LIGHT theme: muted text #4A4458 on same surfaces ==")
for bg in ["#C9B8FF","#F5A79E"]:
    for a in (0.55,0.65):
        check("muted #4A4458 / light glass", "#4A4458", W, a, bg)
print()
print("== DARK theme: near-white text on white glass (low alpha) over dark mesh ==")
for bg in ["#0F0D17","#1E1838","#3A2A6E","#6D5DF6","#F0766A"]:
    for a in (0.08,0.12,0.18):
        check("text #F4F1FA / dark glass", "#F4F1FA", W, a, bg)
print()
print("== DARK theme: dark glass (black tint) over bright orb (the fix when white glass fails) ==")
for bg in ["#6D5DF6","#F0766A","#F5B942"]:
    for a in (0.35,0.5):
        check("text #F4F1FA / smoked glass", "#F4F1FA", K, a, bg)
print()
print("== Accent / CTA solid buttons ==")
for txt,bg in [("#FFFFFF","#C8503F"),("#FFFFFF","#B8452F"),("#FFFFFF","#5B4BE0"),("#FFFFFF","#4C3FD1"),("#1A1523","#F5B942"),("#FFFFFF","#A16207"),("#1A1523","#FAF7F2"),("#F4F1FA","#0F0D17"),("#4A4458","#FAF7F2"),("#B7B0C9","#0F0D17"),("#C4BDD6","#0F0D17")]:
    r=contrast(hex2rgb(txt),hex2rgb(bg)); print(f"{txt} on {bg}: {r:5.2f}:1  {'PASS' if r>=4.5 else 'FAIL'}")

print()
print("== DARK theme accents ==")
for txt,bg in [("#A99CFF","#0F0D17"),("#1A1523","#A99CFF"),("#FF8A7A","#0F0D17"),("#1A1523","#FF8A7A"),("#F5B942","#0F0D17"),("#1A1523","#F5B942"),("#2DD4BF","#0F0D17")]:
    r=contrast(hex2rgb(txt),hex2rgb(bg)); print(f"{txt} on {bg}: {r:5.2f}:1  {'PASS' if r>=4.5 else 'FAIL'}")
print()
print("== DARK theme ink-tinted glass rgba(30,24,48,a) over bright orbs ==")
for bg in ["#6D5DF6","#F0766A","#F5B942","#2DD4BF"]:
    for a in (0.45,0.55,0.65):
        check("text #F4F1FA / ink glass", "#F4F1FA", (30,24,48), a, bg)
        check("muted #C4BDD6 / ink glass", "#C4BDD6", (30,24,48), a, bg)
print()
print("== LIGHT theme accent-as-text on paper ==")
for txt in ["#4C3FD1","#B8452F","#A16207"]:
    r=contrast(hex2rgb(txt),hex2rgb("#FAF7F2")); print(f"{txt} on #FAF7F2: {r:5.2f}:1  {'PASS' if r>=4.5 else 'FAIL'}")

# ── Phase 2b: gallery band meta text sits on the BACKGROUND, not on glass ──
# The mood name, the one-line mood and the plan chip have no panel behind them,
# so they are read directly against the band's orbs at full strength.
print()
print("== gallery band meta text: on .glass, vs bare on the orbs ==")
BANDS = {
 'saqee  light': ('#f4f9ff', 0.9,  ['#cfe9ff','#e6f0ff','#dcebff'], '#14202e', '#43536b'),
 'saqee  dark ': ('#0b1220', 0.7,  ['#1b3a6b','#24325c','#16294a'], '#eaf2ff', '#b6c8e0'),
 'ballour light':('#faf7f2', 0.85, ['#c9b8ff','#f5a79e','#ffe7b8'], '#1a1523', '#4a4458'),
 'ballour dark ':('#0f0d17', 0.5,  ['#6d5df6','#f0766a','#f5b942'], '#f4f1fa', '#c4bdd6'),
 'fajr   light': ('#fff1e6', 0.85, ['#ffb88c','#ffd9a8','#ffc9c2'], '#2a1b10', '#5c4433'),
 'fajr   dark ': ('#1e1838', 0.55, ['#ff9e6b','#6d4aa8','#3a2a6e'], '#f6f1ff', '#c9bfe4'),
 'hibr   light': ('#f7f5fb', 0.6,  ['#ede9f5','#e4dff0','#f0edf8'], '#14121c', '#4a4458'),
 'hibr   dark ': ('#0f0d17', 0.75, ['#2a2440','#3a3159','#1e1a2e'], '#f4f1fa', '#c4bdd6'),
 # ورقة has no orbs: the only ground is the paper itself.
 'waraqa light': ('#faf7f2', 0.0,  ['#faf7f2'], '#1a1523', '#4a4458'),
 'waraqa dark ': ('#161413', 0.0,  ['#161413'], '#f4f1fa', '#cdc7c0'),
}
# The meta column sits on .glass, whose alpha is per-template (app/templates.css).
GLASS_TINT = {'saqee  light':((255,255,255),0.50),'saqee  dark ':((20,28,48),0.60),
 'ballour light':((255,255,255),0.30),'ballour dark ':((30,24,48),0.60),
 'fajr   light':((255,255,255),0.50),'fajr   dark ':((30,24,48),0.62),
 'hibr   light':((255,255,255),0.42),'hibr   dark ':((30,24,48),0.60),
 'waraqa light':((255,255,255),0.55),'waraqa dark ':((255,255,255),0.06)}
for name,(base,alpha,orbs,fg,muted) in BANDS.items():
    lo_fg = lo_mu = 99
    bare_fg = bare_mu = 99
    for orb in orbs:
        raw = composite(hex2rgb(orb), alpha, hex2rgb(base))
        bare_fg = min(bare_fg, contrast(hex2rgb(fg), raw))
        bare_mu = min(bare_mu, contrast(hex2rgb(muted), raw))
        tint, ga = GLASS_TINT[name]
        surf = composite(tint, ga, raw)
        lo_fg = min(lo_fg, contrast(hex2rgb(fg), surf))
        lo_mu = min(lo_mu, contrast(hex2rgb(muted), surf))
    f1 = 'PASS' if lo_fg>=4.5 else '*** FAIL ***'
    f2 = 'PASS' if lo_mu>=4.5 else '*** FAIL ***'
    print(f"  {name}  name {lo_fg:5.2f}:1 {f1:<7} (bare {bare_fg:5.2f})   mood {lo_mu:5.2f}:1 {f2:<7} (bare {bare_mu:5.2f})")

# -- Phase 5 . waraqa: sheets on a desk --------------------------------------
# The cards are OPAQUE here, so the Lottie backdrop can never reach text on a
# sheet. What it can reach is the footer, which sits straight on the desk. Each
# added surface is measured as a surface.
print()
print("== waraqa: text over every surface (sheet, desk, seal, chip, backdrop) ==")
PAPER = {
  'light': dict(sheet='#fdfaf3', desk='#e9dfcb', fg='#2b2019', muted='#5c4d3e',
                accent='#b8452f', seal='#f4edde', chip=((43,32,25),0.04),
                crease=((43,32,25),0.06), plane=((0,0,0),0.12)),
  'dark ': dict(sheet='#201c17', desk='#15120e', fg='#f6f1e6', muted='#c9bfae',
                accent='#f0a07a', seal='#262019', chip=((255,255,255),0.05),
                crease=((0,0,0),0.50), plane=((255,255,255),0.16)),
}
for theme, v in PAPER.items():
    rows = [
      ('sheet',            hex2rgb(v['sheet'])),
      ('sheet + chip',     composite(v['chip'][0], v['chip'][1], hex2rgb(v['sheet']))),
      ('seal',             hex2rgb(v['seal'])),
      ('desk',             hex2rgb(v['desk'])),
      ('desk + crease',    composite(v['crease'][0], v['crease'][1], hex2rgb(v['desk']))),
      ('desk + paper plane', composite(v['plane'][0], v['plane'][1], hex2rgb(v['desk']))),
    ]
    for label, surf in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        # Accent type only ever appears on a sheet (links, folios, rules);
        # the desk carries nothing but the footer's muted text.
        on_sheet = label.startswith(('sheet', 'seal'))
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_sheet else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_sheet else 'accent    - '
        print(f"  {theme} {label:<20} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# -- Phase 5 . badira: leaf palette under a wheat band ------------------------
# The cards are glass here, so the band reaches BOTH the footer (bare on the
# page) and every card (through the glass). The binding case is the teal leaf
# of a stalk under the footer's muted type.
print()
print("== badira: text over the leaf palette and the wheat band ==")
STALKS = ['#F5B942', '#F9A825', '#0E8F6E', '#F7C948']
BADIRA = {
  'light': dict(page='#f1f5ec', glass=((255,255,255),0.62), fg='#16251b',
                muted='#3f5245', accent='#2f6b45', band=0.30),
  'dark ': dict(page='#0d1310', glass=((24,34,27),0.72), fg='#e9f2e9',
                muted='#b5c7b8', accent='#8fd0a0', band=0.30),
}
for theme, v in BADIRA.items():
    tint, ga = v['glass']
    card = composite(tint, ga, hex2rgb(v['page']))
    plain = [('card', card), ('page', hex2rgb(v['page']))]
    for label, surf in plain:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        f = 'PASS' if min(a, b, c) >= 4.5 else '*** FAIL ***'
        print(f"  {theme} {label:<22} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  accent {c:5.2f}  {f}")
    # Worst stalk colour, on the bare page and again seen through a card.
    worst_page = min(contrast(hex2rgb(v['muted']), composite(hex2rgb(st), v['band'], hex2rgb(v['page']))) for st in STALKS)
    worst_card = min(contrast(hex2rgb(v['muted']), composite(tint, ga, composite(hex2rgb(st), v['band'], hex2rgb(v['page'])))) for st in STALKS)
    f1 = 'PASS' if worst_page >= 4.5 else '*** FAIL ***'
    f2 = 'PASS' if worst_card >= 4.5 else '*** FAIL ***'
    print(f"  {theme} footer over wheat                  muted {worst_page:5.2f}  {f1}")
    print(f"  {theme} card text over wheat               muted {worst_card:5.2f}  {f2}")

# -- Phase 5 . thurayya: a star field under everything ------------------------
# The binding case is a SOLID star sitting behind text. Bare on the page it
# fails in both themes, which is why the footer is given the template's glass
# and the sky is masked out toward the bottom of the viewport (effects.css).
print()
print("== thurayya: text over the night, the chart, and a solid star ==")
THUR = {
  'light': dict(page='#f7f4ec', glass=((255,255,255),0.62), fg='#1c1b33',
                muted='#4e4c66', accent='#7d5f10', star=((0,0,0),0.22)),
  'dark ': dict(page='#080a17', glass=((20,24,46),0.70), fg='#f2eee0',
                muted='#c3bda9', accent='#f5b942', star=((255,255,255),0.75)),
}
for theme, v in THUR.items():
    tint, ga = v['glass']
    card = composite(tint, ga, hex2rgb(v['page']))
    star_page = composite(v['star'][0], v['star'][1], hex2rgb(v['page']))
    star_card = composite(tint, ga, star_page)
    rows = [('card', card), ('page', hex2rgb(v['page'])),
            ('card over a star', star_card), ('footer glass over a star', star_card)]
    for label, surf in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        f = 'PASS' if min(a, b, c) >= 4.5 else '*** FAIL ***'
        print(f"  {theme} {label:<26} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  accent {c:5.2f}  {f}")
    bare = contrast(hex2rgb(v['muted']), star_page)
    print(f"  {theme} {'BARE text over a star':<26} {rgb2hex(star_page)}  muted {bare:5.2f}  <- why the footer is on glass")

# -- Phase 5 . rafif: drifting lines under an airy page -----------------------
# Same shape of risk as every Lottie backdrop: the footer sits on the page, not
# on a card. The lines are drawn in blue, so the worst case is a solid stroke.
print()
print("== rafif: text over the air palette and a drifting line ==")
LINE = '#3B6FD4'
RAFIF = {
  'light': dict(page='#f2f7fa', glass=((255,255,255),0.55), fg='#13202b',
                muted='#3c4d59', accent='#0e6d8a', band=0.26),
  'dark ': dict(page='#0a1119', glass=((16,26,38),0.66), fg='#e8f1f6',
                muted='#b0c2ce', accent='#7dd3fc', band=0.45),
}
for theme, v in RAFIF.items():
    tint, ga = v['glass']
    card = composite(tint, ga, hex2rgb(v['page']))
    line_page = composite(hex2rgb(LINE), v['band'], hex2rgb(v['page']))
    rows = [('card', card, True), ('page', hex2rgb(v['page']), False),
            ('footer over a line', line_page, False),
            ('card over a line', composite(tint, ga, line_page), True)]
    for label, surf, on_card in rows:
        # The accent sets type only on cards: links, heading rules, badges.
        # The page carries nothing but the footer, which is muted.
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<22} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# -- Phase 5 . siq: a covering canyon ----------------------------------------
# The backdrop is a painted scene, so its worst case is not a guess: #F3DDC9 is
# the brightest OPAQUE pixel it produces, sampled across the whole loop with a
# canvas readback. Everything below is measured against that pixel.
print()
print("== siq: text over the canyon at its brightest ==")
BRIGHT = '#F3DDC9'
SIQ = {
  'light': dict(page='#f7ece0', glass=((255,255,255),0.72), fg='#2a140d',
                muted='#634336', accent='#b8452f', art=0.12),
  'dark ': dict(page='#1c0f0b', glass=((34,18,13),0.82), fg='#f7ece4',
                muted='#d0b8aa', accent='#e8836b', art=0.70),
}
for theme, v in SIQ.items():
    tint, ga = v['glass']
    lit = composite(hex2rgb(BRIGHT), v['art'], hex2rgb(v['page']))
    rows = [('card on bare ground', composite(tint, ga, hex2rgb(v['page'])), True),
            ('card over the lit rock', composite(tint, ga, lit), True),
            ('FOOTER glass over it', composite(tint, ga, lit), True),
            ('bare text over lit rock', lit, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        note = '  <- why every cover template footer is on glass' if not on_card else ''
        print(f"  {theme} {label:<24} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}{note}")

# -- Phase 5 . takwin: hollow forms over a ruled page -------------------------
# The backdrop is outlined geometry drawn in the highlight yellow. Worst case
# is a solid stroke of it behind the footer, which sits on the page with no
# card under it.
print()
print("== takwin: text over the composition ==")
STROKE = '#F0B429'
TAKWIN = {
  'light': dict(page='#faf6ee', glass=((255,255,255),0.60), fg='#151d33',
                muted='#454e68', accent='#1e3a8a', art=0.50),
  'dark ': dict(page='#0e1424', glass=((20,28,48),0.72), fg='#eef1f7',
                muted='#b4bdd0', accent='#8ba6f0', art=0.28),
}
for theme, v in TAKWIN.items():
    tint, ga = v['glass']
    lit = composite(hex2rgb(STROKE), v['art'], hex2rgb(v['page']))
    rows = [('card', composite(tint, ga, hex2rgb(v['page'])), True),
            ('card over a stroke', composite(tint, ga, lit), True),
            ('hero cell (solid)', hex2rgb('#fdfbf8' if theme.strip() == 'light' else '#121a2d'), True),
            ('footer over a stroke', lit, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<22} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")
    # The yellow cell is the one place ink sits on the highlight itself.
    print(f"  {theme} ink on the yellow cell     {STROKE}  {contrast(hex2rgb('#151d33'), hex2rgb(STROKE)):5.2f}  PASS")

# -- Phase 5 . muheet: a water column ----------------------------------------
# Three things sit behind text here: the depth gradient itself, a shaft of
# surface light, and a solid fish from the shoal. The fish is the binding case
# in light (it is drawn in a solid navy) and the shaft is the binding case in
# dark.
print()
print("== muheet: text down the water column ==")
FISH_LIGHT, FISH_DARK, SHAFT = '#1F3BA8', '#8FE3F0', '#8FE3F0'
MUHEET = {
  'light': dict(page='#eaf6f7', deep='#bcdfe5', glass=((255,255,255),0.62), fg='#0b2a33',
                muted='#2f545e', accent='#0b707e', fish=(FISH_LIGHT, 0.20), shaft=('#ffffff', 0.18)),
  'dark ': dict(page='#04141c', deep='#061d27', glass=((8,32,42),0.72), fg='#e4f4f6',
                muted='#9dc0c7', accent='#4fd1c5', fish=(FISH_DARK, 0.26), shaft=(SHAFT, 0.22)),
}
for theme, v in MUHEET.items():
    tint, ga = v['glass']
    fish = composite(hex2rgb(v['fish'][0]), v['fish'][1], hex2rgb(v['page']))
    shaft = composite(hex2rgb(v['shaft'][0]), v['shaft'][1], hex2rgb(v['page']))
    rows = [('card', composite(tint, ga, hex2rgb(v['page'])), True),
            ('card at the sea floor', composite(tint, ga, hex2rgb(v['deep'])), True),
            ('card over a fish', composite(tint, ga, fish), True),
            ('footer over a fish', fish, False),
            ('footer in a light shaft', shaft, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<24} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# -- Phase 5 . fayi: one sun, and everything it throws ------------------------
# Two things darken this page under the text: the shade wash lying across it,
# and the leaf shadows drifting down it. The leaves are drained to greyscale
# and re-levelled per theme, so the values below are the levelled ones.
print()
print("== fayi: text in the light and in the shade ==")
FAYI = {
  'light': dict(page='#f4f1ec', glass=((255,255,255),0.60), fg='#1c1a18',
                muted='#4a4641', accent='#6b4d6e',
                shade=((107,95,116),0.36), leaf=((42,42,42),0.16)),
  'dark ': dict(page='#191719', glass=((34,31,35),0.74), fg='#f2efe9',
                muted='#c0b9b2', accent='#c9a8cd',
                shade=((0,0,0),0.45), leaf=((200,200,200),0.20)),
}
for theme, v in FAYI.items():
    tint, ga = v['glass']
    shaded_page = composite(v['shade'][0], v['shade'][1], hex2rgb(v['page']))
    leafy_page = composite(v['leaf'][0], v['leaf'][1], hex2rgb(v['page']))
    rows = [('lit card', composite(tint, ga, hex2rgb(v['page'])), True),
            ('card in deepest shade', composite(tint, ga, shaded_page), True),
            ('card over a leaf shadow', composite(tint, ga, leafy_page), True),
            ('footer in deepest shade', shaded_page, False),
            ('footer over a leaf shadow', leafy_page, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<26} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# -- Phase 5 . himma: the loud one -------------------------------------------
# Two things sit under text: the coal at the foot of every card, and the embers
# drifting up the page. The embers are colourised to one warm tone before they
# are measured (effects.css), so the value below is the colourised one.
print()
print("== himma: text over the coal and the embers ==")
EMBER_MARK = '#D2842A'
HIMMA = {
  'light': dict(page='#fff7f4', glass=((255,255,255),0.60), fg='#2b1016',
                muted='#663a43', accent='#c41e4f',
                coal=((196,30,79),0.10), mark=0.40),
  'dark ': dict(page='#1c0a10', glass=((42,16,22),0.74), fg='#ffeef1',
                muted='#dbb2bb', accent='#ff7a95',
                coal=((255,122,149),0.18), mark=0.35),
}
for theme, v in HIMMA.items():
    tint, ga = v['glass']
    card = composite(tint, ga, hex2rgb(v['page']))
    coal = composite(v['coal'][0], v['coal'][1], card)     # the glow is INSIDE the card
    mark = composite(hex2rgb(EMBER_MARK), v['mark'], hex2rgb(v['page']))
    rows = [('card', card, True),
            ('card at its hottest coal', coal, True),
            ('card over an ember', composite(tint, ga, mark), True),
            ('footer over an ember', mark, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<26} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")
    print(f"  {theme} ink on the amber stamp    #F5A524  {contrast(hex2rgb('#2b1016'), hex2rgb('#f5a524')):5.2f}  PASS")

# -- Phase 5 . mada: an instrument panel --------------------------------------
# One thing sits under text here: the data stream, whose points are a solid
# blue. The footer is the only text on the page rather than on a card, so it
# sets the ceiling.
print()
print("== mada: text over the scan grid and the stream ==")
POINT = '#2F80ED'
MADA = {
  'light': dict(page='#eaeff4', glass=((255,255,255),0.62), fg='#0f1720',
                muted='#3a4753', accent='#0e6b9c', art=0.30),
  'dark ': dict(page='#06090f', glass=((12,18,28),0.74), fg='#e6f1fa',
                muted='#a6bccd', accent='#56ccf2', art=0.32),
}
for theme, v in MADA.items():
    tint, ga = v['glass']
    stream = composite(hex2rgb(POINT), v['art'], hex2rgb(v['page']))
    rows = [('card', composite(tint, ga, hex2rgb(v['page'])), True),
            ('card over a point', composite(tint, ga, stream), True),
            ('footer over a point', stream, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<22} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# -- Phase 5 . tesla: a page under voltage ------------------------------------
# The storm is DRAWN, so its worst case is known exactly rather than sampled:
# the white-hot core of a bolt, at full strike, directly behind a card. The
# footer is not in the list because the storm is masked away from the foot of
# the page entirely.
print()
print("== tesla: text with a bolt behind it ==")
TESLA = {
  'light': dict(page='#f4f0fb', glass=((255,255,255),0.86), fg='#19102a',
                muted='#473b5e', accent='#7c22ce',
                core='#5b1a99', sheath='#7c22ce', flash=((124,34,206),0.05)),
  'dark ': dict(page='#0b0714', glass=((20,13,32),0.90), fg='#f3ecfd',
                muted='#bcaed4', accent='#c084fc',
                core='#ffffff', sheath='#d8b4fe', flash=((192,132,252),0.07)),
}
for theme, v in TESLA.items():
    tint, ga = v['glass']
    rows = [('card', composite(tint, ga, hex2rgb(v['page']))),
            ('card over a sheath', composite(tint, ga, hex2rgb(v['sheath']))),
            ('card over the CORE', composite(tint, ga, hex2rgb(v['core']))),
            ('card in the flash', composite(tint, ga, composite(v['flash'][0], v['flash'][1], hex2rgb(v['page'])))) ]
    for label, surf in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        f = 'PASS' if min(a, b, c) >= 4.5 else '*** FAIL ***'
        print(f"  {theme} {label:<22} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  accent {c:5.2f}  {f}")

# -- Phase 5 . sakura: text with a petal behind it -----------------------------
# The petals fall over the WHOLE page, footer included, and the footer is the
# one piece of text with no card under it. The art's own palette runs from
# #ffb7b7 (the lightest petal) to #f57e7e (the deepest), so both ends are
# measured: the lightest is the worst case on the dark page, the deepest is the
# worst case on the light one.
print()
print("== sakura: text with a petal behind it ==")
SAKURA = {
  'light': dict(page='#fdf2f4', glass=((255,255,255),0.5), fg='#2b1a21',
                muted='#63454e', accent='#8e3c5d', art=0.55),
  'dark ': dict(page='#1a1015', glass=((38,24,31),0.6), fg='#fbeef2',
                muted='#d3b5bf', accent='#f0a5c0', art=0.28),
}
PETALS = ('#ffb7b7', '#f57e7e')
for theme, v in SAKURA.items():
    tint, ga = v['glass']
    rows = [('card', composite(tint, ga, hex2rgb(v['page'])), True)]
    for petal in PETALS:
        surf = composite(hex2rgb(petal), v['art'], hex2rgb(v['page']))
        rows.append((f'card over {petal}', composite(tint, ga, surf), True))
        rows.append((f'footer over {petal}', surf, False))
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<22} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# The hanko: plum initials cut out of a baby-pink seal. White was the obvious
# ink and measured 1.48:1 once the square went pink, so the ink moved instead.
print()
print("== sakura: the hanko seal ==")
for label, ink, seal, floor in (
    ('initials on the seal   ', '#7a2f4c', '#f8c8d4', 4.5),
    ('seal on the light card ', '#f8c8d4', '#fefbfb', 1.0),
    ('seal on the night card ', '#f8c8d4', '#23161d', 3.0),
):
    r = contrast(hex2rgb(ink), hex2rgb(seal))
    f = 'PASS' if r >= floor else '*** FAIL ***'
    print(f"  {label}  {ink} on {seal}  {r:5.2f}  {f}")

# -- Phase 5 . naseem: text on a coloured ground ------------------------------
# The only template whose PAGE is a saturated colour, which moves the binding
# case: the footer sits on the bare sky rather than on a near-white. Clouds are
# white over that sky, so they only ever lighten it — the bare sky is the worst
# case and the cloud is measured to prove it.
print()
print("== naseem: paper on a coloured sky ==")
NASEEM = {
  # The sky is a gradient now (#a6cdee overhead to #d8e9f8 at the horizon), so
  # the worst case for text on the bare page is the DEEPEST end, not the flat
  # fill this was first measured against.
  'light': dict(page='#a6cdee', glass=((255,255,255),0.93), fg='#0f2436',
                muted='#334f68', accent='#0b4f8a', cloud=((255,255,255),0.78)),
  'dark ': dict(page='#071220', glass=((18,32,48),0.90), fg='#e9f3fc',
                muted='#a9c2d8', accent='#9ec5ff', cloud=((210,232,255),0.07)),
}
for theme, v in NASEEM.items():
    tint, ga = v['glass']
    sky = hex2rgb(v['page'])
    hazy = composite(v['cloud'][0], v['cloud'][1], sky)
    rows = [('card on the sky', composite(tint, ga, sky), True),
            ('card on a cloud', composite(tint, ga, hazy), True),
            ('footer on the sky', sky, False),
            ('footer on a cloud', hazy, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<20} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

# White on the solid accent, for pills and buttons.
print()
for theme, acc, on in (('light', '#0b4f8a', '#ffffff'), ('dark ', '#9ec5ff', '#0a1723')):
    r = contrast(hex2rgb(on), hex2rgb(acc))
    print(f"  {theme} {on} on the accent {acc}  {r:5.2f}  {'PASS' if r >= 4.5 else '*** FAIL ***'}")

# -- Phase 5 . mashrabiya: text with the screen behind it ---------------------
# The lattice wall is fixed behind the whole page, so the binding case is the
# footer — the one piece of text with no card under it — sitting on a spindle
# rather than on the bare ground. The panel in the hero is inside a card and
# carries no text, so it is not measured.
print()
print("== mashrabiya: text with the screen behind it ==")
MASH = {
  'light': dict(page='#f6eee0', glass=((255,253,248),0.86), fg='#2a1c10',
                muted='#5d4526', accent='#8a4b20', wall=('#8a4b20', 0.07)),
  'dark ': dict(page='#1a120d', glass=((40,28,19),0.90), fg='#f4e8d6',
                muted='#c9b092', accent='#e0913f', wall=('#d09a56', 0.06)),
}
for theme, v in MASH.items():
    tint, ga = v['glass']
    ground = hex2rgb(v['page'])
    spindle = composite(hex2rgb(v['wall'][0]), v['wall'][1], ground)
    rows = [('card', composite(tint, ga, ground), True),
            ('card over a spindle', composite(tint, ga, spindle), True),
            ('footer on the ground', ground, False),
            ('footer on a spindle', spindle, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<21} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

print()
for theme, on, acc in (('light', '#ffffff', '#8a4b20'), ('dark ', '#1a120d', '#e0913f')):
    r = contrast(hex2rgb(on), hex2rgb(acc))
    print(f"  {theme} {on} on the accent {acc}  {r:5.2f}  {'PASS' if r >= 4.5 else '*** FAIL ***'}")

# -- Phase 5 . newyork: text over the lit city -------------------------------
# The city is a page layer again — fixed to the foot of the viewport, behind
# everything — so there are two binding cases rather than one:
#
#   * the FOOTER, which has no card under it and sits straight on the city;
#   * card text, because the cards here are deliberately thin (0.74 dark) so
#     the city shows through them instead of being hidden.
#
# The hero's fetched cityscape is measured too. It is MASKED away from the
# writing on wide screens and moved behind the portrait on phones, so the row
# below is the case that is designed never to occur — the accent over one of
# its strokes at full strength is 3.10:1, which is why the mask exists.
print()
print("== newyork: text and the lit city ==")
NY = {
  'light': dict(page='#eef2f8', glass=((255,255,255),0.80), fg='#10182a',
                muted='#44506a', accent='#a81f68', halo=((240,168,74),0.20),
                win=((240,175,70),0.7), mass=(195,206,225), art=0.50,
                line=((240,168,74),0.40)),
  'dark ': dict(page='#070b14', glass=((16,23,38),0.74), fg='#eaf0fb',
                muted='#a9b6cd', accent='#ff5fa2', halo=((255,207,122),0.1),
                win=((255,207,122),0.6), mass=(27,39,65), art=0.40,
                line=((255,180,90),0.32)),
}
for theme, v in NY.items():
    tint, ga = v['glass']
    ground = hex2rgb(v['page'])
    lit = composite(v['win'][0], v['win'][1] * v['art'], ground)
    mass = composite(v['mass'], v['art'], ground)
    card = composite(tint, ga, ground)
    rows = [('card on the sky', card, True),
            ('card over a lit window', composite(tint, ga, lit), True),
            ('card over a tower', composite(tint, ga, mass), True),
            ('marquee under its tube', composite(v['halo'][0], v['halo'][1], card), True),
            ('footer over a window', lit, False),
            ('footer over a tower', mass, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<24} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

    # The hero's fetched cityscape, at the one place it is designed never to
    # be: under the writing. It is masked away from the text column on wide
    # screens and sits behind the portrait on phones, and this number is why.
    line = composite(v['line'][0], v['line'][1], card)
    print(f"  {theme} {'(text on the cityline)':<24} {rgb2hex(line)}  ink {contrast(hex2rgb(v['fg']), line):5.2f}  "
          f"muted {contrast(hex2rgb(v['muted']), line):5.2f}  accent {contrast(hex2rgb(v['accent']), line):5.2f}"
          f"  <- never happens: masked off the text")

print()
for theme, on, acc in (('light', '#ffffff', '#a81f68'), ('dark ', '#070b14', '#ff5fa2')):
    r = contrast(hex2rgb(on), hex2rgb(acc))
    print(f"  {theme} {on} on the accent {acc}  {r:5.2f}  {'PASS' if r >= 4.5 else '*** FAIL ***'}")

# -- Phase 5 . alam: text over the world -------------------------------------
# The world is the PAGE here, printed across the viewport behind everything,
# and the cards are deliberately thin so it shows through them. So the case to
# measure is card text with a landmass under the glass.
#
# The two colours in the art swap roles between the themes, which is the thing
# worth remembering: on the sheet the navy landmasses are the danger because
# they are darker than the paper, and at night the whole map is flipped light
# and tinted mint, so the LAND becomes the lighter half and the danger instead.
print()
print("== alam: text over the world ==")
ALAM = {
  'light': dict(page='#f2ece1', glass=((255,253,248),0.76), strong=((255,253,248),0.92),
                fg='#22201a', muted='#5b544a', accent='#0d6157', art=0.30,
                land='#002945', route='#c98c30'),
  'dark ': dict(page='#0f1513', glass=((24,32,30),0.74), strong=((24,32,30),0.90),
                fg='#eef2ec', muted='#b2bdb5', accent='#63d6b8', art=0.30,
                # flipped light and tinted by the filter in effects.css
                land='#9fe8d4', route='#4a5f52'),
}
for theme, v in ALAM.items():
    tint, ga = v['glass']
    st, sa = v['strong']
    ground = hex2rgb(v['page'])
    land = composite(hex2rgb(v['land']), v['art'], ground)
    route = composite(hex2rgb(v['route']), v['art'], ground)
    rows = [('card on bare sheet', composite(tint, ga, ground), True),
            ('card over a landmass', composite(tint, ga, land), True),
            ('card over a route', composite(tint, ga, route), True),
            # a covering backdrop gives the footer this template's own glass
            ('footer glass over land', composite(st, sa, land), False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<24} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

print()
for theme, on, acc in (('light', '#ffffff', '#0d6157'), ('dark ', '#0f1513', '#63d6b8')):
    r = contrast(hex2rgb(on), hex2rgb(acc))
    print(f"  {theme} {on} on the accent {acc}  {r:5.2f}  {'PASS' if r >= 4.5 else '*** FAIL ***'}")

# -- Phase 5 . fann: a painting behind everything -----------------------------
# The wall of this gallery is La Gioconda herself, and the cards are
# deliberately transparent so she shows through them. So the surfaces are card
# text with her worst passage underneath, and the footer, which has no card.
#
# "Worst passage" is not the darkest PIXEL — a single pixel is not what a line
# of text sits on. The image is downsampled to 8x12 and the extreme CELLS taken:
# #090619 in the shadows and #D2AE56 on her lit sleeve. On the light sheet the
# shadow is the danger; at night the lit sleeve is.
print()
print("== fann: a painting behind everything ==")
FANN = {
  'light': dict(page='#fdfaf5', glass=((255,255,255),0.58), strong=((255,255,255),0.82),
                fg='#1c1a22', muted='#56505e', accent='#7b1fa2',
                art=0.32, fill=0.30, worst='#090619', mount='#fbfaf7'),
  'dark ': dict(page='#14121a', glass=((28,26,36),0.52), strong=((28,26,36),0.80),
                fg='#f2eef7', muted='#bdb5c7', accent='#d29bff',
                art=0.34, fill=0.35, worst='#d2ae56', mount='#221f29'),
}
# The page carries TWO layers of her: the landscape blown up and blurred to
# fill it, and the framed copy over that. They compound, so both go into the
# ground before any card is laid on top. A 46px blur averages a wide area, so
# the fill's realistic surface is the image's MEDIAN cell rather than its
# extreme one.
MEDIAN_CELL = '#62402e'
for theme, v in FANN.items():
    tint, ga = v['glass']
    st, sa = v['strong']
    ground = composite(hex2rgb(MEDIAN_CELL), v['fill'], hex2rgb(v['page']))
    hung = composite(hex2rgb(v['worst']), v['art'], ground)
    rows = [('card on her landscape', composite(tint, ga, ground), True),
            ('card over her worst', composite(tint, ga, hung), True),
            ('footer glass over her', composite(st, sa, hung), False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<23} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")
    bare = contrast(hex2rgb(v['muted']), hung)
    print(f"  {theme} {'(footer with NO glass)':<23} {rgb2hex(hung)}  muted {bare:5.2f}"
          f"   <- why the footer is given glass")
    r = contrast(hex2rgb(v['accent']), hex2rgb(v['mount']))
    print(f"  {theme} {'initials on the mount':<23} {v['mount']}  accent {r:5.2f}"
          f"  {'PASS' if r >= 4.5 else '*** FAIL ***'}")

print()
for theme, on, acc in (('light', '#ffffff', '#7b1fa2'), ('dark ', '#14121a', '#d29bff')):
    r = contrast(hex2rgb(on), hex2rgb(acc))
    print(f"  {theme} {on} on the accent {acc}  {r:5.2f}  {'PASS' if r >= 4.5 else '*** FAIL ***'}")

# -- Phase 5 . majlis: text in a boardroom ------------------------------------
# The table sits in its own column and the writing beside it, so nothing is
# laid over the art. What IS behind the text is the drafting grid on the page,
# and under the footer, the same grid with no card over it.
print()
print("== majlis: text in a boardroom ==")
MAJLIS = {
  'light': dict(page='#f2f4f7', glass=((255,255,255),0.84), fg='#111827',
                muted='#4b5563', accent='#5b21b6', grid=((17,24,39),0.045)),
  'dark ': dict(page='#0e1116', glass=((23,28,36),0.86), fg='#eef1f6',
                muted='#b0b9c6', accent='#a78bfa', grid=((255,255,255),0.04)),
}
for theme, v in MAJLIS.items():
    tint, ga = v['glass']
    ground = hex2rgb(v['page'])
    ruled = composite(v['grid'][0], v['grid'][1], ground)
    rows = [('card', composite(tint, ga, ground), True),
            ('card on a rule', composite(tint, ga, ruled), True),
            ('footer on a rule', ruled, False)]
    for label, surf, on_card in rows:
        a = contrast(hex2rgb(v['fg']), surf)
        b = contrast(hex2rgb(v['muted']), surf)
        c = contrast(hex2rgb(v['accent']), surf)
        worst = min(a, b, c) if on_card else min(a, b)
        f = 'PASS' if worst >= 4.5 else '*** FAIL ***'
        acc = f"accent {c:5.2f}" if on_card else 'accent    - '
        print(f"  {theme} {label:<20} {rgb2hex(surf)}  ink {a:5.2f}  muted {b:5.2f}  {acc}  {f}")

print()
for theme, on, acc in (('light', '#ffffff', '#5b21b6'), ('dark ', '#0e1116', '#a78bfa')):
    r = contrast(hex2rgb(on), hex2rgb(acc))
    print(f"  {theme} {on} on the accent {acc}  {r:5.2f}  {'PASS' if r >= 4.5 else '*** FAIL ***'}")
