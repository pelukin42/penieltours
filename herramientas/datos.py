"""Contenido y datos de Peniel Tours Flamingo. Todo texto lleva inglés (primero) y español.

Regla del proyecto: nada de datos inventados. Cada dato sale de una fuente anotada al lado:
  IG   = Instagram propio del negocio (@penieltoursflamingo): biografía, publicaciones y pendón
  FB   = página de Facebook propia (facebook.com/penieltours): descripción y volante de servicios
  CLI  = dato entregado por quien administra el proyecto
  TERC = sitio de terceros (FishingBooker, Tripadvisor): provisional, se confirma con el negocio
Lo marcado con CONFIRMAR se resalta al abrir el sitio con ?revisar en la dirección.
"""

SITIO = {
    "nombre": "Peniel Tours Flamingo",
    "corto": "Peniel Tours",
    "url": "",                       # dirección pública (ej. https://penieltours.com). Vacía = sin URL absoluta en og:image
    "noindex": True,                 # mientras sea propuesta: que Google no lo indexe. Pasar a False al publicar
    "whatsapp": "50684716533",       # CLI + pendón de IG: (506) 8471-6533
    "tel": "+50684716533",
    "tel_texto": "+506 8471 6533",
    "instagram": "https://www.instagram.com/penieltoursflamingo/",
    "instagram_usuario": "@penieltoursflamingo",
    "facebook": "https://www.facebook.com/penieltours/",
    "tripadvisor": "https://www.tripadvisor.com/Attraction_Review-g309244-d23449572-Reviews-Flamingo_Tours_Peniel-Playa_Flamingo_Province_of_Guanacaste.html",  # CONFIRMAR que el listado es suyo
    "mapa": "Margaritaville Beach Resort, Playa Flamingo, Guanacaste, Costa Rica",   # IG: etiqueta de ubicación de sus publicaciones. CONFIRMAR
}

# ---------------------------------------------------------------------------
# Categorías de tours (id, nombre, color de la tarjeta sin foto)
# ---------------------------------------------------------------------------
CATEGORIAS = [
    ("water", ("On the water", "En el agua"), "Sunset sailing, fishing, wave runners and river adventures.",
     "Navegación al atardecer, pesca, motos acuáticas y aventuras de río."),
    ("land", ("On land", "En tierra"), "ATVs, horses, zip lines and trails.",
     "ATV, caballos, canopy y senderos."),
    ("wild", ("Nature & parks", "Naturaleza y parques"), "Volcanoes, national parks, turtles and sightseeing.",
     "Volcanes, parques nacionales, tortugas y paseos."),
    ("more", ("More", "Más"), "Shuttles and one-day combos.", "Traslados y combos de un día."),
]

