/** Ordinary browser behavior; content and appearance stay in Astro and Tailwind. */
class MietteNavigation extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    this.dispose?.();
    const dialog = this.querySelector('dialog');
    const trigger = this.querySelector<HTMLButtonElement>('[data-menu-open]');
    const closeButton = this.querySelector<HTMLButtonElement>('[data-menu-close]');
    if (!dialog || !trigger || !closeButton) return;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    let animation: Animation | undefined;
    let closing = false;
    let scrollWasLocked: boolean | undefined;

    const unlock = () => {
      if (scrollWasLocked === false) document.documentElement.classList.remove('overflow-hidden');
      scrollWasLocked = undefined;
      trigger.setAttribute('aria-expanded', 'false');
    };
    const closeNow = () => {
      animation?.cancel();
      animation = undefined;
      closing = false;
      if (dialog.open) dialog.close();
      unlock();
    };
    const slide = (opening: boolean) => {
      animation?.cancel();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
      const theme = getComputedStyle(dialog);
      const duration = theme.getPropertyValue('--duration-navigation').trim();
      const milliseconds = Number.parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
      const frames = [{ transform: 'translateX(100%)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }];
      return dialog.animate(opening ? frames : frames.toReversed(), {
        duration: Number.isFinite(milliseconds) ? milliseconds : 0,
        easing: theme.getPropertyValue('--ease-interaction').trim() || 'ease',
      });
    };
    const closeMenu = () => {
      if (!dialog.open || closing) return;
      closing = true;
      animation = slide(false);
      if (!animation) return closeNow();
      const current = animation;
      void current.finished.then(() => {
        if (animation === current) closeNow();
      }).catch(() => {}); // Cancellation belongs to resize, navigation or cleanup.
    };

    trigger.disabled = false;
    trigger.addEventListener('click', () => {
      if (dialog.open) return;
      dialog.showModal();
      scrollWasLocked = document.documentElement.classList.contains('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden');
      trigger.setAttribute('aria-expanded', 'true');
      animation = slide(true);
    }, options);
    closeButton.addEventListener('click', closeMenu, options);
    // Keep Tab at either end inside this menu, including in short scrollable viewports.
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>('a[href], button:not([disabled])')]
        .filter(control => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first && last) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last && first) {
        event.preventDefault();
        first.focus();
      }
    }, options);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeMenu();
    }, options);
    dialog.addEventListener('close', () => {
      // A queued close event must not unlock a newly reopened menu.
      if (!dialog.open) closeNow();
    }, options);
    dialog.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a[href]')) closeNow();
    }, options);
    // Read the actual Tailwind result: the theme owns the breakpoint once.
    window.addEventListener('resize', () => {
      if (getComputedStyle(trigger).display === 'none') closeNow();
    }, options);
    window.addEventListener('pagehide', closeNow, options);
    this.dispose = () => {
      closeNow();
      controller.abort();
      trigger.disabled = true;
    };
  }

  disconnectedCallback() {
    this.dispose?.();
    this.dispose = undefined;
  }
}

if (!customElements.get('miette-navigation')) customElements.define('miette-navigation', MietteNavigation);
