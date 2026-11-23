function mountCampaignStripe(campaign: HTMLElement) {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  let frame = 0;
  let previous = -1;

  function paint() {
    frame = 0;
    const travel = Math.min(campaign.offsetHeight, innerHeight) * .48;
    const progress = Math.max(0, Math.min(1, -campaign.getBoundingClientRect().top / travel));
    if (progress === previous) return;
    previous = progress;
    campaign.style.setProperty('--campaign-ink-front', `${68 + progress * 47}%`);
    campaign.style.setProperty('--campaign-ink-shift', `${2 - progress * 14}%`);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function configure() {
    if (motion.matches) {
      paint();
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', schedule);
      return;
    }
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
    cancelAnimationFrame(frame);
    frame = 0;
    previous = -1;
    campaign.style.removeProperty('--campaign-ink-front');
    campaign.style.removeProperty('--campaign-ink-shift');
  }

  motion.addEventListener('change', configure);
  configure();
}

const campaign = document.querySelector<HTMLElement>('#campaign');
if (campaign) mountCampaignStripe(campaign);
