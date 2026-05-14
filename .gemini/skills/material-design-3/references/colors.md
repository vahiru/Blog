# M3 色彩系统 (HCT & Tonal Palettes)

Material Design 3 的色彩系统基于 **HCT (Hue, Chroma, Tone)** 色彩空间，旨在实现感知一致性和自动化的无障碍对比度。

## HCT 核心维度
- **Hue (色相):** 颜色的种类。
- **Chroma (彩度):** 颜色的鲜艳度，类似于饱和度。
- **Tone (色调):** 感知亮度（0 为黑，100 为白）。**这是决定无障碍对比度的唯一因素。**

## 色阶调色板 (Tonal Palettes)
系统根据种子色生成 5 组调色板，每组包含 13 个固定色阶：
`0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100`

## 无障碍对比度准则
- **文本对比度:** 前景与背景的 Tone 值之差应 $\ge 50$ 以达到 AA 级标准。
- **色彩角色对应关系:**
    *   `Primary` (Tone 40) 对应 `On Primary` (Tone 100)。
    *   `Primary Container` (Tone 90) 对应 `On Primary Container` (Tone 10)。

## 表面角色 (Surface Roles)
M3 引入了 5 种表面高度，通过色调覆盖层表现层级：
1. **Level 0 (Lowest):** 基准表面。
2. **Level 1 (Low):** 略微提升。
3. **Level 2 (Default):** 标准提升。
4. **Level 3 (High):** 显著提升。
5. **Level 4 (Highest):** 最高提升。
