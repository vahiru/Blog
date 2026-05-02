# Show the manual theme submodule publish checklist.

$ErrorActionPreference = "Stop"

$ThemePath = "themes/astro-mochi-tones"

Write-Host "Astro-Mochi-Tones theme submodule status" -ForegroundColor Cyan

if (-not (Test-Path $ThemePath)) {
    Write-Host "Error: Theme submodule directory not found: $ThemePath" -ForegroundColor Red
    Write-Host "Run: git submodule update --init --recursive" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Theme repository:" -ForegroundColor Cyan
git -C $ThemePath status --short --branch

Write-Host ""
Write-Host "Blog repository:" -ForegroundColor Cyan
git status --short --branch

Write-Host ""
Write-Host "Manual workflow:" -ForegroundColor Cyan
Write-Host "  cd $ThemePath" -ForegroundColor Yellow
Write-Host "  git switch main" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor Yellow
Write-Host "  git commit -m `"Update theme`"" -ForegroundColor Yellow
Write-Host "  git push origin main" -ForegroundColor Yellow
Write-Host "  cd ../.." -ForegroundColor Yellow
Write-Host "  git add $ThemePath" -ForegroundColor Yellow
Write-Host "  git commit -m `"Update theme submodule`"" -ForegroundColor Yellow
Write-Host "  git push origin main" -ForegroundColor Yellow
