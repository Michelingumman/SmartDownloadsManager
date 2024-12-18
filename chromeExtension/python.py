import sys
import time

try:
    hour = str(time.localtime().tm_hour)
    minut = str(time.localtime().tm_min)
    sec = str(time.localtime().tm_sec)
    data = f"time: {hour}:{minut}:{sec}\n"

    # Attempt to write to log
    with open("C:/_Projects/SmartDownloadsManager/chromeExtension/log.txt", "a") as log:
        log.write("Python script started...\n")
        log.write(data)

except PermissionError as e:
    print(f"PermissionError: {e}", file=sys.stderr)
    sys.stdout.flush()
except Exception as e:
    print(f"Unexpected Error: {e}", file=sys.stderr)
    sys.stdout.flush()

# Always return a response
print('{"status": "success", "message": "Test response from Python!"}')
sys.stdout.flush()