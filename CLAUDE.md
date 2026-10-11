# Peniel Tours Flamingo — convenciones del proyecto

Sitio web de Peniel Tours (tours de aventura en Playa Flamingo, Guanacaste). HTML, CSS y JavaScript planos.
Las páginas de `profesional/` se generan con `python3 herramientas/build.py` desde `herramientas/datos.py`.
Diseño de referencia: sitios de tours de naturaleza como Tamarindo Estuary Tours. **No** copia el diseño de otros
clientes del autor (el sitio de Industrias Montero se usó solo como referencia de «sitio web real», no de estilo).

---

## Reglas duras

1. **Nunca inventar un dato del negocio.** Ni precios, ni horarios, ni duraciones, ni garantías, ni seguros, ni
   capturas o avistamientos prometidos, ni años de experiencia, ni testimonios, ni calificaciones. Campo sin fuente =
   no se escribe. Lo dudoso se marca con `conf(...)` (se ve con `?revisar`) y se anota en `PENDIENTES-CLIENTE.md`.
2. **Cada dato lleva su fuente** (campo `fuente` en `datos.py`): IG (Instagram propio), FB (Facebook propio),
   CLI (lo dio quien administra el proyecto) o TERC (sitio de terceros, provisional).
3. **Solo fotos y videos del propio negocio** (su Instagram). Nunca bancos de imágenes ni fotos de otros sitios.
   Donde no hay foto, la tarjeta lleva un pictograma dibujado, nunca una foto ajena.
4. **Los formularios no mienten:** no guardan nada; arman el mensaje y abren WhatsApp.
5. **No se registra ni se compra ningún dominio** sin autorización explícita.
6. El sitio **no promete resultados** (pesca, avistamientos). Se habla de lo que se vio en sus fotos.
7. Todo texto visible lleva inglés y español (`T(en, es)` en `build.py`). El inglés es el idioma base.

---

## Datos del negocio (no tocar sin fuente nueva)

- WhatsApp y llamadas: **+506 8471 6533** (`50684716533`). Lo dio quien administra el proyecto y sale en su pendón.
- Instagram `@penieltoursflamingo`; Facebook `https://www.facebook.com/penieltours/` («Peniel Tours flamingo»).
- Servicios: su biografía de Instagram («ATV, ZipLine, Horseback Riding, Tubing, Wave Runners, Sunset Cruise, and More!
  Call or text for details and pricing!»), su volante de Facebook (ATV, Water Rafting, Sport Fishing, Horseback Riding,
  Sailing, Kayak, Hiking, Sightseeing, Shuttles, Canopy, Volcano Tours, Palo Verde National Park, Turtle Tours) y su pendón
  (Sport Fishing, Tubing, ATV, Boat Tours, Rápel, tour de aventura de un día).
- Precios: **no hay**. Su biografía dice «llama o escribe para detalles y precios». No se publican precios.
- Provisional (TERC): duraciones de pesca (FishingBooker) y el listado de Tripadvisor.

---

## Cómo está armado

- `herramientas/datos.py`: tours, categorías, galería, videos, preguntas y datos de contacto.
- `herramientas/build.py`: genera `index`, `tours`, `gallery`, `contact`, `links` y `404`, con encabezado, pie, íconos y
  pictogramas SVG. Después de cambiar datos o plantillas: `python3 herramientas/build.py`.
- `profesional/css/site.css`: todos los estilos. Colores solo en `:root` (azul marino y celeste del logo, naranja de
  atardecer para la acción). Letras: Barlow Condensed (títulos) y Barlow (texto).
- `profesional/js/site.js`: idioma EN/ES (`data-es` y `data-es-<atributo>`), menú, formularios a WhatsApp, videos que
  se reproducen al verse, filtro y visor de la galería y el modo `?revisar`.
- `herramientas/instagram.py` y `herramientas/fotos.py`: cómo se obtuvieron y optimizaron las fotos y videos.

## Cómo verificar antes de mostrar

```bash
python3 -m http.server 5538 --bind 127.0.0.1 &       # desde la raíz del repositorio
PLAYWRIGHT_PATH=/ruta/a/playwright node scripts/probar.js
```

Debe dar todo en `OK`: sin errores de JavaScript ni imágenes rotas, sin desborde a 390 px, enlaces internos válidos,
idioma ES/EN, formularios, galería y menú del celular.
