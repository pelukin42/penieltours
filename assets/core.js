/* ==========================================================================
   PENIEL TOURS FLAMINGO — Núcleo compartido (FUENTE ÚNICA)
   - Configuración única del negocio: todo dato real vive aquí
   - WhatsApp con mensaje contextual, idioma, registro de solicitudes
   - Placeholders de fotografía, header, menú móvil y animaciones
   Copiar a profesional/js/core.js después de editar.
   La fuente de cada dato está en README.md y PENDIENTES-CLIENTE.md.
   Revisión de fuentes: 11 de octubre de 2026.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) CONFIGURACIÓN DEL NEGOCIO
   Campo vacío = ese elemento o sección NO se dibuja. Nunca se rellena.
   Fuentes:
     · «Perfil FishingBooker» = fishingbooker.com/charters/view/15835, consultado el 11-oct-2026.
       Es un perfil de terceros: se confirma con Peniel Tours antes de publicar.
     · «Cliente» = lo que dio quien administra el proyecto (nombres de Facebook e Instagram).
   -------------------------------------------------------------------------- */
const NEGOCIO = {
  nombre: 'Peniel Tours',
  nombreCompleto: 'Peniel Tours Flamingo',
  nombresAlternos: [],
  ciudad: 'Playa Flamingo',
  eslogan: 'Pesca deportiva desde Playa Flamingo',     // descriptivo: NO es un lema del negocio
  esloganEn: 'Sport fishing from Playa Flamingo',
  schemaTipo: ['LocalBusiness', 'SportsActivityLocation'],
  clubNombre: '',
  marcaIcono: 'i-pt',              // símbolo del sprite que hace de marca (ancla, dibujo propio: no es el logo)
  // Vocabulario del rubro: charter de pesca deportiva, se reserva una salida
  vocab: { uno: 'salida', varios: 'salidas', unoEn: 'trip', variosEn: 'trips',
           cliente: 'viajero', clienteEn: 'guest',
           regalo: '', regaloEn: '',
           pedirCita: 'quiero reservar una salida de pesca',
           pedirCitaEn: 'I would like to book a fishing trip',
           objetivo: 'Quiero', objetivoEn: 'I want',
           zonaTitulo: 'Grupo', zonaTituloEn: 'Group',
           accionCita: 'Reservar', accionCitaEn: 'Book',
           plan: 'plan', planEn: 'plan',
           // Canal «ya reservé»: frases de los tres botones
           quien: 'ya reservé con ustedes', quienEn: 'I already booked with you',
           de: ' para la salida: ', deEn: ' for the trip: ',
           confirmar: 'quiero confirmar los detalles', confirmarEn: 'I want to confirm the details',
           reprogramar: 'necesito cambiar la fecha', reprogramarEn: 'I need to change the date',
           grupo: 'tipo de salida', grupos: 'tipos de salida', grupoEn: 'trip type', gruposEn: 'trip types' },

  // CLIENTE — nombres de las redes
  instagram: 'https://www.instagram.com/penieltoursflamingo/',
  instagramUsuario: '@penieltoursflamingo',
  facebook: 'https://www.facebook.com/search/top?q=Peniel%20Tours%20flamingo',   // [PENDIENTE] URL directa de la página «Peniel Tours flamingo»
  facebookNombre: 'Peniel Tours flamingo',

  // [PENDIENTE] — no hay fuente: vacío hasta que el negocio lo entregue
  whatsapp: '',                    // [PENDIENTE] código de país + número, sin + ni espacios. Ej.: 506XXXXXXXX
  whatsappTexto: '',               // cómo se muestra el número (debe coincidir con whatsapp)
  telefono: '', telefonoHref: '',
  email: '',
  tiktok: '',
  dominio: '',
  endpoint: '',                    // registro de solicitudes (Formspree, Supabase REST o Apps Script). Vacío = solo WhatsApp
  headers: {},
  horario: [],                     // las salidas son por reserva: no hay horario de local
  pagos: [], pagosEn: [],          // [PENDIENTE] confirmar efectivo, tarjeta, SINPE Móvil
  accesible: false,
  director: '',                    // [PENDIENTE] nombre del capitán o responsable (bandera MOSTRAR_DIRECTOR = false)
  google: { rating: null, total: 0 },
  googlePlaceId: '',               // [PENDIENTE] ficha de Google: sin ella no hay enlace a reseñas
  lat: null, lng: null,            // [PENDIENTE] coordenadas exactas del punto de salida

  // PUNTO DE SALIDA — Perfil FishingBooker: «Margaritaville Flamingo Beach Resort, Playa Flamingo, GU 50308».
  // Confirmar con el negocio si es donde se abordan los clientes.
  salida: 'Margaritaville Flamingo Beach Resort', salidaEn: 'Margaritaville Flamingo Beach Resort',
  direccion: 'Playa Flamingo, Guanacaste', direccionEn: 'Playa Flamingo, Guanacaste',
  canton: 'Playa Flamingo',
  provincia: 'Guanacaste',
  codigoPostal: '50308',
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Margaritaville+Flamingo+Beach+Resort+Playa+Flamingo',

  // EMBARCACIÓN — Perfil FishingBooker
  barco: { tipo: 'Hatteras', pies: 31, anio: 2007, capacidad: 6,
           fuente: 'Perfil FishingBooker, 11-oct-2026' },

  // Promoción del mes: un solo lugar para cambiarla. activa:false = no se muestra.
  promo: { activa: false, texto: '', textoEn: '', wa: '' },

  /* ---------- Catálogo: tipos de salida ---------- */
  categorias: [
    { id: 'medio-dia', icono: 'i-sol', dibujo: 'img/dibujos/medio-dia-manana.svg',
      nombre: 'Medio día', nombreEn: 'Half day',
      desc: 'Cuatro horas en el agua, en la mañana o en la tarde.',
      descEn: 'Four hours on the water, in the morning or the afternoon.' },
    { id: 'tres-cuartos', icono: 'i-barco', dibujo: 'img/dibujos/tres-cuartos.svg',
      nombre: 'Tres cuartos de día', nombreEn: '3/4 day',
      desc: 'Seis horas de pesca desde Playa Flamingo.',
      descEn: 'Six hours of fishing out of Playa Flamingo.' },
    { id: 'dia-completo', icono: 'i-pez', dibujo: 'img/dibujos/dia-completo.svg',
      nombre: 'Día completo', nombreEn: 'Full day',
      desc: 'Ocho horas en el agua: el día entero para pescar.',
      descEn: 'Eight hours on the water: the whole day for fishing.' }
  ],

  /* ---------- Zonas del cotizador: aquí, «quiénes van» ---------- */
  zonas: {
    'hasta-6':  ['Hasta 6 personas', 'Up to 6 people'],
    'solo':     ['Voy solo', 'Just me'],
    'pareja':   ['En pareja', 'As a couple'],
    'familia':  ['En familia, con niños', 'Family, with children'],
    'amigos':   ['Con amigos', 'With friends'],
    'grupo':    ['Somos 5 o 6', 'There are 5 or 6 of us']
  },

  /* ---------- Catálogo: salidas ----------
     horas / franja: duración publicada y si es de mañana o de tarde (la usa la portada).
     foto: dibujo a escala de horas (img/dibujos/, lo genera herramientas/dibujos.py).
     Cuando lleguen fotos reales de cada salida, se reemplaza por 'img/salidas/<id>.jpg'. */
  servicios: [
    { id: 'medio-dia-manana', rotulo: 'Mañana', rotuloEn: 'Morning', cats: ['medio-dia'], zonas: ['hasta-6'], horas: 4, franja: 'manana',
      precio: null, foto: 'img/dibujos/medio-dia-manana.svg',
      nombre: 'Medio día, en la mañana', nombreEn: 'Half day, morning',
      desc: 'Cuatro horas de pesca en la mañana, desde Playa Flamingo. Incluye equipo de pesca, carnada, snacks y bebidas, según el perfil del negocio.',
      descEn: 'Four hours of fishing in the morning, out of Playa Flamingo. Includes fishing gear, bait, snacks and drinks, per the business profile.',
      fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'medio-dia-tarde', rotulo: 'Tarde', rotuloEn: 'Afternoon', cats: ['medio-dia'], zonas: ['hasta-6'], horas: 4, franja: 'tarde',
      precio: null, foto: 'img/dibujos/medio-dia-tarde.svg',
      nombre: 'Medio día, en la tarde', nombreEn: 'Half day, afternoon',
      desc: 'Cuatro horas de pesca en la tarde, desde Playa Flamingo. Incluye equipo de pesca, carnada, snacks y bebidas, según el perfil del negocio.',
      descEn: 'Four hours of fishing in the afternoon, out of Playa Flamingo. Includes fishing gear, bait, snacks and drinks, per the business profile.',
      fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'tres-cuartos', rotulo: 'Tres cuartos de día', rotuloEn: 'Three quarters of a day', cats: ['tres-cuartos'], zonas: ['hasta-6'], horas: 6,
      precio: null, foto: 'img/dibujos/tres-cuartos.svg',
      nombre: 'Tres cuartos de día', nombreEn: '3/4 day',
      desc: 'Seis horas de pesca desde Playa Flamingo. Incluye equipo de pesca, carnada, snacks y bebidas, según el perfil del negocio.',
      descEn: 'Six hours of fishing out of Playa Flamingo. Includes fishing gear, bait, snacks and drinks, per the business profile.',
      fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'dia-completo', rotulo: 'Día completo', rotuloEn: 'Full day', cats: ['dia-completo'], zonas: ['hasta-6'], horas: 8,
      precio: null, foto: 'img/dibujos/dia-completo.svg',
      nombre: 'Día completo', nombreEn: 'Full day',
      desc: 'Ocho horas de pesca desde Playa Flamingo. Incluye equipo de pesca, carnada, snacks, bebidas y almuerzo, según el perfil del negocio.',
      descEn: 'Eight hours of fishing out of Playa Flamingo. Includes fishing gear, bait, snacks, drinks and lunch, per the business profile.',
      fuente: 'Perfil FishingBooker, 11-oct-2026' }
  ],

  /* ---------- Lo que lleva la salida (solo con fuente) ---------- */
  tecnologias: [
    { id: 'hatteras', nombre: 'Hatteras de 31 pies',
      origen: 'Construida en 2007', origenEn: 'Built in 2007',
      uso: 'Hasta 6 personas a bordo', usoEn: 'Up to 6 guests on board',
      servicio: 'dia-completo', fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'equipo', nombre: 'Cañas, carretes y señuelos',
      origen: 'Incluido en el precio', origenEn: 'Included in the price',
      uso: 'Equipo ligero y pesado, carnada viva', usoEn: 'Light and heavy tackle, live bait',
      servicio: 'medio-dia-manana', fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'a-bordo', nombre: 'GPS, silla de combate y baño',
      origen: 'A bordo', origenEn: 'On board',
      uso: 'Vivero de carnada viva y nevera con hielo', usoEn: 'Live-bait tank and ice cooler',
      servicio: 'tres-cuartos', fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'comida', nombre: 'Snacks, bebidas y almuerzo',
      origen: 'Incluido en el precio', origenEn: 'Included in the price',
      uso: 'Agua y refresco; el almuerzo según la salida', usoEn: 'Water and soft drinks; lunch depends on the trip',
      servicio: 'dia-completo', fuente: 'Perfil FishingBooker, 11-oct-2026' },
    { id: 'snorkel', nombre: 'Equipo de snorkel',
      origen: 'A bordo, se avisa al capitán antes', origenEn: 'On board, tell the captain beforehand',
      uso: 'Para meterse al agua en la salida', usoEn: 'To get in the water during the trip',
      servicio: 'tres-cuartos', fuente: 'Perfil FishingBooker, 11-oct-2026' }
  ],

  /* ---------- Sin paquetes, plan de mantenimiento, regalo ni galería ---------- */
  paquetes: [],
  membresias: [],
  regalo: { opciones: [] },
  /* Galería: apagada. Solo irán fotos del propio negocio (Instagram y Facebook propios) y no hay
     ninguna cargada: nunca bancos de imágenes ni fotos de terceros. */
  galeriaGrupos: {},
  galeria: [],

  /* ---------- Cotizador: qué quiero -> salidas ----------
     Los objetivos no prometen resultados de pesca: solo orientan la duración. */
  cotizador: {
    areas: [
      { id: 'dia', icono: 'i-barco', nombre: 'Mi día en el agua', nombreEn: 'My day on the water',
        zonas: ['solo', 'pareja', 'familia', 'amigos', 'grupo'],
        objetivos: [
          { id: 'poco-tiempo', claves: 'poco tiempo rapido corto medio dia manana tarde cuatro horas', nombre: 'Tengo poco tiempo: medio día', nombreEn: 'I’m short on time: half day', servicios: ['medio-dia-manana', 'medio-dia-tarde'] },
          { id: 'mas-tiempo', claves: 'mas tiempo seis horas tres cuartos intermedio', nombre: 'Quiero más tiempo en el agua', nombreEn: 'I want more time on the water', servicios: ['tres-cuartos', 'dia-completo'] },
          { id: 'dia-entero', claves: 'dia completo entero ocho horas todo el dia almuerzo', nombre: 'Quiero pasar el día entero pescando', nombreEn: 'I want to fish the whole day', servicios: ['dia-completo'] },
          { id: 'ninos', claves: 'ninos familia hijos pequenos', nombre: 'Voy con niños', nombreEn: 'I’m going with children', servicios: ['medio-dia-manana', 'medio-dia-tarde', 'tres-cuartos', 'dia-completo'] },
          { id: 'snorkel', claves: 'snorkel bucear nadar agua mascara', nombre: 'Quiero hacer snorkel además de pescar', nombreEn: 'I want to snorkel as well as fish', servicios: ['tres-cuartos', 'dia-completo'] }
        ] },
      { id: 'pesca', icono: 'i-pez', nombre: 'Qué quiero pescar', nombreEn: 'What I want to catch',
        zonas: ['solo', 'pareja', 'familia', 'amigos', 'grupo'],
        objetivos: [
          { id: 'marlin', claves: 'marlin negro azul rayado pez vela grande', nombre: 'Marlín', nombreEn: 'Marlin', servicios: ['medio-dia-manana', 'medio-dia-tarde', 'tres-cuartos', 'dia-completo'] },
          { id: 'dorado-atun', claves: 'dorado mahi mahi atun aleta amarilla negra comer llevar', nombre: 'Dorado o atún', nombreEn: 'Mahi mahi or tuna', servicios: ['medio-dia-manana', 'medio-dia-tarde', 'tres-cuartos', 'dia-completo'] },
          { id: 'pez-gallo', claves: 'pez gallo roosterfish medregal costera arrecife', nombre: 'Pez gallo o medregal', nombreEn: 'Roosterfish or amberjack', servicios: ['medio-dia-manana', 'medio-dia-tarde', 'tres-cuartos', 'dia-completo'] },
          { id: 'primera-vez', claves: 'primera vez nunca he pescado principiante aprender', nombre: 'Es mi primera vez pescando', nombreEn: 'It’s my first time fishing', servicios: ['medio-dia-manana', 'medio-dia-tarde', 'tres-cuartos'] }
        ] }
    ],
    // Rangos para orientar la conversación. NO son precios de Peniel Tours.
    presupuestos: [
      { id: 'p1', nombre: 'Hasta US$500', nombreEn: 'Up to US$500' },
      { id: 'p2', nombre: 'US$500 a US$800', nombreEn: 'US$500 to US$800' },
      { id: 'p3', nombre: 'Más de US$800', nombreEn: 'Over US$800' },
      { id: 'p0', nombre: 'Prefiero que me asesoren', nombreEn: 'I’d like advice' }
    ],
    cuando: [
      ['En los próximos días', 'In the next few days'], ['Este mes', 'This month'],
      ['En los próximos meses', 'In the coming months'], ['Todavía no tengo fecha', 'I don’t have a date yet']
    ]
  }
};

