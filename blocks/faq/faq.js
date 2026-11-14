/**
 * faq — question / answer pairs (D5: one row per Q/A). Cells: question (h3) | answer.
 * Reconstructive: each row becomes an item; the authored question and answer elements are
 * MOVED in (EW1). Static (always open), as on the source.
 * Schema: stardust/eds-schema/faq.json (section faq-sec)
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'faq-item';
    const [question, answer] = [...row.children];
    question?.classList.add('faq-question');
    answer?.classList.add('faq-answer');
  });
}
