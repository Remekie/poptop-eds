/**
 * cards — block-collection cards: one row per card, cells = [image?] [body].
 * The authored picture is kept as-is (the pipeline already emits a responsive picture;
 * replacing it would drop its editor index, EW1). Paragraphs before the card heading are
 * MOVED into an eyebrow wrapper.
 * @variants block: numbered | overlay | image | compact (default: plain grid)
 * Schema: stardust/eds-schema/about.json (section services)
 */
function wrapEyebrow(body) {
  const heading = body.querySelector(':scope > :is(h2, h3, h4)');
  if (!heading) return;
  const lead = [];
  let el = body.firstElementChild;
  while (el && el !== heading) {
    if (el.tagName === 'P') lead.push(el);
    el = el.nextElementSibling;
  }
  if (!lead.length) return;
  const eyebrow = document.createElement('div');
  eyebrow.className = 'cards-card-eyebrow';
  heading.before(eyebrow);
  eyebrow.append(...lead);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        wrapEyebrow(div);
      }
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
