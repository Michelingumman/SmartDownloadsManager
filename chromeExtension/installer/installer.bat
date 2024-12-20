@echo off
REM Define variables
SET EXTENSION_NAME=smartdownloadsmanager
SET REG_KEY_PATH=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\%EXTENSION_NAME%
SET LOG_FILE=install.log

REM Log setup start
echo Installing Smart Downloads Manager... > %LOG_FILE%

REM Locate Python
echo Locating Python installation... >> %LOG_FILE%
for /f "delims=" %%A in ('where python') do (
    SET PYTHON_PATH=%%A
    echo Python found at: %%A >> %LOG_FILE%
    goto :found_python
)
echo ERROR: Python not found. Ensure Python is installed and added to the PATH. >> %LOG_FILE%

exit /b 1

:found_python

REM Get absolute paths of necessary files
SET SCRIPT_DIR=%~dp0
SET PYTHON_FILE=%SCRIPT_DIR%..\python.py
SET RUN_BAT_FILE=%SCRIPT_DIR%..\NativeMessaging\run.bat
SET JSON_FILE=%SCRIPT_DIR%..\NativeMessaging\smartdownloadsmanager.json

REM Clean up the paths to avoid installer\..\ in JSON and Registry Key
FOR /f "delims=" %%i IN ("%JSON_FILE%") DO SET ABS_JSON_PATH=%%~fi
FOR /f "delims=" %%i IN ("%PYTHON_FILE%") DO SET ABS_PYTHON_PATH=%%~fi
FOR /f "delims=" %%i IN ("%RUN_BAT_FILE%") DO SET ABS_RUN_BAT_PATH=%%~fi

REM Escape backslashes for JSON compatibility
SET ESCAPED_JSON_PATH=%ABS_JSON_PATH:\=\\%
SET ESCAPED_RUN_BAT_PATH=%ABS_RUN_BAT_PATH:\=\\%

REM Log the resolved paths
echo Resolved smartdownloadsmanager.json path: %ABS_JSON_PATH% >> %LOG_FILE%
echo Resolved python.py path: %ABS_PYTHON_PATH% >> %LOG_FILE%
echo Resolved run.bat path: %ABS_RUN_BAT_PATH% >> %LOG_FILE%

REM Update run.bat
echo Configuring run.bat... >> %LOG_FILE%
echo @echo off > "%ABS_RUN_BAT_PATH%"
echo REM Path to Python executable and script >> "%ABS_RUN_BAT_PATH%"
echo "%PYTHON_PATH%" -u "%ABS_PYTHON_PATH%" >> "%ABS_RUN_BAT_PATH%"
echo run.bat updated successfully. >> %LOG_FILE%

REM Update smartdownloadsmanager.json
echo Configuring Native Messaging Host JSON... >> %LOG_FILE%
powershell -Command "(gc '%ABS_JSON_PATH%') -replace '\"path\": \".*\"', '\"path\": \"%ESCAPED_RUN_BAT_PATH%\"' | sc '%ABS_JSON_PATH%'"
echo JSON file updated with path: %ABS_RUN_BAT_PATH% >> %LOG_FILE%

REM Create the registry key
echo Adding registry key... >> %LOG_FILE%
REG ADD "%REG_KEY_PATH%" /ve /t REG_SZ /d "%ABS_JSON_PATH%" /f >> %LOG_FILE% 2>&1

REM Check if the registry key was added successfully
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add the registry key. >> %LOG_FILE%
    pause
    exit /b 1
)

REM Installation complete
echo Installation complete. Smart Downloads Manager is now configured. >> %LOG_FILE%

exit /b 0
