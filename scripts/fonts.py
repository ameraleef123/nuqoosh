"""One-time font fetch. Downloads every subset of the families below into
public/fonts/ and writes faces.json, which generates app/fonts.css.

The output is COMMITTED. Nothing at build or run time touches Google:
run this only to change a family or a weight, then regenerate fonts.css.

    python scripts/fonts.py
"""
import urllib.request, re, os, sys, json
sys.stdout.reconfigure(encoding='utf-8')
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
FAMILIES = {
  "Cairo:wght@400..800":                        "cairo",
  "IBM+Plex+Sans+Arabic:wght@400;500;600;700":  "plex-arabic",
  "Amiri:wght@700":                             "amiri",
  "Almarai:wght@300;400;700;800":               "almarai",
  "Noto+Naskh+Arabic:wght@400..700":            "naskh",
  "Noto+Sans+Arabic:wght@400..700":             "noto-arabic",
}
os.makedirs("public/fonts", exist_ok=True)
faces, total = [], 0
for q, folder in FAMILIES.items():
    css = urllib.request.urlopen(urllib.request.Request(
        f"https://fonts.googleapis.com/css2?family={q}&display=swap", headers={"User-Agent": UA}), timeout=40).read().decode()
    os.makedirs(f"public/fonts/{folder}", exist_ok=True)
    for subset, body in re.findall(r"/\*\s*(\w[\w-]*)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S):
        if subset not in ("arabic", "latin", "latin-ext"): continue
        fam   = re.search(r"font-family:\s*'([^']+)'", body).group(1)
        style = re.search(r"font-style:\s*(\w+)", body).group(1)
        wt    = re.search(r"font-weight:\s*([\d ]+)", body).group(1).strip()
        ur    = re.search(r"unicode-range:\s*([^;]+);", body).group(1).strip()
        src   = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", body).group(1)
        path  = f"public/fonts/{folder}/{subset}-{wt.replace(' ', '-')}.woff2"
        data  = urllib.request.urlopen(urllib.request.Request(src, headers={"User-Agent": UA}), timeout=60).read()
        open(path, "wb").write(data); total += len(data)
        faces.append((fam, folder, style, wt, subset, ur, path.replace("public", "", 1)))
    print(f"  {folder}")
json.dump(faces, open("public/fonts/faces.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(faces)} files, {total/1024:.0f} KB -> public/fonts/. Now regenerate app/fonts.css.")
