// home.js
// 片笺双语官网
//
// Created by Condy on 2026/11/10.

(() => {
  document.querySelectorAll('[data-tour]').forEach((tour) => {
    const tablist = tour.querySelector('[data-tour-tabs]');
    const tabs = Array.from(tour.querySelectorAll('[data-tour-tab]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

    // 缺少目标面板时保留完整的静态内容，避免增强后出现空白。
    if (!tablist || tabs.length === 0 || panels.some((panel) => !panel || !tour.contains(panel))) return;

    const select = (index, moveFocus = false) => {
      tabs.forEach((tab, position) => {
        const active = position === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[position].hidden = !active;
      });
      if (moveFocus) {
        tabs[index].focus();
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    tablist.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', (event) => {
        let next = index;
        switch (event.key) {
          case 'ArrowRight': next = (index + 1) % tabs.length; break;
          case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
          case 'Home': next = 0; break;
          case 'End': next = tabs.length - 1; break;
          default: return;
        }
        event.preventDefault();
        select(next, true);
      });
    });
    select(0);
    tablist.hidden = false;
    tour.classList.add('is-enhanced');
  });

  document.querySelectorAll('[data-phone]').forEach((phone) => {
    const image = phone.querySelector('[data-phone-image]');
    const shell = phone.querySelector('.phone-shell');
    const screen = phone.querySelector('.phone-screen');
    if (!image || !screen) return;

    const status = document.createElement('div');
    status.className = 'phone-status';
    const message = document.createElement('span');
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = phone.dataset.retryLabel;
    status.append(message, retry);
    screen.append(status);

    const update = (state) => {
      phone.dataset.state = state;
      status.hidden = state === 'ready';
      retry.hidden = state !== 'error';
      message.textContent = state === 'error' ? phone.dataset.errorLabel : phone.dataset.loadingLabel;
      // 多张图片的正常加载不逐项播报，仅给真实失败提供语义提示。
      status.setAttribute('aria-live', state === 'error' ? 'polite' : 'off');
    };

    image.addEventListener('load', () => update('ready'));
    image.addEventListener('error', () => update('error'));
    retry.addEventListener('click', () => {
      update('loading');
      image.src = image.getAttribute('src');
    });
    update(image.complete ? (image.naturalWidth > 0 ? 'ready' : 'error') : 'loading');

    // 装饰外壳失败时直接展示截图，内容仍可阅读。
    const showWithoutShell = () => phone.classList.add('phone--unframed');
    shell?.addEventListener('error', showWithoutShell);
    if (shell?.complete && shell.naturalWidth === 0) showWithoutShell();
  });

  const menu = document.querySelector('[data-mobile-menu]');
  if (!menu) return;
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => { menu.open = false; });
  });
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();
