# Pendientes con Peniel Tours

Lo que falta para publicar, con lo más importante primero. **Nada de esto se inventó**: donde no hay dato, el
sitio queda vacío o lo dice (ver `CLAUDE.md`).

Fuente de todo lo que sí aparece: perfil público de Peniel Tours en
[FishingBooker](https://fishingbooker.com/charters/view/15835), consultado el **11-oct-2026**. Es un sitio de
terceros, así que **todo** se confirma con el negocio.

## 1. Bloquean la publicación

| # | Qué falta | Por qué importa | Dónde se carga |
|---|---|---|---|
| 1 | **Número de WhatsApp** (código de país + número, sin `+` ni espacios) | Hoy todos los botones de WhatsApp abren WhatsApp **sin destinatario** | `NEGOCIO.whatsapp` y `whatsappTexto` en `assets/core.js` |
| 2 | **Teléfono**, si atienden llamadas | Se oculta mientras esté vacío | `telefono` y `telefonoHref` |
| 3 | **Enlace directo de la página de Facebook** («Peniel Tours flamingo») | Hoy el botón abre una *búsqueda* de Facebook | `NEGOCIO.facebook` |
| 4 | **Confirmar que el perfil de FishingBooker es de este negocio** y que sus datos siguen vigentes | Todo el catálogo sale de ahí | ver sección 2 |

## 2. Datos del perfil de FishingBooker por confirmar

- Embarcación: Hatteras de 31 pies, año 2007, hasta 6 personas.
- Salidas y duración: medio día mañana (4 h), medio día tarde (4 h), tres cuartos de día (6 h), día completo (8 h).
  **Falta**: horas de salida y regreso, y si hay más salidas o más tours que la pesca.
- Incluye: cañas, carretes y equipo, carnada viva, señuelos, snacks, bebidas (agua y refresco), almuerzo,
  limpieza y fileteado, licencia de pesca. **Falta** saber qué lleva cada salida (el perfil no lo separa).
- A bordo: GPS, silla de combate, baño, vivero de carnada viva, nevera. Equipo de snorkel: se avisa al capitán antes.
- Especies que menciona: dorado, marlín negro, azul y rayado, pez gallo, atún aleta amarilla y aleta negra, medregal.
  El sitio **no promete capturas**.
- Capitán con más de 10 años de experiencia (sin nombre). Cargar el nombre y encender `MOSTRAR_DIRECTOR` si lo quieren.
- Apto para niños, captura y suelta o quedarse con la captura.
- Punto de salida: Margaritaville Flamingo Beach Resort, Playa Flamingo (código postal 50308).
  **Falta** confirmar dónde se aborda y las coordenadas exactas.

## 3. Decisiones del negocio

- **Precios.** El perfil de FishingBooker muestra tarifas por grupo en dólares para cada salida. Son de terceros y
  pueden estar desactualizadas, por eso `MOSTRAR_PRECIOS = false` y cada salida lleva `precio: null`. Si Peniel Tours
  quiere publicarlos, se cargan en `NEGOCIO.servicios[].precio` y se enciende la bandera.
- **Política de cancelación, depósito y formas de pago.** Lo que muestra FishingBooker es de la plataforma, no
  necesariamente del negocio. No se publica nada hasta que lo definan.
- **Idiomas.** El sitio está en español e inglés, pero no se afirma que el equipo atienda en inglés.
- **Fotos.** Solo propias (Instagram y Facebook del negocio), nunca bancos de imágenes ni fotos de FishingBooker.
  La galería está construida y apagada (`GALERIA = false`). Con 8 a 12 fotos de las salidas se enciende.
- **Más tours.** Si Peniel Tours ofrece otras experiencias además de la pesca, se agregan al catálogo y al cotizador.

## 4. Antes de salir a internet

- Ficha de Google Business: cargar `googlePlaceId` y coordenadas para activar reseñas, Waze y el mapa exacto.
- Correo del negocio y dominio. **No se registra ni se compra nada** sin autorización explícita.
- Pasar `MODO_DEMO` a `false` en `profesional/js/main.js` (quita notas y fuentes) y quitar `noindex` de las páginas
  y de `netlify.toml`.
- Conectar `NEGOCIO.endpoint` si quieren registrar las solicitudes además de enviarlas por WhatsApp.
