"""Revisa que todo texto marcado con data-i18n tenga traducción en js/en.js.

Uso:
  python claves_i18n.py ruta/al/proyecto/pro [--listar]

Las claves demo.* (notas de la propuesta) se ignoran a propósito.
"""
import pathlib
import re
import sys


def main():
    raiz = pathlib.Path(sys.argv[1])
    listar = "--listar" in sys.argv
    claves = {}
    for f in sorted(raiz.glob("*.html")):
        t = f.read_text(encoding="utf-8")
        for m in re.finditer(r'<(\w+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>(.*?)</\1>', t, re.S):
            claves.setdefault(m.group(3), " ".join(m.group(5).split()))
        for m in re.finditer(r'<(\w+)[^>]*?data-i18n-attr="([^"]+)"[^>]*>', t):
            for par in m.group(2).split(";"):
                attr, k = [x.strip() for x in par.split(":", 1)]
                v = re.search(r"\s" + attr + r'="([^"]*)"', m.group(0))
                claves.setdefault(k, "[" + attr + "] " + (v.group(1) if v else ""))
    en = raiz / "js" / "en.js"
    traducidas = set(re.findall(r"^\s*'([^']+)'\s*:", en.read_text(encoding="utf-8"), re.M)) if en.exists() else set()
    faltan = sorted(k for k in claves if k not in traducidas and not k.startswith("demo."))
    sobran = sorted(traducidas - set(claves))
    if listar:
        for k in sorted(claves):
            print(k, "=>", claves[k])
    print("claves en HTML:", len(claves), "· traducidas:", len(traducidas & set(claves)))
    print("SIN TRADUCCIÓN:", faltan or "ninguna")
    print("EN en.js PERO NO EN HTML (revisar):", sobran or "ninguna")


if __name__ == "__main__":
    main()
