/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { OG_PALETTES, type OgPalette } from "./og-palettes";

interface OgImageInput {
  title: string;
  description?: string;
  date: Date;
  categories?: string[];
  tags?: string[];
}

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Material 3 字阶。数值是官方 token 乘以 1.4：预览图会被社交平台缩到
 * 一半左右显示，直接用界面尺寸会看不清，但字号之间的比例、行高和字距关系保持不变。
 */
const TYPE = {
  displayLarge: { fontSize: 80, lineHeight: 1.12, letterSpacing: -2.8 },
  displayMedium: { fontSize: 63, lineHeight: 1.16, letterSpacing: -1.4 },
  displaySmall: { fontSize: 50, lineHeight: 1.24, letterSpacing: 0 },
  headlineSmall: { fontSize: 34, lineHeight: 1.33, letterSpacing: 0 },
  titleLarge: { fontSize: 31, lineHeight: 1.27, letterSpacing: 0 },
  bodyLarge: { fontSize: 25, lineHeight: 1.5, letterSpacing: 0.7 },
  labelLarge: { fontSize: 20, lineHeight: 1.43, letterSpacing: 0.14 },
} as const;

/** Material 3 形状标度，同样按 1.4 放大（extra-large 28 → 40，等等）。 */
const SHAPE = {
  medium: 17,
  large: 22,
  extraLarge: 40,
  extraExtraLarge: 56,
  full: 999,
} as const;

const fontRegular = readFile(join(process.cwd(), "src/assets/og/NotoSansSC-Regular.ttf"));
const fontMedium = readFile(join(process.cwd(), "src/assets/og/NotoSansSC-Medium.ttf"));
const brandMark = readFile(join(process.cwd(), "public/favicon.png"));

/**
 * 配色表由 MD3 官方算法从主题的 colorPicker.presetColors 预生成
 * （见 scripts/build-og-palettes.mjs）。按分类名做确定性取模：新分类会自动
 * 分到一个颜色，同一分类每次构建结果一致。取模方式与 PostCard 挑占位色一致。
 */
function paletteForCategory(categories: string[] = []): OgPalette {
  const key = categories[0];
  if (!key) return OG_PALETTES[0];
  const sum = [...key].reduce((total, character) => total + (character.codePointAt(0) ?? 0), 0);
  return OG_PALETTES[sum % OG_PALETTES.length];
}

/** 把 #rrggbb 转成带透明度的 rgba()，用于状态层和描边。 */
function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 内容区宽度（画布减去左右 72px 内边距），文本装配以此为准。 */
const CONTENT_WIDTH = WIDTH - 72 * 2;

/** 全角字符按 1em 估宽，其余按 0.55em——用来估算折行足够精确。 */
const emWidth = (character: string) =>
  /[\u3000-\u9fff\uff00-\uffef]/.test(character) ? 1 : 0.55;

interface FitStep {
  style: { fontSize: number; lineHeight: number; letterSpacing: number };
  maxLines: number;
}

/**
 * 在给定字号档位里挑第一个能把文本放进 maxLines 行的档，并按宽度预算截断。
 * 相比按字数截断，中英混排的标题不会再被切在半个单词上。
 */
function fitText(value: string, steps: readonly FitStep[]) {
  const characters = Array.from(value.trim());
  const totalEm = characters.reduce((sum, character) => sum + emWidth(character), 0);

  for (const step of steps) {
    if (totalEm <= (step.maxLines * CONTENT_WIDTH) / step.style.fontSize) {
      return { text: characters.join(""), style: step.style };
    }
  }

  // 所有档位都放不下：用最小档，按宽度预算截断，并给省略号留出位置。
  const last = steps[steps.length - 1];
  const budgetEm = (last.maxLines * CONTENT_WIDTH) / last.style.fontSize - 1.2;
  let used = 0;
  const kept: string[] = [];
  for (const character of characters) {
    used += emWidth(character);
    if (used > budgetEm) break;
    kept.push(character);
  }
  return { text: `${kept.join("").trimEnd()}…`, style: last.style };
}

function formatDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/** 标题在 display 三档之间降级；短标题给两行，长标题放宽到三行。 */
const TITLE_STEPS = [
  { style: TYPE.displayLarge, maxLines: 2 },
  { style: TYPE.displayMedium, maxLines: 2 },
  { style: TYPE.displaySmall, maxLines: 3 },
] as const;

/** 摘要固定 body-large，最多两行。 */
const DESCRIPTION_STEPS = [{ style: TYPE.bodyLarge, maxLines: 2 }] as const;

export async function generateOgImage(input: OgImageInput) {
  const color = paletteForCategory(input.categories);
  const title = fitText(input.title, TITLE_STEPS);
  const description = fitText(
    input.description || "一篇来自 Vahiru Blog 的文章。",
    DESCRIPTION_STEPS,
  );
  const category = input.categories?.[0] || "文章";
  const tags = (input.tags || []).slice(0, 3);
  const brandMarkSrc = `data:image/png;base64,${(await brandMark).toString("base64")}`;

  const svg = await satori(
    /*
      颜色直接铺满整张画布：社交平台展示预览图时自己会加圆角和边框，
      图里再嵌一层圆角卡片就成了「框中框」。装饰沿用站点 hero 的
      描边圆环；底色用 secondary-container 以保证任何色相都柔和。
    */
    <div
      lang="zh-CN"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: WIDTH,
        height: HEIGHT,
        padding: "64px 72px",
        background: color.surface,
        color: color.onSurface,
        fontFamily: "Noto Sans SC",
        overflow: "hidden",
      }}
    >
        <div
          style={{
            position: "absolute",
            right: -200,
            bottom: -430,
            width: 700,
            height: 700,
            borderRadius: SHAPE.full,
            border: `2px solid ${withAlpha(color.onSurface, 0.14)}`,
          }}
        />
        {/* 顶部：品牌标识 + 分类 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                width: 76,
                height: 76,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: SHAPE.large,
                background: color.pill,
                overflow: "hidden",
              }}
            >
              <img src={brandMarkSrc} width={76} height={76} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ ...TYPE.titleLarge, fontWeight: 500 }}>Vahiru Blog</div>
              <div
                style={{
                  ...TYPE.labelLarge,
                  marginTop: 2,
                  color: withAlpha(color.onSurface, 0.68),
                }}
              >
                vahiru.is-cute.cat
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "13px 26px",
              borderRadius: SHAPE.full,
              background: color.pill,
              color: color.accent,
              ...TYPE.labelLarge,
              fontWeight: 500,
              letterSpacing: 1.6,
            }}
          >
            {category}
          </div>
        </div>

        {/* 中部：标题 + 摘要 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            width: CONTENT_WIDTH,
          }}
        >
          {/* balance 让多行标题两行长度均衡，避免「…完全指 / 南」这种孤字折行。 */}
          <div style={{ ...title.style, fontWeight: 500, textWrap: "balance" }}>{title.text}</div>
          <div
            style={{
              ...description.style,
              marginTop: 24,
              color: withAlpha(color.onSurface, 0.78),
            }}
          >
            {description.text}
          </div>
        </div>

        {/* 底部：标签 + 日期 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 28,
            borderTop: `1px solid ${withAlpha(color.onSurface, 0.16)}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {tags.map((tag) => (
              <div
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  border: `1.5px solid ${withAlpha(color.onSurface, 0.28)}`,
                  borderRadius: SHAPE.full,
                  color: withAlpha(color.onSurface, 0.82),
                  ...TYPE.labelLarge,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              ...TYPE.titleLarge,
              fontWeight: 500,
              letterSpacing: 0.8,
              color: color.accent,
            }}
          >
            {formatDate(input.date)}
          </div>
        </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Noto Sans SC", data: await fontRegular, weight: 400, style: "normal" },
        { name: "Noto Sans SC", data: await fontMedium, weight: 500, style: "normal" },
      ],
    },
  );

  return new Resvg(svg, {
    background: color.surface,
    fitTo: { mode: "width", value: WIDTH },
  }).render().asPng();
}
