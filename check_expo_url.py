import time
import os

def check_expo_url():
    url_file = "expo_url.txt"
    max_attempts = 30
    attempt = 0

    while attempt < max_attempts:
        if os.path.exists(url_file):
            with open(url_file, "r") as f:
                url = f.read().strip()
                if url.startswith("exp://"):
                    print(f"Expo URL found: {url}")
                    return True
        
        print(f"Attempt {attempt + 1}/{max_attempts}: Expo URL not found yet. Waiting...")
        time.sleep(10)  # Wait for 10 seconds before next check
        attempt += 1

    print("Expo URL not found after maximum attempts.")
    return False

if __name__ == "__main__":
    if check_expo_url():
        exit(0)  # Success
    else:
        exit(1)  # Failure