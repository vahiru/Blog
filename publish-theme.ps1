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

# Push package/ directory to origin (Astro-Mochi-Tones repo)
Write-Host "Pushing package/ to origin..." -ForegroundColor Yellow

git subtree push --prefix=package origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Theme published successfully!" -ForegroundColor Green
}
else {
    Write-Host "Publish failed. Check error messages above." -ForegroundColor Red
}
