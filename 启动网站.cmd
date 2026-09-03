@echo off
title Lectures Echos Launcher

cd /d "%~dp0site"
set PATH=C:\Program Files\nodejs;%PATH%

echo.
echo ============================================
echo   Lectures and Echos - Starting...
echo ============================================
echo.

echo [1/4] Cleaning up old server on port 4321...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4321" ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1

echo.
echo [2/4] Node version:
call node -v

echo.
echo [3/4] Starting dev server...
start "DevServer" cmd /k pnpm dev

echo.
echo [4/4] Waiting for server to be ready...
set /a tries=0

:waitloop
set /a tries+=1
timeout /t 1 /nobreak >nul
netstat -an | findstr ":4321" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 goto ready
if %tries% geq 40 goto timeout
echo   ...waiting (%tries%s)
goto waitloop

:ready
echo.
echo   Server is ready! Opening browser...
start http://localhost:4321/
echo.
echo ============================================
echo   Done! http://localhost:4321/
echo   Close the DevServer window to stop.
echo ============================================
echo.
pause
exit /b 0

:timeout
echo.
echo ============================================
echo   [ERROR] Server did not start in 40 seconds.
echo   Check the DevServer window for errors.
echo ============================================
echo.
pause
exit /b 1
