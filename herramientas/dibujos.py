"""Genera los dibujos de las salidas (profesional/img/dibujos/*.svg) y el ícono del sitio.

Cada dibujo es la carta del día de una salida: el barco al final de la barra de horas
y el sol según sea de mañana, de tarde o de día entero. Es el mismo dibujo que hace
profesional/js/salida.js en la portada, en versión apaisada y con su propio estilo
(un SVG cargado con <img> no ve las variables de la página).

Uso (desde la carpeta del proyecto):
    python3 herramientas/dibujos.py
"""
import math
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent / "profesional" / "img"
DIB = RAIZ / "dibujos"

X0, HORA, MAXH = 24, 30, 8
SALIDAS = [
    # id, horas, posición del sol (x, y), título accesible
    ("medio-dia-manana", 4, (52, 50), "Medio día, en la mañana: 4 horas"),
    ("medio-dia-tarde", 4, (268, 50), "Medio día, en la tarde: 4 horas"),
    ("tres-cuartos", 6, (160, 30), "Tres cuartos de día: 6 horas"),
    ("dia-completo", 8, (160, 30), "Día completo: 8 horas"),
]

ESTILO = """<style>
  .t{fill:none;stroke:#0F2330;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
  .casco{fill:#0F2330}
  .cab{fill:#FFFFFF;stroke:#0F2330;stroke-width:1.3;stroke-linejoin:round}
  .mar{fill:#C4DFE3}
  .hor{stroke:#0F2330;stroke-width:1.3}
  .ola{fill:none;stroke:#3E8C99;stroke-width:1.1;stroke-linecap:round}
  .sol{fill:#C2410C}
  .rayo{stroke:#C2410C;stroke-width:1.6;stroke-linecap:round}
  .regla{stroke:#A5B5BA;stroke-width:1.3}
  .marca{stroke:#0F2330;stroke-width:1.1}
  .barra{fill:#C2410C}
  .cota{fill:none;stroke:#43575F;stroke-width:.9;stroke-dasharray:1.5 3}
  .estela{fill:none;stroke:#43575F;stroke-width:1;stroke-dasharray:2 4;stroke-linecap:round}
  .txt{font-family:Archivo,'Arial Narrow',Arial,sans-serif;font-weight:600;font-size:10px;fill:#43575F;text-anchor:middle}
  .num{font-family:Archivo,Arial,sans-serif;font-weight:700;font-size:34px;fill:#0F2330}
  .uni{font-family:Archivo,Arial,sans-serif;font-size:13px;fill:#43575F}
  @media (prefers-color-scheme: dark){
    .t,.hor,.marca{stroke:#E6F1F3} .casco{fill:#E6F1F3} .cab{fill:#112530;stroke:#E6F1F3}
    .mar{fill:#1D4150} .ola{stroke:#6FB8C4} .sol{fill:#F0834F} .rayo{stroke:#F0834F} .barra{fill:#F0834F}
    .regla{stroke:#5F7880} .cota,.estela{stroke:#9FB6BE} .txt,.uni{fill:#9FB6BE} .num{fill:#E6F1F3}
  }
  @keyframes mece{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
  .bote{animation:mece 4.6s ease-in-out infinite}
  @media (prefers-reduced-motion: reduce){.bote{animation:none}}
</style>"""


def barco(bx, by):
    return (
        '<g transform="translate(%d %d)"><g class="bote">'
        '<path class="t" d="M3 -12 L-13 -29 M-13 -29 Q-19 -14 -21 0"/>'
        '<path class="t" d="M30 -30 L-8 -47"/><path class="t" d="M27 -30 V-44"/>'
        '<path class="casco" d="M0 -12 L58 -12 L70 -17 L55 0 L8 0 Z"/>'
        '<path class="cab" d="M13 -12 V-23 H40 L46 -12 Z"/>'
        '<path class="cab" d="M19 -23 V-30 H34 V-23 Z"/>'
        '<path class="t" d="M19 -18 H37"/></g></g>' % (bx, by)
    )


def sol(x, y):
    rayos = "".join(
        '<line class="rayo" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'
        % (math.cos(math.radians(a)) * 15, math.sin(math.radians(a)) * 15,
           math.cos(math.radians(a)) * 20, math.sin(math.radians(a)) * 20)
        for a in range(0, 360, 45)
    )
    return '<g transform="translate(%d %d)"><circle class="sol" r="10"/>%s</g>' % (x, y, rayos)


def olas(y, fase):
    d = "M%d %d q9 -5 18 0" % (-20 + fase, y) + " t18 0" * 19
    return '<path class="ola" d="%s"/>' % d


def dibujo(horas, pos, titulo):
    cx = X0 + horas * HORA
    ancho_regla = MAXH * HORA
    marcas, cifras = "", ""
    for h in range(MAXH + 1):
        x = X0 + h * HORA
        par = h % 2 == 0
        marcas += '<line class="marca" x1="%d" x2="%d" y1="%d" y2="%d"/>' % (x, x, 152 if par else 154, 166 if par else 164)
        if par:
            cifras += '<text class="txt" x="%d" y="180">%d</text>' % (x, h)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 214" role="img" aria-label="%s">'
        "<title>%s</title>%s"
        '<rect class="mar" x="0" y="72" width="320" height="56"/>'
        '<line class="hor" x1="0" y1="72" x2="320" y2="72"/>'
        "%s%s%s%s"
        '<line class="estela" x1="%d" y1="94" x2="%d" y2="94"/>'
        "%s"
        '<line class="cota" x1="%d" y1="98" x2="%d" y2="150"/>'
        '<line class="regla" x1="%d" y1="159" x2="%d" y2="159"/>'
        '<rect class="barra" x="%d" y="154" width="%d" height="10"/>'
        "%s%s"
        '<text class="num" x="%d" y="208">%d</text><text class="uni" x="%d" y="208">horas</text>'
        "</svg>"
    ) % (
        titulo, titulo, ESTILO, olas(92, 0), olas(106, 9), olas(120, 4), sol(*pos),
        X0, max(X0, cx - 33), barco(cx - 33, 92),
        cx, cx, X0, X0 + ancho_regla, X0, horas * HORA, marcas, cifras, X0, horas, X0 + 26,
    )


ICONO = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="12" fill="#0C2D3F"/>'
    '<g transform="translate(6 10) scale(.88)" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">'
    '<circle cx="26" cy="6" r="3.2" stroke-width="3"/>'
    '<path stroke-width="3.6" d="M26 9.5V37M18 16h16"/>'
    '<path stroke-width="3.6" d="M7 26c1.5 8 8 11 19 11s17.5-3 19-11"/>'
    '<path stroke-width="3.6" d="m1.8 24.5 5.2 2.5 3.6-5.6M50.2 24.5 45 27l-3.6-5.6"/></g>'
    '<path d="M8 52c4 0 4-2.4 8-2.4s4 2.4 8 2.4 4-2.4 8-2.4 4 2.4 8 2.4 4-2.4 8-2.4 4 2.4 8 2.4" fill="none" stroke="#F59E6C" stroke-width="3" stroke-linecap="round"/>'
    "</svg>"
)


def main():
    DIB.mkdir(parents=True, exist_ok=True)
    for sid, horas, pos, titulo in SALIDAS:
        (DIB / (sid + ".svg")).write_text(dibujo(horas, pos, titulo), encoding="utf-8")
        print("dibujos/%s.svg" % sid)
    (RAIZ / "favicon.svg").write_text(ICONO, encoding="utf-8")
    print("favicon.svg")


if __name__ == "__main__":
    main()
