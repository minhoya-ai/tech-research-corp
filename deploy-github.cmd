@echo off
title Aetheris AI Research Portal - Deploy to GitHub
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
if errorlevel 1 pause
