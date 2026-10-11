# Peniel Tours Flamingo — convenciones del proyecto

Sitio multipágina de Peniel Tours (pesca deportiva desde Playa Flamingo, Guanacaste). Está construido sobre la
**misma estructura base que el sitio de Industrias Montero** (`pelukin42/industrias-montero`, Plan Pro de Axel
Sites): un motor en HTML, CSS y JavaScript planos, sin dependencias, que dibuja todo desde un objeto `NEGOCIO`.

---

## Reglas duras

1. **Nunca inventar un dato del negocio.** Ni precios, ni horarios, ni garantías, ni capturas prometidas, ni años
   de experiencia, ni testimonios. Campo sin fuente = vacío en `NEGOCIO` = no se dibuja. Lo dudoso va con nota de
   demo y se anota en `PENDIENTES-CLIENTE.md`.
2. **Cada dato lleva su fuente** (campo `fuente:` o comentario en `assets/core.js`). En modo demo se ve en la tarjeta.
3. **Solo fotos del cliente.** Hoy no hay ninguna cargada. Nunca bancos de imágenes ni fotos de FishingBooker.
   Si hace falta una pieza visual, se dibuja (`herramientas/dibujos.py`).
4. **Las propuestas se ven como propuestas.** Lo que salió de un sitio de terceros lleva `nota-demo`.
5. **Los formularios no mienten.** Sin `NEGOCIO.endpoint`, nada finge haberse guardado: se abre WhatsApp con el
   mensaje completo.
6. **No se registra ni se compra ningún dominio** sin autorización explícita.
7. **El sitio no promete resultados de pesca.** Las especies se listan como «lo que menciona el perfil».

---

## Fuente única

`assets/core.css` y `assets/core.js` son los originales. Después de editarlos:

```bash
cp assets/core.css profesional/css/styles.css && cp assets/core.js profesional/js/core.js
```

`profesional/css/site.css` no tiene copia: se edita directo.

El sprite de íconos, el encabezado y el pie viven en `profesional/index.html` entre las marcas `@sprite`,
`@header` y `@footer`. Después de tocarlos: `python3 herramientas/sync_parciales.py`.

Los dibujos de las salidas y el ícono se generan con `python3 herramientas/dibujos.py`.

---

## Vocabulario del rubro

Está en `NEGOCIO.vocab`: *salida*, *viajero*, *reservar*, *grupo*. No se dice «producto», «cita», «sesión» ni
«visita». El canal «ya reservé» (`quien`, `de`, `confirmar`, `reprogramar`) tiene sus frases en el mismo lugar.

## Banderas

Solo en las primeras líneas de `profesional/js/main.js`. **En ningún otro archivo.**

| Bandera | Hoy | Por qué |
|---|---|---|
| `MODO_DEMO` | `true` | Es una propuesta |
| `MOSTRAR_PRECIOS` | `false` | Solo hay tarifas en un perfil de terceros |
| `MOSTRAR_HORARIO` | `false` | Las salidas son por reserva |
| `MOSTRAR_DIRECTOR` | `false` | No se conoce el nombre del capitán |
| `CLUB`, `TARJETA_REGALO` | `false` | No aplican |
| `GALERIA` | `false` | No hay fotos propias cargadas |

---

## Sistema visual

**Idea:** el sitio se lee como una carta náutica. La portada es la **salida a escala de horas**
(`profesional/js/salida.js`): se elige medio día mañana, medio día tarde, tres cuartos o día completo; el barco
avanza hasta el final de la barra de horas, el sol marca mañana, tarde o día entero y la barra naranja mide la
salida. La regla va de 0 a 8 horas **sin horas de reloj**, porque no se conocen los horarios de salida.

- Colores solo en `:root` de `assets/core.css`: `--marino` (texto, trazos, pie), `--marca` (naranja de boya: acción
  y salida elegida), `--espuma` y `--oleaje` (agua; `--oleaje` solo para trazos), `--arena` (reglas).
- Letra: una sola familia, Archivo, a lo largo de su eje de ancho.
- Cantos de 3 px y sin sombras. Todo lo que se mueve es parte del dibujo y `prefers-reduced-motion` lo apaga.
- Bilingüe: `profesional/js/en.js` tiene una entrada por cada `data-i18n`. Las notas `demo.*` no se traducen.
  `python3 scripts/claves_i18n.py profesional` debe decir «SIN TRADUCCIÓN: ninguna».

## Cómo verificar antes de mostrar

```bash
python3 -m http.server 5538 --bind 127.0.0.1 &        # servidor local
node scripts/probar.js                                # errores, desborde a 390 px, WhatsApp de cada flujo
python3 scripts/claves_i18n.py profesional            # traducciones completas
grep -rniE "montero|ducha|calentador" --include=*.html --include=*.js --include=*.css .   # restos: cero
```

`scripts/probar.js` usa Playwright; ver el encabezado del archivo para las variables `PLAYWRIGHT_PATH` y `CHROMIUM`.
