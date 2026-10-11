# Peniel Tours Flamingo — sitio web

Sitio web de **Peniel Tours**, tours de aventura en Playa Flamingo, Guanacaste, Costa Rica: ATV, navegación al
atardecer, pesca deportiva, cabalgatas, motos acuáticas y más. HTML, CSS y JavaScript planos, sin dependencias.
Bilingüe (inglés y español): elige el idioma del navegador y el visitante puede cambiarlo con **EN / ES**.

Diseño de referencia: un sitio de tours de naturaleza estilo Tamarindo Estuary Tours (portada con foto grande,
«qué esperar», tarjetas de tours, ofertas para grupos, contacto y «visítanos»), hecho con el logo y las fotos
y videos del propio Instagram de Peniel Tours.

**Estado: propuesta.** Lleva `noindex` (Google no lo indexa) y varios datos por confirmar con el negocio:
ver [`PENDIENTES-CLIENTE.md`](PENDIENTES-CLIENTE.md).

## Cómo verlo

La forma más rápida: bajar el repositorio (Code → Download ZIP), descomprimir y abrir `profesional/index.html`.
Con un servidor local:

```bash
python3 -m http.server 5538 --bind 127.0.0.1      # desde la raíz del repositorio
```

y abrir <http://localhost:5538/profesional/>. Agregando `?revisar` a cualquier dirección se resaltan en rojo los
datos que todavía hay que confirmar con el negocio. Con `?lang=es` o `?lang=en` se fuerza el idioma.

## Páginas

| Página | Qué tiene |
|---|---|
| `profesional/index.html` | Portada con carrusel de fotos, «qué esperar», tours favoritos, videos, formulario para grupos, cómo funciona, galería, «visítanos» y llamada a reservar |
| `profesional/tours.html` | Los 18 tours por tipo: en el agua, en tierra, naturaleza y parques, más |
| `profesional/gallery.html` | Videos y 29 fotos con filtro y visor |
| `profesional/contact.html` | Formulario, WhatsApp, llamada, redes y preguntas frecuentes |
| `profesional/links.html` | Enlaces para la biografía de Instagram |

Los formularios no guardan nada: arman el mensaje y abren **WhatsApp (+506 8471 6533)**. Hay botón de WhatsApp en el
encabezado, flotante, en cada tour y en el pie, además de Instagram (@penieltoursflamingo) y Facebook.

## Cómo se cambia algo

El contenido vive en `herramientas/datos.py` (tours, galería, preguntas, teléfono, redes) y las páginas se arman con
`herramientas/build.py`. Después de editar:

```bash
python3 herramientas/build.py        # regenera profesional/*.html
```

- **Agregar la foto de un tour** (hoy los de zip line, rápel, tubing, rafting, kayak, caminatas, volcán, Palo Verde y
  traslados usan un pictograma): poner la foto en `profesional/img/`, indicarla en `foto=` de ese tour y correr `build.py`.
- **Fotos y videos:** `herramientas/instagram.py` baja el material público del Instagram del negocio y
  `herramientas/fotos.py` elige, recorta y optimiza lo que usa el sitio (ver sus encabezados).
- **Publicar sin que Google lo oculte:** en `datos.py`, `"noindex": False` y `"url": "https://su-dominio.com"`, y `build.py`.

## Publicar

- **GitHub Pages** (gratis, repositorio público): una sola vez, en *Settings → Pages → Source: GitHub Actions*, y en
  la pestaña *Actions* correr «Publicar en GitHub Pages» (después se publica solo con cada cambio). Queda en
  `https://pelukin42.github.io/penieltours/`.
- **Netlify:** arrastrar la carpeta `profesional/` a <https://app.netlify.com/drop>, o conectar el repositorio
  (`netlify.toml` ya indica que se publica `profesional/`).

## Estructura

```
index.html                    Redirige a profesional/
README.md · CLAUDE.md · PENDIENTES-CLIENTE.md
netlify.toml · .github/workflows/pages.yml
herramientas/                 datos.py · build.py · fotos.py · instagram.py
scripts/probar.js             Pruebas con Playwright (errores, enlaces, idioma, formularios, galería)
profesional/                  El sitio: 5 páginas + 404, css/site.css, js/site.js, img/ y video/
```
