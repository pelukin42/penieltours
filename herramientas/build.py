#!/usr/bin/env python3
"""Genera las páginas de profesional/ a partir de herramientas/datos.py.

El sitio es HTML, CSS y JavaScript planos: este script solo arma los .html para no repetir el encabezado, el pie
y las tarjetas a mano. Después de cambiar datos.py (o este archivo) se corre:

    python3 herramientas/build.py

y se suben los .html resultantes junto con el resto de profesional/. No hace falta compilar nada para publicar.
"""
import html
import json
import pathlib
import sys
import urllib.parse

from PIL import Image

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import datos as D  # noqa: E402

RAIZ = pathlib.Path(__file__).resolve().parent.parent / "profesional"
IMG = RAIZ / "img"
S = D.SITIO


# ---------------------------------------------------------------------------
# Utilidades de texto: todo texto visible lleva su versión en español en data-es
# ---------------------------------------------------------------------------
def e(s):
    return html.escape(s, quote=True)


def T(en, es):
    return '<span data-es="%s">%s</span>' % (e(es), en)


def ia(attr, en, es):
    return '%s="%s" data-es-%s="%s"' % (attr, e(en), attr, e(es))


def conf(contenido, nota):
    """Marca algo que falta confirmar: se resalta al abrir el sitio con ?revisar."""
    return '<span class="confirmar" data-nota="%s">%s</span>' % (e(nota), contenido)


def wa(en, es=None):
    es = es or en
    return 'href="https://wa.me/%s?text=%s" data-wa="%s" data-wa-es="%s" target="_blank" rel="noopener"' % (
        S["whatsapp"], urllib.parse.quote(en), e(en), e(es))


# ---------------------------------------------------------------------------
# Íconos y pictogramas
# ---------------------------------------------------------------------------
ICONOS = {
    "wa": '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.59-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    "ig": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    "fb": '<path fill="currentColor" stroke="none" d="M14 21v-8h2.6l.4-3H14V8.2c0-.9.3-1.4 1.5-1.4H17V4.1C16.7 4 15.8 4 14.8 4 12.5 4 11 5.4 11 7.9V10H8.5v3H11v8z"/>',
    "pin": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "down": '<path d="m6 9 6 6 6-6"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "close": '<path d="M6 6l12 12M18 6 6 18"/>',
    "star": '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8z"/>',
}

PICTOS = {
    "sail": '<path d="M8 44h48l-6 10H14z"/><path d="M32 8v36"/><path d="M34 10l18 30H34z"/><path d="M30 18 14 40h16z"/>',
    "boat": '<path d="M6 38h52l-8 14H14z"/><path d="M18 38V26h22l8 12"/><path d="M24 32h4m6 0h4"/><path d="M30 26V16"/><path d="M4 58q5-4 10 0t10 0 10 0 10 0 10 0 10 0"/>',
    "fish": '<path d="M6 32c8-11 24-14 36-7 4 2 7 5 10 7-3 2-6 5-10 7-12 7-28 4-36-7z"/><path d="M52 32l8-9v18z"/><circle cx="19" cy="30" r="1.8" fill="currentColor" stroke="none"/><path d="M28 24c3 5 3 11 0 16"/>',
    "jetski": '<path d="M8 40c12 5 32 5 48-6l-12-6-8-12h-8l4 12-12 2z"/><path d="M4 54q5-4 10 0t10 0 10 0 10 0 10 0 10 0"/>',
    "kayak": '<path d="M4 42c14-8 42-8 56 0-14 8-42 8-56 0z"/><ellipse cx="32" cy="40" rx="7" ry="2.6"/><path d="M16 18l32 28"/><ellipse cx="13" cy="15" rx="7" ry="3" transform="rotate(41 13 15)"/><ellipse cx="51" cy="49" rx="7" ry="3" transform="rotate(41 51 49)"/>',
    "raft": '<path d="M6 40c0-8 52-8 52 0 0 8-10 12-26 12S6 48 6 40z"/><path d="M22 34l-8-18m28 18 8-18"/><path d="M4 58q5-4 10 0t10 0 10 0 10 0 10 0 10 0"/>',
    "tube": '<circle cx="32" cy="28" r="17"/><circle cx="32" cy="28" r="7"/><path d="M4 52q5-4 10 0t10 0 10 0 10 0 10 0 10 0"/><path d="M4 59q5-4 10 0t10 0 10 0 10 0 10 0 10 0"/>',
    "atv": '<circle cx="15" cy="44" r="9"/><circle cx="49" cy="44" r="9"/><circle cx="15" cy="44" r="3"/><circle cx="49" cy="44" r="3"/><path d="M15 44l9-14h16l9 14"/><path d="M26 28h10"/><path d="M40 30l5-10h9"/>',
    "horse": '<path d="M16 56C9 47 8 39 8 30 8 16 18 8 32 8s24 8 24 22c0 9-1 17-8 26"/><path d="M12 56h14m12 0h14"/><circle cx="15" cy="28" r="1.6" fill="currentColor" stroke="none"/><circle cx="15" cy="40" r="1.6" fill="currentColor" stroke="none"/><circle cx="49" cy="28" r="1.6" fill="currentColor" stroke="none"/><circle cx="49" cy="40" r="1.6" fill="currentColor" stroke="none"/>',
    "zip": '<path d="M6 8v48M58 28v28"/><path d="M6 12l52 14"/><circle cx="32" cy="19.5" r="3"/><path d="M32 23v8"/><circle cx="32" cy="35" r="3.4"/><path d="M32 39v8m-7-5 7-3 7 3m-7 5-5 8m5-8 5 8"/>',
    "rappel": '<path d="M44 6v52"/><path d="M44 12h8M44 28h8M44 44h8"/><circle cx="30" cy="22" r="3.6"/><path d="M30 26v14M30 40l-7 12m7-12 5 12M30 30l9-6"/><path d="M39 6v18"/>',
    "hike": '<path d="M4 52l16-26 10 14 8-10 22 22z"/><circle cx="48" cy="14" r="4"/><path d="M30 52q9-5 4-12"/>',
    "volcano": '<path d="M6 54l18-32h16l18 32z"/><path d="M24 22q8 5 16 0"/><path d="M32 16q-7-4 0-8t0-4"/><path d="M32 28v9m-6 5-3 8m15-8 3 8"/>',
    "leaf": '<path d="M12 52C10 28 26 10 54 10c0 28-14 44-38 42z"/><path d="M12 52 40 24"/><path d="M26 38h12M32 31h10"/>',
    "turtle": '<ellipse cx="30" cy="34" rx="16" ry="12"/><path d="M22 34h16M30 22v24"/><circle cx="52" cy="32" r="5"/><path d="M19 24l-8-9m25 9 7-9M19 44l-8 9m25-9 7 9M14 34H8"/>',
    "camera": '<rect x="8" y="20" width="48" height="32" rx="5"/><circle cx="32" cy="36" r="9"/><path d="M22 20l3-7h14l3 7"/><circle cx="48" cy="27" r="1.6" fill="currentColor" stroke="none"/>',
    "plus": '<circle cx="32" cy="32" r="22"/><path d="M32 20v24M20 32h24"/>',
    "van": '<path d="M6 20h32l14 14v14H6z"/><path d="M14 26h14v9H14zm20 0h4l6 9H34z"/><circle cx="19" cy="49" r="5" fill="#fff" fill-opacity=".0"/><circle cx="43" cy="49" r="5"/>',
}


