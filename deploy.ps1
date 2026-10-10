# ==============================================================================
# Aetheris AI Research Portal - GitHub Deployment (minhoya-ai Dedicated)
# ==============================================================================

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") + ";C:\Program Files\GitHub CLI;C:\Users\nulgi\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"

Set-Location $PSScriptRoot

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  🌌 Aetheris AI Portal - minhoya-ai 계정 전용 푸시 도우미" -ForegroundColor Cyan
Write-Host "  저장소: https://github.com/minhoya-ai/tech-research-corp" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 원격 저장소 설정
git remote remove origin 2>$null
git remote add origin https://github.com/minhoya-ai/tech-research-corp.git

# 토큰 입력받기
Write-Host "기존 minhoya-ai 계정의 GitHub Personal Access Token을 입력해주세요." -ForegroundColor Yellow
$token = Read-Host "minhoya-ai 액세스 토큰 붙여넣기 (ghp_...)"
$token = $token.Trim()

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "`n[오류] 토큰이 입력되지 않았습니다." -ForegroundColor Red
    Read-Host "종료하려면 Enter를 누르세요..."
    return
}

Write-Host "`n[minhoya-ai 계정으로 GitHub 업로드 진행 중...]`n" -ForegroundColor Green

# 자격 증명 저장 활성화 (이후 재입력 방지)
git config credential.helper store

# 푸시 실행
git push -u "https://minhoya-ai:$token@github.com/minhoya-ai/tech-research-corp.git" main

if ($LASTEXITCODE -eq 0) {
    # 원격 URL을 깨끗한 URL로 재설정 (토큰 노출 방지)
    git remote set-url origin https://github.com/minhoya-ai/tech-research-corp.git
    
    Write-Host "`n======================================================================" -ForegroundColor Green
    Write-Host "🎉 업로드 성공! 모든 파일이 minhoya-ai/tech-research-corp 에 푸시되었습니다." -ForegroundColor Green
    Write-Host ""
    Write-Host "📌 [GitHub Pages 활성화 바로가기]" -ForegroundColor Yellow
    Write-Host "👉 https://github.com/minhoya-ai/tech-research-corp/settings/pages" -ForegroundColor White
    Write-Host "   (Source를 'GitHub Actions'로 선택하시면 배포 완료됩니다)"
    Write-Host ""
    Write-Host "🌐 공식 웹사이트 주소:" -ForegroundColor Cyan
    Write-Host "👉 https://minhoya-ai.github.io/tech-research-corp/" -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Green
} else {
    Write-Host "`n[오류] 푸시 실패. 토큰 유효 기간 및 권한(repo)을 확인해주세요." -ForegroundColor Red
}

Write-Host ""
Read-Host "창을 닫으려면 Enter를 누르세요..."
