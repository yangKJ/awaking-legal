// home-interactions.test.cjs
// Awaking 官网
//
// Created by Condy on 2026/10/9.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../awaking/shared/home-v2.js'), 'utf8');

function fixture() {
  const panels = new Map();
  const groups = [2, 3].map((count, groupIndex) => {
    const tabs = Array.from({ length: count }, (_, index) => {
      const panelID = `panel-${groupIndex}-${index}`;
      panels.set(panelID, { hidden: index !== 0 });
      return {
        selected: String(index === 0), tabIndex: index === 0 ? 0 : -1, focused: false,
        handlers: {},
        getAttribute: () => panelID,
        setAttribute(name, value) { if (name === 'aria-selected') this.selected = value; },
        addEventListener(name, handler) { this.handlers[name] = handler; },
        focus() { this.focused = true; },
      };
    });
    return { tabs, querySelectorAll: () => tabs };
  });
  const divider = { hidden: true };
  const controls = { hidden: true };
  const comparison = {
    amount: null, enhanced: false,
    style: { setProperty(name, value) { comparison.amount = value; } },
    classList: { add(name) { comparison.enhanced = name === 'is-interactive'; } },
    querySelector: () => divider,
  };
  const range = { value: '50', addEventListener(name, handler) { this[name] = handler; } };
  const output = { textContent: '' };
  const summary = { focused: false, focus() { this.focused = true; } };
  const links = [0, 1].map(() => ({ addEventListener(name, handler) { this[name] = handler; } }));
  const menu = {
    open: true,
    querySelectorAll: () => links,
    querySelector: () => summary,
    addEventListener(name, handler) { this[name] = handler; },
  };
  const document = {
    querySelectorAll: () => groups,
    querySelector: (selector) => ({ '.mobile-nav': menu, '[data-photo-comparison]': comparison, '.comparison-controls': controls })[selector],
    getElementById: (id) => ({ 'comparison-range': range, 'comparison-value': output })[id] || panels.get(id),
  };
  vm.runInNewContext(source, { document });
  return { groups, panels, comparison, range, output, divider, controls, menu, links, summary };
}

test('编辑过程与设备标签独立保留选择', () => {
  const f = fixture();
  f.groups[0].tabs[1].handlers.click();
  assert.equal(f.panels.get('panel-0-1').hidden, false);
  assert.equal(f.panels.get('panel-0-0').hidden, true);
  assert.equal(f.groups[1].tabs[0].selected, 'true');
  assert.equal(f.panels.get('panel-1-0').hidden, false);
  f.groups[1].tabs[2].handlers.click();
  assert.equal(f.groups[0].tabs[1].selected, 'true');
  assert.equal(f.panels.get('panel-0-1').hidden, false);
});

test('方向键循环、Home 与 End 只移动当前组焦点', () => {
  const f = fixture();
  const tabs = f.groups[1].tabs;
  let prevented = false;
  tabs[0].handlers.keydown({ key: 'ArrowLeft', preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(tabs[2].focused, true);
  assert.equal(tabs[2].tabIndex, 0);
  tabs[2].handlers.keydown({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(tabs[0].selected, 'true');
  tabs[0].handlers.keydown({ key: 'End', preventDefault() {} });
  assert.equal(tabs[2].selected, 'true');
  tabs[2].handlers.keydown({ key: 'Home', preventDefault() {} });
  assert.equal(tabs[0].selected, 'true');
  assert.equal(f.groups[0].tabs[0].selected, 'true');
  tabs[0].handlers.keydown({ key: 'Tab', preventDefault() { assert.fail('不能拦截 Tab'); } });
});

test('对比滑杆覆盖原片、半幅、完整成片三个边界', () => {
  const f = fixture();
  assert.equal(f.comparison.enhanced, true);
  assert.equal(f.controls.hidden, false);
  assert.equal(f.divider.hidden, false);
  for (const amount of ['0', '50', '100']) {
    f.range.value = amount;
    f.range.input();
    assert.equal(f.comparison.amount, `${amount}%`);
    assert.equal(f.output.textContent, `${amount}%`);
  }
});

test('菜单链接关闭菜单，Escape 关闭后回到触发器', () => {
  const f = fixture();
  f.links[0].click();
  assert.equal(f.menu.open, false);
  f.menu.open = true;
  f.menu.keydown({ key: 'Escape' });
  assert.equal(f.menu.open, false);
  assert.equal(f.summary.focused, true);
});

test('没有首页控件的页面不会发生异常', () => {
  assert.doesNotThrow(() => vm.runInNewContext(source, {
    document: { querySelector: () => null, querySelectorAll: () => [], getElementById: () => null },
  }));
});
