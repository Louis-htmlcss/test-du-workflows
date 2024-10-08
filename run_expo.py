import subprocess
import re
import os

def start_expo_and_get_url():
    # Exécute la commande Expo
    process = subprocess.Popen(
        ['npx', 'expo', 'start', '--tunnel', '--non-interactive', '--dev'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Lire la sortie en temps réel
    while True:
        output = process.stdout.readline()
        if output:
            print(output.strip(), flush=True)  # Affiche la sortie pour le débogage en temps réel
            # Cherche l'URL avec le regex
            match = re.search(r'URL:\s+(exp://[\w.-]+)', output)
            if match:
                expo_url = match.group(1)
                print(f"Expo URL found: {expo_url}", flush=True)
                # Définir la sortie du workflow
                with open(os.environ['GITHUB_ENV'], 'a') as env_file:
                    env_file.write(f"EXPO_URL={expo_url}\n")
                return expo_url

    # Si le processus se termine sans trouver l'URL
    print("Expo URL not found.", flush=True)
    return None

if __name__ == "__main__":
    start_expo_and_get_url()