# Lectures & Échos · 个人阅读与收藏档案

![B站小电视动图](https://wimg.588ku.com/gif320/24/07/09/16dafad4428b4d29a0e84a9bd01af740.gif)

<div style="font-size: 1.2rem; color: #fb7299; font-weight: 600; margin: 10px 0 30px;">
  📚 微信读书书摘归档 × 📺 B站 / YouTube 网络博主文本合集 · Astro 静态档案站
</div>

## 📋 仓库简介

<div style="background-color: #fafcff; padding: 15px; border-radius: 8px; border-left: 4px solid #fb7299;">

这里是个人的**阅读与观看档案库**：一边把微信读书里的划线、想法、书评与阅读数据沉淀成可检索的书摘，一边把 B 站 / YouTube 上知识类、科普类、演讲类创作者的视频文稿按 UP 主 / 专题归档。全部内容以 Markdown 纯文本托管在 GitHub，并由 `site/` 下的 **Astro 静态网站**渲染成带 3D 书房、搜索与分类筛选的可浏览档案。

网站首页分为两个互不混杂的模块：

- **我的书架**：只收录「微信读书」书库——书卡封面、分类书背、阅读进度、每本书的高亮划线（📌）、想法（💭）与独立读书笔记，以及逐月阅读统计；排序按最近阅读时间。
- **网络博主**：只收录微信读书之外的创作者 / 专题合集，支持按创作者检索、按单篇全文搜索。

依托 Git 版本管理，每一次补充、修订与重名合并都有迹可循，是一座可持续更新的个人知识云端资料库。

</div>

## 📂 仓库结构与规模

> 当前收录：**微信读书 205 本**书摘（另含 1 份逐月阅读统计、1 份书单画廊）＋ **网络博主 / 专题 205 篇**（78 位创作者、2 个专题集）＋ `AI 指令/` 18 篇整理用提示词。

```text
lectures-et-echos/
├── site/                         # Astro 静态网站源码（构建 / 组件 / 脚本都在这里）
│   ├── src/                      # 页面、布局、两大模块组件、数据层 lib
│   ├── scripts/                  # 导入 / 修复 / 封面 / 同步 / 构建校验脚本
│   ├── assets/cover-system/      # 封面生成底图与清单（输出全部为 WebP）
│   └── public/                   # 静态资源（含 CNAME：20260718.xyz）
├── .github/workflows/pages.yml   # GitHub Pages 自动部署（push main 即构建发布）
├── 智能体操作手册.md              # 给 AI 协作者的完整运维 SOP（同步/合并/构建/部署）
├── README.md
│
├── 微信读书/                     # 【我的书架】205 本书 + 阅读统计 + Gallery
├── 毒舌的南瓜/                   # 创作者 — 21 篇
├── 安森垚/                       # 创作者 — 13 篇
├── 渤海小吏/                     # 创作者（含专题：安史之乱）— 13 篇
├── 小岛浪吹/                     # 创作者 — 10 篇
├── 河畔的伯爵/                   # 创作者 — 10 篇
├── 本子在隔壁/                   # 创作者 — 9 篇
├── 木子的生命管理/               # 创作者 — 8 篇
├── 乌鸦校尉CaptainWuya/          # 创作者 — 7 篇
├── 啊粥粥啊粥/                   # 创作者 — 7 篇
├── liliMozi/                     # 创作者 — 5 篇
├── 王局拍案/                     # 创作者 — 5 篇
├── 爱历史的老丁/                 # 创作者 — 4 篇
├── 木鱼水心/                     # 创作者（含专题：星空读书会）— 3 篇
├── 历史调研室/ · 三好的读书时刻/ · 具象波/ · 最好不过zeze/ · 超Carry的柴西/ · 黑纹白斑马/  # 各 3 篇
├── 大猿取经/ · 何解毒/ · 元日安/ · 唯一讲述者/ · 差评君/ · 捕月说/ · 张渔顽/ ……            # 各 2 篇
├── 哔哩名人演讲录/               # 专题集 — 2 篇
├── 于丹品读《论语》/             # 专题集 — 1 篇
├── 咻弗森/ · 拾味X/ · 无穷小亮的科普日常/  # 新并入的创作者
│   ⋮（其余每位创作者一个同名文件夹，单篇居多，共 78 位创作者）
└── AI 指令/                      # 辅助整理内容的 AI 工具指令 — 18 篇（不发布到网站）
```

> 约定：每个**根目录文件夹 = 一个创作者 / 专题 / 书库**；文章为其下的 `.md` 文件，嵌套子文件夹会被识别为「专题（topic）」；文章配图与生成封面统一放在该目录的 `文本附件/` 下。

## 🧩 两大模块是怎么分的

- 数据层在 `site/src/lib/`：`bookshelf.ts` 负责「我的书架」（兜底分类、排序、进度），`catalog.ts` 负责「网络博主」目录，`collections.ts` 决定文件夹类型（创作者 `creator` / 专题 `series` / 书库 `library`）。
- 默认新建的根目录文件夹都会被当作**创作者**自动收进「网络博主」，无需登记；只有书库（微信读书）和少数专题需要在 `collections.ts` 显式标注。
- 微信读书的书由专用脚本从官方接口同步，**不要手写**；详见《智能体操作手册.md》的「微信读书同步 / 笔记修复与重名合并」工作流。

## 📝 内容整理规范

1. **分类原则**：一位 UP 主 / 一个频道对应一个同名文件夹；跨创作者的同主题内容可建专题文件夹。
2. **文件格式**：UTF-8、LF 换行的 Markdown；标题取文件名，正文直接开始（无需在正文里重复标题）。
3. **封面与图片**：网站图片统一使用体积小的 **WebP**；新文章无需手做封面，运行封面脚本会按标题确定性生成 480px / 960px 两档 WebP 并自动写入 `cover` 配置（见下）。
4. **来源链接**：可在 frontmatter 写 `sourceUrl`，或在正文写一行 `网址：https://…`，页面会自动生成「原文链接」。
5. **更新方式**：新增收藏就在对应文件夹补 `.md`；新创作者就新建同名文件夹；`draft: true` 的文章不会发布到线上。

## 🖥️ 本地运行网站

网站源码在 `site/`，需要 **Node.js 24（>=24 <25）**，包管理器为 pnpm（也可用等价的 npm）：

```bash
cd site
pnpm install
pnpm dev          # 本地开发预览（会先同步资源再启动）
```

正式构建（推荐按这一条，它会顺序执行「同步资源 → 类型检查 → 构建 → 产物自检」四步）：

```bash
pnpm build
pnpm preview      # 本地预览构建产物
```

也可以单独执行各步：

```bash
pnpm sync-assets     # 把仓库里的封面 / 配图同步进站点资源目录
pnpm check           # astro check 类型与模板检查
pnpm generate:covers # 为缺封面的已发布文章生成 WebP 封面（幂等，不覆盖已有封面）
pnpm import:weread   # 导入微信读书导出（一般按操作手册走，不直接跑）
```

### 自动补齐文章封面

新增文章后在 `site/` 执行 `pnpm generate:covers`：脚本只处理尚无封面的已发布 Markdown，在文章对应的 `文本附件/` 生成 480px 与 960px 两档 WebP 并自动写回 `cover` 字段；重复运行不会覆盖已有封面，随后 `pnpm build` 即可生效。

## 🚀 GitHub Pages 自动部署

`.github/workflows/pages.yml` 会在推送到 `main` 时自动构建并发布（Node 24，站点根路径 `/`，绑定自定义域名 **https://20260718.xyz**）。首次使用需在仓库 `Settings → Pages` 把 `Source` 设为 `GitHub Actions`；也可在 `Actions` 页手动触发。若改用项目子路径（`用户名.github.io/仓库名`）部署，需要同步调整工作流里的 `SITE_BASE` 与 `astro.config.mjs`。

### 克隆与提交

```bash
# SSH（推荐）
git clone git@github.com:NewtNorlly/lectures-et-echos.git
# HTTPS
git clone https://github.com/NewtNorlly/lectures-et-echos.git
```

日常更新：

```bash
git add .
git commit -m "更新：新增XX内容 / 补充XX笔记"
git push
```

## 🎮 趣味彩蛋

![工作间隙放松一下~](https://i1.hdslb.com/bfs/new_dyn/1659535f66e75c25d0aa216ec6f4b6fd628576425.gif@264w_264h_1e_1c.webp)

工作间隙放松一下~


![仓库主人的状态](https://i1.hdslb.com/bfs/new_dyn/15f95d18b0503a2c07c04794427d128b628576425.gif@264w_264h_1e_1c.webp)

仓库主人的状态~

## ✉️ 版权与联系方式

<div style="background-color: #ffeef2; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px; border: 1px solid #d2d4d5;">© 2026 NewtNorlly<br><br>📧 联系邮箱：newtnolly@outlook.com<br>🌐 在线档案：<a href="https://20260718.xyz" style="color: #fb7299; text-decoration: none; font-weight: 600;">https://20260718.xyz</a><br>📄 许可协议： <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="color: #fb7299; text-decoration: none; font-weight: 600;"> CC BY-NC-SA 4.0（非商用共享） </a><br>⚠️ 说明：本仓库为个人内容收藏整理，仅用于个人学习与查阅，严禁用于商业用途。</div>
