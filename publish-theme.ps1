# Publish theme submodule to Astro-Mochi-Tones repository

$ErrorActionPreference = "Stop"

$ThemePath = "themes/astro-mochi-tones"
$ThemeBranch = "main"

Write-Host "Publishing Astro-Mochi-Tones theme submodule..." -ForegroundColor Cyan

if (-not (Test-Path $ThemePath)) {
    Write-Host "Error: Theme submodule directory not found: $ThemePath" -ForegroundColor Red
    Write-Host "Run: git submodule update --init --recursive" -ForegroundColor Yellow
    exit 1
}

$rootStatus = git status --porcelain -- . ":(exclude)$ThemePath"
if ($rootStatus) {
    Write-Host "Error: Please commit or stash blog repository changes first." -ForegroundColor Red
    Write-Host "Theme changes inside $ThemePath can remain uncommitted until the next step." -ForegroundColor Yellow
    exit 1
}

Push-Location $ThemePath
try {
    $themeStatus = git status --porcelain
    if ($themeStatus) {
        Write-Host "Committing theme changes..." -ForegroundColor Yellow
        git add .
        git commit -m "Update theme"
    }

    Write-Host "Pushing theme repository to $ThemeBranch..." -ForegroundColor Yellow
    git push origin $ThemeBranch
}
finally {
    Pop-Location
}

Write-Host "Theme pushed successfully." -ForegroundColor Green
Write-Host "Now commit the updated submodule pointer in the blog repository:" -ForegroundColor Cyan
Write-Host "  git add themes/astro-mochi-tones .gitmodules package.json tsconfig.json publish-theme.ps1 GUIDE.md" -ForegroundColor Yellow
Write-Host "  git commit -m `"Update theme submodule`"" -ForegroundColor Yellow
