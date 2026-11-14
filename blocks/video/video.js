/**
 * video — built by buildVideoAutoBlocks() from an authored root-relative `.mp4` link.
 * Plays muted, looping and inline like the source; the <video> mounts after first paint so it
 * never delays FCP/LCP (#157). The authored link stays in place until then.
 * Reduced motion: the video does not autoplay and shows its controls instead.
 */
function afterFirstPaint(fn) {
  const painted = (l) => l.getEntriesByName('first-contentful-paint').length > 0;
  if (painted(performance)) { fn(); return; }
  if (!window.PerformanceObserver?.supportedEntryTypes?.includes('paint')) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn, { once: true });
    return;
  }
  const po = new PerformanceObserver((l) => { if (painted(l)) { po.disconnect(); fn(); } });
  po.observe({ type: 'paint', buffered: true });
}

export default function decorate(block) {
  const link = block.querySelector('a[href$=".mp4"]');
  if (!link) return;
  let url;
  try {
    url = new URL(link.href, window.location);
  } catch {
    return;
  }
  if (url.origin !== window.location.origin || !url.pathname.endsWith('.mp4')) return;
  const box = document.createElement('div');
  box.className = 'video-box';
  block.replaceChildren(box);
  box.append(link);
  afterFirstPaint(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const video = document.createElement('video');
    Object.assign(video, {
      src: url.pathname, muted: true, loop: true, playsInline: true, autoplay: !reduce,
    });
    video.controls = reduce;
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('aria-label', link.textContent.trim() || 'Video');
    link.replaceWith(video);
  });
}
