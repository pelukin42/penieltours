"""Lee el feed público de un perfil de Instagram y baja las fotos (y la lista de publicaciones, con sus videos) a una carpeta de trabajo.

Sirve para reunir el material del propio negocio (@penieltoursflamingo). No usa contraseña: solo el
punto público que usa la app web para perfiles abiertos. Si Instagram lo cierra o lo limita, las fotos se
pueden bajar a mano y dejar en la carpeta de trabajo con la misma estructura (img/, vid/).

Uso:
    python3 herramientas/instagram.py [usuario] [carpeta]      (por defecto penieltoursflamingo ../work/ig)

Deja en la carpeta: items.json (publicaciones), meta.json (una fila por imagen), img/ y vid/.
Los videos se bajan aparte (campo video_versions de items.json, carpeta vid/). Después se corre herramientas/fotos.py para elegir y optimizar lo que usa el sitio.
"""
import datetime
import json
import os
import pathlib
import subprocess
import sys
import time
import urllib.parse

USUARIO = sys.argv[1] if len(sys.argv) > 1 else "penieltoursflamingo"
CARPETA = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else pathlib.Path(__file__).resolve().parent.parent.parent / "work" / "ig")
UA_APP = ("Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 "
          "Instagram 300.0.0.29.110 (iPhone14,2; iOS 16_6; en_US; en-US; scale=3.00; 1170x2532; 487294112)")
UA_WEB = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"


def curl(url, *extra, salida=None):
    cmd = ["curl", "-sS", "-m", "60"] + list(extra) + (["-o", str(salida)] if salida else []) + [url]
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def publicaciones():
    base = "https://www.instagram.com/api/v1/feed/user/%s/username/?count=12" % USUARIO
    items, max_id = [], None
    for _ in range(30):
        url = base + ("&max_id=" + urllib.parse.quote(max_id) if max_id else "")
        d = json.loads(curl(url, "-A", UA_APP, "-H", "X-IG-App-ID: 936619743392459", "-H", "Accept: */*"))
        items += d.get("items", [])
        print("pagina", len(items))
        if not d.get("more_available") or not d.get("next_max_id"):
            break
        max_id = d["next_max_id"]
        time.sleep(3)
    return items


def mejor(nodo):
    c = (nodo.get("image_versions2") or {}).get("candidates", [])
    return max(c, key=lambda x: x["width"] * x["height"]) if c else None


def main():
    (CARPETA / "img").mkdir(parents=True, exist_ok=True)
    (CARPETA / "vid").mkdir(parents=True, exist_ok=True)
    items = publicaciones()
    json.dump(items, open(CARPETA / "items.json", "w"))
    meta = []
    for it in items:
        t = datetime.datetime.fromtimestamp(it["taken_at"]).strftime("%Y-%m-%d")
        nodos = it.get("carousel_media") if it.get("media_type") == 8 else [it]
        for i, n in enumerate(nodos):
            b = mejor(n)
            if not b:
                continue
            nombre = "%s_%s_%d.jpg" % (t, it["code"], i)
            meta.append(dict(file=nombre, code=it["code"], idx=i, date=t, w=b["width"], h=b["height"], url=b["url"]))
            ruta = CARPETA / "img" / nombre
            if not ruta.exists():
                curl(b["url"], "-A", UA_WEB, salida=ruta)
    json.dump(meta, open(CARPETA / "meta.json", "w"))
    print(len(meta), "imagenes en", CARPETA / "img")
    print("Los videos se bajan aparte con el campo video_versions de items.json (ver vid/ en fotos.py).")


if __name__ == "__main__":
    main()
