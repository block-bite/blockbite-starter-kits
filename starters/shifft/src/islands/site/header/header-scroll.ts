const header = document.querySelector<HTMLElement>('.site-header');

if (header) {
  const update = () => {
    header.toggleAttribute('data-scrolled', window.scrollY > 16);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  header.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element) || !event.target.closest('a[href="#top"]')) return;

    // Finish the native top jump even when it interrupts a smooth carousel scroll.
    requestAnimationFrame(() => {
      if (location.hash === '#top' && scrollY > 0) window.scrollTo(0, 0);
    });
  });
}
