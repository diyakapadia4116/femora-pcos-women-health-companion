@echo off
title Women's Health Intelligence Platform (PCOS Companion)
echo ======================================================================
echo  WOMEN'S HEALTH INTELLIGENCE PLATFORM : PCOS MONITORING & ANALYTICS
echo  5th-Semester Software Group Project (SGP)
echo ======================================================================
echo.
echo Starting FastAPI Backend Service on http://127.0.0.1:8000 ...
start "PCOS Backend (FastAPI)" cmd /k "cd /d %~dp0pcos-backend && python main.py"

echo Starting Vite React Frontend on http://localhost:5173 ...
start "PCOS Frontend (React)" cmd /k "cd /d %~dp0pcos-frontend && npm.cmd run dev"

echo.
echo App launching! Both Backend & Frontend servers are running.
echo Open your browser at: http://localhost:5173
echo.
pause
