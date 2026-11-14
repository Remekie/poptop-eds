/**
 * quote — block-collection quote: row 1 = quotation, row 2 = attribution.
 * Template-slotted: authored paragraphs are MOVED into a blockquote and a caption (EW1).
 * The five stars are decoration drawn in CSS, so no words are added to the page.
 * Schema: stardust/eds-schema/about.json (section review)
 */
export default function decorate(block) {
  const [quoteRow, attrRow] = [...block.children];
  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');
  if (quoteRow) blockquote.append(...quoteRow.querySelector(':scope > div').childNodes);
  figure.append(blockquote);
  if (attrRow) {
    const caption = document.createElement('figcaption');
    caption.append(...attrRow.querySelector(':scope > div').childNodes);
    figure.append(caption);
  }
  block.replaceChildren(figure);
}
