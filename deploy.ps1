# ==============================================================================
# Aetheris AI Research Portal - GitHub Deployment Script
# Target: https://github.com/minhoya-ai/tech-research-corp
# ==============================================================================

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Update PATH to guarantee Git and GitHub CLI availability
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") + ";C:\Program Files\GitHub CLI;C:\Users\nulgi\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"

Set-Location $PSScriptRoot

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  🌌 Aetheris AI Research Portal - GitHub 원클릭 자동 배포" -ForegroundColor Cyan
Write-Host "  대상 저장소: https://github.com/minhoya-ai/tech-research-corp" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. 원격 저장소 URL 갱신
git remote remove origin 2>$null
git remote add origin https://github.com/minhoya-ai/tech-research-corp.git
Write-Host "[OK] 원격 저장소 연결 확인 완료." -ForegroundColor Green
Write-Host ""

# 2. 인증 방식 안내
Write-Host "[인증 방식 선택]" -ForegroundColor Yellow
Write-Host "1. GitHub 개인 액세스 토큰(Token)으로 즉시 업로드 (가장 추천 ⭐)"
Write-Host "2. GitHub CLI 웹 브라우저 로그인 (gh auth login)"
Write-Host ""
$choice = Read-Host "선택할 번호를 입력하세요 (1 또는 2, 기본값: 1)"

if ($choice -eq "2") {
    Write-Host "`n[GitHub CLI 웹 로그인을 시작합니다...]`n" -ForegroundColor Yellow
    Write-Host "브라우저가 열리면 화면에 표시되는 8자리 일회용 코드를 입력하고 승인하세요.`n"
    gh auth login --web -h github.com
    gh auth setup-git
    Write-Host "`n[파일 업로드 진행 중...]`n" -ForegroundColor Green
    git push -u origin main
} else {
    Write-Host "`n[GitHub 토큰 발급 페이지를 웹 브라우저로 엽니다...]" -ForegroundColor Yellow
    Start-Process "https://github.com/settings/tokens/new?scopes=repo&description=tech-research-corp"
    Write-Host "----------------------------------------------------------------------"
    Write-Host "1. 브라우저 화면 맨 아래의 초록색 [Generate token] 버튼을 클릭하세요."
    Write-Host "2. 발급된 'ghp_' 로 시작하는 토큰을 복사하세요."
    Write-Host "----------------------------------------------------------------------`n"
    
    $token = Read-Host "복사한 GitHub 토큰을 여기에 붙여넣기(Ctrl+V 또는 마우스 우클릭)"
    $token = $token.Trim()
    
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "`n[오류] 토큰이 입력되지 않았습니다. 작업을 중단합니다." -ForegroundColor Red
        Read-Host "계속하려면 Enter를 누르세요..."
        return
    }
    
    Write-Host "`n[GitHub 'main' 브랜치로 파일 업로드 진행 중...]`n" -ForegroundColor Green
    git push -u "https://minhoya-ai:$token@github.com/minhoya-ai/tech-research-corp.git" main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n======================================================================" -ForegroundColor Green
    Write-Host "🎉 모든 웹사이트 파일이 GitHub에 성공적으로 업로드되었습니다!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📌 [마지막 단계: GitHub Pages 활성화]" -ForegroundColor Yellow
    Write-Host "1. 아래 주소로 접속합니다:"
    Write-Host "   👉 https://github.com/minhoya-ai/tech-research-corp/settings/pages" -ForegroundColor White
    Write-Host "2. 'Source' 드롭다운을 [GitHub Actions] 로 변경합니다."
    Write-Host "3. 약 1분 후 아래 공식 주소로 사이트가 오픈됩니다:"
    Write-Host "   🌐 https://minhoya-ai.github.io/tech-research-corp/" -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Green
} else {
    Write-Host "`n[오류] 업로드에 실패했습니다. 토큰에 'repo' 권한이 체크되어 있는지 확인해주세요." -ForegroundColor Red
}

Write-Host ""
Read-Host "완료되었습니다. 창을 닫으려면 Enter를 누르세요..."
