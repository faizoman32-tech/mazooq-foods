@echo off
title Mazooq Admin Panel (Local)
cd /d "%~dp0"
color 0E

echo.
echo  ================================================================
echo    MAZOOQ ADMIN PANEL - LOCAL
echo  ================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [!] Node.js install nahi hai. Install from https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo  Installing dependencies... first time 1-2 minutes...
  call npm install
)

if not exist dist (
  echo  Building... first time 1-2 minutes...
  call npm run build
)

if "%ADMIN_PASSWORD%"=="" set ADMIN_PASSWORD=MazooqAdmin2026
echo  Local login password: %ADMIN_PASSWORD%
echo  Browser will open at: http://localhost:8080/admin
echo.
echo  To STOP: press Ctrl+C in this window, then close it.
echo  ================================================================
echo.

start "" /min cmd /c "ping -n 8 127.0.0.1 >nul & start http://localhost:8080/admin"
call npm start
pause