/* --------------------------------------------------------------------------
   2) IDIOMA — el HTML viene en español; i18n.js cambia a inglés
   -------------------------------------------------------------------------- */
function esEN(){ return document.documentElement.lang === 'en'; }
/* Devuelve el texto en el idioma activo: L('Hola', 'Hi') o L(obj, 'nombre') */
function L(a, b){
  if (a && typeof a === 'object'){ return (esEN() && a[b + 'En']) ? a[b + 'En'] : a[b]; }
  return esEN() && b ? b : a;
}

/* --------------------------------------------------------------------------
   3) UTILIDADES
   -------------------------------------------------------------------------- */
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}
function dolares(n){
  const sep = esEN() ? ',' : '.';
  return 'US$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
function icono(id, clase){
  return '<svg' + (clase ? ' class="' + clase + '"' : '') + ' aria-hidden="true"><use href="#' + id + '"/></svg>';
}
function servicioPorId(id){
  return NEGOCIO.servicios.filter(function(s){ return s.id === id; })[0] || null;
}
function zonaNombre(id){
  const z = NEGOCIO.zonas[id];
  return z ? (esEN() ? z[1] : z[0]) : id;
}

const MESES = {
  es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','setiembre','octubre','noviembre','diciembre'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December']
};
const DIAS = {
  es: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
};
function fechaLarga(d){
  const k = esEN() ? 'en' : 'es';
  return esEN()
    ? DIAS.en[d.getDay()] + ', ' + MESES.en[d.getMonth()] + ' ' + d.getDate()
    : DIAS.es[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[k][d.getMonth()];
}
/* "19:00" -> "7 p. m." / "7 p.m." */
function hora12(hhmm){
  const p = hhmm.split(':'), h = parseInt(p[0], 10), m = p[1];
  const h12 = ((h + 11) % 12) + 1;
  const suf = h < 12 ? (esEN() ? 'a.m.' : 'a. m.') : (esEN() ? 'p.m.' : 'p. m.');
  return h12 + (m !== '00' ? ':' + m : '') + ' ' + suf;
}

/* --------------------------------------------------------------------------
   4) HORARIO — hora de Costa Rica (UTC-6, sin horario de verano)
   -------------------------------------------------------------------------- */
function ahoraCR(){
  const d = new Date();
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000 - 6 * 3600000);
}
function estadoHorario(){
  const h = NEGOCIO.horario;
  if (!h || !h.length) return null;
  const now = ahoraCR();
  const min = now.getHours() * 60 + now.getMinutes();
  const aMin = function(s){ const p = s.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); };
  const hoy = h.filter(function(x){ return x.dia === now.getDay(); })[0];
  if (hoy && min >= aMin(hoy.abre) && min < aMin(hoy.cierra)){
    return { abierto: true, texto: L('Abierto ahora, cierra a las ', 'Open now, closes at ') + hora12(hoy.cierra) };
  }
  if (hoy && min < aMin(hoy.abre)){
    return { abierto: false, texto: L('Cerrado, abre hoy a las ', 'Closed, opens today at ') + hora12(hoy.abre) };
  }
  for (let i = 1; i <= 7; i++){
    const dia = (now.getDay() + i) % 7;
    const sig = h.filter(function(x){ return x.dia === dia; })[0];
    if (sig){
      const cuando = i === 1 ? L('mañana', 'tomorrow') : (esEN() ? 'on ' + DIAS.en[dia] : 'el ' + DIAS.es[dia]);
      return { abierto: false, texto: L('Cerrado, abre ', 'Closed, opens ') + cuando + L(' a las ', ' at ') + hora12(sig.abre) };
    }
  }
  return null;
}