def sprite():
    ico = "".join('<symbol id="i-%s" viewBox="0 0 24 24">%s</symbol>' % (k, v) for k, v in ICONOS.items())
    pic = "".join('<symbol id="p-%s" viewBox="0 0 64 64">%s</symbol>' % (k, v) for k, v in PICTOS.items())
    return '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">%s%s</svg>' % (ico, pic)


def ic(nombre, extra=""):
    return '<svg class="icon %s" aria-hidden="true"><use href="#i-%s"/></svg>' % (extra, nombre)


# ---------------------------------------------------------------------------
# Imágenes
# ---------------------------------------------------------------------------
_dim = {}


def dims(ruta):
    if ruta not in _dim:
        with Image.open(IMG / ruta) as im:
            _dim[ruta] = im.size
    return _dim[ruta]


def foto(nombre, alt, sizes, pos=None, eager=False, prioridad=False, clase=""):
    en, es = alt
    w, h = dims(nombre + ".jpg")
    sm = IMG / (nombre + "-sm.jpg")
    srcset = ""
    if sm.exists():
        srcset = ' srcset="img/%s-sm.jpg %dw, img/%s.jpg %dw"' % (nombre, dims(nombre + "-sm.jpg")[0], nombre, w)
    estilo = ' style="object-position:%s"' % pos if pos else ""
    carga = "" if eager else ' loading="lazy" decoding="async"'
    prio = ' fetchpriority="high"' if prioridad else ""
    cl = ' class="%s"' % clase if clase else ""
    return '<img src="img/%s.jpg"%s sizes="%s" width="%d" height="%d" %s%s%s%s%s>' % (
        nombre, srcset, sizes, w, h, ia("alt", en, es), carga, prio, estilo, cl)


# ---------------------------------------------------------------------------
# Piezas comunes
# ---------------------------------------------------------------------------
ONDA = ('<svg class="wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">'
        '<path d="M0 60c120 30 240 36 360 14s240-52 360-44 240 52 360 60 240-10 360-38V100H0z"/></svg>')


def cabecera(activa, solida):
    def a(href, clave, en, es):
        cur = ' aria-current="page"' if activa == clave else ""
        return '<a href="%s"%s>%s</a>' % (href, cur, T(en, es))

    menu = ""
    for cid, (en, es), _, _ in D.CATEGORIAS[:3]:
        menu += '<a href="tours.html#%s">%s</a>' % (cid, T(en, es))
    return """<header class="hdr%s" id="top">
  <div class="wrap hdr__in">
    <a class="brand" href="index.html" aria-label="%s">
      <img src="img/logo-128.png" width="48" height="48" alt="Peniel Tours">
      <span class="brand__txt"><b>PENIEL TOURS</b><small>Playa Flamingo</small></span>
    </a>
    <nav class="nav" id="nav" aria-label="%s" data-es-aria-label="Principal">
      %s
      <div class="dd"><a href="tours.html"%s>%s</a><div class="dd__menu">%s</div></div>
      %s
      %s
      %s
    </nav>
    <div class="lang" role="group" aria-label="Language / Idioma"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="es" aria-pressed="false">ES</button></div>
    <a class="btn btn--sun btn--sm hdr__cta" %s>%s %s</a>
    <button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="Open menu">%s</button>
  </div>
</header>""" % (
        " hdr--solid" if solida else "", e(S["nombre"]), "Main",
        a("index.html", "home", "Home", "Inicio"),
        ' aria-current="page"' if activa == "tours" else "", T("Tours", "Tours"), menu,
        a("gallery.html", "gallery", "Gallery", "Galería"),
        a("contact.html", "contact", "Contact", "Contacto"),
        a("links.html", "links", "Links", "Enlaces"),
        wa("Hi Peniel Tours! I'd like to book a tour.", "¡Hola Peniel Tours! Quisiera reservar un tour."),
        ic("wa"), T("Book now", "Reservar"), ic("menu"))


