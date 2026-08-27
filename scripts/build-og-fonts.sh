#!/usr/bin/env bash
# 生成社交预览图（OG image）用的中文字体。
#
# satori 需要 TTF/OTF 且不支持可变字重，所以每个字重都得是一个静态文件。
# 这里从 Noto Sans SC 可变字体实例化出 Regular(400) 和 Medium(500) 两个字重，
# 并子集化到同一套码位（约 7600 个，含 6766 个基本汉字），每个约 3.5 MB。
#
# 依赖：python3 + fonttools + brotli
#   python3 -m pip install fonttools brotli
#
# 用法：bash scripts/build-og-fonts.sh
set -euo pipefail

OUT_DIR="src/assets/og"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

VF_URL="https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"

echo "下载可变字体…"
curl -fsSL -o "$WORK/NotoSansSC-VF.ttf" "$VF_URL"

python3 - "$WORK" "$OUT_DIR" <<'PY'
import sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.subset import Subsetter, Options

work, out_dir = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
reference = out_dir / "NotoSansSC-Regular.ttf"

# 沿用现有 Regular 的码位集合，保证换字重不会改变可用字符范围。
if reference.exists():
    unicodes = set(TTFont(reference).getBestCmap())
    print(f"沿用现有码位集合: {len(unicodes)} 个")
else:
    # 首次生成时的兜底：ASCII + 常用标点 + 基本汉字 + 全角标点
    unicodes = set(range(0x20, 0x7F)) | set(range(0x2000, 0x206F)) \
        | set(range(0x3000, 0x303F)) | set(range(0x4E00, 0xA000)) \
        | set(range(0xFF00, 0xFF61)) | {0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x00B7}
    print(f"使用默认码位集合: {len(unicodes)} 个")

for weight, name in ((400, "Regular"), (500, "Medium")):
    font = TTFont(work / "NotoSansSC-VF.ttf")
    instantiateVariableFont(font, {"wght": weight}, inplace=True, updateFontNames=True)

    options = Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)

    target = out_dir / f"NotoSansSC-{name}.ttf"
    font.save(target)
    print(f"{target}  {target.stat().st_size:,} bytes  字形 {font['maxp'].numGlyphs}")
PY
