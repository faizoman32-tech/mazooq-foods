@echo off
title Mazooq Foods - Production Build ^& Start
cd /d "%~dp0"
color 0A

echo.
echo  ================================================================
echo    MAZOOQ FOODS - Production Build ^& Start (Windows)
echo  ================================================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo  [!] Node.js install nahi hai.
  echo      Node.js LTS install karo: https://nodejs.org
  echo      Phir ye file dobara chalao.
  echo.
  pause
  exit /b 1
)

REM Set environment variables (Windows CMD syntax)
set ADMIN_STORE=file
set ADMIN_PASSWORD=MazooqAdmin2026

echo  [1/3] Environment set:
echo        ADMIN_STORE = %ADMIN_STORE%
echo        ADMIN_PASSWORD = %ADMIN_PASSWORD%
echo.

REM Install dependencies if missing
if not exist node_modules (
  echo  [2/3] Installing dependencies (first time, ~1-2 min)...
  call npm install
  if errorlevel 1 (
    echo  [!] npm install fail ho gaya.
    pause
    exit /b 1
  )
  echo.
) else (
  echo  [2/3] Dependencies already installed. ✓
  echo.
)

REM Build the project
echo  [3/3] Building production bundle...
call npm run build
if errorlevel 1 (
  echo  [!] Build fail ho gaya. Upar error dekho.
  pause
  exit /b 1
)
echo.

echo  ================================================================
echo   ✅ Build successful! Server start ho raha hai...
echo  ================================================================
echo.
echo   🌐 Storefront:  http://localhost:8080
echo   🔐 Admin Panel: http://localhost:8080/admin
echo                 (password: MazooqAdmin2026)
echo.
echo   Server stop karne ke liye: Ctrl+C dabao is window mein.
echo  ================================================================
echo.

REM Open browser after 3 seconds
start "" /min cmd /c "ping -n 4 127.0.0.1 >nul & start http://localhost:8080"

REM Start production server
call npm start
pause
