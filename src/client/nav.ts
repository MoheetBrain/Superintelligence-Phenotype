/** Mobile navigation disclosure: button toggles, Escape and link selection close it. */

const DESKTOP_QUERY = '(min-width: 64em)';

export function initNavigation(root: Document = document): void {
  const header = root.querySelector<HTMLElement>('[data-site-header]');
  const toggle = header?.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panelId = toggle?.getAttribute('aria-controls');
  const panel = panelId ? root.getElementById(panelId) : null;
  if (!header || !toggle || !panel) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    header.toggleAttribute('data-nav-open', open);
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  panel.addEventListener('click', (event) => {
    if ((event.target as Element | null)?.closest('a')) setOpen(false);
  });

  root.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target as Node)) setOpen(false);
  });

  const desktop = window.matchMedia(DESKTOP_QUERY);
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
