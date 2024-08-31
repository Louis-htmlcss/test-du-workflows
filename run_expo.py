import subprocess
import re
import os

def start_expo_and_get_url():
    # Exécute la commande Expo
    process = subprocess.Popen(
        ['npx', 'expo', 'start', '--tunnel', '--non-interactive', '--no-dev'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Lire la sortie en temps réel
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())  # Affiche la sortie pour le débogage
            # Cherche l'URL avec le regex
            match = re.search(r'URL:\s+(exp://[\w.-]+)', output)
            if match:
                expo_url = match.group(1)
                print(f"Expo URL found: {expo_url}")
                # Définir la sortie du workflow
                with open(os.environ['GITHUB_ENV'], 'a') as env_file:
                    env_file.write(f"EXPO_URL={expo_url}\n")
                return expo_url

    # Si le processus se termine sans trouver l'URL
    print("Expo URL not found.")
    return None

if __name__ == "__main__":
    start_expo_and_get_url()