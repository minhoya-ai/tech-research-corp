# ==============================================================================
# Aetheris AI Research Portal - Instant Public Tunnel Launcher
# Exposes localhost:4000 to the public internet via secure HTTPS tunnel
# ==============================================================================

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Aetheris AI Portal - Launching Public Tunnel" -ForegroundColor Cyan
Write-Host "  Local Target: http://localhost:4000" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if local server is running on port 4000
$portActive = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if (-not $portActive) {
    Write-Host "[*] Port 4000 is not active. Starting local backend server..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

Write-Host "[OK] Local backend server is running on port 4000." -ForegroundColor Green
Write-Host "[*] Creating secure public HTTPS tunnel..." -ForegroundColor Cyan
Write-Host "    (Anyone worldwide can access your live portal and backend APIs!)" -ForegroundColor DarkGray
Write-Host ""

# Run localtunnel via npm.cmd
& npm.cmd exec -- localtunnel --port 4000
