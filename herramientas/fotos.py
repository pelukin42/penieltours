"""Prepara las fotos y los videos de Peniel Tours para la web (profesional/img y profesional/video).

Parte de lo que bajó herramientas/instagram.py (carpeta de trabajo con img/, vid/ y meta.json), elige las piezas
que se usan en el sitio, las recorta si hace falta y las optimiza: una versión grande (máx. 1080 px) y una
pequeña de 520 px para cuadrículas (<nombre>-sm.jpg).

Uso:
    python3 herramientas/fotos.py [carpeta_de_trabajo]      (por defecto ../work/ig)

Cada foto sale del Instagram público del propio negocio (@penieltoursflamingo); el origen de cada una está en SPEC.
"""
import json
import pathlib
import subprocess
import sys

from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "profesional"
TRABAJO = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ.parent / "work" / "ig"

GRANDE, CHICA = 1080, 520

# nombre de salida -> (origen, opciones)
#   origen "ig:<archivo>"        foto de una publicación (img/<archivo> de la carpeta de trabajo)
#   origen "vid:<archivo>@<seg>" fotograma de un video (vid/<archivo>.mp4) en el segundo indicado
#   crop: (x0, y0, x1, y1) como fracción de la imagen
SPEC = {
    # marca
    "logo":            ("ig:2018-06-07_Bju0GhZjr-a_0.jpg", {"solo_grande": True}),
    # navegación en catamarán
    "sail-sunset":     ("ig:2018-06-08_BjxObUVAXFv_0.jpg", {}),
    "sail-sun-low":    ("ig:2018-06-08_BjxObUVAXFv_1.jpg", {}),
    "sail-catamaran":  ("ig:2018-06-08_BjxObUVAXFv_3.jpg", {}),
    "sail-morning":    ("ig:2018-06-08_BjxObUVAXFv_5.jpg", {}),
    "sail-dusk":       ("ig:2018-06-08_BjxOENbglKR_7.jpg", {}),
    "sail-deck":       ("ig:2018-06-08_BjxOENbglKR_4.jpg", {}),
    "sail-bow":        ("ig:2018-06-08_BjxOENbglKR_2.jpg", {}),
    "sail-trampoline": ("ig:2018-06-08_BjxOENbglKR_1.jpg", {}),
    "sail-saloon":     ("ig:2018-06-08_BjxOENbglKR_5.jpg", {}),
    # pesca deportiva
    "fish-crew":       ("ig:2018-06-08_Bjx3MgOgL94_0.jpg", {}),
    "fish-catch":      ("ig:2019-10-31_B4Sd3Xyl-JF_0.jpg", {}),
    # fauna y naturaleza
    "wild-dolphin":    ("ig:2018-06-08_BjxNw4dAyWz_3.jpg", {}),
    "wild-whale":      ("ig:2018-06-08_BjxNw4dAyWz_7.jpg", {}),
    "wild-turtle":     ("ig:2018-06-08_BjxNw4dAyWz_0.jpg", {}),
    "wild-reef":       ("ig:2018-06-08_BjxNw4dAyWz_8.jpg", {}),
    "wild-sloth":      ("ig:2018-06-08_BjxNw4dAyWz_9.jpg", {}),
    "wild-monkey":     ("ig:2018-06-08_BjxNw4dAyWz_6.jpg", {}),
    "wild-trogon":     ("ig:2018-06-08_BjxNw4dAyWz_5.jpg", {}),
    "wild-woodpecker": ("ig:2018-06-08_BjxNw4dAyWz_4.jpg", {}),
    "wild-waterfall":  ("ig:2018-06-08_BjxNw4dAyWz_2.jpg", {}),
    # caballos
    "horse-rider":     ("ig:2018-08-10_BmTWyoLBlVs_6.jpg", {}),
    "horse-group":     ("vid:000_C9I9UMJPenD@15.0", {"crop": (0, 0.22, 1, 0.78)}),
    # ATV, motos acuáticas y paseo en bote (fotogramas de sus videos)
    "atv-convoy":      ("vid:052_BtKGCKAAnrn@3.0", {}),
    "atv-beach":       ("vid:004_COv7Y2lh5wv@35.0", {}),
    "atv-rider":       ("vid:063_BqqtotygMP6@14.0", {}),
    "atv-road":        ("vid:053_BtKF0Q8gFcD@9.0", {}),
    "jetski-beach":    ("vid:103_BkDf-l0hu7U@1.0", {}),
    "boat-monkey":     ("vid:056_Br842p3giZq@10.0", {}),
    # sus pendones
    "adventure-day":   ("ig:2018-06-09_Bj0FUVahgW9_0.jpg", {"crop": (0.11, 0.26, 0.74, 0.96)}),
    "banner-tours":    ("ig:2018-06-09_Bj0FUVahgW9_1.jpg", {"crop": (0.17, 0, 0.80, 1)}),
}