def pie():
    return """<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div>
        <a class="brand" href="index.html" aria-label="%s"><img src="img/logo-128.png" width="48" height="48" alt="" loading="lazy"><span class="brand__txt"><b>PENIEL TOURS</b><small>Playa Flamingo</small></span></a>
        <p class="ftr__tag">%s</p>
        <div class="ftr__soc">
          <a href="%s" target="_blank" rel="noopener" aria-label="Instagram %s">%s</a>
          <a href="%s" target="_blank" rel="noopener" aria-label="Facebook">%s</a>
          <a %s aria-label="WhatsApp">%s</a>
        </div>
      </div>
      <div>
        <h4>%s</h4>
        <ul>
          <li><a href="tours.html">%s</a></li>
          <li><a href="gallery.html">%s</a></li>
          <li><a href="contact.html">%s</a></li>
          <li><a href="links.html">%s</a></li>
        </ul>
      </div>
      <div>
        <h4>%s</h4>
        <ul>
          <li><a href="tours.html#water">%s</a></li>
          <li><a href="tours.html#land">%s</a></li>
          <li><a href="tours.html#wild">%s</a></li>
          <li><a href="tours.html#more">%s</a></li>
        </ul>
      </div>
      <div>
        <h4>%s</h4>
        <ul>
          <li><a %s>WhatsApp %s</a></li>
          <li><a href="tel:%s">%s</a></li>
          <li><a href="%s" target="_blank" rel="noopener">%s</a></li>
          <li>Playa Flamingo, Guanacaste, Costa Rica</li>
        </ul>
      </div>
    </div>
    <div class="ftr__legal">
      <p>&copy; <span data-year>2026</span> Peniel Tours Flamingo.</p>
      <p>%s</p>
    </div>
  </div>
</footer>
<a class="wa-float" %s %s>%s</a>""" % (
        e(S["nombre"]), T("Best tours in Costa Rica. Call or text for details and pricing.",
                          "Los mejores tours de Costa Rica. Llama o escribe para detalles y precios."),
        S["instagram"], S["instagram_usuario"], ic("ig"), S["facebook"], ic("fb"),
        wa("Hi Peniel Tours! I found you on your website and would like to ask about a tour.",
           "¡Hola Peniel Tours! Los encontré en su sitio web y quiero consultar por un tour."), ic("wa"),
        T("Explore", "Explorar"), T("All tours", "Todos los tours"), T("Gallery", "Galería"), T("Contact", "Contacto"), T("Links", "Enlaces"),
        T("Tours", "Tours"), T("On the water", "En el agua"), T("On land", "En tierra"), T("Nature &amp; parks", "Naturaleza y parques"), T("More", "Más"),
        T("Contact", "Contacto"), wa("Hi Peniel Tours! I'd like to ask about a tour.", "¡Hola Peniel Tours! Quisiera consultar por un tour."),
        S["tel_texto"], S["tel"], S["tel_texto"], S["instagram"], S["instagram_usuario"],
        T("Tours in Playa Flamingo, Guanacaste.", "Tours en Playa Flamingo, Guanacaste."),
        wa("Hi Peniel Tours! I'd like to ask about a tour.", "¡Hola Peniel Tours! Quisiera consultar por un tour."),
        ia("aria-label", "Message us on WhatsApp", "Escríbenos por WhatsApp"), ic("wa"))


def pagina(nombre, titulo, desc, cuerpo, activa=None, solida=True, og="sail-sunset", clase_body="", sin_cabecera=False):
    t_en, t_es = titulo
    d_en, d_es = desc
    base = S["url"].rstrip("/") + "/" if S["url"] else ""
    jsonld = {
        "@context": "https://schema.org", "@type": "TravelAgency", "name": S["nombre"],
        "telephone": S["tel"], "image": base + "img/logo.png",
        "address": {"@type": "PostalAddress", "addressLocality": "Playa Flamingo", "addressRegion": "Guanacaste", "addressCountry": "CR"},
        "sameAs": [S["instagram"], S["facebook"]],
    }
    robots = '<meta name="robots" content="noindex,nofollow">\n' if S["noindex"] else ""
    return """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title data-es="%s">%s</title>
<meta name="description" content="%s" data-es-content="%s">
%s<meta name="wa-number" content="%s">
<meta name="theme-color" content="#0F2E5C">
<link rel="icon" href="img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Peniel Tours Flamingo">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:image" content="%simg/%s.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css">
<script type="application/ld+json">%s</script>
</head>
<body%s>
%s
<a class="skip" href="#main" data-es="Saltar al contenido">Skip to content</a>
%s
<main id="main">
%s
</main>
%s
<script src="js/site.js"></script>
</body>
</html>
""" % (e(t_es), t_en, e(d_en), e(d_es), robots, S["whatsapp"], e(t_en), e(d_en), base, og,
       json.dumps(jsonld, ensure_ascii=False),
       ' class="%s"' % clase_body if clase_body else "",
       sprite(), "" if sin_cabecera else cabecera(activa, solida), cuerpo,
       "" if sin_cabecera else pie())


# ---------------------------------------------------------------------------
# Secciones reutilizables
# ---------------------------------------------------------------------------
def opciones_tours():
    o = '<option value="" data-es="Todavía no sé — ayúdenme a elegir">Not sure yet — help me choose</option>'
    for t in D.TOURS:
        o += '<option value="%s" data-es="%s">%s</option>' % (t["id"], e(t["es"]), t["en"])
    return o


def formulario(tipo, titulo, boton, personas=True, mensaje=False, telefono=False):
    t_en, t_es = titulo
    b_en, b_es = boton
    f = '<form class="form" data-wa-form="%s" novalidate>\n<h3>%s</h3>\n' % (tipo, T(t_en, t_es))
    f += '<div class="field"><label for="%s-nombre">%s</label><input id="%s-nombre" name="nombre" autocomplete="name" required %s><span class="err">%s</span></div>\n' % (
        tipo, T("Your name", "Tu nombre"), tipo, ia("placeholder", "Name", "Nombre"), T("Please add your name.", "Escribe tu nombre."))
    f += '<div class="field"><label for="%s-tour">%s</label><select id="%s-tour" name="tour">%s</select></div>\n' % (
        tipo, T("Tour", "Tour"), tipo, opciones_tours())
    fila = ""
    if personas:
        fila += '<div class="field"><label for="%s-personas">%s</label><input id="%s-personas" name="personas" type="number" min="1" max="99" inputmode="numeric" %s></div>' % (
            tipo, T("People", "Personas"), tipo, ia("placeholder", "How many?", "¿Cuántas?"))
    fila += '<div class="field"><label for="%s-fecha">%s</label><input id="%s-fecha" name="fecha" type="date"></div>' % (tipo, T("Date", "Fecha"), tipo)
    f += '<div class="row2">%s</div>\n' % fila
    if telefono:
        f += '<div class="field"><label for="%s-tel">%s</label><input id="%s-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel"></div>\n' % (
            tipo, T("Phone (optional)", "Teléfono (opcional)"), tipo)
    if mensaje:
        f += '<div class="field"><label for="%s-msg">%s</label><textarea id="%s-msg" name="mensaje" %s></textarea></div>\n' % (
            tipo, T("Message (optional)", "Mensaje (opcional)"), tipo,
            ia("placeholder", "Tell us what you have in mind", "Cuéntanos qué tienes en mente"))
    f += '<button class="btn btn--wa btn--block" type="submit">%s %s</button>\n' % (ic("wa"), T(b_en, b_es))
    f += '<p class="form__note">%s</p>\n<p class="form__sent" role="status" aria-live="polite"></p>\n</form>' % T(
        "This opens WhatsApp with your message ready to send. Nothing is stored on this site.",
        "Esto abre WhatsApp con tu mensaje listo para enviar. En este sitio no se guarda nada.")
    return f


