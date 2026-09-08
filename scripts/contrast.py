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
}
# The meta column sits on .glass, whose alpha is per-template (app/templates.css).
GLASS_TINT = {'saqee  light':((255,255,255),0.50),'saqee  dark ':((20,28,48),0.60),
 'ballour light':((255,255,255),0.30),'ballour dark ':((30,24,48),0.60),
 'fajr   light':((255,255,255),0.50),'fajr   dark ':((30,24,48),0.62),
 'hibr   light':((255,255,255),0.42),'hibr   dark ':((30,24,48),0.60)}
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
