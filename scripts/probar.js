/* Prueba funcional del sitio con Playwright (Chromium).
   Uso:  python3 -m http.server 5538 --bind 127.0.0.1      (en una terminal, desde la raíz del repositorio)
         node scripts/probar.js                              (en otra)
   Variables: BASE (por defecto http://127.0.0.1:5538/profesional/), PLAYWRIGHT_PATH, CHROMIUM (ruta del navegador).
   Revisa: errores de JavaScript, desborde horizontal a 390 px, imágenes rotas, enlaces internos, idioma ES/EN,
   enlaces de WhatsApp, formularios, filtro y visor de la galería y el menú del celular. Termina con código 1 si algo falla. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:5538/profesional/';
const PAGINAS = ['index.html', 'tours.html', 'gallery.html', 'contact.html', 'links.html', '404.html'];
let fallos = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FALLA ') + m); if (!c) fallos++; };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  for (const ancho of [390, 1366]) {
    for (const pg of PAGINAS) {
      const ctx = await b.newContext({ viewport: { width: ancho, height: 800 }, locale: 'en-US' });
      const p = await ctx.newPage();
      const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      p.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE.slice(0, 22))) errs.push(r.status() + ' ' + r.url().replace(BASE, '')); });
      await p.goto(BASE + pg); await p.waitForTimeout(500);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
      const rotas = await p.evaluate(() => [...document.images].filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')));
      ok(!errs.length && !rotas.length, `${pg} @${ancho}: sin errores ni imágenes rotas ${errs.concat(rotas).join(' | ')}`);
      ok(await p.evaluate(w => document.documentElement.scrollWidth <= w, ancho), `${pg} @${ancho}: sin desborde horizontal`);
      await ctx.close();
    }
  }
  // enlaces internos
  {
    const p = await (await b.newContext()).newPage();
    const hrefs = new Set();
    for (const pg of PAGINAS) {
      await p.goto(BASE + pg);
      (await p.$$eval('a[href]', a => a.map(x => x.getAttribute('href')))).forEach(h => { if (!/^(https?:|tel:|mailto:|#)/.test(h)) hrefs.add(h.split('#')[0]); });
    }
    let malos = [];
    for (const h of hrefs) { if (!h) continue; const r = await p.request.get(BASE + h); if (r.status() >= 400) malos.push(h); }
    ok(!malos.length, 'enlaces internos válidos ' + malos.join(', '));
  }

  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, locale: 'en-US' });
  await ctx.addInitScript(() => { window.open = u => { (window.__ab = window.__ab || []).push(decodeURIComponent(u)); return null; }; });
  const p = await ctx.newPage();
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(400);
  const wa = await p.$$eval('[data-wa]', a => a.map(x => x.href));
  ok(wa.length > 5 && wa.every(h => h.startsWith('https://wa.me/50684716533?text=')), 'todos los botones de WhatsApp apuntan a 50684716533 (' + wa.length + ')');
  ok(await p.getAttribute('html', 'lang') === 'en', 'idioma inicial en inglés con navegador en inglés');
  await p.click('.lang button[data-lang="es"]'); await p.waitForTimeout(200);
  ok(/Tours de aventura/i.test(await p.textContent('h1')), 'el botón ES traduce el título');
  ok(/Hola Peniel Tours/.test(decodeURIComponent(await p.getAttribute('.hdr__cta', 'href'))), 'el botón ES cambia el mensaje de WhatsApp');
  ok((await p.getAttribute('.card img', 'alt')).length > 5, 'las fotos traen texto alternativo');

  // formulario de grupo en español
  await p.fill('#group-nombre', 'Ana'); await p.selectOption('#group-tour', 'atv'); await p.fill('#group-personas', '5');
  await p.click('#group-nombre ~ *', { trial: true }).catch(() => {});
  await p.click('form[data-wa-form="group"] button[type="submit"]'); await p.waitForTimeout(200);
  const msg = (await p.evaluate(() => window.__ab || []))[0] || '';
  ok(/Tours en ATV/.test(msg) && /Personas: 5/.test(msg) && /Me llamo Ana/.test(msg), 'formulario de grupo arma el mensaje en español: ' + msg.replace(/\n/g, ' / ').slice(0, 120));
  await p.fill('#group-nombre', ''); await p.click('form[data-wa-form="group"] button[type="submit"]'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => document.querySelector('#group-nombre').closest('.field').classList.contains('is-bad')), 'el formulario pide el nombre');

  // galería: filtro y visor
  await p.goto(BASE + 'gallery.html'); await p.waitForTimeout(400);
  const total = await p.$$eval('.masonry a', a => a.length);
  await p.click('.filters button[data-cat="wild"]');
  const vis = await p.$$eval('.masonry a:not(.is-off)', a => a.length);
  ok(vis > 0 && vis < total, `filtro de galería: ${vis} de ${total}`);
  await p.click('.masonry a:not(.is-off) >> nth=0'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.getElementById('lb').open), 'el visor abre una foto');
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  ok(!(await p.evaluate(() => document.getElementById('lb').open)), 'Escape cierra el visor');

  // contacto: modo revisión
  await p.goto(BASE + 'contact.html?revisar'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.documentElement.classList.contains('revisar') && document.querySelectorAll('.confirmar').length > 0), '?revisar resalta lo que falta confirmar');

  // menú del celular
  const m = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage();
  await m.goto(BASE + 'index.html'); await m.waitForTimeout(300);
  await m.click('.burger'); await m.waitForTimeout(300);
  ok(await m.evaluate(() => document.getElementById('nav').classList.contains('is-open')), 'el menú del celular abre');
  await m.click('#nav a[href="tours.html"] >> nth=0'); await m.waitForTimeout(300);
  ok(/tours\.html/.test(m.url()), 'el menú navega a Tours');
  await b.close();
  process.exit(fallos ? 1 : 0);
})();
