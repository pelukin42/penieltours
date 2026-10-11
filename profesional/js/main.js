/* ==========================================================================
   Sitio Pro (multipágina) — MOTOR del skill /pro, igual para todos los clientes
   Se carga después de js/core.js y js/i18n.js. Dibuja lo que depende de
   NEGOCIO antes de que core.js conecte enlaces, WhatsApp y placeholders
   (DOMContentLoaded). Cada página se identifica con <body data-page="...">.
   ========================================================================== */

/* Banderas de la propuesta: se cambian aquí y en ningún otro lugar */
const MODO_DEMO        = true;   // notas y fuentes visibles. Pasar a false al publicar.
const MOSTRAR_PRECIOS  = false;  // el único precio que se vio es del perfil de FishingBooker (terceros). Encender solo con la lista real de Peniel Tours.
const MOSTRAR_HORARIO  = false;  // las salidas son por reserva: no hay horario de local.
const MOSTRAR_DIRECTOR = false;  // no se confirmó el nombre del capitán o responsable.
const CLUB             = false;  // no aplica: no hay plan de mantenimiento.
const TARJETA_REGALO   = false;  // no aplica por ahora.
const GALERIA          = false;  // sin fotos propias cargadas: nunca bancos de imágenes ni fotos de terceros.
const FLAGS = {
  terceros: false                // reservado para salidas que solo aparezcan en perfiles de terceros
};

