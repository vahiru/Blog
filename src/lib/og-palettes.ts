// 本文件由 scripts/build-og-palettes.mjs 生成，请勿手动编辑。
// 数值来自 Material 3 官方算法（@material/material-color-utilities）对
// astro.config.ts 中 colorPicker.presetColors 各个种子色展开出的亮色方案。

export interface OgPalette {
    /** 卡片底色，secondary-container = secondary.tone(90) */
    surface: string;
    /** 卡片上的文字，on-secondary-container = secondary.tone(10) */
    onSurface: string;
    /** 小面积强调色，primary = primary.tone(40) */
    accent: string;
    /** 画布底色，surface-container = neutral.tone(94) */
    page: string;
    /** 药丸/头像底色，surface-container-lowest = neutral.tone(100) */
    pill: string;
}

export const OG_PALETTES: readonly OgPalette[] = [
    {
        // 种子色 #6750a4
        surface: "#e8def8",
        onSurface: "#1e192b",
        accent: "#6750a4",
        page: "#f2ecf1",
        pill: "#ffffff",
    },
    {
        // 种子色 #9c4146
        surface: "#ffdad9",
        onSurface: "#2c1515",
        accent: "#9c4146",
        page: "#f8ebea",
        pill: "#ffffff",
    },
    {
        // 种子色 #006a6a
        surface: "#cce8e7",
        onSurface: "#051f1f",
        accent: "#006a6a",
        page: "#eceeed",
        pill: "#ffffff",
    },
    {
        // 种子色 #5d5f00
        surface: "#e6e4c0",
        onSurface: "#1c1d06",
        accent: "#606200",
        page: "#f1eee5",
        pill: "#ffffff",
    },
    {
        // 种子色 #006e1c
        surface: "#d5e8cf",
        onSurface: "#111f0f",
        accent: "#006e1c",
        page: "#eeeee8",
        pill: "#ffffff",
    },
];