# ---------------------------------------------------------------------------
# Tours. Fuente de la lista: IG (biografía y pendón), FB (volante de servicios).
# foto: nombre en profesional/img (sin extensión). Sin foto = tarjeta con pictograma.
# pos: object-position de la foto en la tarjeta.
# ---------------------------------------------------------------------------
TOURS = [
    # --- En el agua ---
    dict(id="sunset-sailing", cat="water", pic="sail", foto="sail-sunset", pos="center 40%", destacado=True,
         en="Sunset Sailing Cruise", es="Navegación al atardecer",
         d_en="Sail the Pacific coast on a catamaran and watch the sun go down over the water.",
         d_es="Navega por la costa del Pacífico en catamarán y mira cómo el sol se oculta sobre el agua.",
         fuente="IG: biografía (Sunset Cruise), volante FB (Sailing) y fotos del catamarán"),
    dict(id="boat-tours", cat="water", pic="boat", foto="boat-monkey", pos="center 30%", destacado=True,
         en="Boat Tours", es="Paseos en bote",
         d_en="Glide along the water by boat and keep your eyes open for wildlife. A capuchin monkey once hopped on board.",
         d_es="Recorre el agua en bote y abre bien los ojos: puede haber fauna. Un mono capuchino llegó a subirse a bordo.",
         fuente="IG: pendón (Boat Tours) y video del paseo"),
    dict(id="sport-fishing", cat="water", pic="fish", foto="fish-crew", pos="center 55%", destacado=True,
         en="Sport Fishing", es="Pesca deportiva",
         d_en="Sport fishing trips out of Playa Flamingo.",
         d_es="Salidas de pesca deportiva desde Playa Flamingo.",
         extra_en="Half-day to full-day trips", extra_es="Salidas de medio día a día completo",
         confirmar="Las duraciones (4, 6 y 8 horas) salen de un perfil de FishingBooker; confirmar con el negocio.",
         fuente="IG: pendón y volante FB (Sport Fishing); FishingBooker (TERC) para las duraciones"),
    dict(id="wave-runners", cat="water", pic="jetski", foto="jetski-beach", pos="center 55%", destacado=True,
         en="Wave Runners", es="Motos acuáticas",
         d_en="Ride a wave runner on the waves off Playa Flamingo.",
         d_es="Maneja una moto acuática sobre las olas frente a Playa Flamingo.",
         fuente="IG: biografía (Wave Runners) y video de la playa"),
    dict(id="kayak", cat="water", pic="kayak", foto=None,
         en="Kayak", es="Kayak",
         d_en="Get out on the water at your own pace by kayak.",
         d_es="Sal al agua a tu ritmo en kayak.",
         fuente="FB: volante de servicios (Kayak)"),
    dict(id="rafting", cat="water", pic="raft", foto=None,
         en="White-Water Rafting", es="Rafting en aguas bravas",
         d_en="Take on river rapids in a raft.",
         d_es="Enfrenta los rápidos de un río en balsa.",
         fuente="FB: descripción (white water rafting) y volante"),
    dict(id="tubing", cat="water", pic="tube", foto=None,
         en="River Tubing", es="Tubing de río",
         d_en="Float down the river in an inner tube.",
         d_es="Déjate llevar río abajo en un tubo.",
         fuente="IG: biografía (Tubing) y pendón"),
    # --- En tierra ---
    dict(id="atv", cat="land", pic="atv", foto="atv-convoy", pos="center 40%", destacado=True,
         en="ATV Tours", es="Tours en ATV",
         d_en="Ride an ATV along the palm-lined beach road of Playa Flamingo.",
         d_es="Recorre en ATV el camino de palmeras junto a la playa de Playa Flamingo.",
         fuente="IG: biografía (ATV), pendón y videos"),
    dict(id="horseback", cat="land", pic="horse", foto="horse-rider", pos="center 45%", destacado=True,
         en="Horseback Riding", es="Cabalgatas",
         d_en="Ride along the beach on horseback.",
         d_es="Cabalga por la orilla de la playa.",
         fuente="IG: biografía (Horseback Riding), fotos y video"),
    dict(id="zipline", cat="land", pic="zip", foto=None,
         en="Zip Line & Canopy", es="Zip line y canopy",
         d_en="Fly through the treetops on a zip line.",
         d_es="Vuela entre las copas de los árboles en un zip line.",
         fuente="IG: biografía (ZipLine), volante FB (Canopy) y pendón"),
    dict(id="rappel", cat="land", pic="rappel", foto=None,
         en="Rappel & Climbing", es="Rápel y escalada",
         d_en="Rappel down a rock face with a harness and rope.",
         d_es="Baja en rápel por una pared de roca con arnés y cuerda.",
         fuente="IG: pendón (Rápel)"),
    dict(id="hiking", cat="land", pic="hike", foto=None,
         en="Hiking", es="Caminatas",
         d_en="Explore Guanacaste on foot.",
         d_es="Explora Guanacaste a pie.",
         fuente="FB: volante de servicios (Hiking)"),
    # --- Naturaleza y parques ---
    dict(id="volcano", cat="wild", pic="volcano", foto=None,
         en="Volcano Tours", es="Tours a volcanes",
         d_en="Visit one of Costa Rica's volcanoes.",
         d_es="Visita uno de los volcanes de Costa Rica.",
         fuente="FB: descripción (volcanoes) y volante (Volcano Tours)"),
    dict(id="palo-verde", cat="wild", pic="leaf", foto="wild-trogon", pos="center 35%",
         en="Palo Verde National Park", es="Parque Nacional Palo Verde",
         d_en="A national park known for its wetlands and birdlife.",
         d_es="Un parque nacional conocido por sus humedales y sus aves.",
         fuente="FB: volante de servicios (Palo Verde National Park)"),
    dict(id="turtles", cat="wild", pic="turtle", foto="wild-turtle", pos="center 50%",
         en="Turtle Tours", es="Tours de tortugas",
         d_en="Meet the sea turtles of Guanacaste's coast.",
         d_es="Conoce a las tortugas marinas de la costa de Guanacaste.",
         fuente="FB: volante de servicios (Turtle Tours)"),
    dict(id="sightseeing", cat="wild", pic="camera", foto="wild-waterfall", pos="center 40%",
         en="Sightseeing", es="Paseos turísticos",
         d_en="Discover beaches, waterfalls and wildlife around Guanacaste.",
         d_es="Descubre playas, cascadas y fauna alrededor de Guanacaste.",
         fuente="FB: volante de servicios (Sightseeing)"),
    # --- Más ---
    dict(id="adventure-day", cat="more", pic="plus", foto="adventure-day", pos="center 50%",
         en="One-Day Adventure Tour", es="Tour de aventura de un día",
         d_en="Our banner promises “your best adventure, one-day tour”: rivers, trails and rope. Ask what's included.",
         d_es="Nuestro pendón promete “la mejor aventura en un solo día”: ríos, senderos y cuerdas. Pregunta qué incluye.",
         confirmar="Falta saber qué actividades incluye el tour de un día.",
         fuente="IG: pendón (“Your Best Adventure One Day Tour”)"),
    dict(id="shuttles", cat="more", pic="van", foto=None,
         en="Shuttles", es="Traslados",
         d_en="Need a ride? Ask us about shuttles.",
         d_es="¿Necesitas transporte? Pregúntanos por los traslados.",
         fuente="FB: volante de servicios (Shuttles)"),
]

