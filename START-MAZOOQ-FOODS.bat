@echo off
title Mazooq Foods - Local Preview (Dev Mode)
cd /d "%~dp0"
color 0A

echo.
echo  ================================================================
echo    MAZOOQ FOODS - TASTE THE SMILE   (Dev Mode - Live Reload)
echo  ================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [!] Node.js install nahi hai.
  echo      Install Node.js LTS from https://nodejs.org then run this file again.
  echo.
  pause
  exit /b 1
)

REM Set environment variables (Windows CMD syntax)
set ADMIN_STORE=file
set ADMIN_PASSWORD=MazooqAdmin2026

if not exist node_modules (
  echo  Installing dependencies... first time only, 1-2 minutes...
  call npm install
  if errorlevel 1 ( echo  [!] npm install failed. & pause & exit /b 1 )
)

echo  Starting Mazooq Foods in dev mode...
echo  Browser will open at http://localhost:3001 in ~8 seconds.
echo.
echo  Admin Panel: http://localhost:3001/admin  (password: MazooqAdmin2026)
echo.
echo  To STOP: press Ctrl+C in this window, then close it.
echo  ================================================================
echo.

start "" /min cmd /c "ping -n 9 127.0.0.1 >nul & start http://localhost:3001"
call npm run dev -- --port 3001 --host 127.0.0.1
pause
