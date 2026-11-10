// postcard-home.test.cjs
// 片笺双语官网
//
// Created by Condy on 2026/11/10.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../pianjian/home.js'), 'utf8');

test('所有下载入口按页面语言进入对应商店地区', () => {
    for (const [file, country] of [['index.html', 'cn'], ['index-en.html', 'us']]) {
        const html = fs.readFileSync(path.join(__dirname, '../pianjian', file), 'utf8');
        const downloads = Array.from(html.matchAll(/href="(https:\/\/apps\.apple\.com\/[^"]+)"/g));
        assert.ok(downloads.length > 0);
        for (const [, href] of downloads) {
            const url = new URL(href);
            assert.ok(url.pathname.startsWith(`/${country}/app/`), `${file} 的下载地区错误`);
            assert.ok(url.pathname.endsWith('/id6799028972'), `${file} 的 App ID 错误`);
        }
    }
});

function element() {
    return {
        hidden: false,
        handlers: {},
        attributes: {},
        classes: new Set(),
        children: [],
        addEventListener(name, handler) { this.handlers[name] = handler; },
        setAttribute(name, value) { this.attributes[name] = value; },
        getAttribute(name) { return this.attributes[name]; },
        append(...children) { this.children.push(...children); },
        focus() { this.focused = true; },
        scrollIntoView(options) { this.scrollOptions = options; },
    };
}

function tourFixture(prefix, count) {
    const list = element();
    list.hidden = true;
    const panels = Array.from({ length: count }, () => element());
    const tabs = panels.map((panel, index) => {
        const tab = element();
        tab.id = `${prefix}-tab-${index}`;
        tab.attributes['aria-controls'] = `${prefix}-panel-${index}`;
        return tab;
    });
    const tour = element();
    tour.classList = { add: (name) => tour.classes.add(name) };
    tour.querySelector = () => list;
    tour.querySelectorAll = () => tabs;
    tour.contains = (panel) => panels.includes(panel);
    return { tour, list, tabs, panels };
}

function run({ groups = [], phone, menu, missingPanel = false } = {}) {
    const panels = new Map();
    for (const group of groups) {
        group.tabs.forEach((tab, index) => panels.set(tab.attributes['aria-controls'], group.panels[index]));
    }
    const document = {
        handlers: {},
        addEventListener(name, handler) { this.handlers[name] = handler; },
        querySelectorAll: (selector) => selector === '[data-tour]' ? groups.map((group) => group.tour) : phone ? [phone] : [],
        querySelector: () => menu || null,
        getElementById: (id) => missingPanel ? null : panels.get(id),
        createElement: () => element(),
    };
    vm.runInNewContext(source, { document });
    return document;
}

test('导览初始化与点击只修改当前组', () => {
    const first = tourFixture('first', 5);
    const second = tourFixture('second', 2);
    run({ groups: [first, second] });
    assert.equal(first.list.hidden, false);
    assert.equal(first.list.attributes.role, 'tablist');
    assert.deepEqual(first.panels.map((panel) => panel.hidden), [false, true, true, true, true]);
    first.tabs[4].handlers.click();
    assert.deepEqual(first.panels.map((panel) => panel.hidden), [true, true, true, true, false]);
    assert.equal(first.tabs[4].tabIndex, 0);
    assert.equal(first.panels[4].attributes['aria-labelledby'], first.tabs[4].id);
    assert.deepEqual(second.panels.map((panel) => panel.hidden), [false, true]);
});

test('方向键循环和首尾键移动焦点，Tab 保持浏览器行为', () => {
    const group = tourFixture('keys', 5);
    run({ groups: [group] });
    const key = (index, value) => group.tabs[index].handlers.keydown({ key: value, preventDefault() {} });
    key(0, 'ArrowLeft');
    assert.equal(group.tabs[4].focused, true);
    assert.equal(group.tabs[4].scrollOptions.inline, 'nearest');
    assert.equal(group.tabs[4].scrollOptions.block, 'nearest');
    key(4, 'ArrowRight');
    assert.equal(group.tabs[0].attributes['aria-selected'], 'true');
    key(0, 'End');
    assert.equal(group.tabs[4].attributes['aria-selected'], 'true');
    key(4, 'Home');
    assert.equal(group.tabs[0].attributes['aria-selected'], 'true');
    group.tabs[0].handlers.keydown({ key: 'Tab', preventDefault() { assert.fail('不应拦截 Tab'); } });
});

