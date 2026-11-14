/**
 * page-hero — full-bleed photo hero for inner pages (about, contact, faq, inspiration, partners).
 * Template-slotted: authored elements are MOVED into slots, never rebuilt (EW1).
 *
 * Authoring (one cell per row):
 *   row 1: image
 *   row 2: eyebrow paragraph, h1 (one line per Shift+Enter break), lede paragraph(s), optional CTA
 *
 * The h1's lines render in three sizes (small / large / accent); each line is wrapped in a
 * span in place, so the authored h1 keeps its identity.
 * Schema: stardust/eds-schema/about.json (section hero)
 */

function wrapLines(heading) {
  const lines = [[]];
  [...heading.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') lines.push([]);
    else lines[lines.length - 1].push(node);
  });
  lines
    .filter((nodes) => nodes.some((n) => n.textContent.trim()))
    .forEach((nodes, i, all) => {
      const span = document.createElement('span');
      span.className = `page-hero-line page-hero-line-${i === 0 && all.length > 1 ? 'lead' : 'main'}`;
      if (i === all.length - 1 && all.length > 2) span.className = 'page-hero-line page-hero-line-accent';
      nodes[0].before(span);
      span.append(...nodes);
    });
}

export default function decorate(block) {
  const visual = document.createElement('div');
  visual.className = 'page-hero-visual';
  const content = document.createElement('div');
  content.className = 'page-hero-content';
  const eyebrow = document.createElement('div');
  eyebrow.className = 'page-hero-eyebrow';
  const headline = document.createElement('div');
  headline.className = 'page-hero-headline';
  const body = document.createElement('div');
  body.className = 'page-hero-body';

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
  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el === heading) headline.append(el);
      else if (el.querySelector('picture')) visual.append(el);
      else if (heading && !headline.contains(heading)) eyebrow.append(el);
      else body.append(el);
    });
  });

  if (heading) wrapLines(heading);
  content.append(...[eyebrow, headline, body].filter((slot) => slot.children.length));
  block.replaceChildren(visual, content);
}
