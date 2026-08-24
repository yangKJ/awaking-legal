(() => {
  const header = document.querySelector('.site-header');
  const button = header?.querySelector('.menu-toggle');
  const nav = header?.querySelector('#site-nav');

  if (!header || !button || !nav) return;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!isOpen()) return;

    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '打开网站导航');
    nav.classList.remove('is-open');

    if (restoreFocus) button.focus();
  };

  button.addEventListener('click', () => {
    const nextOpenState = !isOpen();
    button.setAttribute('aria-expanded', String(nextOpenState));
    button.setAttribute('aria-label', nextOpenState ? '关闭网站导航' : '打开网站导航');
    nav.classList.toggle('is-open', nextOpenState);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu({ restoreFocus: true });
    }
  });

  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener?.('change', () => closeMenu());
})();
