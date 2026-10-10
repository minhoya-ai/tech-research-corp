@echo off
chcp 65001 > nul
title Aetheris AI Research Portal
echo =======================================================
echo  Aetheris AI Research Portal 실행 중...
echo =======================================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [알림] 필수 패키지를 설치합니다...
    call npm.cmd install
)

echo.
echo [알림] 서버를 시작하고 브라우저를 엽니다...
echo 웹 주소: http://localhost:4000
echo.

start "" "http://localhost:4000"
node server.js

pause
