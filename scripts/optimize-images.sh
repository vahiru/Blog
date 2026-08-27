#!/usr/bin/env bash
# 压缩图片源文件。
#
# src/assets/images/ 下的图片会经过 astro:assets 按需生成多尺寸 WebP，构建产物
# 已经是最优的；这里压缩源文件是为了控制仓库体积和构建耗时。
# public/images/ 下的图片（社交预览用的 cover.jpg 等）会被原样发布，
# 源文件尺寸就是访客下载的尺寸，必须压好。
#
# 用法：bash scripts/optimize-images.sh [目录…，默认 src/assets/images public/images]
set -euo pipefail

if [ "$#" -gt 0 ]; then
    TARGETS=("$@")
else
    TARGETS=("src/assets/images" "public/images")
fi
# 正文栏宽上限是 820px，按 2x 高清屏取 1600 已经足够；再大的像素肉眼看不出差别。
MAX_EDGE=1600
QUALITY=82             # 视觉上接近无损，体积约为 q100 的 1/10

total_before=0
total_after=0

while IFS= read -r -d '' img; do
    before=$(stat -c%s "$img")
    tmp=$(mktemp --suffix=.jpg)
    magick "$img" \
        -auto-orient \
        -resize "${MAX_EDGE}x${MAX_EDGE}>" \
        -colorspace sRGB \
        -sampling-factor 4:2:0 \
        -interlace JPEG \
        -strip \
        -quality "$QUALITY" \
        "$tmp"
    after=$(stat -c%s "$tmp")
    # 已经压过的图再编码一次只会掉画质，收益不足 3% 就保留原文件。
    if [ "$after" -lt $((before * 97 / 100)) ]; then
        mv "$tmp" "$img"
    else
        rm -f "$tmp"
        after=$before
    fi
    total_before=$((total_before + before))
    total_after=$((total_after + after))
    printf '%-52s %8s -> %8s  (%d%%)\n' "$img" "$before" "$after" $((after * 100 / before))
done < <(find "${TARGETS[@]}" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

printf '\n合计 %s -> %s bytes\n' "$total_before" "$total_after"
