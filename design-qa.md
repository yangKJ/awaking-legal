# Awaking 官网设计验收

- Source visual truth: `/Users/condy/Desktop/Awakening/Docs/Product/AwakingWebsite/2026-09-10/concepts/01-immersive-photo.png`
- Implementation: `awaking/zh/index.html`、`awaking/en/index.html`、`awaking/shared/home-v2.css`
- Browser-rendered evidence: `design-qa/zh-desktop.png`、`design-qa/zh-mobile.png`、`design-qa/en-desktop.jpg`
- State: 首页默认滤镜 Tab；额外验证中文蒙版 Tab 与手机菜单展开。
- Console: 中英文首页均无 warning 或 error。

## 证据与比较范围

概念图是长页面方向稿，实际实现使用同一摄影主导首屏、底部编辑式文字编排、浅色作品区和深色产品证据区。实际首页增加了当前发布范围、双语、隐私和支持入口，因此不按概念图中的虚构署名、概念前后图或单一设备定位做像素级复制。

| 视图 | Source pixels | Implementation pixels | CSS viewport | 密度 |
| --- | ---: | ---: | ---: | ---: |
| 中文桌面首屏 | 946 × 1663（长页方向稿） | 1280 × 720 | 1280 × 720 | 1x |
| 英文桌面首屏 | 946 × 1663（长页方向稿） | 1280 × 720 | 1280 × 720 | 1x |
| 中文手机首屏 | 946 × 1663（响应式方向） | 390 × 844 | 390 × 844 | 1x |

全视图已检查首屏构图、作品区的主次关系，以及深色产品证据区。聚焦检查覆盖了品牌字标与 CTA、中文标题换行、产品 Tab、手机菜单、图片裁切与证明信息；因此不需要额外的局部裁切图。

## 比较历史

1. 初次桌面检查发现白色 CTA 的文字继承为白色，导致按钮不可读。已在 `.marketing-home .button-light` 明确指定深色文字。
2. 初次 Tab 检查发现 `.showcase-panel` 的 `display: grid` 覆盖了 `hidden` 的默认效果。已增加 `.showcase-panel[hidden] { display: none; }`；浏览器验证筛选后只呈现选中的蒙版内容，并同步更新 `aria-selected`。
3. 独立设计复审最初读取到修复前手机截图。替换为 390 × 844 实际渲染后，品牌、标题、正文、CTA、证明信息和菜单均完整可见。
4. 独立复审提出手机首屏末端出现浅色下一段，以及中文标题临近照片高亮区。已将手机 `.hero` 和 `.hero-content` 改为 `100svh`，并收窄中文标题的最大宽度与最大字号；修订后手机首屏以深色边界完成，中文标题保持安全边距。
5. 独立复审提出作品区不应复用首屏海岸图。已生成并接入独立的雨后蓝调街景 `work-night.webp`。
6. 本地 App Store 查询返回的移动端版本与 Mac 发布资料不同，因此下载区改为稳定的“已在 App Store 上线”文案，不再把单一区域的版本号误写成全平台最新版本。

## 最终检查

- 字体与排版：大字标保留摄影杂志式强度；中文和英文标题各自换行，正文保持可读行长。
- 布局节奏：首屏稀疏、作品区明亮、产品证据区集中、下载区再次简洁；桌面两列作品与手机单列均不裁切文字。
- 色彩：中性深色背景让摄影承担色彩，蓝紫只作为强调；CTA 文字、正文和导航在可见状态下清楚。
- 素材：首屏、作品摄影均为本轮原创摄影资产；功能段使用真实 Awaking 编辑界面素材。生成摄影没有声称为 App 输出。
- 内容：中英文均排除未发布的 Range、Text、Beauty、Materials、Finish Plan、云同步、远程 AI 和服务端照片处理。平台表述覆盖 iPhone、iPad 与 Apple silicon Mac。
- 行为与可访问性：跳转主要内容、焦点样式、键盘 Tab 键切换、移动端菜单、减少动态效果、语义 heading、图片替代说明和 44px 级行动入口已检查。App Store、支持、隐私、条款与语言链接在本地静态服务器均可解析。

## 残留测试边界

- 未测试真实 App Store 跳转、支付或远程 GitHub Pages 部署；本轮没有发起这些外部动作。
- 生成摄影用于品牌叙事；后续若作为“由 Awaking 完成”的案例，必须补同一原片的实际处理输出与记录。

final result: passed