def tarjeta(t, sizes="(min-width:1100px) 360px, (min-width:700px) 45vw, 92vw"):
    cid = t["cat"]
    nombre_cat = {c[0]: c[1] for c in D.CATEGORIAS}[cid]
    if t.get("foto"):
        medio = '<div class="card__media">%s<span class="card__tag">%s</span></div>' % (
            foto(t["foto"], (t["en"], t["es"]), sizes, pos=t.get("pos")), T(*nombre_cat))
    else:
        medio = '<div class="card__media card__media--picto card__media--%s"><svg class="picto" viewBox="0 0 64 64" role="img" %s><use href="#p-%s"/></svg><span class="card__tag">%s</span></div>' % (
            cid, ia("aria-label", t["en"], t["es"]), t["pic"], T(*nombre_cat))
    desc = T(t["d_en"], t["d_es"])
    if t.get("confirmar") and t["id"] == "adventure-day":
        desc = conf(desc, t["confirmar"])
    extra = ""
    if t.get("extra_en"):
        extra = '<span class="card__extra">%s</span>' % conf(T(t["extra_en"], t["extra_es"]), t["confirmar"])
    msg_en = "Hi Peniel Tours! I'd like details and pricing for: %s." % t["en"]
    msg_es = "¡Hola Peniel Tours! Quisiera detalles y precios de: %s." % t["es"]
    return ('<article class="card rv" id="%s">%s<div class="card__body"><h3>%s</h3><p>%s</p>%s'
            '<a class="btn btn--outline btn--sm" %s>%s %s</a></div></article>') % (
        t["id"], medio, T(t["en"], t["es"]), desc, extra, wa(msg_en, msg_es), ic("wa"), T("Ask about this tour", "Pregunta por este tour"))


def videos(titulo=True):
    figs = ""
    for nombre, (en, es) in D.VIDEOS:
        clase = "vid rv vid--tall" if nombre == "horses" else "vid rv"
        figs += ('<figure class="%s"><div class="vid__frame"><video data-loop muted loop playsinline preload="none" poster="img/poster-%s.jpg" '
                 'aria-label="%s" data-es-aria-label="%s"><source src="video/%s.mp4" type="video/mp4"></video></div>'
                 '<figcaption>%s</figcaption></figure>') % (clase, nombre, e(en), e(es), nombre, T(en, es))
    return '<div class="vids">%s</div>' % figs


def banda_contacto():
    return """<section class="cta sec">
  <div class="wrap">
    <p class="eyebrow">%s</p>
    <h2>%s</h2>
    <a class="cta__num" href="tel:%s">%s <span>%s</span></a>
    <div class="cta__btns">
      <a class="btn btn--wa" %s>%s %s</a>
      <a class="btn btn--ghost" href="tel:%s">%s %s</a>
    </div>
  </div>
</section>""" % (
        T("Call or text", "Llama o escribe"), T("Ready for your adventure?", "¿Listo para tu aventura?"),
        S["tel"], ic("phone"), S["tel_texto"],
        wa("Hi Peniel Tours! I'd like to book a tour.", "¡Hola Peniel Tours! Quisiera reservar un tour."), ic("wa"), T("Book on WhatsApp", "Reserva por WhatsApp"),
        S["tel"], ic("phone"), T("Call us", "Llámanos"))


def visitanos():
    mapa = "https://www.google.com/maps?q=%s&output=embed" % urllib.parse.quote(S["mapa"])
    ruta = "https://www.google.com/maps/search/?api=1&query=%s" % urllib.parse.quote(S["mapa"])
    nota = "Es el lugar que sale en la etiqueta de ubicación de sus publicaciones de Instagram; falta confirmar dónde se encuentran con los clientes."
    return """<section class="sec sec--sky" id="visit">
  <div class="wrap">
    <div class="sec__head rv"><p class="eyebrow">%s</p><h2>%s</h2></div>
    <div class="visit">
      <div class="visit__info rv">
        <ul class="facts">
          <li>%s<div><b>%s</b>%s</div></li>
          <li>%s<div><b>%s</b><a href="tel:%s">%s</a></div></li>
          <li>%s<div><b>Instagram</b><a href="%s" target="_blank" rel="noopener">%s</a></div></li>
          <li>%s<div><b>Facebook</b><a href="%s" target="_blank" rel="noopener">Peniel Tours flamingo</a></div></li>
        </ul>
        <div class="visit__btns">
          <a class="btn btn--wa" %s>%s %s</a>
          <a class="btn btn--outline" href="%s" target="_blank" rel="noopener">%s %s</a>
        </div>
      </div>
      <div class="map rv"><iframe title="Map of Playa Flamingo" %s loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="%s"></iframe></div>
    </div>
  </div>
</section>""" % (
        T("Come visit us", "Visítanos"), T("Find us in Playa Flamingo", "Encuéntranos en Playa Flamingo"),
        ic("pin"), T("Playa Flamingo, Guanacaste, Costa Rica", "Playa Flamingo, Guanacaste, Costa Rica"),
        conf(T("Most of our photos were taken around the Margaritaville Beach Resort. Message us to confirm where we meet for your tour.",
               "La mayoría de nuestras fotos son de los alrededores del Margaritaville Beach Resort. Escríbenos para confirmar dónde nos encontramos en tu tour."), nota),
        ic("phone"), T("Call or text", "Llama o escribe"), S["tel"], S["tel_texto"],
        ic("ig"), S["instagram"], S["instagram_usuario"],
        ic("fb"), S["facebook"],
        wa("Hi Peniel Tours! I'd like to book a tour.", "¡Hola Peniel Tours! Quisiera reservar un tour."), ic("wa"), T("Message us", "Escríbenos"),
        ruta, ic("pin"), T("Directions", "Cómo llegar"),
        ia("aria-label", "Map", "Mapa"), mapa)


