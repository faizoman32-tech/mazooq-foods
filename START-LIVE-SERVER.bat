@echo off
title Mazooq Foods - Live Server
cd /d "%~dp0"
color 0A

echo.
echo  ================================================================
echo    MAZOOQ FOODS - LIVE SERVER (auto-refresh on every save)
echo  ================================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [!] Node.js is not installed.
  echo      Install Node.js LTS from https://nodejs.org and run this file again.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo  Installing dependencies - first time only, 1-2 minutes...
  call npm install
  if errorlevel 1 ( echo  [!] npm install failed. & pause & exit /b 1 )
)

REM Local-only settings (data is saved in data\admin-store.json)
set ADMIN_STORE=file
if "%ADMIN_PASSWORD%"=="" set ADMIN_PASSWORD=MazooqAdmin2026
set PORT=8080

echo  1) Starting the backend (orders, forms, logins) on port 8080...
start "Mazooq Backend (keep open)" /min cmd /k "set ADMIN_STORE=file&& set ADMIN_PASSWORD=%ADMIN_PASSWORD%&& set PORT=8080&& node server.js"

echo  2) Starting the website with live reload on port 3000...
echo.
echo     Website:      http://localhost:3000
echo     Admin panel:  http://localhost:3000/admin.html   (password: %ADMIN_PASSWORD%)
echo     Phone/tablet on the same Wi-Fi: use the "Network" address shown below.
echo.
echo  Edit any file in src\ and save - the page refreshes by itself.
echo  To STOP: close this window AND the minimised "Mazooq Backend" window.
echo  ================================================================
echo.

REM Open Firefox (falls back to the default browser if Firefox isn't found)
set "FF=%ProgramFiles%\Mozilla Firefox\firefox.exe"
if not exist "%FF%" set "FF=%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe"
if exist "%FF%" (
  start "" /min cmd /c "ping -n 7 127.0.0.1 >nul & start "" "%FF%" http://localhost:3000"
) else (
  start "" /min cmd /c "ping -n 7 127.0.0.1 >nul & start http://localhost:3000"
)

call npm run dev
pause
