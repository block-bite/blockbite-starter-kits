const motion = matchMedia('(prefers-reduced-motion: no-preference)');

if (motion.matches) {
  for (const video of document.querySelectorAll<HTMLVideoElement>('video[data-campaign-src]')) {
    const source = video.dataset.campaignSrc;
    if (!source) continue;

    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    video.addEventListener('error', () => video.classList.remove('is-playing'));
    video.muted = true;
    video.src = source;
    void video.play().catch(() => {
      // Autoplay restrictions leave the campaign image in place.
    });
  }
}
