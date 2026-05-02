# 🍡 Astro-Mochi-Tones 开发者指南

> 这份文档假设你是一个完全的新手，会一步步教你如何使用这个博客主题。

---

## 📋 目录

1. [什么是这个项目？](#什么是这个项目)
2. [环境准备](#环境准备)
3. [项目结构说明](#项目结构说明)
4. [日常开发](#日常开发)
5. [写文章](#写文章)
6. [发布主题](#发布主题)
7. [常见问题](#常见问题)

---

## 什么是这个项目？

这是一个 **博客主题系统**，分为两部分：

| 部分 | 说明 | 你需要做什么 |
|------|------|-------------|
| `themes/astro-mochi-tones/` | 主题代码，作为 Git 子模块引用 | 开发和维护主题 |
| 根目录 | 你的个人博客，使用上面的主题 | 写文章、添加图片 |

**简单理解**：
- `themes/astro-mochi-tones/` = 博客的"皮肤"（颜色、布局、按钮样式等）
- 根目录 = 博客的"内容"（你的文章、图片）

---

## 环境准备

### 第一次使用？先安装这些工具

1. **Node.js** — JavaScript 运行环境
   - 下载：https://nodejs.org/ （选择 LTS 版本）
   - 安装后打开终端，输入 `node -v` 确认安装成功

2. **npm** — Node.js 自带的包管理器
   - 安装 Node.js 后会自动带上 npm

3. **Git** — 版本控制
   - 下载：https://git-scm.com/

### 安装项目依赖

打开终端，进入项目目录，运行：

```bash
cd C:\Users\nekov\Project\Blog
git submodule update --init --recursive
npm install
```

这会安装所有需要的软件包，可能需要几分钟。

---

## 项目结构说明

```
Blog/
│
├── 📁 themes/
│   └── 📁 astro-mochi-tones/ # 【主题子模块】
│       ├── 📁 src/
│       ├── 📄 index.ts       # 主题入口文件
│       └── 📄 package.json   # 主题配置
│
├── 📁 src/
│   ├── 📁 content/blog/     # ⭐ 你的文章放这里！
│   └── 📁 data/             # 数据文件（友链等）
├── 📁 public/               # ⭐ 你的图片放这里！
├── 📄 astro.config.ts       # 博客配置
├── 📄 .gitmodules           # 子模块配置
├── 📄 .gitignore            # Git 忽略文件
└── 📄 publish-theme.ps1     # 发布主题的脚本
```

### 你通常只需要关心的目录：

| 目录 | 用途 |
|------|------|
| `src/content/blog/` | 放你的文章（.md 或 .mdx 文件） |
| `public/` | 放你的图片、视频等资源 |
| `themes/astro-mochi-tones/` | 修改主题代码 |

---

## 日常开发

### 启动开发服务器

每次开始写博客前，运行这个命令：

```bash
npm run dev
```

然后打开浏览器访问 **http://localhost:4321/**

> 💡 开发服务器会自动刷新，你修改文件后浏览器会自动更新。

### 停止服务器

在终端按 `Ctrl + C`

---

## 写文章

### 第 1 步：创建文件

在 `src/content/blog/` 目录下创建一个 `.md` 文件，例如：

```
src/content/blog/my-first-post.md
```

### 第 2 步：填写文章信息（Frontmatter）

每篇文章开头需要有一个"头部信息"区域，用 `---` 包裹：

```markdown
---
title: "我的第一篇文章"
date: 2025-01-01
description: "这是文章的简短描述，会显示在列表页"
tags: ["日记", "技术"]
categories: ["博客"]
cover: "/images/cover.jpg"
draft: false
---

# 这里开始写正文

你好世界！这是我的第一篇文章。

## 二级标题

正文内容...
```

### 头部信息字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 发布日期，格式：`2025-01-01` |
| `description` | ❌ | 简短描述（SEO 用） |
| `tags` | ❌ | 标签数组，如 `["技术", "教程"]` |
| `categories` | ❌ | 分类数组 |
| `cover` | ❌ | 封面图路径 |
| `draft` | ❌ | 设为 `true` 则不会发布 |

### 第 3 步：添加图片

1. 把图片放到 `public/images/` 目录
2. 在文章中这样引用：

```markdown
![图片描述](/images/my-photo.jpg)
```

---

## 发布主题

当你对主题代码（`themes/astro-mochi-tones/` 目录）做了修改，想要发布到 GitHub 让别人也能用：

### 第 1 步：在主题子模块里提交并推送

```bash
cd themes/astro-mochi-tones
git switch main
git add .
git commit -m "更新主题"
git push origin main
cd ../..
```

### 第 2 步：在博客仓库提交子模块指针

```bash
git add themes/astro-mochi-tones
git commit -m "更新主题子模块"
git push origin main
```

如果只是想查看当前主题和博客仓库状态，可以运行辅助脚本：

```bash
.\publish-theme.ps1
```

---

## Cloudflare Pages 部署

在 Cloudflare Pages 里使用这些构建设置：

| 配置项 | 值 |
|------|------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22.16.0` |

这个仓库使用 Git 子模块引用主题。正常情况下，Cloudflare 从 GitHub 构建时会按 `.gitmodules` 拉取公开子模块；如果构建日志里出现 `themes/astro-mochi-tones` 不存在或 `file:./themes/astro-mochi-tones` 无法解析，先确认 GitHub 上提交了 `.gitmodules` 和子模块指针，然后重新部署。

如果需要手动控制安装流程，可以在 Cloudflare Pages 环境变量里设置 `SKIP_DEPENDENCY_INSTALL=1`，并把构建命令改为：

```bash
git submodule update --init --recursive && npm install && npm run build
```

---

## 常见问题

### Q: 我只想写文章，不想改主题代码怎么办？

只需要：
1. 运行 `npm run dev`
2. 在 `src/content/blog/` 写文章
3. 完成！

### Q: 终端报错 "npm: command not found"

重新安装 Node.js LTS 版本，并确认安装后运行 `npm -v` 有版本号。

### Q: 页面打开是空白的

检查终端是否有报错信息，通常是：
- 少了某个依赖 → 运行 `npm install`
- 文章格式错误 → 检查 frontmatter 是否正确

### Q: 如何修改网站标题？

编辑 `astro.config.ts`：

```ts
MochiTones({
  config: {
    title: "你的网站标题",  // ← 改这里
    description: "网站描述",
  },
})
```

### Q: 如何部署到网上？

1. 运行构建命令：
   ```bash
   npm run build
   ```
2. 把 `dist/` 目录上传到服务器或静态托管平台（如 Cloudflare Pages、Vercel）

---

## 🆘 还有问题？

- 查看 [Astro 官方文档](https://docs.astro.build/)
- 在 [GitHub Issues](https://github.com/vahiru/Astro-Mochi-Tones/issues) 提问
