type TrailView = 'studio' | 'box' | 'outside';

function mountTrail(section: HTMLElement) {
  const chalk = section.querySelector<HTMLAnchorElement>('.trail-chalk-swatch');
  const blush = section.querySelector<HTMLAnchorElement>('.trail-blush-swatch');
  const chalkPhoto = section.querySelector<HTMLImageElement>('.trail-chalk-photo img');
  const blushPhoto = section.querySelector<HTMLImageElement>('.trail-blush-photo img');
  const boxFrame = section.querySelector<HTMLElement>('.trail-box-frame');
  const boxPhoto = boxFrame?.querySelector('img');
  const outsidePhoto = section.querySelector<HTMLImageElement>('.trail-outside-photo img');
  const thumbs = section.querySelector<HTMLElement>('.trail-thumbs');
  const studioThumb = thumbs?.querySelector<HTMLButtonElement>('.trail-studio-thumb');
  const boxThumb = thumbs?.querySelector<HTMLButtonElement>('.trail-box-thumb');
  const outsideThumb = thumbs?.querySelector<HTMLButtonElement>('.trail-outside-thumb');
  const launcher = section.querySelector<HTMLButtonElement>('.trail-zoom');
  const dialog = section.querySelector<HTMLDialogElement>('.trail-dialog');
  const close = section.querySelector<HTMLButtonElement>('.trail-close');
  const caption = section.querySelector<HTMLElement>('.trail-dialog-colour');
  const pan = section.querySelector<HTMLElement>('.trail-pan');
  if (!chalk || !blush || !chalkPhoto || !blushPhoto || !launcher || !dialog || !close || !caption || !pan) return;
  if (!thumbs || !studioThumb || !boxThumb || !outsideThumb || !boxFrame || !boxPhoto || !outsidePhoto) return;

  const swatches = [chalk, blush];
  const thumbnails = { studio: studioThumb, box: boxThumb, outside: outsideThumb };
  const views: TrailView[] = ['studio', 'box', 'outside'];
  let active = chalk;
  let view: TrailView = 'studio';

  function addThumbnail(button: HTMLButtonElement, photo: HTMLImageElement) {
    const image = new Image();
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.src = photo.currentSrc || photo.src;
    button.append(image);
    return image;
  }

  const studioPreview = addThumbnail(studioThumb, chalkPhoto);
  addThumbnail(boxThumb, boxPhoto);
  addThumbnail(outsideThumb, outsidePhoto);

  function selectView(next: TrailView) {
    view = next;
    section.dataset.trailView = view;
    for (const item of views) thumbnails[item].setAttribute('aria-pressed', String(item === view));
  }

  for (const item of views) {
    thumbnails[item].addEventListener('click', () => selectView(item));
  }
  thumbs.hidden = false;

  function select(swatch: HTMLAnchorElement) {
    active = swatch;
    section.dataset.trailChoice = swatch === blush ? 'blush' : 'chalk';
    const photo = swatch === blush ? blushPhoto : chalkPhoto;
    studioPreview.src = photo.currentSrc || photo.src;
    selectView('studio');
    for (const item of swatches) {
      if (item === active) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    }
  }
  const readHash = () => {
    const target = swatches.find(swatch => swatch.hash === location.hash);
    if (target) select(target);
  };
  function choose(swatch: HTMLAnchorElement) {
    select(swatch);
    if (location.hash !== swatch.hash) history.replaceState(history.state, '', swatch.hash);
  }

  for (const swatch of swatches) {
    swatch.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      choose(swatch);
    });
    swatch.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const other = swatch === blush ? chalk : blush;
      choose(other);
      other.focus({ preventScroll: true });
    });
  }
  select(chalk);
  readHash();
  window.addEventListener('hashchange', readHash);

  if (typeof dialog.showModal !== 'function') return;
  launcher.hidden = false;
  launcher.addEventListener('click', () => {
    const studio = active === blush ? blushPhoto : chalkPhoto;
    const source = view === 'studio' ? studio : view === 'box' ? boxPhoto : outsidePhoto;
    const image = source.cloneNode() as HTMLImageElement;
    image.loading = 'eager';
    if (view === 'box') {
      const frame = boxFrame.cloneNode() as HTMLElement;
      frame.append(image);
      pan.replaceChildren(frame);
    } else {
      pan.replaceChildren(image);
    }
    caption.textContent = (view === 'studio' ? active : thumbnails[view]).textContent?.trim() || '';
    dialog.showModal();
    close.focus({ preventScroll: true });
    const centrePhoto = () => {
      pan.scrollLeft = (pan.scrollWidth - pan.clientWidth) / 2;
      pan.scrollTop = (pan.scrollHeight - pan.clientHeight) / 2;
    };
    if (image.complete) centrePhoto();
    else image.addEventListener('load', centrePhoto, { once: true });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    pan.replaceChildren();
    const focused = document.activeElement;
    if (!focused || focused === document.body || dialog.contains(focused)) {
      launcher.focus({ preventScroll: true });
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  pan.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const box = pan.getBoundingClientRect();
    const ratioX = (event.clientX - box.left) / box.width;
    const ratioY = (event.clientY - box.top) / box.height;
    pan.scrollLeft = ratioX * (pan.scrollWidth - pan.clientWidth);
    pan.scrollTop = ratioY * (pan.scrollHeight - pan.clientHeight);
  });
}

for (const section of document.querySelectorAll<HTMLElement>('.trail-product')) mountTrail(section);
