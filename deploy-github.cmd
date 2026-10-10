@echo off
chcp 65001 > nul
title Aetheris AI Portal - GitHub Pages 배포 도우미
echo ======================================================================
echo   Aetheris AI Research Portal - GitHub 원격 푸시 도우미
echo   대상 저장소: https://github.com/minhoya-ai/tech-research-corp
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/2] 원격 저장소(origin) 확인 중...
git remote set-url origin https://github.com/minhoya-ai/tech-research-corp.git
echo [OK] https://github.com/minhoya-ai/tech-research-corp.git 연결됨.
echo.

echo [2/2] GitHub 'main' 브랜치로 파일 업로드(푸시)를 진행합니다...
echo (GitHub 로그인 창이 뜨면 브라우저에서 'Sign in with your browser'를 눌러주세요)
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ======================================================================
    echo [안내] 푸시 도중 인증이 필요하거나 실패했습니다.
    echo 브라우저 창에서 로그인 승인 후 다시 실행해주세요.
    echo ======================================================================
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo 🎉 파일 업로드(푸시)가 성공적으로 완료되었습니다!
echo.
echo 📌 [최종 사이트 주소 확인 방법]
echo 1. https://github.com/minhoya-ai/tech-research-corp 접속
echo 2. 상단 메뉴 [Settings] -> 좌측 [Pages] 메뉴 클릭
echo 3. 'Source'를 [GitHub Actions] 로 선택
echo 4. 약 1분 후 아래 주소로 접속 가능:
echo    👉 https://minhoya-ai.github.io/tech-research-corp/
echo ======================================================================
echo.
pause
