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
