# Awaking 产品官网与法律页面

本仓库通过 GitHub Pages 承载 Awaking、照惜和片笺的产品官网、技术支持与法律页面。仓库根目录的 `index.html` 只负责产品入口，不作为任何单一 App 的产品事实来源。

## 产品入口

| 产品 | 目录 | 线上入口 |
|---|---|---|
| Awaking | `awaking/` | `https://yangkj.github.io/awaking-legal/awaking/` |
| 照惜 | `zhaoxi/` | `https://yangkj.github.io/awaking-legal/zhaoxi/` |
| 片笺 | `pianjian/` | `https://yangkj.github.io/awaking-legal/pianjian/` |

各产品独立维护品牌视觉、功能边界、隐私披露和用户协议。不要跨产品复制功能声明、购买规则或数据处理口径。

## Awaking 新版双语站点

Awaking 下一阶段官网使用中文与英文两套同构页面，共享视觉系统与最小脚本：

```text
awaking/
├── zh/
│   ├── index.html
│   ├── support.html
│   ├── privacy-policy.html
│   ├── terms-of-service.html
│   └── assets/
│       └── web/
├── en/
│   ├── index.html
│   ├── support.html
│   ├── privacy-policy.html
│   ├── terms-of-service.html
│   └── assets/
│       └── web/
└── shared/
    ├── site.css
    └── site.js
```

- `zh/`：简体中文官网、支持、隐私政策和用户协议。
- `en/`：英文同构页面；语言切换保持在当前对应页面。
- `shared/`：双语页面共用的响应式样式和版本展示脚本。
- `assets/web/`：网页实际加载的轻量 WebP；源 PNG 只作为设计母版，不直接进入首屏加载链。

### 新版预备地址

| 页面 | 简体中文 | English |
|---|---|---|
| 官网 | `/awaking/zh/` | `/awaking/en/` |
| 技术支持 | `/awaking/zh/support.html` | `/awaking/en/support.html` |
| 隐私政策 | `/awaking/zh/privacy-policy.html` | `/awaking/en/privacy-policy.html` |
| 用户协议 | `/awaking/zh/terms-of-service.html` | `/awaking/en/terms-of-service.html` |

Awaking App Store：`https://apps.apple.com/app/id6760924133`

## 新旧站并行策略

新版 `zh/`、`en/` 页面当前是下一版本的预备站点。旧版页面继续保留，不在本次重写中删除、覆盖或重定向：

- `/awaking/index.html`
- `/awaking/support.html`
- `/awaking/privacy-policy.html`
- `/awaking/terms-of-service.html`
- 根目录历史法律页面

在新版 App、App Store 产品页和 Awaking Pro 商品全部完成真实发布门禁之前，不应把旧 canonical URL 提前切换到新版，也不要仅因页面代码完成就宣称新版已公开上线。

正式切换必须在同一发布批次完成：

1. 确认 App Store 当前可下载二进制与官网功能、Free/Pro 权益和购买规则一致。
2. 确认月度、年度与永久解锁商品在 App Store Connect 真实可售；价格与优惠以 Apple 购买面板为准。
3. 同步更新 App 内 `Info.plist`、App Store Connect、发布资料和 README 中的法律 URL。
4. 决定 `/awaking/` 的语言路由：中文 canonical、语言选择页或显式重定向。
5. 保留旧 URL 的兼容跳转，避免已安装版本出现断链。
6. 部署后逐页验证中文、英文、移动端、桌面端、外链和法律互跳。

## 内容事实边界

官网文案必须服从当前公开版本和代码真实入口：

- 品牌名统一使用 `Awaking`；`Awakening` 仅可作为内部工程名。
- 不宣传尚未公开的 Range、Text、Beauty、Materials 或普通入口不存在的能力。
- 不把相机导入写成当前能力，除非真实入口、权限和设备验收均已完成。
- 标准 JPEG 导出可表述为无品牌水印；Pro 权益须与 StoreKit 和实际购买面板一致。
- “本地处理”应写成不自动上传到开发者服务器，不能排除用户主动系统分享或 Apple Photos/iCloud 取回。
- 回忆流只能承诺浏览本身不改变系统相册；保存、分享或删除仍由用户主动确认。
- App Store 最新版本可以动态展示，但查询失败时必须保留明确、不过时的静态下载状态。

## 隐私与法律页面

隐私政策需分别说明三类场景：

1. App 内照片、编辑、导出与本地诊断。
2. 用户主动发送的支持邮件和诊断包。
3. GitHub Pages 托管产生的服务端访问日志。

正式公开前还需由产品所有者补齐并确认真实服务提供者/个人信息处理者名称、适用的联系信息以及支持邮件和附件的实际保留规则；不要在仓库中猜测法律主体。

## 本地预览与检查

在仓库根目录启动临时静态服务器：

```bash
python3 -m http.server 8765
```

然后访问：

- `http://127.0.0.1:8765/awaking/zh/`
- `http://127.0.0.1:8765/awaking/en/`

提交前至少检查：

- 8 个双语页面的本地链接、图片、页内锚点和语言互跳。
- 320、390、820、1180 像素宽度，以及短横屏下无横向溢出或裁切。
- 移动菜单、键盘焦点、Skip Link、44×44pt 触控热区和 Reduce Motion。
- 中英文素材没有串用，海报保持比例且不使用 `object-fit: cover` 裁掉文字。
- `node --check awaking/shared/site.js` 与 `git diff --check` 通过。
- 网页首屏加载优化资源；不要把约 28–29 MB 的源 PNG 直接部署为首屏资源。

## 发布方式

GitHub Pages 从 `master` 分支仓库根目录发布。创建本地提交不会自动公开页面；只有推送到远端并完成 Pages 部署后，线上内容才会更新。

支持邮箱：`yangkj310@gmail.com`
