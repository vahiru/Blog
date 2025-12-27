# Publish theme to Astro-Mochi-Tones repository
# Uses git subtree to push package/ directory to theme repo

Write-Host "Publishing Astro-Mochi-Tones theme..." -ForegroundColor Cyan

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "Error: Please commit all changes first" -ForegroundColor Red
    Write-Host "Run: git add . && git commit -m 'your message'" -ForegroundColor Yellow
    exit 1
}

# First time setup: use split + force push to overwrite remote
Write-Host "Splitting package/ into a separate branch..." -ForegroundColor Yellow

# Create a temporary branch from the subtree
git subtree split --prefix=package -b temp-theme-branch

# Force push to theme-remote
Write-Host "Force pushing to theme-remote (Astro-Mochi-Tones)..." -ForegroundColor Yellow
git push theme-remote temp-theme-branch:main --force

# Clean up temp branch
git branch -D temp-theme-branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "Theme published successfully!" -ForegroundColor Green
}
else {
    Write-Host "Publish failed. Check error messages above." -ForegroundColor Red
}
