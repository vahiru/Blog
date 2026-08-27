/**
 * 生成社交预览图用的 Material 3 配色表（src/lib/og-palettes.ts）。
 *
 * 为什么要预生成：@material/material-color-utilities 的内部 ESM 导入没有写 .js
 * 后缀，Node 无法直接加载，而 Vite 的 ssr.noExternal 在 Astro 的静态构建阶段
 * 不生效。种子色只有固定几个，所以在这里用官方算法算一次并落成常量，
 * 构建期就不再需要这个依赖了。
 *
 * 改了 SEED_COLORS（应与 astro.config.ts 里 colorPicker.presetColors 保持一致）后重跑：
 *   node scripts/build-og-palettes.mjs
 */

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

// 与 astro.config.ts 的 colorPicker.presetColors 一致。
const SEED_COLORS = ["#6750a4", "#9c4146", "#006a6a", "#5d5f00", "#006e1c"];

const workDir = await mkdtemp(join(tmpdir(), "og-palettes-"));

try {
    // 先把库打成单文件 ESM，绕开缺后缀的相对导入。
    const bundlePath = join(workDir, "mcu.mjs");
    await esbuild.build({
        stdin: {
            contents: `export { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";`,
            resolveDir: process.cwd(),
            loader: "js",
        },
        bundle: true,
        format: "esm",
        platform: "node",
        outfile: bundlePath,
        logLevel: "warning",
    });

    const { argbFromHex, hexFromArgb, themeFromSourceColor } = await import(
        pathToFileURL(bundlePath).href
    );

    const palettes = SEED_COLORS.map((seed) => {
        const theme = themeFromSourceColor(argbFromHex(seed));
        const roles = theme.schemes.light.toJSON();
        const neutral = theme.palettes.neutral;

        /*
         * 大面积底色用 secondary-container 而不是 primary-container：
         * M3 的 primary 色板有彩度下限（48），青色、绿色这类色相在 tone 90
         * 依然非常鲜艳，铺满 1200×630 会刺眼；secondary 色板彩度上限是 16，
         * 任何种子色都能得到柔和的浅色调。primary 留给分类标签等小面积强调。
         */
        return {
            seed,
            surface: hexFromArgb(roles.secondaryContainer),
            onSurface: hexFromArgb(roles.onSecondaryContainer),
            accent: hexFromArgb(roles.primary),
            page: hexFromArgb(neutral.tone(94)),
            pill: hexFromArgb(neutral.tone(100)),
        };
    });

    const entries = palettes
        .map((palette) => {
            const body = Object.entries(palette)
                .filter(([key]) => key !== "seed")
                .map(([key, value]) => `        ${key}: "${value}",`)
                .join("\n");
            return `    {\n        // 种子色 ${palette.seed}\n${body}\n    },`;
        })
        .join("\n");

    const output = `// 本文件由 scripts/build-og-palettes.mjs 生成，请勿手动编辑。
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
${entries}
];
`;

    const target = join(process.cwd(), "src/lib/og-palettes.ts");
    await writeFile(target, output, "utf8");
    console.log(`已写入 ${target}`);
    for (const palette of palettes) {
        console.log(`  ${palette.seed} → surface ${palette.surface}  on ${palette.onSurface}  accent ${palette.accent}`);
    }
} finally {
    await rm(workDir, { recursive: true, force: true });
}
