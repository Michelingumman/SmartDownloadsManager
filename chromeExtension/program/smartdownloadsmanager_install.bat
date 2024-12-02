@echo off
echo Installing Smart Downloads Manager...
mkdir "C:\ProgramData\SmartDownloadsManager"
copy fileManager.js "C:\ProgramData\SmartDownloadsManager\"
mkdir "%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts"
copy native-host.json "%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts\"
echo Installation complete.
pause
