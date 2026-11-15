import { getMetadata } from './aem.js';

/**
 * Page-level JSON-LD. The site-wide LocalBusiness + WebSite graph is server-rendered in
 * head.html; this adds the page node (type from the `schema` page metadata, default WebPage)
 * and its breadcrumb, and, for an FAQPage, the questions read from the page's faq block,
 * so the schema always matches what authors wrote.
 */
const SITE = 'https://www.poptopcocktails.ca';
const TYPES = ['WebPage', 'AboutPage', 'ContactPage', 'FAQPage', 'CollectionPage'];

function pageName() {
  return (getMetadata('og:title') || document.title).split(/\s[—|]\s/)[0].trim();
}

function faqEntities() {
  return [...document.querySelectorAll('main .faq .faq-item')].map((item) => ({
    '@type': 'Question',
    name: item.querySelector('.faq-question')?.textContent.trim(),
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.querySelector('.faq-answer')?.textContent.replace(/\s+/g, ' ').trim(),
    },
  })).filter((q) => q.name && q.acceptedAnswer.text);
}

export default function addStructuredData() {
  const type = TYPES.find((t) => t.toLowerCase() === getMetadata('schema').toLowerCase()) || 'WebPage';
  const url = `${SITE}${window.location.pathname}`;
  const crumbs = [{ name: 'Home', item: `${SITE}/` }];
  if (window.location.pathname !== '/') crumbs.push({ name: pageName(), item: url });

  const page = {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: getMetadata('og:title') || document.title,
    description: getMetadata('description'),
    inLanguage: 'en-CA',
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#business` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
    },
  };
  if (type === 'FAQPage') {
    const questions = faqEntities();
    if (questions.length) page.mainEntity = questions;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...page });
  document.head.append(script);
}
