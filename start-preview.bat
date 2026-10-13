@echo off
title Personal site preview
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto nonode

echo Starting your site preview...
echo Keep this window open while you work. Close it to stop the preview.
echo.
start "" /min powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:5173'"
node server.mjs
echo.
echo The preview server stopped. If you see an error above, send a screenshot of this window to Claude.
pause
exit /b

:nonode
echo Node.js was not found on this computer.
echo Install the LTS version from https://nodejs.org then double-click this file again.
echo.
pause
