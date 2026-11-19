# Awaking 官网字体

- 维护：Condy
- 日期：2026-10-09
- Archivo 用于英文标题、正文和操作；中文沿用系统中文字体。
- Newsreader Italic 用于 Awaking 字标，与既有品牌素材中的斜体字标呼应。
- 字体从 Google Fonts 官方仓库取得，完整转为 WOFF2，没有裁剪字形或修改设计；页面自托管，不连接第三方字体服务。
- 两款字体分别随附 SIL Open Font License 1.1，保留原作者与版权信息。

来源：[Archivo](https://github.com/google/fonts/tree/main/ofl/archivo)、[Newsreader](https://github.com/google/fonts/tree/main/ofl/newsreader)。

文件：`archivo-variable.woff2`、`newsreader-italic-variable.woff2`；许可：`Archivo-OFL.txt`、`Newsreader-OFL.txt`。

## 2026-11-18 首页展示子集

- 首页改用 `archivo-latin.woff2`（拉丁字符与常用标点）和 `newsreader-wordmark.woff2`（仅用于 Awaking 字标），合计约 142 KiB；完整原字体继续保留，其他页面不切换。
- 通过本机已有 fontTools 生成 WOFF2 子集，不修改字形设计或可变轴。已在 400、550、600 字重逐字形比较轮廓与字宽；字标额外按 32px 光学尺寸检查，结果与原字体一致。
- 中文继续回退到系统中文字体；两份原始 OFL、版权与字体内部名称记录保留。生成范围、来源及输出哈希见 `web-subsets.json`。
