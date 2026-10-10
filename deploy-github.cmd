@echo off
chcp 65001 > nul
title Aetheris AI Portal - GitHub Pages 배포 도우미
echo ======================================================================
echo   Aetheris AI Research Portal - GitHub 원격 연결 및 배포 도우미
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Git 상태 확인 중...
git status > nul 2>&1
if errorlevel 1 (
    echo [오류] Git 저장소가 감지되지 않았습니다.
    pause
    exit /b 1
)

echo [OK] 로컬 커밋 상태 확인 완료!
echo.
echo ======================================================================
echo [안내] GitHub(https://github.com/new)에서 생성한 레포지토리 주소를 입력하세요.
echo 예시: https://github.com/your-username/aetheris-portal.git
echo ======================================================================
echo.

set /p REPO_URL="GitHub Repository URL 입력: "

if "%REPO_URL%"=="" (
    echo [경고] URL이 입력되지 않았습니다. 작업을 취소합니다.
    pause
    exit /b 1
)

echo.
echo [2/3] 원격 저장소(origin) 연결 설정 중...
git remote remove origin > nul 2>&1
git remote add origin %REPO_URL%

echo [OK] 원격 저장소 연결 완료: %REPO_URL%
echo.

echo [3/3] GitHub 'main' 브랜치로 푸시 시작...
git push -u origin main

if errorlevel 1 (
    echo.
    echo [참고] 푸시 중 인증이 필요할 수 있습니다. 브라우저 인증 창이 열리면 로그인해주세요.
    echo 또는 Personal Access Token(PAT)을 활용하세요.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo 🎉 푸시가 성공적으로 완료되었습니다!
echo.
echo 📌 [마지막 단계: GitHub Pages 활성화 방법]
echo 1. 웹 브라우저에서 방금 푸시한 GitHub 저장소로 이동합니다.
echo 2. 상단 탭에서 [Settings] -> 좌측 [Pages] 메뉴 클릭
echo 3. 'Build and deployment' 아래 'Source'를:
echo    👉 [GitHub Actions] 로 변경합니다!
echo.
echo 4. 약 1분 후 상단 [Actions] 탭에서 배포가 완료되며,
echo    생성된 사이트 주소(예: https://<username>.github.io/<repo>/)로 접속할 수 있습니다.
echo ======================================================================
echo.
pause
