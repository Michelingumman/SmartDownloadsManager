@echo on
echo "test.bat started" >> C:\_Projects\SmartDownloadsManager\chromeExtension\log.txt
python -u "C:\_Projects\SmartDownloadsManager\chromeExtension\python.py" >> C:\_Projects\SmartDownloadsManager\chromeExtension\program\log.txt 2>&1
echo "Python script finished" >> C:\_Projects\SmartDownloadsManager\chromeExtension\log.txt
pause
