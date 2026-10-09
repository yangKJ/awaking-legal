(() => {
  const mobileMenu = document.querySelector('.mobile-nav');

  // 每组标签只切换自己的面板，保留其他组的选择。
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const activate = (tab) => {
      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.setAttribute('aria-selected', String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(candidate.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'Home' ? 0
          : event.key === 'End' ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        activate(tabs[nextIndex]);
      });
    });
  });

  const comparison = document.querySelector('[data-photo-comparison]');
  const range = document.getElementById('comparison-range');
  const value = document.getElementById('comparison-value');

  // 没有脚本时仍可并排查看原片和成片，增强后使用原生滑杆。
  if (comparison && range && value) {
    const updateComparison = () => {
      const amount = `${range.value}%`;
      comparison.style.setProperty('--comparison', amount);
      value.textContent = amount;
    };
    range.addEventListener('input', updateComparison);
    updateComparison();
    comparison.classList.add('is-interactive');
    comparison.querySelector('.comparison-divider').hidden = false;
    document.querySelector('.comparison-controls').hidden = false;
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => { mobileMenu.open = false; });
    });
    mobileMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.open) {
        mobileMenu.open = false;
        mobileMenu.querySelector('summary').focus();
      }
    });
  }
})();