# videos: nombre -> (origen, inicio, duración, ancho de salida)
VIDEOS = {
    "atv":    ("vid/052_BtKGCKAAnrn.mp4", 2.0, 10.0, 540),
    "horses": ("vid/000_C9I9UMJPenD.mp4", 2.0, 10.0, 404),
    "monkey": ("vid/056_Br842p3giZq.mp4", 2.0, 10.0, 540),
}
# fotograma para el póster de cada video (segundo dentro del original)
POSTER = {"atv": ("vid:052_BtKGCKAAnrn@3.0", None), "horses": ("vid:000_C9I9UMJPenD@7.0", None),
          "monkey": ("vid:056_Br842p3giZq@10.0", None)}


def fotograma(arch, seg):
    tmp = SALIDA / "_tmp.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(seg), "-i", str(TRABAJO / "vid" / (arch + ".mp4")),
                    "-frames:v", "1", "-q:v", "2", str(tmp)], check=True)
    im = Image.open(tmp).convert("RGB")
    tmp.unlink()
    return im


def abrir(origen):
    tipo, _, resto = origen.partition(":")
    if tipo == "ig":
        return Image.open(TRABAJO / "img" / resto).convert("RGB")
    arch, _, seg = resto.partition("@")
    return fotograma(arch, float(seg))


def guardar(im, nombre, ancho, calidad):
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    ruta = SALIDA / "img" / nombre
    if nombre.endswith(".png"):
        im.save(ruta, optimize=True)
    else:
        im.save(ruta, quality=calidad, optimize=True, progressive=True)
    return ruta.stat().st_size // 1024


def main():
    (SALIDA / "img").mkdir(parents=True, exist_ok=True)
    (SALIDA / "video").mkdir(parents=True, exist_ok=True)
    total = 0
    for nombre, (origen, op) in SPEC.items():
        im = abrir(origen)
        if op.get("crop"):
            x0, y0, x1, y1 = op["crop"]
            im = im.crop((round(im.width * x0), round(im.height * y0), round(im.width * x1), round(im.height * y1)))
        if nombre == "logo":
            total += guardar(im, "logo.png", 512, 0)
            total += guardar(im, "logo-128.png", 128, 0)
            total += guardar(im, "apple-touch-icon.png", 180, 0)
            total += guardar(im, "favicon.png", 64, 0)
            continue
        total += guardar(im, nombre + ".jpg", GRANDE, 82)
        total += guardar(im, nombre + "-sm.jpg", CHICA, 78)
    print("fotos listas: %d KB" % total)

    for nombre, (src, ini, dur, ancho) in VIDEOS.items():
        out = SALIDA / "video" / (nombre + ".mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ini), "-t", str(dur), "-i", str(TRABAJO / src),
                        "-an", "-vf", "scale=%d:-2" % ancho, "-c:v", "libx264", "-profile:v", "main", "-crf", "30",
                        "-preset", "slow", "-movflags", "+faststart", "-pix_fmt", "yuv420p", str(out)], check=True)
        origen, _ = POSTER[nombre]
        im = abrir(origen)
        guardar(im, "poster-" + nombre + ".jpg", ancho if ancho > 480 else 480, 76)
        print("video %s: %d KB" % (nombre, out.stat().st_size // 1024))


if __name__ == "__main__":
    main()