# ---------------------------------------------------------------------------
# Galería: (archivo sin extensión, categoría, texto alternativo EN, ES)
# ---------------------------------------------------------------------------
GALERIA = [
    ("sail-sunset", "water", "Sunset from the deck of a catamaran", "Atardecer desde la cubierta de un catamarán"),
    ("sail-sun-low", "water", "The sun dipping toward the horizon, sails overhead", "El sol bajando hacia el horizonte, con las velas arriba"),
    ("sail-catamaran", "water", "Catamaran at anchor", "Catamarán anclado"),
    ("sail-morning", "water", "Catamaran in the soft light of the morning", "Catamarán con la luz suave de la mañana"),
    ("sail-dusk", "water", "Dusk over the Pacific seen from the boat", "Anochecer sobre el Pacífico visto desde el bote"),
    ("sail-deck", "water", "Guests relaxing at the front of the catamaran", "Pasajeros descansando en la proa del catamarán"),
    ("sail-bow", "water", "Looking out from the catamaran's trampoline", "Mirando el mar desde la malla del catamarán"),
    ("sail-trampoline", "water", "Sails and rigging on the catamaran", "Velas y jarcia del catamarán"),
    ("sail-saloon", "water", "Inside the catamaran's saloon", "Dentro del salón del catamarán"),
    ("fish-crew", "water", "Crew showing the day's catch", "La tripulación con la pesca del día"),
    ("fish-catch", "water", "A big catch on a fishing trip", "Una buena captura en una salida de pesca"),
    ("jetski-beach", "water", "A wave runner on the beach at Playa Flamingo", "Una moto acuática en la playa de Playa Flamingo"),
    ("boat-monkey", "water", "A capuchin monkey on a boat tour", "Un mono capuchino en un paseo en bote"),
    ("wild-dolphin", "wild", "A dolphin leaping beside the boat", "Un delfín saltando junto al bote"),
    ("wild-whale", "wild", "A whale breaking the surface", "Una ballena sobre la superficie"),
    ("wild-turtle", "wild", "A sea turtle swimming", "Una tortuga marina nadando"),
    ("wild-reef", "wild", "A colorful fish on the reef", "Un pez de colores en el arrecife"),
    ("wild-sloth", "wild", "A sloth hanging from a branch", "Un perezoso colgado de una rama"),
    ("wild-monkey", "wild", "A squirrel monkey resting on a branch", "Un mono ardilla descansando en una rama"),
    ("wild-trogon", "wild", "A trogon perched among green leaves", "Un trogón posado entre hojas verdes"),
    ("wild-woodpecker", "wild", "A red-crested woodpecker on a trunk", "Un carpintero de cresta roja en un tronco"),
    ("wild-waterfall", "wild", "A waterfall dropping onto a beach", "Una cascada que cae sobre una playa"),
    ("atv-convoy", "land", "A line of red ATVs under the palms", "Una fila de ATV rojos bajo las palmeras"),
    ("atv-beach", "land", "ATVs lined up by the beach", "ATV alineados junto a la playa"),
    ("atv-rider", "land", "An ATV rider on the beach road", "Una persona en ATV en el camino de la playa"),
    ("atv-road", "land", "ATVs riding along the road", "ATV recorriendo el camino"),
    ("horse-rider", "land", "A guide on horseback in front of the beach resort", "Un guía a caballo frente al hotel de playa"),
    ("horse-group", "land", "A group riding horses along the beach", "Un grupo cabalgando por la playa"),
    ("adventure-day", "land", "Our one-day adventure banner: rafting, horses, tubing and rappel", "Nuestro pendón de aventura de un día: rafting, caballos, tubing y rápel"),
]