# ---------------------------------------------------------------------------
# Páginas
# ---------------------------------------------------------------------------
def pag_inicio():
    slides = "".join('<div class="hero__slide">%s</div>' % foto(n, (a_en, a_es), "100vw", pos=p, eager=True, prioridad=(i == 0))
                     for i, (n, p, a_en, a_es) in enumerate([
                         ("sail-sun-low", "center 45%", "Sunset over the Pacific from a catamaran", "Atardecer sobre el Pacífico desde un catamarán"),
                         ("horse-rider", "center 35%", "A guide on horseback at Playa Flamingo", "Un guía a caballo en Playa Flamingo"),
                         ("fish-crew", "center 40%", "Crew showing the day's catch", "La tripulación con la pesca del día")]))
    chips = "".join("<li>%s</li>" % T(en, es) for en, es in [
        ("ATV", "ATV"), ("Sailing", "Navegación"), ("Sport fishing", "Pesca deportiva"), ("Horseback riding", "Cabalgatas"),
        ("Wave runners", "Motos acuáticas"), ("Zip line", "Zip line"), ("Volcano tours", "Volcanes"), ("Turtle tours", "Tortugas")])
    hero = """<section class="hero">
  <div class="hero__slides" aria-hidden="false">%s</div>
  <div class="wrap hero__in">
    <p class="eyebrow">Playa Flamingo &middot; Guanacaste &middot; Costa Rica</p>
    <h1>%s</h1>
    <p class="hero__lead">%s</p>
    <div class="hero__cta">
      <a class="btn btn--sun" %s>%s %s</a>
      <a class="btn btn--ghost" href="tours.html">%s</a>
    </div>
    <ul class="chips">%s</ul>
  </div>
  %s
</section>""" % (
        slides,
        T("Adventure tours in <em>Playa Flamingo</em>", "Tours de aventura en <em>Playa Flamingo</em>"),
        T("ATV, sunset sailing, sport fishing, horseback riding, wave runners and more. Call or text for details and pricing.",
          "ATV, navegación al atardecer, pesca deportiva, cabalgatas, motos acuáticas y mucho más. Llama o escribe para detalles y precios."),
        wa("Hi Peniel Tours! I'd like to book a tour.", "¡Hola Peniel Tours! Quisiera reservar un tour."), ic("wa"), T("Book on WhatsApp", "Reserva por WhatsApp"),
        T("See all tours", "Ver todos los tours"), chips, ONDA)

    esperar = [
        ("water", "sail-sun-low", "center 45%", ("On the water", "En el agua"),
         ("Sail into the sunset, go sport fishing or ride a wave runner along the Pacific coast.",
          "Navega hacia el atardecer, sal a pescar o maneja una moto acuática por la costa del Pacífico."),
         ("The sun dipping toward the horizon, sails overhead", "El sol bajando hacia el horizonte, con las velas arriba")),
        ("land", "horse-group", "center 55%", ("On land", "En tierra"),
         ("Ride an ATV along the beach road or trot along the shore on horseback.",
          "Recorre en ATV el camino de la playa o cabalga por la orilla."),
         ("A group riding horses along the beach", "Un grupo cabalgando por la playa")),
        ("wild", "wild-monkey", "center 40%", ("In the wild", "En plena naturaleza"),
         ("Volcanoes, national parks, sea turtles and wildlife: Guanacaste's nature is part of the plan.",
          "Volcanes, parques nacionales, tortugas marinas y fauna: la naturaleza de Guanacaste es parte del plan."),
         ("A squirrel monkey resting on a branch", "Un mono ardilla descansando en una rama")),
    ]
    tarjetas = ""
    for i, (cid, img, pos, (t_en, t_es), (d_en, d_es), alt) in enumerate(esperar):
        tarjetas += ('<a class="expect rv" style="--d:%.2fs" href="tours.html#%s"><div class="expect__img">%s</div>'
                     '<div class="expect__body"><h3>%s</h3><p>%s</p><span class="more">%s %s</span></div></a>') % (
            i * 0.1, cid, foto(img, alt, "(min-width:900px) 380px, 92vw", pos=pos), T(t_en, t_es), T(d_en, d_es), T("See tours", "Ver tours"), ic("arrow"))
    sec_esperar = """<section class="sec">
  <div class="wrap">
    <div class="sec__head sec__head--center rv"><p class="eyebrow">%s</p><h2>%s</h2><p class="sec__lead">%s</p></div>
    <div class="three">%s</div>
  </div>
</section>""" % (T("What to expect", "Qué esperar"), T("One call, any tour", "Una llamada, cualquier tour"),
                 T("We do all kinds of tours, from the beach to the volcano. Pick what sounds fun and we'll take care of the rest.",
                   "Hacemos todo tipo de tours, de la playa al volcán. Elige lo que te guste y nosotros nos encargamos del resto."),
                 tarjetas)

    dest = "".join(tarjeta(t) for t in D.TOURS if t.get("destacado"))
    sec_tours = """<section class="sec sec--sand" id="tours">
  <div class="wrap">
    <div class="sec__head rv"><p class="eyebrow">%s</p><h2>%s</h2><p class="sec__lead">%s</p></div>
    <div class="grid">%s</div>
    <p class="follow rv"><a class="btn btn--sun" href="tours.html">%s %s</a></p>
  </div>
</section>""" % (T("Our tours", "Nuestros tours"), T("Pick your adventure", "Elige tu aventura"),
                 T("A few favorites. There's more: zip line, rafting, tubing, volcano tours, Palo Verde National Park and shuttles.",
                   "Algunos favoritos. Hay más: zip line, rafting, tubing, volcanes, Parque Nacional Palo Verde y traslados."),
                 dest, T("See all tours", "Ver todos los tours"), ic("arrow"))

    sec_videos = """<section class="sec sec--navy">
  <div class="wrap">
    <div class="sec__head sec__head--center rv"><p class="eyebrow">%s</p><h2>%s</h2><p class="sec__lead">%s</p></div>
    %s
    <div class="follow rv"><a class="btn btn--ghost" href="%s" target="_blank" rel="noopener">%s %s</a></div>
  </div>
</section>""" % (T("Real clips", "Videos reales"), T("See it in action", "Míralo en acción"),
                 T("Clips from our Instagram, filmed on our tours around Playa Flamingo.", "Videos de nuestro Instagram, grabados en nuestros tours alrededor de Playa Flamingo."),
                 videos(), S["instagram"], ic("ig"), T("Follow %s" % S["instagram_usuario"], "Sigue a %s" % S["instagram_usuario"]))

    sec_grupo = """<section class="group sec">
  <div class="wrap group__in">
    <div class="rv"><p class="eyebrow" style="color:var(--navy-ink)">%s</p><h2>%s</h2><p>%s</p></div>
    <div class="rv">%s</div>
  </div>
</section>""" % (T("Group offers", "Ofertas para grupos"), T("Traveling in a group?", "¿Viajan en grupo?"),
                 T("Tell us how many you are and when you'd like to go. We'll answer on WhatsApp with details and pricing.",
                   "Cuéntanos cuántos son y cuándo quieren ir. Te respondemos por WhatsApp con detalles y precios."),
                 formulario("group", ("Get a group quote", "Pide una cotización para tu grupo"), ("Send on WhatsApp", "Enviar por WhatsApp")))

    pasos = "".join(
        '<div class="step rv" style="--d:%.2fs"><span class="step__n" aria-hidden="true">%d</span><h3>%s</h3><p>%s</p></div>' % (
            i * 0.1, i + 1, T(h_en, h_es), T(p_en, p_es))
        for i, (h_en, h_es, p_en, p_es) in enumerate([
            ("Message us", "Escríbenos", "Send a WhatsApp or give us a call with the tour you like, the date and how many people are coming.",
             "Mándanos un WhatsApp o llámanos con el tour que te gusta, la fecha y cuántas personas son."),
            ("Get the details", "Recibe los detalles", "We answer with the details and pricing, and we can help you pick if you're not sure.",
             "Te respondemos con los detalles y los precios, y te ayudamos a elegir si no estás seguro."),
            ("Enjoy the adventure", "Disfruta la aventura", "Show up ready for a great day in Guanacaste. We'll take it from there.",
             "Llega listo para un gran día en Guanacaste. Nosotros nos encargamos del resto.")]))
    sec_pasos = """<section class="sec">
  <div class="wrap">
    <div class="sec__head rv"><p class="eyebrow">%s</p><h2>%s</h2></div>
    <div class="steps">%s</div>
  </div>
</section>""" % (T("How it works", "Cómo funciona"), T("Booking is easy", "Reservar es fácil"), pasos)

    orden = ["sail-sunset", "atv-convoy", "horse-group", "wild-dolphin", "fish-crew", "wild-turtle", "jetski-beach", "wild-sloth"]
    cat = {g[0]: g for g in D.GALERIA}
    cat["wild-sloth"] = ("wild-sloth", "wild", "A sloth hanging from a branch", "Un perezoso colgado de una rama")
    mosaico = "".join('<a class="rv" href="gallery.html">%s</a>' % foto(n, (cat[n][2], cat[n][3]), "(min-width:900px) 300px, 50vw") for n in orden)
    sec_galeria = """<section class="sec sec--sand">
  <div class="wrap">
    <div class="sec__head rv"><p class="eyebrow">%s</p><h2>%s</h2></div>
    <div class="mosaic">%s</div>
    <p class="follow rv"><a class="btn btn--outline" href="gallery.html">%s %s</a></p>
  </div>
</section>""" % (T("Gallery", "Galería"), T("Moments from our tours", "Momentos de nuestros tours"), mosaico, T("See the full gallery", "Ver toda la galería"), ic("arrow"))

    cuerpo = hero + sec_esperar + sec_tours + sec_videos + sec_grupo + sec_pasos + sec_galeria + visitanos() + banda_contacto()
    return pagina("index", ("Peniel Tours Flamingo | Adventure tours in Playa Flamingo, Costa Rica",
                            "Peniel Tours Flamingo | Tours de aventura en Playa Flamingo, Costa Rica"),
                  ("ATV, sunset sailing, sport fishing, horseback riding, wave runners and more in Playa Flamingo, Guanacaste. Call or text +506 8471 6533 for details and pricing.",
                   "ATV, navegación al atardecer, pesca deportiva, cabalgatas, motos acuáticas y más en Playa Flamingo, Guanacaste. Llama o escribe al +506 8471 6533 para detalles y precios."),
                  cuerpo, activa="home", solida=False, og="sail-sun-low")


