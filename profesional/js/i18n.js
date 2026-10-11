/* ==========================================================================
   Versión bilingüe (opción del Plan Pro) — MOTOR, igual para todos los sitios
   Los textos en inglés viven en js/en.js (se carga antes que este archivo).
   El HTML está escrito en español. Cada texto traducible lleva
   data-i18n="clave" (contenido) o data-i18n-attr="atributo:clave".
   Las notas de la propuesta (demo.*) quedan en español a propósito.
   Idioma: ?lang=en en la URL, o el botón ES/EN (se recuerda en el navegador).
   ========================================================================== */

const BILINGUE = true;   // false = sitio solo en español y sin selector de idioma

(function(){
  'use strict';
  const CLAVE = 'sitio_lang';

  function leer(){ try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v){ try { localStorage.setItem(CLAVE, v); } catch (e) { /* almacenamiento bloqueado */ } }

  function aplicar(lang){
    const en = lang === 'en';
    document.documentElement.lang = en ? 'en' : 'es';
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      if (el.dataset.i18nEs === undefined) el.dataset.i18nEs = el.innerHTML;
      const k = el.dataset.i18n;
      el.innerHTML = (en && typeof I18N_EN !== 'undefined' && I18N_EN[k] !== undefined) ? I18N_EN[k] : el.dataset.i18nEs;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function(el){
      el.dataset.i18nAttr.split(';').forEach(function(par){
        const p = par.split(':');
        const attr = p[0].trim(), k = (p[1] || '').trim();
        const store = 'i18nEs' + attr.replace(/[^a-z]/gi, '');
        if (el.dataset[store] === undefined) el.dataset[store] = el.getAttribute(attr) || '';
        el.setAttribute(attr, (en && typeof I18N_EN !== 'undefined' && I18N_EN[k] !== undefined) ? I18N_EN[k] : el.dataset[store]);
      });
    });
    const burger = document.querySelector('.burger');
    if (burger) burger.setAttribute('aria-label', burger.getAttribute('aria-expanded') === 'true'
      ? (en ? 'Close menu' : 'Cerrar menú') : (en ? 'Open menu' : 'Abrir menú'));
    document.querySelectorAll('.lang button').forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.lang === (en ? 'en' : 'es') ? 'true' : 'false');
    });
    const og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute('content', en ? 'en_US' : 'es_CR');
  }

  if (!BILINGUE){
    document.querySelectorAll('.lang').forEach(function(el){ el.hidden = true; });
    return;
  }

  const url = new URLSearchParams(location.search).get('lang');
  const inicial = (url === 'en' || url === 'es') ? url : (leer() === 'en' ? 'en' : 'es');
  if (inicial === 'en') aplicar('en');

  document.addEventListener('click', function(e){
    const b = e.target.closest('.lang button[data-lang]');
    if (!b) return;
    const lang = b.dataset.lang;
    if (document.documentElement.lang === lang) return;
    guardar(lang);
    aplicar(lang);
    document.dispatchEvent(new CustomEvent('sitio:lang', { detail: { lang: lang } }));
  });
})();