/* --------------------------------------------------------------------------
   5) WHATSAPP — mensajes contextuales, nunca "Hola, quiero información"
   data-wa="mensaje en español"  data-wa-en="message in English"
   -------------------------------------------------------------------------- */
function waLink(mensaje){
  return 'https://wa.me/' + NEGOCIO.whatsapp + '?text=' + encodeURIComponent(mensaje);
}
function initWhatsApp(root){
  (root || document).querySelectorAll('[data-wa]').forEach(function(el){
    const msg = (esEN() && el.dataset.waEn) ? el.dataset.waEn : el.dataset.wa;
    el.setAttribute('href', waLink(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}

/* --------------------------------------------------------------------------
   6) REGISTRO DE SOLICITUDES — con origen (UTM, gclid, referente)
   Si NEGOCIO.endpoint está vacío devuelve null: nunca finge que se guardó.
   -------------------------------------------------------------------------- */
function origenVisita(){
  const q = new URLSearchParams(location.search);
  const o = { pagina: location.pathname, referente: document.referrer || '' };
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'].forEach(function(k){
    if (q.get(k)) o[k] = q.get(k);
  });
  try {
    const guardado = JSON.parse(sessionStorage.getItem('sitio_origen') || 'null');
    if (guardado && !o.utm_source) Object.keys(guardado).forEach(function(k){ if (!o[k]) o[k] = guardado[k]; });
    if (o.utm_source || o.gclid || o.fbclid) sessionStorage.setItem('sitio_origen', JSON.stringify(o));
  } catch (e) { /* almacenamiento bloqueado: se usa solo lo de esta visita */ }
  return o;
}
function registrarSolicitud(tipo, datos){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'solicitud_' + tipo, servicio: datos.servicio || '' });
  if (!NEGOCIO.endpoint) return Promise.resolve(null);
  const cuerpo = Object.assign({ tipo: tipo, fecha: new Date().toISOString(), idioma: document.documentElement.lang, origen: origenVisita() }, datos);
  return fetch(NEGOCIO.endpoint, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, NEGOCIO.headers || {}),
    body: JSON.stringify(cuerpo)
  }).then(function(r){ return r.ok; }).catch(function(){ return false; });
}