def hero_interior(img, pos, titulo, sub):
    return """<section class="phero">
  %s
  <div class="wrap phero__in"><h1>%s</h1><p>%s</p></div>
</section>""" % (foto(img, ("", ""), "100vw", pos=pos, eager=True), T(*titulo), T(*sub))


def pag_tours():
    nav = '<nav class="catnav" aria-label="Tour types" data-es-aria-label="Tipos de tour"><div class="wrap">%s</div></nav>' % "".join(
        '<a href="#%s">%s</a>' % (cid, T(*nombre)) for cid, nombre, _, _ in D.CATEGORIAS)
    secciones = ""
    for cid, nombre, d_en, d_es in D.CATEGORIAS:
        lista = [t for t in D.TOURS if t["cat"] == cid]
        secciones += ('<section class="cat" id="%s"><div class="wrap"><div class="cat__head rv"><h2>%s</h2><p>%s</p></div>'
                      '<div class="grid">%s</div></div></section>') % (cid, T(*nombre), T(d_en, d_es), "".join(tarjeta(t) for t in lista))
    pie_tours = """<section class="sec sec--sand">
  <div class="wrap">
    <div class="sec__head sec__head--center rv"><p class="eyebrow">%s</p><h2>%s</h2><p class="sec__lead">%s</p></div>
    <div class="follow"><a class="btn btn--wa" %s>%s %s</a><a class="btn btn--outline" href="contact.html">%s</a></div>
  </div>
</section>""" % (T("Don't see it?", "¿No lo ves?"), T("We do all tours", "Hacemos todo tipo de tours"),
                 T("If there's something you'd like to do in Guanacaste, ask us. Call or text for details and pricing.",
                   "Si hay algo que quieras hacer en Guanacaste, pregúntanos. Llama o escribe para detalles y precios."),
                 wa("Hi Peniel Tours! Do you offer other tours? I'd like to do...", "¡Hola Peniel Tours! ¿Tienen otros tours? Me gustaría hacer..."),
                 ic("wa"), T("Ask us", "Pregúntanos"), T("Contact us", "Contáctanos"))
    cuerpo = hero_interior("sail-sunset", "center 45%", ("Our tours", "Nuestros tours"),
                           ("On the water, on land and in the wild. Call or text for details and pricing.",
                            "En el agua, en tierra y en plena naturaleza. Llama o escribe para detalles y precios.")) + nav + secciones + pie_tours + banda_contacto()
    return pagina("tours", ("Tours | Peniel Tours Flamingo", "Tours | Peniel Tours Flamingo"),
                  ("ATV, sunset sailing, sport fishing, wave runners, horseback riding, zip line, volcano tours and more from Playa Flamingo.",
                   "ATV, navegación al atardecer, pesca deportiva, motos acuáticas, cabalgatas, zip line, volcanes y más desde Playa Flamingo."),
                  cuerpo, activa="tours", solida=False, og="sail-sunset")


