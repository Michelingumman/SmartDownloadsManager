@echo off
echo Installing Smart Downloads Manager...


REM Set paths (modify as needed)
SET EXTENSION_NAME=smartdownloadsmanager
SET JSON_FILE_PATH=%~dp0smartdownloadsmanager.json
SET REG_KEY_PATH=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\smartdownloadsmanager

REM Display paths for debugging
echo Extension Name: %EXTENSION_NAME%
echo JSON File Path: %JSON_FILE_PATH%
echo Registry Key Path: %REG_KEY_PATH%

REM Check if the JSON file exists
if not exist "%JSON_FILE_PATH%" (
    echo ERROR: JSON file not found at %JSON_FILE_PATH%.
    pause
    exit /b 1
)

REM Add the registry key
echo Creating registry key...
REG ADD "%REG_KEY_PATH%" /ve /t REG_SZ /d "%JSON_FILE_PATH%" /f

REM Check if the registry key was created successfully
if %ERRORLEVEL% EQU 0 (
    echo Registry key created successfully.
) else (
    echo ERROR: Failed to create the registry key.
    pause
    exit /b 1
)

echo Setup complete. Your extension should now be able to communicate with the native messaging host.
exit /b 0

