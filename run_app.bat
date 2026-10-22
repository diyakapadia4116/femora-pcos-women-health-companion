@echo off
title Women's Health Intelligence Platform (PCOS Companion)
echo ======================================================================
echo  WOMEN'S HEALTH INTELLIGENCE PLATFORM : PCOS MONITORING & ANALYTICS
echo  5th-Semester Software Group Project (SGP)
echo ======================================================================
echo.
echo Starting FastAPI Backend Service on https://femora-pcos-backend.onrender.com ...
start "PCOS Backend (FastAPI)" cmd /k "cd /d %~dp0pcos-backend && python main.py"

echo Starting Vite React Frontend on https://femora-pcos-women-health-companion.vercel.app/ ...
start "PCOS Frontend (React)" cmd /k "cd /d %~dp0pcos-frontend && npm.cmd run dev"

echo.
echo App launching! Both Backend & Frontend servers are running.
echo Open your browser at: https://femora-pcos-women-health-companion.vercel.app/
echo.
pause
