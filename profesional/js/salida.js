/* ==========================================================================
   La salida (solo portada): elegís cuánto tiempo querés estar en el agua y la
   carta del día se dibuja a escala de horas. La barra naranja mide la salida,
   el barco se corre hasta el final de la barra y el sol marca si es de
   mañana, de tarde o de día entero.

   Lo que se mueve es parte del dibujo (css/site.css, bloque «La carta del día»):
   - Al cargar se traza: se abre la regla, crece la barra, llega el barco y
     sale el sol. Después el barco se mece solo.
   - Al cambiar de salida, el barco avanza, el sol se corre y la barra se estira.
   - Quien pide "reducir movimiento" ve la carta final, quieta.

   Datos: duración, mañana/tarde y capacidad salen del perfil público de
   Peniel Tours en FishingBooker (11-oct-2026). No hay precios publicados por
   el negocio: el botón pide la cotización por WhatsApp con la salida adentro.
   Depende de core.js (NEGOCIO, L, esc, waLink).
   ========================================================================== */
(function(){
  'use strict';

  const form = document.getElementById('medida');
  const dibujo = document.getElementById('plano-dibujo');
  if (!form || !dibujo || typeof NEGOCIO === 'undefined') return;

  const lienzo = document.getElementById('plano');
  const estado = document.getElementById('medida-estado');
  const rotulo = document.getElementById('medida-cta');
  const boton = document.getElementById('medida-wa');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

  const X0 = 22, HORA = 28, MAXH = 8;       // la regla: 8 horas de 28 unidades, desde x = 22
  const LARGO = MAXH * HORA;                // 224
  const SOL = { manana: [42, 98], tarde: [258, 98], dia: [150, 64] };
  const salidas = NEGOCIO.servicios.filter(function(s){ return s.horas; });
  if (!salidas.length) return;
  const capacidad = NEGOCIO.barco && NEGOCIO.barco.capacidad;

  /* ---------------- Geometría (se arma una sola vez) ---------------- */
  function ola(y, fase){
    let d = 'M' + (-20 + fase) + ' ' + y + ' q9 -5 18 0';
    for (let i = 0; i < 17; i++) d += ' t18 0';
    return d;
  }

  function construir(){
    let marcas = '', cifras = '';
    for (let h = 0; h <= MAXH; h++){
      const x = X0 + h * HORA, par = h % 2 === 0;
      marcas += '<line class="sd-marca" x1="' + x + '" x2="' + x + '" y1="' + (par ? 201 : 204) + '" y2="' + (par ? 217 : 214) + '"/>';
      if (par) cifras += '<text class="sd-horas" x="' + x + '" y="230">' + h + '</text>';
    }
    const sol = '<g class="sd-sol"><circle r="12"/>' +
      [0, 45, 90, 135, 180, 225, 270, 315].map(function(a){
        const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
        return '<line x1="' + (c * 17).toFixed(1) + '" y1="' + (s * 17).toFixed(1) + '" x2="' + (c * 22).toFixed(1) + '" y2="' + (s * 22).toFixed(1) + '"/>';
      }).join('') + '</g>';
    const barco = '<g class="sd-barco"><g class="sd-barco__in">' +
      '<path class="sd-trazo" d="M3 -12 L-13 -29 M-13 -29 Q-19 -14 -21 0"/>' +
      '<path class="sd-trazo" d="M30 -30 L-8 -47"/>' +
      '<path class="sd-trazo" d="M27 -30 V-44"/>' +
      '<path class="sd-casco" d="M0 -12 L58 -12 L70 -17 L55 0 L8 0 Z"/>' +
      '<path class="sd-cabina" d="M13 -12 V-23 H40 L46 -12 Z"/>' +
      '<path class="sd-cabina" d="M19 -23 V-30 H34 V-23 Z"/>' +
      '<path class="sd-trazo" d="M19 -18 H37"/>' +
      '</g></g>';
    dibujo.innerHTML =
      '<rect class="sd-mar" x="0" y="118" width="300" height="62"/>' +
      '<line class="sd-horizonte" x1="0" y1="118" x2="300" y2="118"/>' +
      '<g class="sd-olas"><path class="sd-ola" d="' + ola(138, 0) + '"/><path class="sd-ola" d="' + ola(154, 9) + '"/><path class="sd-ola" d="' + ola(170, 4) + '"/></g>' +
      sol +
      '<line class="sd-estela" x1="' + X0 + '" y1="136" x2="' + (X0 + LARGO) + '" y2="136"/>' +
      barco +
      '<g class="sd-cota-v"><line class="sd-cota" x1="0" x2="0" y1="142" y2="199"/></g>' +
      '<line class="sd-regla" x1="' + X0 + '" y1="208" x2="' + (X0 + LARGO) + '" y2="208"/>' +
      '<rect class="sd-barra" x="' + X0 + '" y="203" width="' + LARGO + '" height="10"/>' +
      marcas + cifras +
      '<text class="sd-num" id="sd-n" x="' + X0 + '" y="282">4</text>' +
      '<text class="sd-unidad" id="sd-u" x="' + (X0 + 36) + '" y="282"></text>' +
      '<text class="sd-franja" id="sd-f" x="278" y="282"></text>';
  }
  construir();
  const num = document.getElementById('sd-n');
  const unidad = document.getElementById('sd-u');
  const franja = document.getElementById('sd-f');

  /* ---------------- Estado ---------------- */
  function actual(){
    const r = form.querySelector('input[name="salida"]:checked');
    const id = r ? r.value : salidas[0].id;
    return salidas.filter(function(s){ return s.id === id; })[0] || salidas[0];
  }

  function pintar(){
    const s = actual(), h = s.horas;
    const cx = X0 + h * HORA;
    const pos = SOL[s.franja] || SOL.dia;
    lienzo.style.setProperty('--bx', String(cx - 33));
    lienzo.style.setProperty('--cx', String(cx));
    lienzo.style.setProperty('--k', String(h / MAXH));
    lienzo.style.setProperty('--e', String(Math.max(0, (h * HORA - 33) / LARGO)));
    lienzo.style.setProperty('--sx', String(pos[0]));
    lienzo.style.setProperty('--sy', String(pos[1]));

    num.textContent = h;
    unidad.textContent = L('horas', 'hours');
    franja.textContent = L(s, 'rotulo');

    const nombre = L(s, 'nombre');
    const enAgua = L(h + ' horas en el agua', h + ' hours on the water');
    const cupo = capacidad ? L(', para hasta ' + capacidad + ' personas.', ', for up to ' + capacidad + ' people.') : '.';
    estado.innerHTML = '<b>' + esc(nombre) + '</b>: ' + esc(enAgua + cupo);
    estado.classList.remove('is-nuevo');
    void estado.offsetWidth;
    estado.classList.add('is-nuevo');

    rotulo.textContent = L('Cotizar esta salida por WhatsApp', 'Get a quote for this trip on WhatsApp');
    const msg = L('Hola ' + NEGOCIO.nombre + ', quiero cotizar una salida de pesca: ' + nombre + ' (' + h + ' horas). Somos ___ personas y queremos ir el ___.',
                  'Hi ' + NEGOCIO.nombre + ', I would like a quote for a fishing trip: ' + nombre + ' (' + h + ' hours). There are ___ of us and we would like to go on ___.');
    boton.setAttribute('href', waLink(msg));
    boton.setAttribute('target', '_blank');
    boton.setAttribute('rel', 'noopener');
  }

  /* ---------------- Arranque ---------------- */
  const pre = new URLSearchParams(location.search).get('salida');
  if (pre){
    const r = form.querySelector('input[name="salida"][value="' + pre.replace(/[^a-z-]/g, '') + '"]');
    if (r) r.checked = true;
  }
  const intro = !quieto.matches && !document.hidden;
  if (intro){
    lienzo.classList.add('sd-intro');
    const fin = function(){ lienzo.classList.remove('sd-intro'); };
    setTimeout(fin, 2600);
    form.addEventListener('change', fin, { once: true });
  }
  pintar();
  form.addEventListener('change', pintar);
  form.addEventListener('submit', function(e){ e.preventDefault(); });
  document.addEventListener('sitio:lang', pintar);
})();
