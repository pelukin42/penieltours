"""Sincroniza los bloques compartidos de profesional/index.html hacia las demás páginas.

Bloques: <!-- @sprite --> (íconos), <!-- @header --> (cinta demo, menú) y
<!-- @footer --> (pie, WhatsApp flotante, barra móvil). Cada página recibe solo
los bloques que ya tiene marcados. En el menú se marca aria-current según
<body data-page="...">.

No es un paso de compilación: el sitio sigue siendo HTML plano. Se corre solo
cuando se edita un bloque compartido en index.html.

Uso (desde la carpeta del proyecto):
    python herramientas/sync_parciales.py
"""
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent / "profesional"
FUENTE = RAIZ / "index.html"
BLOQUES = ("sprite", "header", "footer")


def buscar(html, nombre):
    return re.search(r"<!-- @%s\b[^>]*-->.*?<!-- /@%s -->" % (nombre, nombre), html, re.S)


def main():
    src = FUENTE.read_text(encoding="utf-8")
    for ruta in sorted(RAIZ.glob("*.html")):
        if ruta.name == FUENTE.name:
            continue
        html = ruta.read_text(encoding="utf-8")
        pagina = re.search(r'<body[^>]*data-page="([^"]+)"', html)
        pagina = pagina.group(1) if pagina else ""
        hechos = []
        for nombre in BLOQUES:
            destino = buscar(html, nombre)
            if not destino:
                continue
            origen = buscar(src, nombre)
            if not origen:
                sys.exit("index.html no tiene el bloque @%s" % nombre)
            bloque = origen.group(0)
            if nombre == "header":
                bloque = bloque.replace(' aria-current="page"', "")
                bloque = re.sub(r'(data-nav="%s")' % re.escape(pagina), r'\1 aria-current="page"', bloque)
            html = html[:destino.start()] + bloque + html[destino.end():]
            hechos.append(nombre)
        ruta.write_text(html, encoding="utf-8")
        print("%-22s %s" % (ruta.name, ", ".join(hechos) or "(sin bloques)"))


if __name__ == "__main__":
    main()
