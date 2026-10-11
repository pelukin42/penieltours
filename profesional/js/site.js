/* ==========================================================================
   Peniel Tours Flamingo — comportamiento del sitio (sin dependencias)
   - Idioma EN/ES: los textos traen su versión en español en data-es (y data-es-<atributo> para alt, placeholder, etc.)
   - Menú móvil, encabezado que se vuelve sólido, aparecer al hacer scroll
   - Formularios: no guardan nada, arman el mensaje y abren WhatsApp
   - Videos que se reproducen al verse, filtro de galería y visor de fotos
   - ?revisar en la dirección resalta lo que falta confirmar con el negocio
   ========================================================================== */
(function(){
  'use strict';

  var doc = document, root = doc.documentElement;
  var WA = (doc.querySelector('meta[name="wa-number"]') || {}).content || '50684716533';
  var LS = 'peniel_lang';
  var ATTRS = ['alt', 'title', 'placeholder', 'aria-label', 'content'];
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c){ return (c || doc).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function leer(){ try { return localStorage.getItem(LS); } catch (e) { return null; } }
  function guardar(v){ try { localStorage.setItem(LS, v); } catch (e) { /* almacenamiento bloqueado */ } }

  root.classList.add('js');

  /* ---------------- Idioma ---------------- */
  var lang = 'en';
  function detectar(){
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'es' || q === 'en') return q;
    var g = leer();
    if (g === 'es' || g === 'en') return g;
    return /^es/i.test(navigator.language || '') ? 'es' : 'en';
  }
  function waLink(texto){ return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto); }

  function aplicarIdioma(l){
    lang = l;
    root.lang = l;
    $$('[data-es]').forEach(function(el){
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = l === 'es' ? el.dataset.es : el.dataset.en;
    });
    ATTRS.forEach(function(a){
      var k = 'es' + a.replace(/(^|-)([a-z])/g, function(m, p, c){ return c.toUpperCase(); });
      var kEn = 'en' + k.slice(2);
      $$('[data-es-' + a + ']').forEach(function(el){
        if (el.dataset[kEn] === undefined) el.dataset[kEn] = el.getAttribute(a) || '';
        el.setAttribute(a, l === 'es' ? el.dataset[k] : el.dataset[kEn]);
      });
    });
    $$('[data-wa]').forEach(function(a){
      var t = l === 'es' && a.dataset.waEs ? a.dataset.waEs : a.dataset.wa;
      a.href = waLink(t);
      a.target = '_blank'; a.rel = 'noopener';
    });
    $$('.lang button').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false'); });
    $$('.burger').forEach(function(b){ b.setAttribute('aria-label', menuAbierto() ? (l === 'es' ? 'Cerrar menú' : 'Close menu') : (l === 'es' ? 'Abrir menú' : 'Open menu')); });
    doc.dispatchEvent(new CustomEvent('idioma', { detail: l }));
  }
  doc.addEventListener('click', function(e){
    var b = e.target.closest('.lang button[data-lang]');
    if (!b) return;
    guardar(b.dataset.lang);
    aplicarIdioma(b.dataset.lang);
  });

  /* ---------------- Encabezado y menú ---------------- */
  var hdr = $('.hdr'), nav = $('#nav'), burger = $('.burger');
  function menuAbierto(){ return !!(nav && nav.classList.contains('is-open')); }
  function solido(){ if (hdr && !hdr.classList.contains('hdr--solid')) hdr.classList.toggle('is-solid', window.scrollY > 40); }
  solido();
  window.addEventListener('scroll', solido, { passive: true });
  function cerrarMenu(){
    if (!nav) return;
    nav.classList.remove('is-open'); hdr.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', lang === 'es' ? 'Abrir menú' : 'Open menu');
    doc.body.style.overflow = '';
  }
  if (burger && nav){
    burger.addEventListener('click', function(){
      var abre = !menuAbierto();
      nav.classList.toggle('is-open', abre); hdr.classList.toggle('is-open', abre);
      burger.setAttribute('aria-expanded', abre ? 'true' : 'false');
      burger.setAttribute('aria-label', abre ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu'));
      doc.body.style.overflow = abre ? 'hidden' : '';
    });
    $$('a', nav).forEach(function(a){ a.addEventListener('click', cerrarMenu); });
    doc.addEventListener('keydown', function(e){ if (e.key === 'Escape' && menuAbierto()){ cerrarMenu(); burger.focus(); } });
    window.addEventListener('resize', function(){ if (window.innerWidth > 1020 && menuAbierto()) cerrarMenu(); });
  }

  /* ---------------- Aparecer al hacer scroll ---------------- */
  (function(){
    var items = $$('.rv');
    if (!items.length) return;
    if (quieto || !('IntersectionObserver' in window)){ items.forEach(function(el){ el.classList.add('in'); }); return; }
    var alto = window.innerHeight;
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function(el){
      if (el.getBoundingClientRect().top < alto * 0.92) el.classList.add('in'); else io.observe(el);
    });
  })();

  /* ---------------- Formularios -> WhatsApp ---------------- */
  var TXT = {
    en: { hi: 'Hi Peniel Tours!', tour: "I'd like details and pricing for: ", any: 'a tour (not sure yet)', people: 'People: ', date: 'Date: ',
          name: 'My name is ', phone: 'Phone: ', note: 'Note: ', group: "We're a group and would like a quote. ", sent: 'WhatsApp is opening with your message. If it did not open, ', tap: 'tap here' },
    es: { hi: '¡Hola Peniel Tours!', tour: 'Quisiera detalles y precios de: ', any: 'un tour (todavía no sé cuál)', people: 'Personas: ', date: 'Fecha: ',
          name: 'Me llamo ', phone: 'Teléfono: ', note: 'Nota: ', group: 'Somos un grupo y quisiéramos una cotización. ', sent: 'Se está abriendo WhatsApp con tu mensaje. Si no se abrió, ', tap: 'toca aquí' }
  };
  $$('form[data-wa-form]').forEach(function(f){
    var msg = $('.form__sent', f);
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var nombre = f.elements.nombre ? f.elements.nombre.value.trim() : '';
      var campo = f.elements.nombre ? f.elements.nombre.closest('.field') : null;
      if (campo) campo.classList.toggle('is-bad', !nombre);
      if (!nombre){ f.elements.nombre.focus(); return; }
      var t = TXT[lang], v = function(n){ return f.elements[n] ? f.elements[n].value.trim() : ''; };
      var sel = f.elements.tour, tour = '';
      if (sel && sel.value){ var op = sel.options[sel.selectedIndex]; tour = lang === 'es' && op.dataset.es ? op.dataset.es : (op.dataset.en || op.textContent); }
      var lineas = [t.hi + (f.dataset.waForm === 'group' ? ' ' + t.group : ' ')];
      lineas[0] = lineas[0].trim();
      lineas.push(t.tour + (tour || t.any));
      if (v('personas')) lineas.push(t.people + v('personas'));
      if (v('fecha')) lineas.push(t.date + v('fecha'));
      if (v('telefono')) lineas.push(t.phone + v('telefono'));
      lineas.push(t.name + nombre + '.');
      if (v('mensaje')) lineas.push(t.note + v('mensaje'));
      var url = waLink(lineas.join('\n'));
      if (msg){
        msg.innerHTML = t.sent + '<a href="' + url + '" target="_blank" rel="noopener">' + t.tap + '</a>.';
        msg.classList.add('is-on');
      }
      var w = window.open(url, '_blank', 'noopener');
      if (!w && !msg) location.href = url;
    });
  });
  doc.addEventListener('idioma', function(){ $$('.form__sent.is-on').forEach(function(m){ m.classList.remove('is-on'); }); });

  /* ---------------- Videos: se reproducen al verse ---------------- */
  (function(){
    var vs = $$('video[data-loop]');
    if (!vs.length) return;
    if (quieto || !('IntersectionObserver' in window)){
      vs.forEach(function(v){ v.controls = true; v.preload = 'metadata'; });
      return;
    }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){
        var v = en.target;
        if (en.isIntersecting){ var p = v.play(); if (p && p.catch) p.catch(function(){ v.controls = true; }); } else v.pause();
      });
    }, { threshold: 0.35 });
    vs.forEach(function(v){ io.observe(v); });
  })();

  /* ---------------- Galería: filtro y visor ---------------- */
  var filtros = $$('.filters button');
  var fotos = $$('.masonry a');
  filtros.forEach(function(b){
    b.addEventListener('click', function(){
      filtros.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      fotos.forEach(function(a){ a.classList.toggle('is-off', b.dataset.cat !== 'all' && a.dataset.cat !== b.dataset.cat); });
    });
  });
  var lb = $('#lb');
  if (lb && typeof lb.showModal === 'function'){
    var img = $('img', lb), cap = $('.lb__cap', lb), actual = 0, lista = [];
    var visibles = function(){ return fotos.filter(function(a){ return !a.classList.contains('is-off'); }); };
    var mostrar = function(i){
      actual = (i + lista.length) % lista.length;
      var a = lista[actual], im = $('img', a);
      img.src = a.getAttribute('href'); img.alt = im.alt; cap.textContent = im.alt;
    };
    fotos.forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        lista = visibles(); mostrar(lista.indexOf(a));
        lb.showModal();
      });
    });
    $('.lb__prev', lb).addEventListener('click', function(){ mostrar(actual - 1); });
    $('.lb__next', lb).addEventListener('click', function(){ mostrar(actual + 1); });
    $('.lb__close', lb).addEventListener('click', function(){ lb.close(); });
    lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft') mostrar(actual - 1);
      if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
  }

  /* ---------------- Modo revisión ---------------- */
  if (/(^|[?&])revisar(=|&|$)/.test(location.search)){
    root.classList.add('revisar');
    var marcas = $$('.confirmar');
    var bar = doc.createElement('div');
    bar.className = 'revisar-bar';
    bar.textContent = 'Modo revisión: ' + marcas.length + ' dato(s) por confirmar con Peniel Tours en esta página (subrayados en rojo; pasa el cursor para ver qué falta).';
    doc.body.appendChild(bar);
    marcas.forEach(function(m){ m.title = m.dataset.nota || ''; });
  }

  /* ---------------- Año del pie ---------------- */
  $$('[data-year]').forEach(function(y){ y.textContent = new Date().getFullYear(); });

  aplicarIdioma(detectar());
})();