test('错误面板引用保留所有静态内容', () => {
    const group = tourFixture('missing', 2);
    run({ groups: [group], missingPanel: true });
    assert.equal(group.list.hidden, true);
    assert.deepEqual(group.panels.map((panel) => panel.hidden), [false, false]);
    assert.equal(group.tour.classes.size, 0);
});

test('跨组面板引用不会隐藏其他组件的内容', () => {
    const first = tourFixture('owner', 2);
    const second = tourFixture('other', 2);
    first.tabs[0].attributes['aria-controls'] = second.tabs[0].attributes['aria-controls'];
    run({ groups: [first, second] });
    assert.equal(first.list.hidden, true);
    assert.deepEqual(first.panels.map((panel) => panel.hidden), [false, false]);
    assert.deepEqual(second.panels.map((panel) => panel.hidden), [false, true]);
});

function phoneFixture(complete = false, naturalWidth = 0) {
    const image = element();
    image.complete = complete;
    image.naturalWidth = naturalWidth;
    image.attributes.src = './screen.webp';
    const shell = element();
    shell.complete = true;
    shell.naturalWidth = 1406;
    const screen = element();
    const phone = element();
    phone.dataset = { loadingLabel: '加载中', errorLabel: '加载失败', retryLabel: '重试' };
    phone.classList = { add: (name) => phone.classes.add(name) };
    phone.querySelector = (selector) => ({ '[data-phone-image]': image, '.phone-shell': shell, '.phone-screen': screen })[selector];
    return { phone, image, shell, screen };
}

test('图片失败后能够重试，加载完成隐藏状态层', () => {
    const f = phoneFixture();
    run({ phone: f.phone });
    const status = f.screen.children[0];
    const [message, retry] = status.children;
    assert.equal(f.phone.dataset.state, 'loading');
    assert.equal(retry.hidden, true);
    f.image.handlers.error();
    assert.equal(f.phone.dataset.state, 'error');
    assert.equal(message.textContent, '加载失败');
    assert.equal(retry.hidden, false);
    retry.handlers.click();
    assert.equal(f.phone.dataset.state, 'loading');
    assert.equal(f.image.src, './screen.webp');
    f.image.handlers.load();
    assert.equal(f.phone.dataset.state, 'ready');
    assert.equal(status.hidden, true);
});

test('命中缓存的成功与失败图片，以及外壳失败均有确定状态', () => {
    for (const width of [1206, 0]) {
        const f = phoneFixture(true, width);
        run({ phone: f.phone });
        assert.equal(f.phone.dataset.state, width ? 'ready' : 'error');
        f.shell.handlers.error();
        assert.equal(f.phone.classes.has('phone--unframed'), true);
    }
});

test('没有装饰外壳的相机画面仍支持加载状态', () => {
    const f = phoneFixture();
    f.phone.querySelector = (selector) => ({ '[data-phone-image]': f.image, '.phone-screen': f.screen })[selector];
    run({ phone: f.phone });
    assert.equal(f.phone.dataset.state, 'loading');
    f.image.handlers.load();
    assert.equal(f.phone.dataset.state, 'ready');
    assert.equal(f.screen.children[0].hidden, true);
});

test('移动菜单支持链接、外部点击和 Escape 焦点恢复', () => {
    const menu = element();
    const link = element();
    const summary = element();
    menu.querySelectorAll = () => [link];
    menu.querySelector = () => summary;
    menu.contains = (target) => target === summary || target === link;
    menu.open = true;
    const document = run({ menu });
    document.handlers.keydown({ key: 'Escape' });
    assert.equal(menu.open, false);
    assert.equal(summary.focused, true);
    menu.open = true;
    link.handlers.click();
    assert.equal(menu.open, false);
    menu.open = true;
    document.handlers.click({ target: summary });
    assert.equal(menu.open, true);
    document.handlers.click({ target: {} });
    assert.equal(menu.open, false);
});

test('没有首页组件时安全退出', () => {
    assert.doesNotThrow(() => run());
});
