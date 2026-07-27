/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

interface OgImageInput {
  title: string;
  description?: string;
  date: Date;
  categories?: string[];
  tags?: string[];
}

const WIDTH = 1200;
const HEIGHT = 630;

const palettes = {
  journal: {
    background: "#f5eeea",
    surface: "#fff8f5",
    surfaceHigh: "#f0e4de",
    primary: "#755846",
    primaryContainer: "#ffdbc8",
    onPrimaryContainer: "#2c160b",
    secondary: "#655c57",
    tertiaryContainer: "#d9e7cb",
    onSurface: "#201a17",
    onSurfaceVariant: "#51443d",
    outline: "#d6c4bb",
  },
  tech: {
    background: "#edf3f1",
    surface: "#f7fffc",
    surfaceHigh: "#dfe9e6",
    primary: "#25665f",
    primaryContainer: "#a9f2e7",
    onPrimaryContainer: "#00201d",
    secondary: "#4a6360",
    tertiaryContainer: "#cde5ff",
    onSurface: "#171d1b",
    onSurfaceVariant: "#3f4947",
    outline: "#bdcac6",
  },
  guide: {
    background: "#eef2f8",
    surface: "#f9f9ff",
    surfaceHigh: "#e2e7f0",
    primary: "#405f91",
    primaryContainer: "#d6e3ff",
    onPrimaryContainer: "#001b3e",
    secondary: "#565f71",
    tertiaryContainer: "#f5d9ff",
    onSurface: "#191c20",
    onSurfaceVariant: "#43474e",
    outline: "#c3c6cf",
  },
} as const;

const fontData = readFile(join(process.cwd(), "src/assets/og/NotoSansSC-Regular.ttf"));

function selectPalette(categories: string[] = []) {
  if (categories.includes("随笔")) return palettes.journal;
  if (categories.includes("Guide")) return palettes.guide;
  return palettes.tech;
}

function shorten(value: string, maxLength: number) {
  const characters = Array.from(value.trim());
  return characters.length > maxLength
    ? `${characters.slice(0, maxLength - 1).join("")}…`
    : characters.join("");
}

function formatDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function titleSize(title: string) {
  const length = Array.from(title).length;
  if (length > 34) return 48;
  if (length > 22) return 56;
  return 66;
}

function CatMark({ color, surface }: { color: string; surface: string }) {
  return (
    <div style={{ position: "relative", display: "flex", width: 66, height: 62 }}>
      <div style={{ position: "absolute", left: 7, top: 2, width: 24, height: 24, borderRadius: 5, background: color, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", right: 7, top: 2, width: 24, height: 24, borderRadius: 5, background: color, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", left: 4, top: 13, display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 48, borderRadius: 22, background: color }}>
        <div style={{ display: "flex", gap: 15, marginTop: 2 }}>
          <div style={{ width: 6, height: 9, borderRadius: 8, background: surface }} />
          <div style={{ width: 6, height: 9, borderRadius: 8, background: surface }} />
        </div>
      </div>
    </div>
  );
}

export async function generateOgImage(input: OgImageInput) {
  const palette = selectPalette(input.categories);
  const title = shorten(input.title, 48);
  const description = shorten(input.description || "一篇来自 Vahiru Blog 的文章。", 96);
  const category = input.categories?.[0] || "文章";
  const tags = (input.tags || []).slice(0, 3);
  const texture = Array.from({ length: 64 }, (_, index) => ({
    left: 18 + ((index * 173) % 1160),
    top: 14 + ((index * 97) % 600),
    size: index % 5 === 0 ? 3 : 2,
    opacity: index % 3 === 0 ? 0.12 : 0.07,
  }));

  const svg = await satori(
    <div
      lang="zh-CN"
      style={{
        position: "relative",
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        padding: 42,
        background: palette.background,
        color: palette.onSurface,
        fontFamily: "Noto Sans SC",
        overflow: "hidden",
      }}
    >
      {texture.map((dot) => (
        <div
          style={{
            position: "absolute",
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            borderRadius: 4,
            background: palette.primary,
            opacity: dot.opacity,
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "34px 42px 32px",
          border: `1px solid ${palette.outline}`,
          borderRadius: 34,
          background: palette.surface,
          boxShadow: "0 12px 30px rgba(45, 30, 22, 0.10)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: 0, top: 0, width: 250, height: 12, borderBottomLeftRadius: 12, background: palette.primaryContainer }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 180, height: 12, borderTopLeftRadius: 12, background: palette.tertiaryContainer }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", width: 74, height: 74, alignItems: "center", justifyContent: "center", borderRadius: 24, background: palette.primaryContainer }}>
              <CatMark color={palette.primary} surface={palette.surface} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 25, color: palette.primary }}>Vahiru Blog</div>
              <div style={{ marginTop: 2, fontSize: 16, color: palette.onSurfaceVariant, letterSpacing: 1.2 }}>STORIES · NOTES · LIFE</div>
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px 18px", borderRadius: 18, background: palette.surfaceHigh, color: palette.secondary, fontSize: 18 }}>
            vahiru.is-cute.cat
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", width: 930, paddingTop: 16 }}>
          <div style={{ fontSize: titleSize(title), lineHeight: 1.18, letterSpacing: 0, color: palette.onSurface }}>
            {title}
          </div>
          <div style={{ width: 72, height: 6, margin: "22px 0 18px", borderRadius: 6, background: palette.primary }} />
          <div style={{ fontSize: 25, lineHeight: 1.5, color: palette.onSurfaceVariant }}>
            {description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", padding: "10px 16px", borderRadius: 14, background: palette.primaryContainer, color: palette.onPrimaryContainer, fontSize: 18 }}>
              {category}
            </div>
            {tags.map((tag) => (
              <div style={{ display: "flex", padding: "9px 14px", border: `1px solid ${palette.outline}`, borderRadius: 14, color: palette.secondary, fontSize: 17 }}>
                #{tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: palette.onSurfaceVariant }}>
            <span style={{ fontSize: 17 }}>written by Vahiru</span>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: palette.primary }} />
            <span style={{ fontSize: 20 }}>{formatDate(input.date)}</span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Noto Sans SC",
          data: await fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  return new Resvg(svg, {
    background: palette.background,
    fitTo: { mode: "width", value: WIDTH },
  }).render().asPng();
}
