@echo off
echo Installing Smart Downloads Manager...

REM Create the target directory
mkdir "C:\SmartDownloadsManager"

REM Copy the required files
copy fileManager.js "C:\SmartDownloadsManager\"
copy native-host.json "C:\SmartDownloadsManager\"

REM Register native-host.json
mkdir "%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts"
copy native-host.json "%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts\"

echo Installation complete. Native host is now registered.
pause
