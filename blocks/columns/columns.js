/**
 * columns — block-collection columns. Each row is one band of side-by-side cells.
 * A cell that holds only an image becomes the image column; in a text cell, the
 * paragraphs before the first heading are MOVED into an eyebrow wrapper (EW1/EW2).
 * Schema: stardust/eds-schema/about.json (section origin)
 */
function wrapEyebrow(cell) {
  const heading = cell.querySelector(':scope > :is(h1, h2, h3, h4)');
  if (!heading) return;
  const lead = [];
  let el = cell.firstElementChild;
  while (el && el !== heading) {
    if (el.tagName === 'P') lead.push(el);
    el = el.nextElementSibling;
  }
  if (!lead.length) return;
  const eyebrow = document.createElement('div');
  eyebrow.className = 'columns-eyebrow';
  heading.before(eyebrow);
  eyebrow.append(...lead);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        // picture is only content in column
        col.classList.add('columns-img-col');
      } else {
        col.classList.add('columns-text-col');
        wrapEyebrow(col);
      }
    });
  });
}
