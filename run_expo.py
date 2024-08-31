import subprocess
import sys
import time
import re

def run_expo_command():
    command = "npx expo start --tunnel --non-interactive --no-dev"
    log_file = "expo_logs.txt"
    url_file = "expo_url.txt"
    
    try:
        with open(log_file, "w") as log_f, open(url_file, "w") as url_f:
            process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            
            while True:
                output = process.stdout.readline()
                if output:
                    print(output.strip())
                    log_f.write(output)
                    log_f.flush()
                    sys.stdout.flush()
                    
                    # Check for the Expo URL in the output
                    match = re.search(r'URL:\s+(exp://[\w.-]+)', output)
                    if match:
                        expo_url = match.group(1)
                        url_f.write(expo_url)
                        url_f.flush()
                        print(f"Expo URL found and saved: {expo_url}")
                
                if process.poll() is not None:
                    break
            
            # Keep the script running
            while True:
                time.sleep(60)  # Sleep for 60 seconds and continue
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return 1

if __name__ == "__main__":
    run_expo_command()