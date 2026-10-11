# Peniel Tours Flamingo — sitio web (propuesta)

Sitio multipágina para **Peniel Tours**, pesca deportiva desde Playa Flamingo, Guanacaste, Costa Rica.
Usa la misma estructura base que el sitio de Industrias Montero: HTML, CSS y JavaScript planos, sin dependencias.

**Estado: demo.** Lleva notas de origen en los datos por confirmar y `noindex,nofollow` en todas las páginas.
No está publicado ni indexado. Lo que falta del cliente está en [`PENDIENTES-CLIENTE.md`](PENDIENTES-CLIENTE.md).

## Cómo verlo

```bash
python3 -m http.server 5538 --bind 127.0.0.1
```

Luego abrir <http://localhost:5538/profesional/>. La raíz del repositorio redirige a `profesional/`.

## Páginas

| Página | Qué hace |
|---|---|
| `profesional/index.html` | Portada con la **salida a escala de horas**, tipos de salida, pasos, ficha técnica del barco, especies, punto de salida y preguntas |
| `profesional/servicios.html` | Catálogo de las 4 salidas con filtros y buscador; galería lista pero apagada |
| `profesional/agendar.html` | Reservar una salida · Cotizar (4 pasos) · Ya reservé. Todo sale por WhatsApp con el mensaje completo |
| `profesional/links.html` | Página de enlaces para la bio de Instagram: WhatsApp, Instagram, Facebook, cotizar y cómo llegar |

Botones de contacto: WhatsApp (encabezado, portada, botón flotante, barra móvil, cierre y pie), Instagram
(`@penieltoursflamingo`) y Facebook («Peniel Tours flamingo»).

## Cómo se edita

Todo dato real vive en `NEGOCIO`, dentro de `assets/core.js`. **Campo vacío = ese elemento no se dibuja.**
Después de editar: `cp assets/core.js profesional/js/core.js` (y lo mismo con `core.css`). Las banderas están en las
primeras líneas de `profesional/js/main.js`. Más detalle en [`CLAUDE.md`](CLAUDE.md).

**Lo primero que hay que confirmar:** a qué se dedica Peniel Tours. El catálogo sale de un perfil de FishingBooker que el cliente no reconoce todavía (ver `PENDIENTES-CLIENTE.md`). WhatsApp (+506 8471 6533), Facebook e Instagram ya están cargados.

## Publicar

`netlify.toml` publica solo la carpeta `profesional/`. Antes de salir: `MODO_DEMO = false`, quitar el `noindex` y
cargar los datos pendientes.

## Estructura

```
index.html                  Redirige a profesional/
README.md · CLAUDE.md · PENDIENTES-CLIENTE.md
netlify.toml                Publica profesional/
assets/core.css · core.js   FUENTE ÚNICA (se copian a profesional/css/styles.css y profesional/js/core.js)
herramientas/               sync_parciales.py · dibujos.py · og.html · icono.html
scripts/                    probar.js (Playwright) · claves_i18n.py
profesional/                El sitio: 4 páginas, css/, js/ (core, main, salida, i18n, en, dinamico), img/
```