/* --------------------------------------------------------------------------
   7) PLACEHOLDERS DE FOTOGRAFÍA
   <img data-ph="Recepción" src="img/recepcion.jpg">
   El marcador se dibuja primero y se retira en cuanto la foto carga bien.
   Con loading="lazy" el navegador puede no intentar la descarga, el evento
   "error" no llega, y el hueco quedaría vacío: por eso este orden.
   -------------------------------------------------------------------------- */
const PH_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.5-5.5L7 19"/></svg>';

function initPlaceholders(root){
  (root || document).querySelectorAll('img[data-ph]').forEach(function(img){
    if (img.dataset.phInit) return;
    img.dataset.phInit = '1';
    if (!img.parentNode) return;
    const box = document.createElement('div');
    box.className = 'ph';
    box.innerHTML = PH_ICON + '<b>' + L('Fotografía pendiente', 'Photo pending') + '</b><span>' + esc(img.dataset.ph || '') + '</span>';
    img.parentNode.insertBefore(box, img);
    const cargo = function(){ if (img.naturalWidth > 0){ box.remove(); img.style.display = ''; } };
    if (img.complete) cargo();
    img.addEventListener('load', cargo);
    img.addEventListener('error', function(){ img.style.display = 'none'; });
  });
}

/* --------------------------------------------------------------------------
   8) HEADER / MENÚ / ANIMACIONES
   -------------------------------------------------------------------------- */
