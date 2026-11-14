import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  // ignore sections emptied by the metadata block (Robots: noindex)
  const sections = [...fragment.children]
    .filter((section) => section.textContent.trim() || section.querySelector('img'));

  if (sections.length > 1) {
    // rich footer: brand, link groups..., bottom line
    block.classList.add('footer-rich');
    const top = document.createElement('div');
    top.className = 'footer-top';
    const bottom = sections.pop();
    bottom.classList.add('footer-bottom');
    sections.forEach((section, i) => {
      section.classList.add(i === 0 ? 'footer-brand' : 'footer-group');
      top.append(section);
    });
    footer.append(top, bottom);
  } else {
    sections.forEach((section) => footer.append(section));
  }

  block.append(footer);
}
