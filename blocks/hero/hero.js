/**
 * hero — the home page hero: a full-screen photo with a three-line headline and one CTA.
 * Template-slotted: authored elements are MOVED into slots, never rebuilt (EW1).
 *
 * Authoring (one cell per row):
 *   row 1: image
 *   row 2: h1 (one line per Shift+Enter break; the last line gets the orange underline), CTA
 *
 * Schema: stardust/eds-schema/home.json (section hero)
 */
function markLastLine(heading) {
  const brs = heading.querySelectorAll('br');
  if (!brs.length) return;
  const last = brs[brs.length - 1];
  const nodes = [];
  let node = last.nextSibling;
  while (node) {
    nodes.push(node);
    node = node.nextSibling;
  }
  if (!nodes.some((n) => n.textContent.trim())) return;
  const span = document.createElement('span');
  span.className = 'hero-accent-line';
  last.after(span);
  span.append(...nodes);
}

export default function decorate(block) {
  const visual = document.createElement('div');
  visual.className = 'hero-visual';
  const content = document.createElement('div');
  content.className = 'hero-content';
  const headline = document.createElement('div');
  headline.className = 'hero-headline';
  const actions = document.createElement('div');
  actions.className = 'hero-actions';

  const picture = block.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    visual.append(picture.closest('p') || picture);
  }

  const heading = block.querySelector('h1, h2');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el === heading) headline.append(el);
      else if (el.querySelector('picture')) visual.append(el);
      else actions.append(el);
    });
  });

  if (heading) markLastLine(heading);
  content.append(...[headline, actions].filter((slot) => slot.children.length));
  block.replaceChildren(visual, content);
}