(function(){
  'use strict';

  const PAGE = document.body.dataset.page || '';
  const N = NEGOCIO.nombre;
  // Vocabulario del rubro: tratamiento/paciente, proyecto/cliente, platillo/comensal…
  const V = Object.assign({ uno: 'servicio', varios: 'servicios', unoEn: 'service', variosEn: 'services',
    cliente: 'cliente', clienteEn: 'client', regalo: 'una tarjeta de regalo', regaloEn: 'a gift card' }, NEGOCIO.vocab || {});
  const cap = function(t){ return t.charAt(0).toUpperCase() + t.slice(1); };
  const lugar = function(){ return N + (NEGOCIO.ciudad ? ', ' + NEGOCIO.ciudad : ''); };

  /* ---------------- Utilidades de catálogo ---------------- */
  function activo(s){ return !s.flag || !!FLAGS[s.flag]; }
  function servicios(){ return NEGOCIO.servicios.filter(activo); }
  function nombreServicio(id){ const s = servicioPorId(id); return s ? L(s, 'nombre') : id; }
  function contarServicios(catId){ return servicios().filter(function(s){ return s.cats.indexOf(catId) >= 0; }).length; }
  function categoriasActivas(){ return NEGOCIO.categorias.filter(function(c){ return contarServicios(c.id) > 0; }); }
  function paquete(id){ return NEGOCIO.paquetes.filter(function(p){ return p.id === id; })[0] || null; }
  function listaNatural(arr){
    if (arr.length < 2) return arr.join('');
    return arr.slice(0, -1).join(', ') + L(' y ', ' and ') + arr[arr.length - 1];
  }
  function plural(n, uno, varios){ return n + ' ' + (n === 1 ? uno : varios); }
  function items(n){ return plural(n, L(V.uno, V.unoEn), L(V.varios, V.variosEn)); }

  function guardarFoco(){
    const a = document.activeElement;
    return a && a.dataset ? a.dataset.key : null;
  }
  function restaurarFoco(key, root){
    if (!key) return;
    const el = (root || document).querySelector('[data-key="' + key + '"]');
    if (el) el.focus();
  }

  /* ---------------- Banderas y modo demo ---------------- */
  function aplicarBanderas(){
    document.querySelectorAll('[data-demo]').forEach(function(el){ el.hidden = !MODO_DEMO; });
    if (!MODO_DEMO){
      const cinta = document.querySelector('.demo-bar');
      if (cinta) cinta.remove();
      document.body.classList.remove('has-demo-bar');
    }
    const mapa = { horario: MOSTRAR_HORARIO, director: MOSTRAR_DIRECTOR, membresias: CLUB, galeria: GALERIA, regalo: TARJETA_REGALO, precios: MOSTRAR_PRECIOS };
    document.querySelectorAll('[data-flag]').forEach(function(el){
      if (el.dataset.flag in mapa) el.hidden = !mapa[el.dataset.flag];
    });
  }

  /* ---------------- Horario ---------------- */
  function pintarEstado(){
    const e = estadoHorario();
    document.querySelectorAll('[data-render="estado"]').forEach(function(el){
      if (!e || !MOSTRAR_HORARIO){ el.hidden = true; return; }
      el.hidden = false;
      el.textContent = e.texto;
      el.classList.toggle('is-open', e.abierto);
    });
  }
  function gruposHorario(){
    const grupos = [];
    [1, 2, 3, 4, 5, 6, 0].forEach(function(d){
      const h = NEGOCIO.horario.filter(function(x){ return x.dia === d; })[0];
      const clave = h ? h.abre + '-' + h.cierra : 'cerrado';
      const ult = grupos[grupos.length - 1];
      if (ult && ult.clave === clave) ult.dias.push(d);
      else grupos.push({ clave: clave, dias: [d], h: h });
    });
    return grupos;
  }
  function nombreDias(dias){
    const cap = function(t){ return t.charAt(0).toUpperCase() + t.slice(1); };
    const k = esEN() ? 'en' : 'es';
    if (dias.length === 1) return cap(DIAS[k][dias[0]]);
    return cap(DIAS[k][dias[0]]) + L(' a ', ' to ') + (esEN() ? DIAS.en[dias[dias.length - 1]] : DIAS.es[dias[dias.length - 1]]);
  }
  function pintarHorario(){
    const hoy = ahoraCR().getDay();
    document.querySelectorAll('[data-render="horario"]').forEach(function(dl){
      dl.innerHTML = gruposHorario().map(function(g){
        return '<div' + (g.dias.indexOf(hoy) >= 0 ? ' class="is-hoy"' : '') + '><dt>' + esc(nombreDias(g.dias)) + '</dt><dd>' +
          (g.h ? esc(hora12(g.h.abre) + ' – ' + hora12(g.h.cierra)) : L('Cerrado', 'Closed')) + '</dd></div>';
      }).join('');
    });
    document.querySelectorAll('[data-render="faq-horario"]').forEach(function(p){
      p.textContent = gruposHorario().map(function(g, i){
        const dias = nombreDias(g.dias);
        return (i && !esEN() ? dias.charAt(0).toLowerCase() + dias.slice(1) : dias) + ': ' + (g.h ? hora12(g.h.abre) + L(' a ', ' to ') + hora12(g.h.cierra) : L('cerrado', 'closed'));
      }).join('; ') + '.';
    });
  }

  /* ---------------- Opiniones de Google (solo la cifra pública real) ---------------- */
  function estrellas(r){
    let h = '<span class="stars" aria-hidden="true">';
    for (let i = 1; i <= 5; i++){
      const op = r >= i - 0.25 ? 1 : (r >= i - 0.75 ? 0.55 : 0.2);
      h += '<svg style="opacity:' + op + '"><use href="#i-star"/></svg>';
    }
    return h + '</span>';
  }
  function pintarRating(){
    const g = NEGOCIO.google;
    const leer = 'https://search.google.com/local/reviews?placeid=' + NEGOCIO.googlePlaceId;
    const escribir = 'https://search.google.com/local/writereview?placeid=' + NEGOCIO.googlePlaceId;
    const num = String(g.rating).replace('.', esEN() ? '.' : ',');
    document.querySelectorAll('[data-render="rating-mini"]').forEach(function(el){
      if (!g.rating){ el.hidden = true; return; }
      el.innerHTML = '<a class="rating-mini" href="' + leer + '" target="_blank" rel="noopener" aria-label="' +
        esc(num + L(' de 5 en Google', ' out of 5 on Google') + (g.total ? ', ' + g.total + L(' reseñas', ' reviews') : '')) + '">' +
        estrellas(g.rating) + '<b>' + num + '</b><span class="cnt"> ' +
        (g.total ? plural(g.total, L('reseña en Google', 'Google review'), L('reseñas en Google', 'Google reviews')) : L('en Google', 'on Google')) + '</span></a>';
    });
    document.querySelectorAll('[data-render="rating-card"]').forEach(function(el){
      if (!g.rating){ el.hidden = true; return; }
      el.innerHTML = '<div class="rating-card__num">' + num + '<small> / 5</small></div>' +
        '<div class="rating-card__txt">' + estrellas(g.rating) +
          '<p>' + (g.total
            ? L('Calificación pública de ' + N + ' en Google, con ', N + '’s public rating on Google, based on ') + plural(g.total, L('reseña', 'review'), L('reseñas', 'reviews')) + '.'
            : L('Calificación pública de ' + N + ' en Google.', N + '’s public rating on Google.')) + '</p>' +
          '<div class="rating-card__btns">' +
            '<a class="btn btn--primary btn--sm" href="' + leer + '" target="_blank" rel="noopener">' + icono('i-star') + L('Leer las reseñas', 'Read the reviews') + '</a>' +
            '<a class="btn btn--ghost btn--sm" href="' + escribir + '" target="_blank" rel="noopener">' + icono('i-chat') + L('Dejar mi reseña', 'Leave a review') + '</a>' +
          '</div>' +
        '</div>';
    });
  }

  /* ---------------- Promoción del mes ---------------- */
  function pintarPromo(){
    const el = document.querySelector('[data-render="promo"]');
    const p = NEGOCIO.promo;
    if (!el) return;
    if (!p || !p.activa || !p.texto){ el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = '<div class="wrap">' + icono('i-sparkle') + '<span>' + esc(L(p, 'texto')) + '</span>' +
      (p.wa ? '<a data-wa="' + esc(p.wa) + '">' + L('Pedirla por WhatsApp', 'Ask on WhatsApp') + '</a>' : '') + '</div>';
    initWhatsApp(el);
  }

  /* ---------------- Datos estructurados (JSON-LD) desde NEGOCIO ---------------- */
  function jsonLD(){
    if (PAGE !== 'inicio') return;
    const n = NEGOCIO;
    const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = {
      '@context': 'https://schema.org',
      '@type': n.schemaTipo || 'LocalBusiness',
      name: n.nombreCompleto || n.nombre,
      alternateName: (n.nombresAlternos && n.nombresAlternos.length) ? n.nombresAlternos : undefined,
      slogan: n.eslogan || undefined,
      telephone: n.telefono || undefined,
      address: n.direccion ? { '@type': 'PostalAddress', streetAddress: n.direccion, addressLocality: n.canton,
        addressRegion: n.provincia, postalCode: n.codigoPostal || undefined, addressCountry: 'CR' } : undefined,
      geo: n.lat ? { '@type': 'GeoCoordinates', latitude: n.lat, longitude: n.lng } : undefined,
      hasMap: n.googleMaps || undefined,
      sameAs: [n.instagram, n.facebook, n.tiktok].filter(Boolean),
      paymentAccepted: (n.pagos && n.pagos.length) ? n.pagos.join(', ') : undefined,
      hasOfferCatalog: { '@type': 'OfferCatalog', name: cap(V.varios),
        itemListElement: servicios().map(function(s){ return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.nombre } }; }) }
    };
    if (n.dominio){ data.url = n.dominio; data.image = n.dominio.replace(/\/$/, '') + '/img/og.jpg'; }
    if (n.email) data.email = n.email;
    if (MOSTRAR_HORARIO && n.horario && n.horario.length){
      data.openingHoursSpecification = n.horario.map(function(h){
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: dias[h.dia], opens: h.abre, closes: h.cierra };
      });
    }
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ======================================================================
     INICIO
     ====================================================================== */
  function pintarCategorias(){
    const tot = document.querySelector('[data-render="total-areas"]');
    if (tot) tot.textContent = categoriasActivas().length;
    const el = document.querySelector('[data-render="categorias"]');
    if (!el) return;
    el.innerHTML = categoriasActivas().map(function(c, i){
      const n = contarServicios(c.id);
      return '<a class="tile rv in" href="servicios.html#' + c.id + '">' +
        (c.dibujo ? '<span class="tile__dibujo"><img src="' + esc(c.dibujo) + '" alt="" loading="lazy"></span>'
                  : '<span class="tile__ico">' + icono(c.icono) + '</span>') +
        '<h3>' + esc(L(c, 'nombre')) + '</h3><p>' + esc(L(c, 'desc')) + '</p>' +
        '<span class="tile__pie">' + items(n) + icono('i-arrow') + '</span></a>';
    }).join('');
  }
  function pintarTecnologias(){
    const el = document.querySelector('[data-render="tecnologias"]');
    if (!el) return;
    el.innerHTML = NEGOCIO.tecnologias.filter(function(t){ return !t.flag || FLAGS[t.flag]; }).map(function(t){
      return '<li><a class="marca" href="servicios.html#svc-' + t.servicio + '">' +
        '<span class="marca__origen">' + esc(L(t, 'origen')) + '</span>' +
        '<span class="marca__nombre">' + esc(t.nombre) + '</span>' +
        '<span class="marca__uso">' + esc(L(t, 'uso')) + '</span>' +
        (MODO_DEMO ? '<small class="marca__fuente">' + L('Fuente: ', 'Source: ') + esc(t.fuente) + '</small>' : '') +
      '</a></li>';
    }).join('');
  }
  function pintarClubMini(){
    const el = document.querySelector('[data-render="club-mini"]');
    if (!el) return;
    el.innerHTML = NEGOCIO.membresias.map(function(m){
      return '<li' + (m.destacado ? ' class="is-dest"' : '') + '><span class="club-mini__ico">' + icono(NEGOCIO.marcaIcono || 'i-loto') + '</span>' +
        '<div><h3>' + esc(L(m, 'nombre')) + '</h3><p>' + esc(L(m, 'lema')) + '</p></div>' +
        '<a href="membresias.html#plan-' + m.id + '" aria-label="' + esc(L('Ver ' + (V.plan ? 'el ' + V.plan : 'la membresía') + ' ', 'See the ' + (V.planEn || 'membership') + ' ') + L(m, 'nombre')) + '">' + icono('i-arrow') + '</a></li>';
    }).join('');
  }

  /* ======================================================================
     CATÁLOGO
     ====================================================================== */
  function tarjetaServicio(s){
    const cat = NEGOCIO.categorias.filter(function(c){ return c.id === s.cats[0]; })[0];
    const zonas = listaNatural((s.zonas || []).map(zonaNombre).map(function(z, i){ return i ? z.charAt(0).toLowerCase() + z.slice(1) : z; }));
    const msg = L('Hola ' + N + ', quiero información sobre ', 'Hi ' + N + ', I would like information about ') + L(s, 'nombre') +
      L('. Lo vi en el catálogo de su sitio web.', '. I saw it in your website catalog.');
    let badges = '<span class="badge badge--neutro">' + icono(cat ? cat.icono : 'i-sparkle') + esc(cat ? L(cat, 'nombre') : '') + '</span>';
    if (s.medico) badges += '<span class="badge">' + icono('i-med') + L('Procedimiento médico', 'Medical procedure') + '</span>';
    if (s.flag) badges += '<span class="badge badge--prop">' + L('Por confirmar', 'To be confirmed') + '</span>';
    return '<article class="svc" id="svc-' + s.id + '">' +
      (s.foto ? '<figure class="svc__media media"><img src="' + esc(s.foto) + '" alt="' + esc(L(s, 'nombre')) + '" loading="lazy" data-ph="' + esc(L(s, 'nombre')) + '"></figure>' : '') +
      '<div class="svc__body">' +
        '<div class="svc__badges">' + badges + '</div>' +
        '<h3>' + esc(L(s, 'nombre')) + '</h3>' +
        '<p>' + esc(L(s, 'desc')) + '</p>' +
        (zonas ? '<p class="svc__zonas"><b>' + L((V.zonaTitulo || 'Zonas') + ': ', (V.zonaTituloEn || 'Areas') + ': ') + '</b>' + esc(zonas) + '</p>' : '') +
        ((MOSTRAR_PRECIOS && s.precio) ? '<p class="svc__precio">' + dolares(s.precio) + ' <small>' + L('precio publicado por ' + N, 'price published by ' + N) + '</small></p>' : '') +
        '<div class="svc__acts">' +
          '<a class="btn btn--primary btn--sm" href="agendar.html?servicio=' + s.id + '#agendar">' + L(V.accionCita || 'Agendar', V.accionCitaEn || 'Book') + '</a>' +
          '<a class="btn btn--ghost btn--sm" href="agendar.html?servicio=' + s.id + '#cotizar">' + L('Cotizar', 'Quote') + '</a>' +
          '<a class="icon-btn icon-btn--wa" data-wa="' + esc(msg) + '" aria-label="' + esc(L('Consultar por WhatsApp: ', 'Ask on WhatsApp: ') + L(s, 'nombre')) + '">' + icono('i-wa') + '</a>' +
          '<button type="button" class="icon-btn" data-compartir="' + s.id + '" aria-label="' + esc(L('Compartir ', 'Share ') + L(s, 'nombre')) + '">' + icono('i-share') + '</button>' +
        '</div>' +
        (MODO_DEMO ? '<p class="svc__fuente">' + L('Fuente: ', 'Source: ') + esc(s.fuente) +
          ((MOSTRAR_PRECIOS && s.precioFuente) ? ' · ' + L('Precio: ', 'Price: ') + esc(s.precioFuente) : '') + '</p>' : '') +
      '</div></article>';
  }

  function compartirServicio(s){
    if (!s) return;
    const url = location.href.split('#')[0].split('?')[0] + '#svc-' + s.id;
    const texto = L('Mirá este ' + V.uno + ' en ' + lugar() + ': ', 'Take a look at this ' + V.unoEn + ' at ' + lugar() + ': ') + L(s, 'nombre');
    if (navigator.share){
      navigator.share({ title: L(s, 'nombre') + ' · ' + N, text: texto, url: url }).catch(function(){});
      return;
    }
    window.open('https://wa.me/?text=' + encodeURIComponent(texto + ' ' + url), '_blank', 'noopener');
  }

  function initCatalogo(){
    const cont = document.querySelector('[data-render="catalogo"]');
    const filtros = document.querySelector('[data-render="filtros"]');
    const buscar = document.getElementById('buscar');
    if (!cont || !filtros) return;
    let cat = 'todos';
    let q = '';

    const normal = function(t){ return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    // La gente busca por problema ("manchas", "hongos"): se indexan también los objetivos del cotizador
    const porProblema = {};
    NEGOCIO.cotizador.areas.forEach(function(a){
      a.objetivos.forEach(function(o){
        o.servicios.forEach(function(id){
          porProblema[id] = (porProblema[id] || '') + ' ' + o.nombre + ' ' + o.nombreEn + ' ' + (o.claves || '');
        });
      });
    });
    function coincide(s){
      if (!q) return true;
      const zonas = (s.zonas || []).map(function(z){ return (NEGOCIO.zonas[z] || []).join(' '); });
      const txt = normal([s.nombre, s.nombreEn, s.desc, s.descEn, porProblema[s.id]].concat(zonas).join(' '));
      return normal(q).split(/\s+/).every(function(p){ return txt.indexOf(p) >= 0; });
    }
    function pintarFiltros(){
      const key = guardarFoco();
      filtros.innerHTML =
        '<button type="button" class="chip-btn" data-key="f-todos" data-cat="todos" aria-pressed="' + (cat === 'todos') + '">' + L('Todos', 'All') + ' <small>' + servicios().length + '</small></button>' +
        categoriasActivas().map(function(c){
          return '<button type="button" class="chip-btn" data-key="f-' + c.id + '" data-cat="' + c.id + '" aria-pressed="' + (cat === c.id) + '">' +
            icono(c.icono) + esc(L(c, 'nombre')) + ' <small>' + contarServicios(c.id) + '</small></button>';
        }).join('');
      restaurarFoco(key, filtros);
    }
    function pintar(){
      let total = 0;
      const html = categoriasActivas().filter(function(c){ return cat === 'todos' || c.id === cat; }).map(function(c){
        const lista = servicios().filter(function(s){
          // En "Todos" cada servicio aparece una sola vez, en su categoría principal
          const enCat = cat === 'todos' ? s.cats[0] === c.id : s.cats.indexOf(c.id) >= 0;
          return enCat && coincide(s);
        });
        if (!lista.length) return '';
        total += lista.length;
        return '<section class="cat-sec" id="sec-' + c.id + '" aria-labelledby="h-' + c.id + '">' +
          '<div class="cat-sec__head"><span class="cat-sec__ico">' + icono(c.icono) + '</span>' +
          '<div><h2 id="h-' + c.id + '">' + esc(L(c, 'nombre')) + '</h2><p>' + esc(L(c, 'desc')) + '</p></div></div>' +
          '<div class="svc-grid">' + lista.map(tarjetaServicio).join('') + '</div></section>';
      }).join('');
      cont.innerHTML = total ? html :
        '<div class="vacio">' + icono('i-search') + '<p>' + L('No encontramos ' + V.varios + ' con esa búsqueda.', 'No ' + V.variosEn + ' match your search.') + '</p>' +
        '<a class="btn btn--wa btn--sm" data-wa="' + esc(L('Hola ' + N + ', busco un ' + V.uno + ' para: ', 'Hi ' + N + ', I am looking for a ' + V.unoEn + ' for: ') + q) + '">' +
        icono('i-wa') + L('Preguntar por WhatsApp', 'Ask on WhatsApp') + '</a></div>';
      const conteo = document.querySelector('[data-render="conteo"]');
      if (conteo) conteo.textContent = items(total);
      initWhatsApp(cont);
      initPlaceholders(cont);
    }
    function aplicarHash(){
      const h = decodeURIComponent(location.hash.replace('#', ''));
      let foco = null;
      if (h.indexOf('svc-') === 0){ cat = 'todos'; foco = h; }
      else if (NEGOCIO.categorias.some(function(c){ return c.id === h; })) cat = h;
      else cat = 'todos';
      pintarFiltros();
      pintar();
      if (foco){
        const el = document.getElementById(foco);
        if (el){
          el.classList.add('is-foco');
          setTimeout(function(){ el.scrollIntoView({ block: 'center' }); }, 80);
        }
      }
    }

    filtros.addEventListener('click', function(e){
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      cat = b.dataset.cat;
      history.replaceState(null, '', cat === 'todos' ? location.pathname + location.search : '#' + cat);
      pintarFiltros();
      pintar();
      if (cont.getBoundingClientRect().top < 0) cont.scrollIntoView({ block: 'start' });
    });
    if (buscar){
      buscar.addEventListener('input', function(){ q = buscar.value.trim(); pintar(); });
    }
    cont.addEventListener('click', function(e){
      const b = e.target.closest('[data-compartir]');
      if (b) compartirServicio(servicioPorId(b.dataset.compartir));
    });
    window.addEventListener('hashchange', aplicarHash);
    document.addEventListener('sitio:lang', function(){ pintarFiltros(); pintar(); });
    aplicarHash();
  }

  /* ======================================================================
     GALERÍA POR TIPO (portafolio), con antes y después opcional
     ====================================================================== */
  function initGaleria(){
    const cont = document.querySelector('[data-render="galeria"]');
    if (!cont) return;
    const fotos = NEGOCIO.galeria || [];
    const bloque = cont.closest('[data-flag="galeria"]');
    if (!GALERIA || !fotos.length){ if (bloque) bloque.hidden = true; return; }
    const filtros = document.querySelector('[data-render="galeria-filtros"]');
    const visor = document.querySelector('[data-render="visor"]');
    let cat = 'todas';
    let visibles = [];
    let actual = 0;

    const grupo = function(id){
      const c = NEGOCIO.categorias.filter(function(x){ return x.id === id; })[0];
      if (c) return L(c, 'nombre');
      const g = (NEGOCIO.galeriaGrupos || {})[id];
      return g ? (esEN() ? g[1] : g[0]) : id;
    };
    const titulo = function(f){ return L(f, 'titulo') || grupo(f.cat); };

    function pintar(){
      const cats = [];
      fotos.forEach(function(f){ if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });
      if (filtros){
        filtros.hidden = cats.length < 2;
        filtros.innerHTML = '<button type="button" class="chip-btn" data-gcat="todas" aria-pressed="' + (cat === 'todas') + '">' + L('Todas', 'All') + '</button>' +
          cats.map(function(c){
            return '<button type="button" class="chip-btn" data-gcat="' + esc(c) + '" aria-pressed="' + (cat === c) + '">' + esc(grupo(c)) + '</button>';
          }).join('');
      }
      visibles = fotos.filter(function(f){ return cat === 'todas' || f.cat === cat; });
      cont.innerHTML = visibles.map(function(f, i){
        return '<figure class="gal__item">' +
          '<button type="button" class="gal__btn" data-foto="' + i + '" aria-label="' + esc(L('Ver foto: ', 'View photo: ') + titulo(f)) + '">' +
            '<img src="' + esc(f.src) + '" alt="' + esc(titulo(f)) + '"' + (f.w && f.h ? ' width="' + Number(f.w) + '" height="' + Number(f.h) + '"' : '') + ' loading="lazy">' +
            (f.antes ? '<span class="badge gal__badge">' + L('Antes y después', 'Before & after') + '</span>' : '') +
          '</button>' +
          '<figcaption>' + esc(titulo(f)) + '<small>' + esc(grupo(f.cat)) + '</small></figcaption>' +
          (MODO_DEMO && f.fuente ? '<p class="gal__fuente">' + L('Fuente: ', 'Source: ') + esc(f.fuente) + '</p>' : '') +
        '</figure>';
      }).join('');
    }

    function abrir(i){
      if (!visor || typeof visor.showModal !== 'function' || !visibles.length) return;
      actual = (i + visibles.length) % visibles.length;
      const f = visibles[actual];
      const cuerpo = visor.querySelector('[data-visor="cuerpo"]');
      cuerpo.innerHTML = f.antes
        ? '<div class="comparar" style="--corte:50%">' +
            '<img src="' + esc(f.src) + '" alt="' + esc(L('Después: ', 'After: ') + titulo(f)) + '">' +
            '<img class="comparar__antes" src="' + esc(f.antes) + '" alt="' + esc(L('Antes: ', 'Before: ') + titulo(f)) + '">' +
            '<input type="range" min="0" max="100" value="50" aria-label="' + esc(L('Deslizá para comparar antes y después', 'Slide to compare before and after')) + '">' +
          '</div>'
        : '<img src="' + esc(f.src) + '" alt="' + esc(titulo(f)) + '">';
      visor.querySelector('[data-visor="titulo"]').textContent = titulo(f) + ' (' + (actual + 1) + L(' de ', ' of ') + visibles.length + ')';
      const rango = cuerpo.querySelector('input[type="range"]');
      if (rango) rango.addEventListener('input', function(){ rango.parentNode.style.setProperty('--corte', rango.value + '%'); });
      visor.querySelectorAll('[data-visor="prev"], [data-visor="next"]').forEach(function(b){ b.hidden = visibles.length < 2; });
      if (!visor.open) visor.showModal();
    }

    if (filtros){
      filtros.addEventListener('click', function(e){
        const b = e.target.closest('[data-gcat]');
        if (b){ cat = b.dataset.gcat; pintar(); }
      });
    }
    cont.addEventListener('click', function(e){
      const b = e.target.closest('[data-foto]');
      if (b) abrir(parseInt(b.dataset.foto, 10));
    });
    if (visor){
      visor.addEventListener('click', function(e){
        if (e.target === visor || e.target.closest('[data-visor="cerrar"]')) visor.close();
        else if (e.target.closest('[data-visor="prev"]')) abrir(actual - 1);
        else if (e.target.closest('[data-visor="next"]')) abrir(actual + 1);
      });
      visor.addEventListener('keydown', function(e){
        if (e.target.type === 'range') return;
        if (e.key === 'ArrowRight') abrir(actual + 1);
        if (e.key === 'ArrowLeft') abrir(actual - 1);
      });
    }
    document.addEventListener('sitio:lang', pintar);
    pintar();
  }

  /* ======================================================================
     CLUB, PAQUETES Y TARJETA DE REGALO
     ====================================================================== */
  function listaCheck(arr){
    return '<ul>' + arr.map(function(t){ return '<li>' + icono('i-check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>';
  }
  function pintarPlanes(){
    const el = document.querySelector('[data-render="planes"]');
    if (!el) return;
    el.innerHTML = NEGOCIO.membresias.map(function(m){
      let precio;
      if (m.precio) precio = '<p class="plan__precio">' + dolares(m.precio) + '<small>' + L('al mes', 'per month') + '</small></p>';
      else if (MODO_DEMO) precio = '<p class="plan__precio plan__precio--pend">' + L('Precio por definir con ' + N, 'Price to be set by ' + N) + '</p>';
      else precio = '<p class="plan__precio plan__precio--pend">' + L('Consultá el precio', 'Ask for the price') + '</p>';
      const club = NEGOCIO.clubNombre || N;
      const msg = L('Hola ' + N + ', me interesa ' + (V.plan ? 'el ' + V.plan : 'la membresía') + ' «', 'Hi ' + N + ', I am interested in the “') + L(m, 'nombre') +
        L('» ' + (V.plan && club.toLowerCase().indexOf(V.plan) === 0 ? 'del ' : 'de ') + club + '. ¿Me cuentan el precio y las condiciones?', '” ' + (V.planEn || 'membership') + ' of ' + club + '. Could you share the price and terms?');
      return '<article class="plan' + (m.destacado ? ' plan--dest' : '') + '" id="plan-' + m.id + '">' +
        (m.destacado ? '<span class="plan__cinta">' + esc(m.cinta ? L(m, 'cinta') : L('Recomendada', 'Recommended')) + '</span>' : '') +
        '<svg class="plan__marca" aria-hidden="true"><use href="#' + (NEGOCIO.marcaIcono || 'i-loto') + '"/></svg>' +
        '<div><h3>' + esc(L(m, 'nombre')) + '</h3><p class="plan__lema">' + esc(L(m, 'lema')) + '</p></div>' +
        precio +
        '<h4>' + L('Incluye', 'Includes') + '</h4>' + listaCheck(esEN() ? m.incluyeEn : m.incluye) +
        '<h4>' + L('Beneficios', 'Perks') + '</h4>' + listaCheck(esEN() ? m.beneficiosEn : m.beneficios) +
        '<div class="plan__cta"><a class="btn ' + (m.destacado ? 'btn--primary' : 'btn--ghost') + ' btn--block" data-wa="' + esc(msg) + '">' +
          icono('i-wa') + L('Me interesa', 'I’m interested') + '</a></div>' +
      '</article>';
    }).join('');
    initWhatsApp(el);
  }

  function tarjetaPaquete(p){
    const incl = p.incluye.filter(function(id){ const s = servicioPorId(id); return s && activo(s); });
    const msg = L('Hola ' + N + ', me interesa el paquete «', 'Hi ' + N + ', I am interested in the “') + L(p, 'nombre') +
      L('». ¿Está disponible y cuánto cuesta?', '” package. Is it available and how much is it?');
    let badge = '';
    if (MODO_DEMO){
      badge = p.tipo === 'propuesto'
        ? '<span class="badge badge--prop">' + L('Idea nueva', 'New idea') + '</span>'
        : '<span class="badge badge--ok">' + L('Ya lo ofreció ' + N, 'Already offered by ' + N) + '</span>';
    }
    return '<article class="pack" id="paquete-' + p.id + '">' + badge +
      '<h3>' + esc(L(p, 'nombre')) + '</h3>' +
      (p.para ? '<p class="pack__para">' + esc(L(p, 'para')) + '</p>' : '') +
      '<ul>' + incl.map(function(id){ return '<li>' + icono('i-check') + '<span>' + esc(nombreServicio(id)) + '</span></li>'; }).join('') + '</ul>' +
      (p.regalo ? '<p class="pack__regalo">' + icono('i-gift') + esc(L(p, 'regalo')) + '</p>' : '') +
      ((MOSTRAR_PRECIOS && p.precio) ? '<p class="pack__precio">' + dolares(p.precio) + '</p>' : '') +
      (MODO_DEMO && p.fuente ? '<p class="pack__fuente">' + L('Fuente: ', 'Source: ') + esc(p.fuente) + '</p>' : '') +
      '<a class="btn btn--ghost btn--sm" data-wa="' + esc(msg) + '">' + icono('i-wa') + L('Consultar', 'Ask about it') + '</a>' +
    '</article>';
  }
  function pintarPaquetes(){
    const pub = document.querySelector('[data-render="paquetes-publicados"]');
    const prop = document.querySelector('[data-render="paquetes-propuestos"]');
    if (!pub) return;
    const listaPub = NEGOCIO.paquetes.filter(function(p){ return MODO_DEMO ? p.tipo === 'publicado' : p.confirmado; });
    const listaProp = MODO_DEMO ? NEGOCIO.paquetes.filter(function(p){ return p.tipo === 'propuesto'; }) : [];
    pub.innerHTML = listaPub.map(tarjetaPaquete).join('');
    const bloquePub = pub.closest('[data-bloque]');
    if (bloquePub) bloquePub.hidden = !listaPub.length;
    if (prop){
      prop.innerHTML = listaProp.map(tarjetaPaquete).join('');
      const bloqueProp = prop.closest('[data-bloque]');
      if (bloqueProp) bloqueProp.hidden = !listaProp.length;
    }
    initWhatsApp();
  }

  function initRegalo(){
    const form = document.getElementById('form-regalo');
    if (!form) return;
    const f = form.elements;
    const opciones = function(){
      const actual = f.experiencia.value;
      // NEGOCIO.regalo.opciones: ids de servicios o paquetes; siempre se ofrece un monto libre
      const exps = ((NEGOCIO.regalo && NEGOCIO.regalo.opciones) || []).map(function(id){
        const s = servicioPorId(id), p = paquete(id);
        return [id, s ? L(s, 'nombre') : (p ? L(p, 'nombre') : id)];
      }).concat([['monto', L('Un monto a elección', 'A gift amount')]]);
      f.experiencia.innerHTML = exps.map(function(o){ return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>'; }).join('');
      if (actual) f.experiencia.value = actual;
    };
    const textoRegalo = function(){
      if (f.experiencia.value !== 'monto') return f.experiencia.options[f.experiencia.selectedIndex].text;
      const m = parseInt(f.monto.value, 10);
      return m > 0 ? L('Regalo por ', 'Gift for ') + dolares(m) : L('Monto a elección', 'Gift amount');
    };
    const preview = function(){
      document.getElementById('campo-monto').hidden = f.experiencia.value !== 'monto';
      const set = function(k, v){ const el = document.querySelector('[data-gc="' + k + '"]'); if (el) el.textContent = v; };
      set('exp', textoRegalo());
      set('para', f.para.value.trim() || L('Nombre de quien recibe', 'Recipient’s name'));
      set('de', f.de.value.trim() || L('Tu nombre', 'Your name'));
    };
    opciones();
    preview();
    form.addEventListener('input', preview);
    form.addEventListener('change', preview);
    document.addEventListener('sitio:lang', function(){ opciones(); preview(); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      limpiarErrores(form);
      const errores = [];
      if (!f.para.value.trim()) marcarError(f.para, 'err-regalo-para', errores);
      if (!f.de.value.trim()) marcarError(f.de, 'err-regalo-de', errores);
      if (f.experiencia.value === 'monto' && !(parseInt(f.monto.value, 10) > 0)) marcarError(f.monto, 'err-regalo-monto', errores);
      if (errores.length){ errores[0].focus(); return; }
      const lineas = [
        L('Hola ' + N + ', quiero comprar ' + V.regalo + '.', 'Hi ' + N + ', I would like to buy ' + V.regaloEn + '.'),
        '• ' + L('Regalo: ', 'Gift: ') + textoRegalo(),
        '• ' + L('Para: ', 'For: ') + f.para.value.trim(),
        '• ' + L('De parte de: ', 'From: ') + f.de.value.trim()
      ];
      if (f.ocasion.value) lineas.push('• ' + L('Ocasión: ', 'Occasion: ') + f.ocasion.options[f.ocasion.selectedIndex].text);
      const entrega = form.querySelector('input[name="entrega"]:checked');
      if (entrega) lineas.push('• ' + L('Entrega: ', 'Delivery: ') + entrega.nextElementSibling.textContent.trim());
      lineas.push(L('¿Cómo hago el pago?', 'How do I pay?'));
      const url = waLink(lineas.join('\n'));
      window.open(url, '_blank', 'noopener');
      mostrarEnvio(form, url, registrarSolicitud('regalo', { servicio: textoRegalo(), para: f.para.value.trim(), de: f.de.value.trim() }),
        L('Tu pedido de regalo está listo en WhatsApp', 'Your gift request is ready in WhatsApp'));
    });
  }

  /* ======================================================================
     FORMULARIOS: errores y confirmación honesta
     ====================================================================== */
  function limpiarErrores(form){
    form.querySelectorAll('[aria-invalid]').forEach(function(el){ el.removeAttribute('aria-invalid'); });
    form.querySelectorAll('.err').forEach(function(el){ el.hidden = true; });
  }
  function marcarError(el, errId, lista){
    el.setAttribute('aria-invalid', 'true');
    const msg = document.getElementById(errId);
    if (msg) msg.hidden = false;
    lista.push(el);
  }
  function telValido(v){
    const d = String(v || '').replace(/\D/g, '');
    return d.length === 8 || (d.length === 11 && d.indexOf('506') === 0) || (d.length >= 10 && d.length <= 15);
  }
  /* Con registro conectado, teléfono y consentimiento pasan a ser obligatorios */
  function ajustarRequeridos(form){
    const conRegistro = !!NEGOCIO.endpoint;
    form.querySelectorAll('[data-si-registro]').forEach(function(el){ el.hidden = !conRegistro; });
    form.querySelectorAll('[data-sin-registro]').forEach(function(el){ el.hidden = conRegistro; });
  }
  function mostrarEnvio(form, url, promesa, titulo){
    const box = form.querySelector('[data-render="envio"]');
    if (!box) return;
    box.hidden = false;
    box.innerHTML = '<h3>' + icono('i-check') + esc(titulo || L('Tu solicitud está lista en WhatsApp', 'Your request is ready in WhatsApp')) + '</h3>' +
      '<p>' + L('Enviá el mensaje para que ' + N + ' te responda. ¿No se abrió WhatsApp? ', 'Send the message so ' + N + ' can reply. WhatsApp didn’t open? ') +
      '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + L('Abrilo aquí', 'Open it here') + '</a>.</p><p data-reg></p>';
    const reg = box.querySelector('[data-reg]');
    promesa.then(function(ok){
      if (ok === true) reg.textContent = L('También quedó registrada en el sistema de ' + N + '.', 'It was also saved in ' + N + '’s system.');
      else if (ok === false) reg.textContent = L('No pudimos guardar una copia, pero con el mensaje de WhatsApp es suficiente.', 'We couldn’t save a copy, but the WhatsApp message is enough.');
      else if (MODO_DEMO) reg.innerHTML = '<span class="badge badge--prop">Demo</span> ' + L('El registro de solicitudes en base de datos se conecta al publicar.', 'The request log database is connected at launch.');
      else reg.remove();
    });
    box.setAttribute('tabindex', '-1');
    box.focus({ preventScroll: true });
    box.scrollIntoView({ block: 'nearest' });
  }
  function opcionesServicios(select, textoVacio){
    const actual = select.value;
    let h = textoVacio ? '<option value="">' + esc(textoVacio) + '</option>' : '';
    categoriasActivas().forEach(function(c){
      const lista = servicios().filter(function(s){ return s.cats[0] === c.id; });
      if (!lista.length) return;
      h += '<optgroup label="' + esc(L(c, 'nombre')) + '">' +
        lista.map(function(s){ return '<option value="' + s.id + '">' + esc(L(s, 'nombre')) + '</option>'; }).join('') + '</optgroup>';
    });
    h += '<option value="otro">' + L('Otro / todavía no sé', 'Other / not sure yet') + '</option>';
    select.innerHTML = h;
    if (actual) select.value = actual;
  }

  /* ======================================================================
     AGENDAR: pestañas, cita, cotizador y seguimiento
     ====================================================================== */
  function initTabs(){
    const lista = document.querySelector('.tabs[role="tablist"]');
    if (!lista) return;
    const tabs = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    const activar = function(id, foco){
      tabs.forEach(function(t){
        const on = t.dataset.tab === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById('panel-' + t.dataset.tab);
        if (panel) panel.hidden = !on;
        if (on && foco) t.focus();
      });
    };
    const desdeHash = function(){
      const h = location.hash.replace('#', '');
      activar(tabs.some(function(t){ return t.dataset.tab === h; }) ? h : tabs[0].dataset.tab);
    };
    lista.addEventListener('click', function(e){
      const t = e.target.closest('[role="tab"]');
      if (!t) return;
      history.replaceState(null, '', location.pathname + location.search + '#' + t.dataset.tab);
      activar(t.dataset.tab);
    });
    lista.addEventListener('keydown', function(e){
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      history.replaceState(null, '', location.pathname + location.search + '#' + tabs[n].dataset.tab);
      activar(tabs[n].dataset.tab, true);
    });
    window.addEventListener('hashchange', desdeHash);
    desdeHash();
  }

  function initCita(){
    const form = document.getElementById('form-cita');
    if (!form) return;
    const f = form.elements;
    const params = new URLSearchParams(location.search);
    ajustarRequeridos(form);

    const pintarFranjas = function(){
      const cont = form.querySelector('[data-render="franjas"]');
      const marcada = form.querySelector('input[name="franja"]:checked');
      const actual = marcada ? marcada.value : '';
      const h = NEGOCIO.horario[0];
      let fr;
      if (MOSTRAR_HORARIO && h){
        fr = [
          ['manana', L('Mañana', 'Morning') + ' (' + hora12(h.abre) + L(' a mediodía)', ' to noon)')],
          ['mediodia', L('Mediodía', 'Midday') + ' (' + L('12 a 3 p. m.)', '12 to 3 p.m.)')],
          ['tarde', L('Tarde', 'Afternoon') + ' (' + L('3 a ', '3 to ') + hora12(h.cierra) + ')']
        ];
      } else {
        fr = [['manana', L('Mañana', 'Morning')], ['tarde', L('Tarde', 'Afternoon')]];
      }
      cont.innerHTML = fr.map(function(o){
        return '<label class="chip"><input type="radio" name="franja" value="' + o[0] + '"' + (actual === o[0] ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>';
      }).join('');
    };
    const opciones = function(){
      opcionesServicios(f.servicio, L('Elegí un servicio', 'Choose a service'));
      pintarFranjas();
    };
    opciones();
    const pre = params.get('servicio');
    if (pre && servicioPorId(pre) && activo(servicioPorId(pre))) f.servicio.value = pre;

    const iso = function(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const hoy = ahoraCR();
    const max = new Date(hoy.getTime());
    max.setDate(max.getDate() + 90);
    f.fecha.min = iso(hoy);
    f.fecha.max = iso(max);

    document.addEventListener('sitio:lang', opciones);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      limpiarErrores(form);
      const errores = [];
      if (!f.servicio.value) marcarError(f.servicio, 'err-cita-servicio', errores);
      if (f.fecha.value){
        const d = new Date(f.fecha.value + 'T12:00:00');
        const abre = NEGOCIO.horario.some(function(x){ return x.dia === d.getDay(); });
        if ((MOSTRAR_HORARIO && !abre) || f.fecha.value < f.fecha.min) marcarError(f.fecha, 'err-cita-fecha', errores);
      }
      if (!f.nombre.value.trim()) marcarError(f.nombre, 'err-cita-nombre', errores);
      const tel = f.telefono.value.trim();
      if ((NEGOCIO.endpoint && !telValido(tel)) || (tel && !telValido(tel))) marcarError(f.telefono, 'err-cita-tel', errores);
      if (NEGOCIO.endpoint && !f.consentimiento.checked) marcarError(f.consentimiento, 'err-cita-consent', errores);
      if (errores.length){ errores[0].focus(); return; }

      const s = servicioPorId(f.servicio.value);
      const servicioTxt = s ? L(s, 'nombre') : L('Otro / todavía no sé', 'Other / not sure yet');
      const lineas = [L('Hola ' + N + ', ' + (V.pedirCita || 'quiero agendar una cita') + '.', 'Hi ' + N + ', ' + (V.pedirCitaEn || 'I would like to book an appointment') + '.')];
      lineas.push('• ' + L(cap(V.uno) + ': ', cap(V.unoEn) + ': ') + servicioTxt);
      if (f.fecha.value) lineas.push('• ' + L('Fecha preferida: ', 'Preferred date: ') + fechaLarga(new Date(f.fecha.value + 'T12:00:00')));
      const pers = form.querySelector('input[name="personas"]:checked');
      if (pers) lineas.push('• ' + L('Personas: ', 'People: ') + pers.value);
      const fr = form.querySelector('input[name="franja"]:checked');
      if (fr) lineas.push('• ' + L('Horario preferido: ', 'Preferred time: ') + fr.nextElementSibling.textContent.trim());
      const primera = form.querySelector('input[name="primera"]:checked');
      if (primera) lineas.push('• ' + L('Primera vez en ' + N + ': ', 'First visit to ' + N + ': ') + primera.nextElementSibling.textContent.trim());
      lineas.push(L('Soy ', 'My name is ') + f.nombre.value.trim() + (tel ? ' (' + tel + ')' : '') + '.');
      if (f.comentario.value.trim()) lineas.push(L('Comentario: ', 'Note: ') + f.comentario.value.trim());

      const url = waLink(lineas.join('\n'));
      window.open(url, '_blank', 'noopener');
      mostrarEnvio(form, url, registrarSolicitud('cita', {
        servicio: servicioTxt, fecha: f.fecha.value, franja: fr ? fr.value : '', personas: pers ? pers.value : '',
        primera: primera ? primera.value : '', nombre: f.nombre.value.trim(), telefono: tel, comentario: f.comentario.value.trim()
      }));
    });
  }

  function initCotizador(){
    const form = document.getElementById('form-cotizar');
    const C = NEGOCIO.cotizador;
    if (!form || !C || !C.areas || !C.areas.length){
      // Sin mapa de cotizador no se ofrece la pestaña
      const tab = document.querySelector('[data-tab="cotizar"]');
      if (tab) tab.hidden = true;
      return;
    }
    const f = form.elements;
    const est = { area: C.areas[0].id, objetivos: [], zonas: [], servicios: [], asesoria: false, presupuesto: '', cuando: '' };
    let paso = 1;
    ajustarRequeridos(form);

    const area = function(id){ return C.areas.filter(function(a){ return a.id === id; })[0]; };
    const objetivo = function(clave){
      const p = clave.split(':'); const a = area(p[0]);
      return a ? { area: a, obj: a.objetivos.filter(function(o){ return o.id === p[1]; })[0] } : null;
    };
    const quitar = function(arr, v){ const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); };
    const alternar = function(arr, v){ if (arr.indexOf(v) >= 0) quitar(arr, v); else arr.push(v); };
    const areasElegidas = function(){
      const ids = [];
      est.objetivos.forEach(function(k){ const a = k.split(':')[0]; if (ids.indexOf(a) < 0) ids.push(a); });
      return ids.length ? ids : [est.area];
    };
    const sugeridos = function(){
      const ids = [];
      est.objetivos.forEach(function(k){
        const o = objetivo(k);
        if (o && o.obj) o.obj.servicios.forEach(function(id){
          const s = servicioPorId(id);
          if (s && activo(s) && ids.indexOf(id) < 0) ids.push(id);
        });
      });
      return ids;
    };

    // Preselección desde el catálogo: ?servicio=id
    const pre = new URLSearchParams(location.search).get('servicio');
    if (pre && servicioPorId(pre) && activo(servicioPorId(pre))){
      C.areas.some(function(a){
        return a.objetivos.some(function(o){
          if (o.servicios.indexOf(pre) >= 0){ est.objetivos.push(a.id + ':' + o.id); est.area = a.id; return true; }
          return false;
        });
      });
      est.servicios.push(pre);
    }

    function pintar(){
      const key = guardarFoco();

      // Paso 1: áreas y objetivos
      form.querySelector('[data-render="cot-areas"]').innerHTML = C.areas.map(function(a){
        const n = est.objetivos.filter(function(k){ return k.indexOf(a.id + ':') === 0; }).length;
        return '<button type="button" class="chip-btn" data-key="a-' + a.id + '" data-area="' + a.id + '" aria-pressed="' + (est.area === a.id) + '">' +
          icono(a.icono) + esc(L(a, 'nombre')) + (n ? ' <small>(' + n + ')</small>' : '') + '</button>';
      }).join('');
      const a = area(est.area);
      form.querySelector('[data-render="cot-objetivos"]').innerHTML = a.objetivos.map(function(o){
        const k = a.id + ':' + o.id;
        const vivos = o.servicios.filter(function(id){ const s = servicioPorId(id); return s && activo(s); });
        if (!vivos.length) return '';
        return '<label class="chip"><input type="checkbox" data-key="o-' + k + '" data-obj="' + k + '"' + (est.objetivos.indexOf(k) >= 0 ? ' checked' : '') + '><span>' + esc(L(o, 'nombre')) + '</span></label>';
      }).join('');

      // Paso 2: zonas de las áreas elegidas
      form.querySelector('[data-render="cot-zonas"]').innerHTML = areasElegidas().map(function(id){
        const ar = area(id);
        return '<div class="grupo-obj"><h3>' + icono(ar.icono) + esc(L(ar, 'nombre')) + '</h3><div class="chips">' +
          ar.zonas.map(function(z){
            return '<label class="chip"><input type="checkbox" data-key="z-' + z + '" data-zona="' + z + '"' + (est.zonas.indexOf(z) >= 0 ? ' checked' : '') + '><span>' + esc(zonaNombre(z)) + '</span></label>';
          }).join('') + '</div></div>';
      }).join('');

      // Paso 3: tratamientos sugeridos
      const sug = sugeridos();
      est.servicios = est.servicios.filter(function(id){ return sug.indexOf(id) >= 0; });
      form.querySelector('[data-render="cot-sugeridos"]').innerHTML = sug.map(function(id){
        const s = servicioPorId(id);
        return '<label class="sug"><input type="checkbox" data-key="s-' + id + '" data-serv="' + id + '"' + (est.servicios.indexOf(id) >= 0 ? ' checked' : '') + '>' +
          '<span><b>' + esc(L(s, 'nombre')) + '</b><small>' + esc(L(s, 'desc')) + '</small>' +
          (s.medico ? '<small>' + L('Procedimiento médico: lo define el médico en consulta.', 'Medical procedure: defined by the physician in consultation.') + '</small>' : '') + '</span>' +
          ((MOSTRAR_PRECIOS && s.precio) ? '<span class="sug__precio">' + dolares(s.precio) + '</span>' : '<span></span>') +
        '</label>';
      }).join('') +
        '<label class="sug sug--asesoria"><input type="checkbox" data-key="s-asesoria" data-asesoria' + (est.asesoria ? ' checked' : '') + '>' +
        '<span><b>' + L('No sé cuál elegir: quiero que me recomienden', 'Not sure which one: I’d like a recommendation') + '</b>' +
        '<small>' + L(N + ' te orienta según lo que querés lograr.', N + ' will guide you based on your goals.') + '</small></span><span></span></label>';

      // Paso 4: presupuesto y cuándo
      form.querySelector('[data-render="cot-presupuestos"]').innerHTML = C.presupuestos.map(function(p){
        return '<label class="chip"><input type="radio" name="presupuesto" data-key="p-' + p.id + '" value="' + p.id + '"' + (est.presupuesto === p.id ? ' checked' : '') + '><span>' + esc(L(p, 'nombre')) + '</span></label>';
      }).join('');
      form.querySelector('[data-render="cot-cuando"]').innerHTML = C.cuando.map(function(c, i){
        return '<label class="chip"><input type="radio" name="cuando" data-key="c-' + i + '" value="' + i + '"' + (est.cuando === String(i) ? ' checked' : '') + '><span>' + esc(esEN() ? c[1] : c[0]) + '</span></label>';
      }).join('');

      // Visibilidad de pasos y barra de progreso
      form.querySelectorAll('[data-paso]').forEach(function(p){ p.hidden = parseInt(p.dataset.paso, 10) !== paso; });
      form.querySelectorAll('[data-render="stepper"] li').forEach(function(li, i){
        li.classList.toggle('is-on', i + 1 === paso);
        li.classList.toggle('is-done', i + 1 < paso);
        if (i + 1 === paso) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      pintarResumen();
      restaurarFoco(key, form);
    }

    function textoObjetivos(){
      return est.objetivos.map(function(k){
        const o = objetivo(k);
        return o && o.obj ? L(o.obj, 'nombre') + ' (' + L(o.area, 'nombre') + ')' : '';
      }).filter(Boolean);
    }
    function referencia(){
      if (!MOSTRAR_PRECIOS) return null;
      const con = est.servicios.map(servicioPorId).filter(function(s){ return s && s.precio; });
      if (!con.length) return null;
      return { total: con.reduce(function(t, s){ return t + s.precio; }, 0), n: con.length, de: est.servicios.length };
    }
    function pintarResumen(){
      const el = document.querySelector('[data-render="resumen"]');
      if (!el) return;
      const fila = function(t, arr){
        return '<div><dt>' + t + '</dt><dd' + (arr.length ? '' : ' class="vacio-dd"') + '>' + (arr.length ? esc(arr.join(', ')) : L('Sin elegir', 'Not selected')) + '</dd></div>';
      };
      const serv = est.servicios.map(nombreServicio);
      if (est.asesoria) serv.push(L('Recomendación de ' + N, N + '’s recommendation'));
      const pres = C.presupuestos.filter(function(p){ return p.id === est.presupuesto; })[0];
      const ref = referencia();
      el.innerHTML = '<h3>' + icono('i-calc') + L('Tu cotización', 'Your quote') + '</h3><dl>' +
        fila(L(V.objetivo || 'Quiero mejorar', V.objetivoEn || 'I want to improve'), textoObjetivos()) +
        fila(L(V.zonaTitulo || 'Zonas', V.zonaTituloEn || 'Areas'), est.zonas.map(zonaNombre)) +
        fila(L(cap(V.varios), cap(V.variosEn)), serv) +
        fila(L('Presupuesto', 'Budget'), pres ? [L(pres, 'nombre')] : []) + '</dl>' +
        '<div class="resumen__total">' + (ref
          ? '<b>' + dolares(ref.total) + '</b><small>' + L('Suma de precios publicados por ' + N + ' (', 'Sum of prices published by ' + N + ' (') + ref.n + L(' de ', ' of ') + ref.de + L('). El precio final lo confirma ' + N + '.', '). ' + N + ' confirms the final price.') + '</small>'
          : '<small>' + L(N + ' te envía el precio por WhatsApp según lo que elijas.', N + ' sends you the price on WhatsApp based on your choices.') + '</small>') +
        '</div>';
    }

    function validarPaso(){
      limpiarErrores(form);
      if (paso === 1 && !est.objetivos.length){ document.getElementById('err-cot-1').hidden = false; return false; }
      if (paso === 3 && !est.servicios.length && !est.asesoria){ document.getElementById('err-cot-3').hidden = false; return false; }
      return true;
    }
    function irA(n){
      paso = n;
      pintar();
      const panel = form.querySelector('[data-paso="' + n + '"] h2');
      if (panel){ panel.setAttribute('tabindex', '-1'); panel.focus({ preventScroll: true }); }
      const top = form.getBoundingClientRect().top;
      if (top < 0) form.scrollIntoView({ block: 'start' });
    }

    form.addEventListener('click', function(e){
      const b = e.target.closest('[data-area]');
      if (b){ est.area = b.dataset.area; pintar(); return; }
      const nav = e.target.closest('[data-ir]');
      if (nav){
        const destino = parseInt(nav.dataset.ir, 10);
        if (destino > paso && !validarPaso()) return;
        irA(destino);
      }
    });
    form.addEventListener('change', function(e){
      const t = e.target;
      if (t.dataset.obj){ alternar(est.objetivos, t.dataset.obj); pintar(); }
      else if (t.dataset.zona){ alternar(est.zonas, t.dataset.zona); pintarResumen(); }
      else if (t.dataset.serv){ alternar(est.servicios, t.dataset.serv); pintarResumen(); }
      else if ('asesoria' in t.dataset){ est.asesoria = t.checked; pintarResumen(); }
      else if (t.name === 'presupuesto'){ est.presupuesto = t.value; pintarResumen(); }
      else if (t.name === 'cuando'){ est.cuando = t.value; }
    });
    document.addEventListener('sitio:lang', pintar);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (paso !== 4){ if (validarPaso()) irA(paso + 1); return; }
      limpiarErrores(form);
      const errores = [];
      if (!est.presupuesto) marcarError(form.querySelector('input[name="presupuesto"]'), 'err-cot-presupuesto', errores);
      if (!f.nombre.value.trim()) marcarError(f.nombre, 'err-cot-nombre', errores);
      const tel = f.telefono.value.trim();
      if ((NEGOCIO.endpoint && !telValido(tel)) || (tel && !telValido(tel))) marcarError(f.telefono, 'err-cot-tel', errores);
      if (NEGOCIO.endpoint && !f.consentimiento.checked) marcarError(f.consentimiento, 'err-cot-consent', errores);
      if (errores.length){ errores[0].focus(); return; }

      const pres = C.presupuestos.filter(function(p){ return p.id === est.presupuesto; })[0];
      const lineas = [L('Hola ' + N + ', quiero una cotización.', 'Hi ' + N + ', I would like a quote.')];
      lineas.push('• ' + L((V.objetivo || 'Quiero mejorar') + ': ', (V.objetivoEn || 'I want to improve') + ': ') + textoObjetivos().join('; '));
      if (est.zonas.length) lineas.push('• ' + L((V.zonaTitulo || 'Zonas') + ': ', (V.zonaTituloEn || 'Areas') + ': ') + est.zonas.map(zonaNombre).join(', '));
      if (est.servicios.length) lineas.push('• ' + L(cap(V.varios) + ' de interés: ', cap(V.variosEn) + ' of interest: ') + est.servicios.map(nombreServicio).join(', '));
      if (est.asesoria) lineas.push('• ' + L('Quiero que me recomienden el ' + V.uno, 'I would like a ' + V.unoEn + ' recommendation'));
      lineas.push('• ' + L('Presupuesto: ', 'Budget: ') + L(pres, 'nombre'));
      if (est.cuando !== '') { const c = C.cuando[parseInt(est.cuando, 10)]; lineas.push('• ' + L('¿Para cuándo?: ', 'When: ') + (esEN() ? c[1] : c[0])); }
      lineas.push(L('Soy ', 'My name is ') + f.nombre.value.trim() + (tel ? ' (' + tel + ')' : '') + '.');
      if (f.comentario.value.trim()) lineas.push(L('Comentario: ', 'Note: ') + f.comentario.value.trim());
      lineas.push(L('(Enviado desde el cotizador del sitio web)', '(Sent from the website quote tool)'));

      const url = waLink(lineas.join('\n'));
      window.open(url, '_blank', 'noopener');
      mostrarEnvio(form, url, registrarSolicitud('cotizacion', {
        objetivos: textoObjetivos(), zonas: est.zonas, servicio: est.servicios.map(nombreServicio).join(', '),
        asesoria: est.asesoria, presupuesto: L(pres, 'nombre'), nombre: f.nombre.value.trim(), telefono: tel,
        comentario: f.comentario.value.trim()
      }), L('Tu cotización está lista en WhatsApp', 'Your quote request is ready in WhatsApp'));
    });

    pintar();
  }

  function initSeguimiento(){
    const form = document.getElementById('form-seguimiento');
    if (!form) return;
    const f = form.elements;
    const opciones = function(){ opcionesServicios(f.tratamiento, L('Elegí tu ' + V.uno + ' (opcional)', 'Choose your ' + V.unoEn + ' (optional)')); };
    opciones();
    document.addEventListener('sitio:lang', opciones);
    form.addEventListener('submit', function(e){ e.preventDefault(); });
    form.addEventListener('click', function(e){
      const b = e.target.closest('[data-seg]');
      if (!b) return;
      const s = servicioPorId(f.tratamiento.value);
      const trat = s ? L(s, 'nombre') : '';
      const nombre = f.nombre.value.trim();
      const quien = L('Hola ' + N + ', ' + (V.quien || 'soy ' + V.cliente), 'Hi ' + N + ', ' + (V.quienEn || 'I am a ' + V.clienteEn)) + (nombre ? ' (' + nombre + ')' : '');
      const de = trat ? L(V.de || ' de ', V.deEn || ' for ') + trat : '';
      const textos = {
        confirmar: quien + L(' y ' + (V.confirmar || 'quiero confirmar mi próxima sesión'), ' and ' + (V.confirmarEn || 'I want to confirm my next session')) + de + '.',
        reprogramar: quien + L(' y ' + (V.reprogramar || 'necesito reprogramar mi cita'), ' and ' + (V.reprogramarEn || 'I need to reschedule my appointment')) + de + L('. ¿Qué otras fechas tienen?', '. What other dates do you have?'),
        consulta: quien + de + L(' y tengo una consulta: ', ' and I have a question: ')
      };
      const url = waLink(textos[b.dataset.seg]);
      window.open(url, '_blank', 'noopener');
      registrarSolicitud('seguimiento', { accion: b.dataset.seg, servicio: trat, nombre: nombre });
    });
  }

  /* ======================================================================
     ARRANQUE
     ====================================================================== */
  function pintarConteoTotal(){
    document.querySelectorAll('[data-render="conteo-total"]').forEach(function(el){
      el.textContent = items(servicios().length) +
        L(' en ', ' in ') + plural(categoriasActivas().length, L(V.grupo || 'área', V.grupoEn || 'area'), L(V.grupos || 'áreas', V.gruposEn || 'areas'));
    });
  }

  function renderComunes(){
    aplicarBanderas();
    pintarEstado();
    pintarHorario();
    pintarRating();
    pintarPromo();
    pintarConteoTotal();
  }
  function renderPagina(){
    if (PAGE === 'inicio'){ pintarCategorias(); pintarTecnologias(); pintarClubMini(); }
    if (PAGE === 'membresias'){ pintarPlanes(); pintarPaquetes(); }
  }

  renderComunes();
  renderPagina();
  jsonLD();
  if (PAGE === 'servicios') initCatalogo();
  initGaleria();
  (function(){
    const el = document.querySelector('[data-render="trabajos"]');
    if (!el) return;
    const vistas = {};
    const fotos = (NEGOCIO.galeria || []).filter(function(f){ if (vistas[f.cat]) return false; vistas[f.cat] = 1; return true; }).slice(0, 8);
    if (!GALERIA || !fotos.length){ const b = el.closest('section'); if (b) b.hidden = true; return; }
    function pintar(){
      el.innerHTML = fotos.map(function(f){
        const t = L(f, 'titulo');
        return '<figure><a href="servicios.html#galeria"><img src="' + esc(f.src) + '" alt="' + esc(t) + '" width="' + Number(f.w) + '" height="' + Number(f.h) + '" loading="lazy"></a><figcaption>' + esc(t) + '</figcaption></figure>';
      }).join('');
    }
    document.addEventListener('sitio:lang', pintar);
    pintar();
  })();
  if (PAGE === 'membresias') initRegalo();
  if (PAGE === 'agendar'){ initTabs(); initCita(); initCotizador(); initSeguimiento(); }

  document.querySelectorAll('[data-print]').forEach(function(b){ b.addEventListener('click', function(){ window.print(); }); });
  setInterval(pintarEstado, 60000);

  document.addEventListener('sitio:lang', function(){
    renderComunes();
    renderPagina();
    initDatos();
    initWhatsApp();
  });
})();
