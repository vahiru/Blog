import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import MochiTones from "astro-mochi-tones";

export default defineConfig({
    // 用于生成 canonical、RSS、Open Graph 等绝对链接。
    site: "https://vahiru.is-cute.cat/",
    markdown: {
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
            defaultColor: false,
        },
    },
    vite: {
        // 根项目与 file: 主题都依赖 Material Web；强制共用单一实例，
        // 避免浏览器重复注册 md-ripple 等自定义元素。
        resolve: {
            dedupe: ["@material/web", "lit", "lit-html", "lit-element", "@lit/reactive-element"],
        },
    },
    integrations: [
        mdx(),
        MochiTones({
            // 主题的全局内容配置：站点信息、资源路径、导航、页脚和文案都集中放这里。
            config: {
                // 基础站点信息，会被 Layout、RSS、Footer 和 SEO 元信息复用。
                title: "Vahiru Blog",
                description: "这里是一只猫猫的自留地",
                author: "Vahiru",
                lang: "zh-CN",
                locale: "zh_CN",

                // 静态资源和主题生成的端点路径。
                favicon: "/favicon.png",
                defaultImage: "/images/default-og.jpg",
                rssPath: "/rss.xml",
                searchPath: "/search.json",

                // 中等及以上屏幕使用导航 rail，紧凑屏使用底部导航栏。
                nav: {
                    drawerTitle: "导航",
                    items: [
                        { label: "首页", icon: "home", href: "/" },
                        {
                            label: "文章",
                            icon: "inventory_2",
                            href: "/archives",
                            activePattern: "^/(archives|blog|categories|tags)(/|$)",
                        },
                        {
                            label: "关于",
                            icon: "face",
                            href: "/about",
                            activePattern: "^/about",
                        },
                        {
                            label: "友链",
                            icon: "group",
                            href: "/friends",
                            activePattern: "^/friends",
                        },
                    ],
                    rssLabel: "RSS",
                    colorLabel: "配色",
                    themeLabel: "明暗",
                },

                // 页脚品牌语、社交链接和版权信息。
                footer: {
                    slogan: "愿你能被这个世界温柔以待，愿你我皆能在时光中安然前行。",
                    socialTitle: "找到我",
                    links: [
                        {
                            label: "GitHub",
                            href: "https://github.com/vahiru",
                            external: true,
                        },
                        {
                            label: "X (Twitter)",
                            href: "https://x.com/nekovahiru",
                            external: true,
                        },
                        {
                            label: "Telegram",
                            href: "https://t.me/vahiru",
                            external: true,
                        },
                        { label: "博客 RSS", href: "/rss.xml" },
                    ],
                },

                // 主题内置页面和组件使用的可见文案。
                labels: {
                    menu: "导航",
                    search: "搜索",
                    searchPlaceholder: "搜索文章…",
                    searchEmpty: "输入至少 2 个字符开始搜索",
                    searchNoResults: "没有找到匹配的文章",
                    untitled: "无标题",
                    noDate: "暂无日期",
                    backHome: "返回首页",
                    previousPost: "上一篇",
                    nextPost: "下一篇",
                    tocTitle: "本文目录",
                    noHeadings: "暂无目录",
                    customizeTheme: "自定义主题",
                    presetColors: "推荐配色",
                    customColor: "自定义颜色",
                    pickColor: "选择种子色",
                    close: "完成",
                    tagTitlePrefix: "标签: ",
                    categoryTitlePrefix: "分类: ",
                    postsCountTemplate: "共 {count} 篇文章",
                    archiveTitleTemplate: "归档 - 第 {page} 页",
                    archiveHeading: "文章归档",
                    archiveEyebrow: "LIBRARY · ARCHIVE",
                    archiveDescription: "沿着时间线翻阅全部文章，也可以从分类快速抵达感兴趣的主题。",
                    archiveTimelineTitle: "时间线",
                    archiveTimelineDescription: "从最近一次更新开始，依次回看过往记录。",
                    archiveBrowseDescription: "选择一个分类，继续探索同一主题下的文章。",
                    categoriesTitle: "分类",
                    noCategories: "暂无分类",
                    postsLabel: "文章",
                    yearsLabel: "年份",
                    categoryEyebrow: "CATEGORY · 分类",
                    tagEyebrow: "TAG · 标签",
                    taxonomyDescriptionTemplate: "浏览收录在「{name}」下的全部文章。",
                    backToArchives: "返回全部归档",
                    paginationLabel: "分页导航",
                    paginationPrevious: "上一页",
                    paginationNext: "下一页",
                    pageInfoTemplate: "第 {current} / {total} 页",
                },

                // 颜色选择器的默认色和预设色板。
                colorPicker: {
                    defaultColor: "#6750a4",
                    presetColors: [
                        "#6750a4",
                        "#9c4146",
                        "#006a6a",
                        "#5d5f00",
                        "#006e1c",
                    ],
                },

                // Waline 后端初始化完成后再在此配置 serverURL；未配置时不会加载评论客户端。
                // 启用时还需把后端源加入 public/_headers 的 CSP connect-src。
            },

            // 根项目已经自定义了这些页面，所以关闭主题自带的同名路由，避免构建冲突。
            pages: {
                "/archives/[...page]": false,
                "/blog/[...slug]": false,
                "/categories/[category]/[...page]": false,
                "/tags/[tag]/[...page]": false,
            },

            // 需要替换主题内部组件/布局时再填写。
            overrides: {},
        }),
    ],
});
