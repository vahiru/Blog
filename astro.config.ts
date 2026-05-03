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
                favicon: "/favicon.svg",
                defaultImage: "/images/default-og.jpg",
                rssPath: "/rss.xml",
                searchPath: "/search.json",

                // 左侧导航栏和移动端抽屉菜单。
                nav: {
                    drawerTitle: "Menu",
                    items: [
                        { label: "Home", icon: "home", href: "/" },
                        {
                            label: "Blog",
                            icon: "inventory_2",
                            href: "/archives",
                            activePattern: "^/archives",
                        },
                        {
                            label: "About",
                            icon: "face",
                            href: "/about",
                            activePattern: "^/about",
                        },
                        {
                            label: "Friends",
                            icon: "group",
                            href: "/friends",
                            activePattern: "^/friends",
                        },
                    ],
                    rssLabel: "RSS",
                    colorLabel: "Color",
                    themeLabel: "Theme",
                },

                // 页脚品牌语、社交链接和版权信息。
                footer: {
                    slogan: "愿你能被这个世界温柔以待，愿你我皆能在时光中安然前行。",
                    socialTitle: "Social",
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
                        { label: "Blog RSS", href: "/rss.xml" },
                    ],
                },

                // 主题内置页面和组件使用的可见文案。
                labels: {
                    menu: "Menu",
                    search: "Search",
                    searchPlaceholder: "Search...",
                    searchEmpty: "Type to search...",
                    searchNoResults: "No results found.",
                    untitled: "Untitled",
                    noDate: "暂无日期",
                    backHome: "返回首页",
                    previousPost: "Previous",
                    nextPost: "Next",
                    tocTitle: "On this page",
                    noHeadings: "No headings",
                    customizeTheme: "Customize Theme",
                    presetColors: "Preset Colors",
                    customColor: "Custom Color",
                    pickColor: "Pick a color",
                    close: "Close",
                    tagTitlePrefix: "标签: ",
                    categoryTitlePrefix: "分类: ",
                    postsCountTemplate: "共 {count} 篇文章",
                    archiveTitleTemplate: "归档 - 第 {page} 页",
                    categoriesTitle: "CATEGORIES",
                    noCategories: "暂无分类",
                    paginationPrevious: "Previous",
                    paginationNext: "Next",
                    pageInfoTemplate: "Page {current} of {total}",
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

                // Waline 评论系统；不配置 serverURL 时主题不会渲染评论区。
                waline: {
                    serverURL: "https://waline-fawn-nine.vercel.app",
                },
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
