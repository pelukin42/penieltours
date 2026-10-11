# Pendientes con Peniel Tours

Lo que falta para publicar, con lo más importante primero. **Nada de esto se inventó**: donde no hay dato, el sitio
no lo dice. Abriendo cualquier página con `?revisar` (por ejemplo `profesional/index.html?revisar`) se resaltan en
rojo los textos que todavía hay que confirmar.

## Ya resuelto

- **Qué ofrece Peniel Tours.** Sale de sus propios canales: biografía de Instagram («ATV, ZipLine, Horseback Riding,
  Tubing, Wave Runners, Sunset Cruise, and More! Call or text for details and pricing!»), volante de Facebook (ATV,
  Water Rafting, Sport Fishing, Horseback Riding, Sailing, Kayak, Hiking, Sightseeing, Shuttles, Canopy, Volcano Tours,
  Palo Verde National Park, Turtle Tours) y su pendón (Sport Fishing, Tubing, ATV, Boat Tours, Rápel, tour de aventura
  de un día). La pesca deportiva **sí es suya**.
- **Contacto:** WhatsApp y llamadas +506 8471 6533 (lo confirma el pendón), Instagram `@penieltoursflamingo` y Facebook
  `facebook.com/penieltours`.
- **Fotos y videos:** salen del Instagram del negocio (2018 a 2024). Ver la sección 2.

## 1. Preguntas para el dueño

Mensaje listo para mandar:

> Hola, estoy terminando el sitio web de Peniel Tours. ¿Me confirmás estas cosas?
> 1. De la lista de tours (ATV, catamarán al atardecer, pesca, caballos, motos acuáticas, zip line, rafting, tubing,
>    kayak, rápel, caminatas, volcán, Palo Verde, tortugas, traslados, tour de aventura de un día), ¿cuáles ofrecen hoy?
> 2. ¿Cuánto dura cada uno y qué incluye? (No hace falta decirme precios: el sitio dice «llama o escribe para detalles y precios».)
> 3. ¿Dónde se encuentran con los clientes? ¿Es en el Margaritaville Beach Resort, en Playa Flamingo?
> 4. ¿El 8471-6533 también recibe llamadas, o solo WhatsApp?
> 5. ¿Quieren que aparezca un correo? (En el pendón se ve uno, pero no lo publiqué.)
> 6. ¿Tienen fotos de zip line, rápel, tubing, rafting, kayak, caminatas, volcán y traslados?
> 7. ¿Estas fotos de su Instagram se pueden usar en el sitio? ¿Alguna persona prefiere no salir?

## 2. Fotos y videos

- Son del **Instagram del negocio** (`@penieltoursflamingo`). Las de tamaño grande son 960 a 1080 px; los fotogramas sacados
  de videos son 640 a 720 px. Con las **originales** el sitio se ve más nítido.
- **Confirmar derechos y permisos.** Hay personas reconocibles en algunas (la tripulación con la pesca, un cliente con su pez,
  un guía a caballo). Las de fauna (perezoso, monos, aves, tortuga, ballena, delfines, cascada) vienen de una publicación
  de 2018 y **no se sabe si las tomó el negocio**: si no son suyas, hay que cambiarlas.
- **Sin foto hoy** (usan un pictograma): kayak, rafting, tubing, zip line, rápel, caminatas, volcán y traslados.
- Cómo agregar una: poner el archivo en `profesional/img/`, indicar `foto=` en ese tour de `herramientas/datos.py` y correr
  `python3 herramientas/build.py`.

## 3. Datos por confirmar (se ven con `?revisar`)

- **Pesca deportiva:** las duraciones (medio día, tres cuartos, día completo: 4, 6 y 8 horas) salen de un perfil de
  FishingBooker llamado «Peniel Tours» en Playa Flamingo. Confirmar y, si no, quitar el texto «Half-day to full-day trips».
- **Tour de aventura de un día:** falta saber qué actividades incluye.
- **Punto de encuentro:** el mapa y el texto usan el Margaritaville Beach Resort porque casi todas sus publicaciones llevan
  esa ubicación. Falta confirmarlo y cargar la ficha de Google.
- **Tripadvisor:** el sitio enlaza el listado «Flamingo Tours Peniel». Confirmar que es del negocio; si no, quitar el enlace.
- **Ubicación exacta:** en Facebook aparece «Tamarindo»; en Instagram y Tripadvisor, Playa Flamingo. El sitio dice Playa
  Flamingo, Guanacaste.

## 4. Lo que el sitio no dice (a propósito)

Precios, duraciones (salvo lo marcado), qué incluye cada tour, edades mínimas, seguros (el pendón dice «full insurance»),
políticas de cancelación, formas de pago, idiomas que se hablan y horarios. Se agregan cuando el negocio los confirme.

## 5. Antes de salir a internet

- En `herramientas/datos.py`: `"noindex": False` y `"url": "https://su-dominio.com"`; luego `python3 herramientas/build.py`.
- Dominio y correo propios: **no se registra ni se compra nada** sin autorización.
- Publicar: GitHub Pages (flujo `.github/workflows/pages.yml`) o Netlify (ver `README.md`).
