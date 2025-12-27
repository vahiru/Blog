# 发布主题到 Astro-Mochi-Tones 仓库
# 使用 git subtree 将 package/ 目录推送到主题仓库

Write-Host "🍡 Publishing Astro-Mochi-Tones theme..." -ForegroundColor Cyan

# 确保所有更改已提交
$status = git status --porcelain
if ($status) {
    Write-Host "❌ 请先提交所有更改" -ForegroundColor Red
    exit 1
}

# 推送 package/ 目录到 origin (Astro-Mochi-Tones 仓库)
Write-Host "📦 Pushing package/ to origin..." -ForegroundColor Yellow

git subtree push --prefix=package origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 主题发布成功!" -ForegroundColor Green
} else {
    Write-Host "❌ 发布失败，请检查错误信息" -ForegroundColor Red
}
