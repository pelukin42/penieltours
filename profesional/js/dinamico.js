/* ==========================================================================
   Dinamismo al hacer scroll: las líneas y los planos se dibujan al llegar.

   No esconde texto ni hace entradas por sección: solo se trazan reglas,
   cotas, el trazo del pie y los dibujos de las líneas de trabajo (css/site.css,
   bloque "Se dibujan al llegar"). Solo se prepara lo que está fuera de la
   pantalla al cargar; lo que ya se ve queda como está.

   Sin JavaScript, con "reducir movimiento" o con la pestaña oculta no se
   hace nada y todo se ve ya dibujado.
   ========================================================================== */
(function(){
  'use strict';

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return;

  const OBJETIVOS = [
    '.tile__dibujo', '.ficha__lista', '.club-mini', '.lista-check', '.faq__list', '.horas',
    '.pasos-home', '.cierre__num', '.local__foto', '.ftr__trazo'
  ];
  // Dentro de estos contenedores, cada hijo lleva su número para escalonar el trazado
  const ESCALONAR = ['.tiles', '.pasos-home'];

  function preparar(){
    const alto = window.innerHeight;
    const lista = [];
    OBJETIVOS.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        // Lo que ya se ve al cargar no se esconde: así nunca hay un parpadeo
        if (el.getBoundingClientRect().top < alto * 0.92) return;
        lista.push(el);
      });
    });
    if (!lista.length) return;

    ESCALONAR.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(caja){
        Array.prototype.forEach.call(caja.children, function(hijo, i){
          hijo.style.setProperty('--i', i);
          const dib = hijo.querySelector('.tile__dibujo');
          if (dib) dib.style.setProperty('--i', i);
        });
        caja.style.setProperty('--i', 0);
      });
    });

    document.documentElement.classList.add('anim');
    lista.forEach(function(el){ el.classList.add('rv-pre'); });

    // Lo que arranca recortado (clip-path) no cuenta como visible para el observador: se vigila su contenedor
    const vigilados = new Map();
    lista.forEach(function(el){ vigilados.set(el.classList.contains('tile__dibujo') ? el.parentElement : el, el); });
    const ojo = new IntersectionObserver(function(entradas){
      entradas.forEach(function(en){
        if (!en.isIntersecting) return;
        const el = vigilados.get(en.target);
        el.classList.remove('rv-pre');
        el.classList.add('rv-on');
        ojo.unobserve(en.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    vigilados.forEach(function(el, vigilado){ ojo.observe(vigilado); });

    // Al imprimir, todo se ve dibujado
    window.addEventListener('beforeprint', function(){
      lista.forEach(function(el){ el.classList.remove('rv-pre'); el.classList.add('rv-on'); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preparar);
  else preparar();
})();
