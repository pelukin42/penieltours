# Pendientes con Peniel Tours

Lo que falta para publicar, con lo más importante primero. **Nada de esto se inventó**: donde no hay dato, el
sitio queda vacío o lo dice (ver `CLAUDE.md`).

## Ya cargado (dado por quien administra el proyecto, 11-oct-2026)

- WhatsApp: **+506 8471 6533** (`NEGOCIO.whatsapp`). Todos los botones de WhatsApp ya abren el chat con ese número.
- Facebook: <https://www.facebook.com/penieltours/> (se quitó `?locale=es_LA` del enlace original).
- Instagram: `@penieltoursflamingo`.

## 1. Bloquea la publicación: confirmar a qué se dedica Peniel Tours

Todo el catálogo (salidas, barco, capacidad, qué incluye, especies, punto de salida) sale de un perfil de
[FishingBooker](https://fishingbooker.com/charters/view/15835) llamado «Peniel Tours», en Playa Flamingo
(consultado el **11-oct-2026**). Es un sitio de terceros y **quien administra el proyecto dijo que no lo conoce**:
no se sabe si es del mismo negocio. Facebook pide iniciar sesión, así que tampoco se pudo leer desde ahí.
Por eso cada dato lleva la nota «sin confirmar con el negocio».

Mensaje listo para mandarle al dueño:

> Hola, estoy armando el sitio web de Peniel Tours. ¿Me confirmás estas cosas?
> 1. ¿Ofrecen pesca deportiva? ¿En qué barco y para cuántas personas?
> 2. ¿Qué salidas tienen y cuánto duran (medio día, tres cuartos, día completo)? ¿A qué hora salen?
> 3. ¿Ofrecen otros tours además de la pesca (snorkel, paseos, etc.)?
> 4. ¿Dónde se aborda el barco?
> 5. ¿Qué incluye cada salida (equipo, comida, bebidas)?
> 6. ¿Tienen fotos propias de las salidas que podamos usar?
> 7. ¿El 8471-6533 también recibe llamadas, o solo WhatsApp?

Si no es pesca, o hay más tours, se cambia el catálogo en `NEGOCIO.servicios` y `NEGOCIO.categorias`
(`assets/core.js`); el resto del sitio se acomoda solo.

## Otros pendientes

| Qué falta | Por qué importa | Dónde se carga |
|---|---|---|
| **Teléfono** para llamadas, si lo hay | Se oculta mientras esté vacío | `telefono` y `telefonoHref` |
| Fotos propias de las salidas | La galería está apagada | ver sección 3 |

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