function initHeader(){
  const hdr = document.querySelector('.hdr');
  if (hdr){
    const onScroll = function(){ hdr.classList.toggle('is-stuck', window.scrollY > 12); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;
  const cerrar = function(){
    nav.classList.remove('is-open'); burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', L('Abrir menú', 'Open menu'));
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', function(){
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? L('Cerrar menú', 'Close menu') : L('Abrir menú', 'Open menu'));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open){
      nav.style.setProperty('--nav-top', Math.max(0, Math.round((hdr || burger).getBoundingClientRect().bottom)) + 'px');
      const first = nav.querySelector('a'); if (first) first.focus({ preventScroll: true });
    }
  });
  nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', cerrar); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && nav.classList.contains('is-open')){ cerrar(); burger.focus(); }
  });
  window.addEventListener('resize', function(){ if (window.innerWidth > 980 && nav.classList.contains('is-open')) cerrar(); });
  window.addEventListener('pageshow', function(){ if (nav.classList.contains('is-open')) cerrar(); });
}

function initReveal(){
  const items = document.querySelectorAll('.rv:not(.in)');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)){ items.forEach(function(el){ el.classList.add('in'); }); return; }
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      const d = e.target.dataset.delay || 0;
      setTimeout(function(){ e.target.classList.add('in'); }, d);
      io.unobserve(e.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function(el){ io.observe(el); });
}

