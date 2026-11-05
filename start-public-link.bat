@echo off
title Mazooq Foods - PUBLIC LIVE LINK (Cloudflare Tunnel)
cd /d "%~dp0"
color 0A

echo.
echo  ================================================================
echo    MAZOOQ FOODS - PUBLIC LIVE LINK
echo    (Ye aapki website ko internet par live karta hai)
echo  ================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [!] Node.js install nahi hai. Install from https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist tools\cloudflared.exe (
  echo  [!] tools\cloudflared.exe nahi mila.
  echo.
  pause
  exit /b 1
)

if not exist dist\index.html (
  echo  Building website... (first time 1-2 minutes)...
  call npm run build
)

set "PORT=8080"
set "ADMIN_STORE=file"
if not defined ADMIN_PASSWORD set "ADMIN_PASSWORD=MazooqAdmin2026"

echo  Starting website server...
start "Mazooq Server" /min cmd /c "node server.js"
ping -n 5 127.0.0.1 >nul
echo  Server ready.
echo.
echo  ================================================================
echo   NEECHE aapka PUBLIC LINK aayega (https://....trycloudflare.com)
echo.
echo   * Ye link customers/doston ko bhej sakte ho
echo   * Laptop band karne par link band ho jayega
echo   * Is window ko band na karein (chalti rehni chahiye)
echo   * Band karne ke liye: Ctrl+C, phir windows close karo
echo  ================================================================
echo.

tools\cloudflared.exe tunnel --url http://localhost:8080 --no-autoupdate --protocol http2
pause
