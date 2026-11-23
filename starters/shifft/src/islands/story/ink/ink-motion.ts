import { createInkRenderer } from './ink-shader';

function mountInk(section: HTMLElement, image: HTMLImageElement) {
  const motion = matchMedia('(min-width: 54rem) and (prefers-reduced-motion: no-preference)');
  const canvas = document.createElement('canvas');
  canvas.className = 'ink-canvas';
  let renderer: ReturnType<typeof createInkRenderer>;
  let visible = false;
  let generation = 0;
  let frame = 0;

  function draw() {
    frame = 0;
    if (!renderer) return;
    const plate = section.getBoundingClientRect();
    const travel = innerHeight * 0.46;
    const progress = Math.max(0, Math.min(1, (travel - plate.top) / travel));
    renderer.draw(progress);
    section.dataset.inkProgress = progress.toFixed(3);
  }

  function schedule() {
    if (renderer && visible && !document.hidden && frame === 0) frame = requestAnimationFrame(draw);
  }

  function stop() {
    generation++;
    cancelAnimationFrame(frame);
    frame = 0;
    renderer?.dispose();
    renderer = null;
    delete section.dataset.inkState;
    delete section.dataset.inkProgress;
  }

  async function start() {
    if (!motion.matches || !visible || renderer) return;
    const current = ++generation;
    try {
      await image.decode();
      if (current !== generation || !motion.matches || !visible) return;
      if (!canvas.isConnected) image.after(canvas);
      renderer = createInkRenderer(canvas, image);
      if (!renderer) return;
      draw();
      section.dataset.inkState = 'ready';
    } catch {
      stop();
    }
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      void start();
      schedule();
    }
  }, { rootMargin: '12% 0px' }).observe(section);

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => motion.matches ? void start() : stop());
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    stop();
  });
  canvas.addEventListener('webglcontextrestored', () => void start());
}

for (const section of document.querySelectorAll<HTMLElement>('[data-ink]')) {
  const image = section.querySelector<HTMLImageElement>('img.ink-print');
  if (image) mountInk(section, image);
}