/* --------------------------------------------------------------------------
   9) DATOS Y ENLACES DESDE NEGOCIO
   data-neg="telefono"     -> escribe el texto (usa campoEn en inglés si existe)
   data-href="instagram"   -> tel:, mailto:, o URL; dato vacío = se oculta
   data-requiere="email"   -> oculta el bloque completo si el dato está vacío
   -------------------------------------------------------------------------- */
function initDatos(){
  document.querySelectorAll('[data-neg]').forEach(function(el){
    const v = L(NEGOCIO, el.dataset.neg);
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-requiere]').forEach(function(el){
    if (!NEGOCIO[el.dataset.requiere]) el.hidden = true;
  });
  document.querySelectorAll('[data-href]').forEach(function(el){
    const k = el.dataset.href;
    let v = NEGOCIO[k];
    if (k === 'tel') v = NEGOCIO.telefonoHref ? 'tel:' + NEGOCIO.telefonoHref : '';
    else if (k === 'email') v = NEGOCIO.email ? 'mailto:' + NEGOCIO.email : '';
    else if (k === 'resenas') v = NEGOCIO.googlePlaceId ? 'https://search.google.com/local/reviews?placeid=' + NEGOCIO.googlePlaceId : '';
    else if (k === 'escribir-resena') v = NEGOCIO.googlePlaceId ? 'https://search.google.com/local/writereview?placeid=' + NEGOCIO.googlePlaceId : '';
    else if (k === 'waze') v = NEGOCIO.lat ? 'https://waze.com/ul?ll=' + NEGOCIO.lat + ',' + NEGOCIO.lng + '&navigate=yes' : '';
    if (!v){ el.hidden = true; return; }
    el.setAttribute('href', v);
    if (/^https?:/.test(v)){ el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
  });
  document.querySelectorAll('[data-year]').forEach(function(y){ y.textContent = new Date().getFullYear(); });
}

document.addEventListener('DOMContentLoaded', function(){
  origenVisita();
  initDatos();
  initWhatsApp();
  initPlaceholders();
  initHeader();
  initReveal();
});