VIDEOS = [
    ("atv", ("A convoy of ATVs on the beach road", "Una fila de ATV en el camino de la playa")),
    ("horses", ("Horseback ride along the beach", "Cabalgata por la playa")),
    ("monkey", ("A capuchin joins the boat tour", "Un capuchino se une al paseo en bote")),
]

PREGUNTAS = [
    (("How do I book a tour?", "¿Cómo reservo un tour?"),
     ("Send us a WhatsApp message or call <a href=\"tel:+50684716533\">+506 8471 6533</a> with the tour you like, the date and how many people are coming. We'll answer with the details.",
      "Escríbenos por WhatsApp o llama al <a href=\"tel:+50684716533\">+506 8471 6533</a> con el tour que te interesa, la fecha y cuántas personas son. Te respondemos con los detalles.")),
    (("How much do the tours cost?", "¿Cuánto cuestan los tours?"),
     ("Call or text us for details and pricing. The price depends on the tour and on how many people are in your group.",
      "Llama o escríbenos para detalles y precios. El precio depende del tour y de cuántas personas sean.")),
    (("Do you offer tours that aren't on the list?", "¿Tienen tours que no están en la lista?"),
     ("We do all kinds of tours. If there's something you'd like to do in Guanacaste, ask us.",
      "Hacemos todo tipo de tours. Si hay algo que quieras hacer en Guanacaste, pregúntanos.")),
    (("Where can we meet?", "¿Dónde nos encontramos?"),
     ("We are based in Playa Flamingo, Guanacaste. Many of our photos were taken around the Margaritaville Beach Resort. Message us and we'll confirm the meeting point for your tour.",
      "Estamos en Playa Flamingo, Guanacaste. Muchas de nuestras fotos son de los alrededores del Margaritaville Beach Resort. Escríbenos y confirmamos el punto de encuentro de tu tour.")),
]
