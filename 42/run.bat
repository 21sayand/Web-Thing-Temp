@echo off
title Sayand - Student Profile & Systems Portfolio
echo ========================================================
echo Starting Sayand Student Profile & Portfolio (Flask)
echo ========================================================
echo.
echo Installing dependencies if needed...
python -m pip install -r requirements.txt
echo.
echo Starting Flask Server on http://localhost:5000 ...
python app.py
pause
