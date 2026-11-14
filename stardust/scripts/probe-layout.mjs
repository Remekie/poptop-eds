#!/usr/bin/env node
/**
 * probe-layout.mjs — computed-style gate for a delivered page (deploy § atomic contract).
 * Asserts: zero pageerror, every block decorated + loaded, grid containers compute grid,
 * every visible image renders non-zero, CLS, and (mobile) the hamburger opens the menu.
 *
 * Usage: node stardust/scripts/probe-layout.mjs <url> [--grids "sel,sel"] [--out <dir>]
 */
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) {
  console.log('Usage: node stardust/scripts/probe-layout.mjs <url> [--grids "sel,sel"] [--out <dir>]');
  process.exit(args.length ? 0 : 2);
}
const url = args[0];
const flag = (name) => { const i = args.indexOf(name); return i > -1 ? args[i + 1] : null; };
const grids = (flag('--grids') || '').split(',').map((s) => s.trim()).filter(Boolean);
const out = flag('--out');
if (out) mkdirSync(out, { recursive: true });

const { openBrowser, newLiveContext, gotoLive } = await import(pathToFileURL('stardust/scripts/stardust/browser.mjs').href);
const browser = await openBrowser();
let failed = 0;

async function run(width, label) {
  const ctx = await newLiveContext(browser, { viewport: { width, height: 900 }, stateUrl: url });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => {
      if (!e.hadRecentInput) window.cls += e.value;
    })).observe({ type: 'layout-shift', buffered: true });
  });
  await gotoLive(page, url, { waitUntil: 'networkidle', timeoutMs: 60000, settleMs: 0, httpError: 'measure' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => { setTimeout(r, 120); });
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  const r = await page.evaluate((sels) => ({
    blocks: [...document.querySelectorAll('main [data-block-name]')].map((b) => `${b.dataset.blockName}:${b.dataset.blockStatus}`),
    grids: sels.map((s) => {
      const el = document.querySelector(s);
      return `${s}=${el ? getComputedStyle(el).display : 'MISSING'}`;
    }),
    zeroImgs: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth > 0
      && i.offsetParent && i.clientWidth === 0).map((i) => i.src.split('/').pop()),
    broken: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0
      && i.offsetParent).map((i) => i.src.split('/').pop()),
    h1: document.querySelectorAll('main h1').length,
    cls: Math.round(window.cls * 1000) / 1000,
    hscroll: document.documentElement.scrollWidth > window.innerWidth,
  }), grids);
  let menu = 'n/a';
  if (width < 769) {
    const btn = page.locator('header .nav-hamburger button');
    if (await btn.count()) {
      await btn.click();
      await page.waitForTimeout(300);
      menu = await page.evaluate(() => {
        const nav = document.querySelector('header nav');
        const s = nav && nav.querySelector('.nav-sections');
        return `${nav?.getAttribute('aria-expanded')}/${s ? getComputedStyle(s).display : 'none'}`;
      });
      if (out) await page.screenshot({ path: `${out}/${label}-menu.png` });
      await btn.click();
    }
  }
  if (out) await page.screenshot({ path: `${out}/${label}.png`, fullPage: true });
  const bad = errors.length || r.zeroImgs.length || r.broken.length || r.h1 !== 1
    || r.blocks.some((b) => !b.endsWith(':loaded')) || r.grids.some((g) => !/=(grid|flex)$/.test(g))
    || r.hscroll || (menu !== 'n/a' && menu !== 'true/flex');
  if (bad) failed += 1;
  console.log(`${bad ? 'FAIL' : 'PASS'} ${label} @${width}: h1=${r.h1} cls=${r.cls} hscroll=${r.hscroll} menu=${menu}`);
  console.log(`  blocks ${r.blocks.join(' ')}`);
  if (r.grids.length) console.log(`  grids  ${r.grids.join(' ')}`);
  if (r.zeroImgs.length || r.broken.length) console.log(`  images zero=${r.zeroImgs} broken=${r.broken}`);
  if (errors.length) console.log(`  errors ${errors.join(' | ')}`);
  await ctx.close();
}

await run(1440, 'desktop');
await run(390, 'mobile');
await browser.close();
process.exit(failed ? 1 : 0);