def pag_galeria():
    filtros = '<div class="filters" role="group" %s>%s</div>' % (ia("aria-label", "Filter photos", "Filtrar fotos"), "".join(
        '<button type="button" data-cat="%s" aria-pressed="%s">%s</button>' % (c, "true" if c == "all" else "false", T(en, es))
        for c, en, es in [("all", "All", "Todas"), ("water", "On the water", "En el agua"), ("land", "On land", "En tierra"), ("wild", "Wildlife", "Fauna")]))
    items = "".join('<a href="img/%s.jpg" data-cat="%s">%s</a>' % (n, c, foto(n, (en, es), "(min-width:900px) 360px, (min-width:600px) 45vw, 92vw"))
                    for n, c, en, es in D.GALERIA)
    cuerpo = hero_interior("atv-convoy", "center 45%", ("Gallery", "Galería"),
                           ("Photos and clips from our Instagram, taken on our tours around Playa Flamingo.",
                            "Fotos y videos de nuestro Instagram, tomados en nuestros tours alrededor de Playa Flamingo.")) + """
<section class="sec sec--navy"><div class="wrap">
  <div class="sec__head rv"><p class="eyebrow">%s</p><h2>%s</h2></div>
  %s
</div></section>
<section class="sec"><div class="wrap">
  %s
  <div class="masonry">%s</div>
  <p class="follow rv" style="margin-top:36px"><a class="btn btn--outline" href="%s" target="_blank" rel="noopener">%s %s</a></p>
</div></section>
<dialog class="lb" id="lb" aria-label="Photo viewer" data-es-aria-label="Visor de fotos">
  <button class="lb__close" type="button" aria-label="Close" data-es-aria-label="Cerrar">%s</button>
  <button class="lb__btn lb__prev" type="button" aria-label="Previous photo" data-es-aria-label="Foto anterior">%s</button>
  <button class="lb__btn lb__next" type="button" aria-label="Next photo" data-es-aria-label="Foto siguiente">%s</button>
  <figure class="lb__fig"><img alt=""><figcaption class="lb__cap"></figcaption></figure>
</dialog>
""" % (T("Clips", "Videos"), T("On our tours", "En nuestros tours"), videos(), filtros, items,
       S["instagram"], ic("ig"), T("See more on Instagram", "Ver más en Instagram"), ic("close"), ic("arrow"), ic("arrow")) + banda_contacto()
    return pagina("gallery", ("Gallery | Peniel Tours Flamingo", "Galería | Peniel Tours Flamingo"),
                  ("Photos and videos from Peniel Tours: sunset sailing, ATV, horseback riding, sport fishing and wildlife in Playa Flamingo.",
                   "Fotos y videos de Peniel Tours: navegación al atardecer, ATV, cabalgatas, pesca deportiva y fauna en Playa Flamingo."),
                  cuerpo, activa="gallery", solida=False, og="atv-convoy")


