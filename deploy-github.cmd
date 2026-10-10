@echo off
chcp 65001 > nul
title Aetheris AI Research Portal - GitHub 자동 배포 도우미
echo ======================================================================
echo   🌌 Aetheris AI Research Portal - GitHub 원클릭 배포 도우미
echo   대상 저장소: https://github.com/minhoya-ai/tech-research-corp
echo ======================================================================
echo.

cd /d "%~dp0"

:: 1. PATH 환경 변수에 Git 및 GitHub CLI 경로 강제 등록 (재부팅 불필요)
set "PATH=%PATH%;C:\Program Files\GitHub CLI;C:\Users\nulgi\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;C:\Users\nulgi\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\ucrt64\bin"

echo [1/4] Git 및 GitHub CLI 도구 점검 중...
where git > nul 2>&1
if errorlevel 1 (
    echo [오류] Git 실행 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)
echo [OK] Git 실행 준비 완료.

:: 2. 원격 저장소 URL 동기화
git remote remove origin > nul 2>&1
git remote add origin https://github.com/minhoya-ai/tech-research-corp.git
echo [OK] 원격 저장소 설정 완료: https://github.com/minhoya-ai/tech-research-corp.git
echo.

:: 3. GitHub 로그인 상태 확인
echo [2/4] GitHub 로그인 인증 상태 확인 중...
gh auth status > nul 2>&1
if errorlevel 1 (
    echo.
    echo ----------------------------------------------------------------------
    echo ⚠️  GitHub 로그인이 필요합니다.
    echo    잠시 후 기본 웹 브라우저가 자동으로 열립니다.
    echo    화면에 표시되는 8자리 일회용 코드를 브라우저에 입력하고 [Continue]를 눌러주세요.
    echo ----------------------------------------------------------------------
    echo.
    gh auth login --web -h github.com
    gh auth setup-git
) else (
    echo [OK] GitHub 로그인 인증이 이미 완료되어 있습니다.
    gh auth setup-git > nul 2>&1
)

echo.
echo [3/4] GitHub 'main' 브랜치로 파일 업로드(푸시)를 시작합니다...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ======================================================================
    echo ❌ 푸시 중 오류가 발생했습니다.
    echo    원인: GitHub 저장소 쓰기 권한이 없거나 네트워크 연결 확인이 필요합니다.
    echo ======================================================================
    echo.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo 🎉 파일 업로드(푸시)가 성공적으로 완료되었습니다!
echo.
echo 📌 [마지막 단계: GitHub Pages 활성화하기 (1회만 진행)]
echo 1. 아래 주소로 접속합니다:
echo    👉 https://github.com/minhoya-ai/tech-research-corp/settings/pages
echo.
echo 2. 'Build and deployment' 아래의 'Source' 드롭다운을:
echo    👉 [GitHub Actions] 로 변경합니다!
echo.
echo 3. 약 1분 후 배포가 완료되며 아래 공식 주소로 사이트가 오픈됩니다:
echo    🌐 https://minhoya-ai.github.io/tech-research-corp/
echo ======================================================================
echo.
pause
