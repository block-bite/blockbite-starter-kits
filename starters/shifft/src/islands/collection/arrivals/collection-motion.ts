function mountCollection(section: HTMLElement) {
  const stage = section.querySelector<HTMLElement>('[data-collection-stage]');
  const track = section.querySelector<HTMLElement>('[data-collection-track]');
  const controls = section.querySelector<HTMLElement>('[data-collection-controls]');
  const previous = section.querySelector<HTMLButtonElement>('[data-collection-prev]');
  const next = section.querySelector<HTMLButtonElement>('[data-collection-next]');
  const counter = section.querySelector<HTMLElement>('[data-collection-counter]');
  if (!stage || !track || !controls || !previous || !next || !counter) return;

  const frames = Array.from(track.querySelectorAll<HTMLElement>('.collection-frame'));
  const last = frames.length - 1;
  if (last < 1) return;

  const wideMotion = matchMedia('(min-width: 54rem) and (min-height: 43rem) and (prefers-reduced-motion: no-preference)');
  const narrowMotion = matchMedia('(width < 54rem) and (prefers-reduced-motion: no-preference)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let frame = 0;
  let visible = false;

  const travel = () => Math.max(1, section.offsetHeight - stage.offsetHeight);
  const stageInset = () => parseFloat(getComputedStyle(stage).insetBlockStart) || 0;
  const railOffset = (card: Element) => {
    const gutter = parseFloat(getComputedStyle(track).scrollPaddingLeft);
    const start = card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft - gutter;
    return Math.max(0, Math.min(start, track.scrollWidth - track.clientWidth));
  };

  function show(position: number) {
    const selected = Math.round(position);
    if (selected !== active) {
      active = selected;
      counter.textContent = String(active + 1) + ' / ' + String(frames.length);
      previous.disabled = active === 0;
      next.disabled = active === last;
    }
    frames.forEach((card, index) => {
      const offset = index - position;
      card.style.setProperty('--offset', offset.toFixed(3));
      card.style.setProperty('--distance', Math.abs(offset).toFixed(3));
      card.style.zIndex = String(last - Math.abs(index - active));
      card.toggleAttribute('data-active', index === active);
    });
  }

  function update() {
    frame = 0;
    const rail = !wideMotion.matches && track.scrollWidth > track.clientWidth + 2;
    controls.hidden = reduced.matches || (!wideMotion.matches && !rail);
    if (wideMotion.matches) {
      const progress = Math.max(0, Math.min(1, (stageInset() - section.getBoundingClientRect().top) / travel()));
      show(progress * last);
    } else if (rail) {
      const distances = frames.map(card => Math.abs(railOffset(card) - track.scrollLeft));
      show(distances.indexOf(Math.min(...distances)));
    }
  }

  function schedule() {
    if (visible && frame === 0) frame = requestAnimationFrame(update);
  }

  function jump(index: number) {
    if (index < 0 || index > last || controls.hidden) return;
    if (wideMotion.matches) {
      const top = section.getBoundingClientRect().top + scrollY - stageInset() + travel() * index / last;
      scrollTo({ top, behavior: 'smooth' });
    } else {
      track.scrollTo({ left: railOffset(frames[index]), behavior: 'smooth' });
    }
  }

  function configure() {
    section.toggleAttribute('data-collection-motion', wideMotion.matches);
    section.toggleAttribute('data-collection-rail', narrowMotion.matches);
    if (wideMotion.matches) track.scrollLeft = 0;
    update();
  }

  previous.addEventListener('click', () => jump(active - 1));
  next.addEventListener('click', () => jump(active + 1));
  track.addEventListener('keydown', event => {
    if (event.target !== track || controls.hidden) return;
    const targets: Record<string, number> = {
      ArrowLeft: active - 1,
      ArrowRight: active + 1,
      Home: 0,
      End: last
    };
    const destination = targets[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    jump(destination);
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }, { rootMargin: '15% 0px' }).observe(section);

  wideMotion.addEventListener('change', configure);
  narrowMotion.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  track.addEventListener('scroll', schedule, { passive: true });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  configure();
}

for (const section of document.querySelectorAll<HTMLElement>('[data-collection]')) {
  mountCollection(section);
}
