# Babyfoot

Babyfoot est une application permettant de gérer des tournois de babyfoot de manière simple et efficace.

## Installation

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/LoicOberle/babyfoot.git
   cd babyfoot
   ```

2. Lancez l'environnement avec Docker Compose :
   ```sh
   docker compose build
   docker compose up -d
   ```

3. Lancer le script pour ajouter un utilisateur de base :
   ```sh
   cd api
   ./setup.sh
   ```

## Accès aux services

- **Interface Web** : [http://localhost:8080](http://localhost:8080)
- **API** : [http://localhost:3000](http://localhost:3000)
- **Swagger (pour tester l'API)** : [http://localhost:3000/swagger](http://localhost:3000/swagger)

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

