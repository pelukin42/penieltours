/* Prueba funcional del sitio con Playwright (Chromium).
   Uso:  python3 -m http.server 5538 --bind 127.0.0.1   (en una terminal)
         node scripts/probar.js                          (en otra)
   Revisa en cada página: errores de JavaScript y desborde horizontal a 390 px.
   Prueba además la portada (una salida por opción, ES y EN), el cotizador, la reserva y «ya reservé»,
   y que cada solicitud arme su mensaje de WhatsApp completo. Salida: una línea por revisión; termina con código 1 si algo falla. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:5538/profesional/';
const PAGINAS = ['index.html', 'servicios.html', 'agendar.html', 'links.html'];
let fallos = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FALLA ') + m); if (!c) fallos++; };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  for (const pg of PAGINAS) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + pg); await p.waitForTimeout(700);
    ok(!errs.length, pg + ' sin errores de JavaScript' + (errs.length ? ': ' + errs.join('; ') : ''));
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= 390), pg + ' sin desborde horizontal a 390 px');
    await p.close();
  }
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => { window.open = u => { (window.__ab = window.__ab || []).push(decodeURIComponent(u)); return null; }; });
  const p = await ctx.newPage();
  const ab = () => p.evaluate(() => window.__ab || []);

  await p.goto(BASE + 'index.html'); await p.waitForTimeout(600);
  for (const [v, h] of [['medio-dia-manana', 4], ['medio-dia-tarde', 4], ['tres-cuartos', 6], ['dia-completo', 8]]) {
    await p.click(`input[value="${v}"] + span`); await p.waitForTimeout(120);
    const href = decodeURIComponent(await p.getAttribute('#medida-wa', 'href'));
    ok(href.includes('(' + h + ' horas)'), 'portada: ' + v + ' arma el mensaje con ' + h + ' horas');
  }
  await p.click('.lang button[data-lang="en"]'); await p.waitForTimeout(250);
  ok(/on the water/.test(await p.textContent('#medida-estado')), 'portada: el inglés traduce el estado de la salida');
  await p.click('.lang button[data-lang="es"]');   // el idioma se recuerda: se vuelve a español para el resto

  await p.goto(BASE + 'agendar.html#cotizar'); await p.waitForTimeout(500);
  await p.click('[data-render="cot-objetivos"] .chip >> nth=0');
  for (const n of [2, 3, 4]) {
    if (n === 4) await p.click('[data-render="cot-sugeridos"] label >> nth=0');
    await p.click(`[data-paso="${n - 1}"] [data-ir="${n}"]`); await p.waitForTimeout(120);
  }
  await p.click('[data-render="cot-presupuestos"] .chip >> nth=0');
  await p.fill('#co-nombre', 'Prueba');
  await p.click('#form-cotizar button[type="submit"]'); await p.waitForTimeout(250);
  ok(/Presupuesto: /.test((await ab())[0] || ''), 'cotizador: el mensaje de WhatsApp lleva el presupuesto');

  await p.click('[data-tab="agendar"]'); await p.waitForTimeout(150);
  await p.selectOption('#ci-servicio', 'dia-completo');
  await p.check('input[name="personas"][value="4"]', { force: true });
  await p.fill('#ci-nombre', 'Prueba');
  await p.click('#form-cita button[type="submit"]'); await p.waitForTimeout(250);
  const cita = (await ab())[1] || '';
  ok(/Día completo/.test(cita) && /Personas: 4/.test(cita), 'reserva: el mensaje lleva la salida y las personas');

  await p.click('[data-tab="seguimiento"]'); await p.waitForTimeout(150);
  await p.selectOption('#sg-trat', 'tres-cuartos');
  await p.click('[data-seg="reprogramar"]');
  ok(/cambiar la fecha/.test((await ab())[2] || ''), 'ya reservé: cambiar la fecha arma su mensaje');
  await b.close();
  process.exit(fallos ? 1 : 0);
})();
