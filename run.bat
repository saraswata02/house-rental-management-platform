@echo off
echo Starting SmartRentAI Platform...

start "SmartRentAI Backend" cmd /k "cd /d %~dp0backend && npm start"
start "SmartRentAI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:5173

echo SmartRentAI is running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5001
