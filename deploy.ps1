# ==============================================================================
# Aetheris AI Research Portal - GitHub Deployment (minhoya-ai)
# ==============================================================================

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") + ";C:\Program Files\GitHub CLI;C:\Users\nulgi\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"

Set-Location $PSScriptRoot

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Aetheris AI Portal - Deploy to GitHub (minhoya-ai)" -ForegroundColor Cyan
Write-Host "  Target: https://github.com/minhoya-ai/tech-research-corp" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Set origin remote
git remote remove origin 2>$null
git remote add origin https://github.com/minhoya-ai/tech-research-corp.git

Write-Host "Please enter your GitHub Personal Access Token (PAT) for minhoya-ai:" -ForegroundColor Yellow
$token = Read-Host "Token (starts with ghp_)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host ""
    Write-Host "[ERROR] Token cannot be empty. Aborted." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

$token = $token.Trim()

Write-Host ""
Write-Host "[Uploading files to GitHub main branch...]" -ForegroundColor Green
Write-Host ""

# Push to GitHub repository using token
git push -u "https://minhoya-ai:$token@github.com/minhoya-ai/tech-research-corp.git" main

if ($LASTEXITCODE -eq 0) {
    # Store credential for future pushes without asking again
    git config credential.helper store
    git remote set-url origin https://github.com/minhoya-ai/tech-research-corp.git
    
    Write-Host ""
    Write-Host "======================================================================" -ForegroundColor Green
    Write-Host "SUCCESS! All files have been uploaded to minhoya-ai/tech-research-corp" -ForegroundColor Green
    Write-Host ""
    Write-Host "NEXT STEP: Enable GitHub Pages" -ForegroundColor Yellow
    Write-Host "1. Visit: https://github.com/minhoya-ai/tech-research-corp/settings/pages" -ForegroundColor White
    Write-Host "2. Set 'Source' to 'GitHub Actions'" -ForegroundColor White
    Write-Host "3. Your site will be live at:" -ForegroundColor White
    Write-Host "   https://minhoya-ai.github.io/tech-research-corp/" -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERROR] Push failed. Please check your token permissions (repo scope required)." -ForegroundColor Red
}

Write-Host ""
Read-Host "Done. Press Enter to exit..."