def pag_contacto():
    faq = "".join('<details%s><summary>%s</summary><div>%s</div></details>' % (
        " open" if i == 0 else "", T(*q),
        conf(T(*a), "Falta confirmar dónde se encuentran con los clientes.") if i == 3 else T(*a)) for i, (q, a) in enumerate(D.PREGUNTAS))
    tarjetas = """<div class="ccards">
  <a class="ccard ccard--wa" %s>%s<div><b>WhatsApp</b><span>%s</span></div></a>
  <a class="ccard" href="tel:%s">%s<div><b>%s</b><span>%s</span></div></a>
  <a class="ccard" href="%s" target="_blank" rel="noopener">%s<div><b>Instagram</b><span>%s</span></div></a>
  <a class="ccard" href="%s" target="_blank" rel="noopener">%s<div><b>Facebook</b><span>Peniel Tours flamingo</span></div></a>
  <a class="ccard" href="%s" target="_blank" rel="noopener">%s<div><b>Tripadvisor</b><span>%s</span></div></a>
</div>""" % (
        wa("Hi Peniel Tours! I'd like to book a tour.", "¡Hola Peniel Tours! Quisiera reservar un tour."), ic("wa"), S["tel_texto"],
        S["tel"], ic("phone"), T("Call us", "Llámanos"), S["tel_texto"],
        S["instagram"], ic("ig"), S["instagram_usuario"],
        S["facebook"], ic("fb"),
        S["tripadvisor"], ic("star"), conf(T("Read guest reviews", "Lee las opiniones de los viajeros"), "Confirmar que este listado de Tripadvisor (Flamingo Tours Peniel) es del negocio."))
    cuerpo = hero_interior("sail-dusk", "center 55%", ("Contact us", "Contáctanos"),
                           ("Message us on WhatsApp or give us a call. We'll answer with details and pricing.",
                            "Escríbenos por WhatsApp o llámanos. Te respondemos con detalles y precios.")) + """
<section class="sec"><div class="wrap contact">
  <div class="rv">%s</div>
  <div class="rv"><p class="eyebrow">%s</p><h2 style="font-size:clamp(2rem,4.4vw,3rem);margin-bottom:22px">%s</h2>%s</div>
</div></section>
<section class="sec sec--sand"><div class="wrap">
  <div class="sec__head rv"><p class="eyebrow">FAQ</p><h2>%s</h2></div>
  <div class="faq rv">%s</div>
</div></section>
""" % (formulario("contact", ("Book or ask about a tour", "Reserva o consulta por un tour"), ("Send on WhatsApp", "Enviar por WhatsApp"), mensaje=True, telefono=True),
       T("Reach us", "Escríbenos"), T("Where to find us", "Dónde encontrarnos"), tarjetas,
       T("Good to know", "Bueno saber"), faq) + visitanos() + banda_contacto()
    return pagina("contact", ("Contact | Peniel Tours Flamingo", "Contacto | Peniel Tours Flamingo"),
                  ("Book a tour with Peniel Tours in Playa Flamingo: WhatsApp or call +506 8471 6533.",
                   "Reserva un tour con Peniel Tours en Playa Flamingo: WhatsApp o llamada al +506 8471 6533."),
                  cuerpo, activa="contact", solida=False, og="sail-dusk")


def pag_enlaces():
    def li(href, icono, titulo, sub=None, clase="", extra=""):
        s = "<small>%s</small>" % sub if sub else ""
        return '<li><a %s class="%s" %s>%s<span>%s%s</span></a></li>' % (href, clase, extra, ic(icono), titulo, s)

    lista = "".join([
        li(wa("Hi Peniel Tours! I found you on Instagram and would like to book a tour.", "¡Hola Peniel Tours! Los encontré en Instagram y quiero reservar un tour."),
           "wa", T("Book on WhatsApp", "Reserva por WhatsApp"), S["tel_texto"], "is-wa"),
        li('href="tours.html"', "arrow", T("See all tours", "Ver todos los tours"), T("ATV, sailing, fishing, horses and more", "ATV, navegación, pesca, caballos y más")),
        li('href="tel:%s"' % S["tel"], "phone", T("Call us", "Llámanos"), S["tel_texto"]),
        li('href="%s" target="_blank" rel="noopener"' % S["instagram"], "ig", "Instagram", S["instagram_usuario"]),
        li('href="%s" target="_blank" rel="noopener"' % S["facebook"], "fb", "Facebook", "Peniel Tours flamingo"),
        li('href="gallery.html"', "star", T("Photos and videos", "Fotos y videos")),
        li('href="index.html"', "pin", T("Our website", "Nuestro sitio web"), "Playa Flamingo, Guanacaste"),
    ])
    cuerpo = """<div class="links">
  <img class="links__logo" src="img/logo.png" width="112" height="112" alt="Peniel Tours">
  <h1>PENIEL TOURS</h1>
  <p class="links__sub">%s</p>
  <ul class="links__list">%s</ul>
  <div class="lang" role="group" aria-label="Language / Idioma"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="es" aria-pressed="false">ES</button></div>
</div>
<a class="wa-float" %s %s>%s</a>""" % (
        T("Best tours in Costa Rica", "Los mejores tours de Costa Rica"), lista,
        wa("Hi Peniel Tours! I'd like to book a tour.", "¡Hola Peniel Tours! Quisiera reservar un tour."), ia("aria-label", "Message us on WhatsApp", "Escríbenos por WhatsApp"), ic("wa"))
    return pagina("links", ("Peniel Tours Flamingo | Links", "Peniel Tours Flamingo | Enlaces"),
                  ("Book a tour, call us or follow Peniel Tours on Instagram and Facebook.",
                   "Reserva un tour, llámanos o sigue a Peniel Tours en Instagram y Facebook."),
                  cuerpo, sin_cabecera=True, clase_body="links-page", og="sail-sunset")


def pag_404():
    cuerpo = """<section class="sec" style="min-height:70svh;display:grid;place-items:center;text-align:center">
  <div class="wrap"><p class="eyebrow">404</p><h1 style="font-size:clamp(3rem,10vw,6rem)">%s</h1>
  <p class="sec__lead">%s</p><p class="follow"><a class="btn btn--sun" href="index.html">%s</a></p></div>
</section>""" % (T("Lost at sea?", "¿Perdido en el mar?"), T("That page doesn't exist. Let's get you back to the tours.", "Esa página no existe. Te llevamos de vuelta a los tours."), T("Back to home", "Volver al inicio"))
    return pagina("404", ("Page not found | Peniel Tours Flamingo", "Página no encontrada | Peniel Tours Flamingo"),
                  ("Page not found.", "Página no encontrada."), cuerpo, solida=True)


def main():
    paginas = {"index.html": pag_inicio(), "tours.html": pag_tours(), "gallery.html": pag_galeria(),
               "contact.html": pag_contacto(), "links.html": pag_enlaces(), "404.html": pag_404()}
    for nombre, contenido in paginas.items():
        (RAIZ / nombre).write_text(contenido, encoding="utf-8")
        print("%-14s %5d KB" % (nombre, len(contenido) // 1024))
    robots = "User-agent: *\n" + ("Disallow: /\n" if S["noindex"] else "Allow: /\n")
    if S["url"] and not S["noindex"]:
        robots += "Sitemap: %s/sitemap.xml\n" % S["url"].rstrip("/")
        urls = "".join("<url><loc>%s/%s</loc></url>" % (S["url"].rstrip("/"), p) for p in ("", "tours.html", "gallery.html", "contact.html"))
        (RAIZ / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">%s</urlset>' % urls, encoding="utf-8")
    (RAIZ / "robots.txt").write_text(robots, encoding="utf-8")


if __name__ == "__main__":
    main()
