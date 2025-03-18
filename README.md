
# Babyfoot

  

Babyfoot est une application permettant de gérer des tournois de babyfoot de manière simple et efficace.

  

## Installation

  

1. Cloner le dépôt :

```sh

git clone https://github.com/LoicOberle/babyfoot.git

cd babyfoot

```

  

2. Lancer l'environnement avec Docker Compose :

```sh

docker compose build

docker compose up -d

docker exec -i babyfoot-db-1 mysql -u root -p -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'rootpassword' WITH GRANT OPTION; FLUSH PRIVILEGES;"


```

  

3. Attendre que l'api soit disponible et lancer le script pour ajouter un utilisateur de base:

```sh

cd api

./setup.sh

```

Identifiant: admin@example.com
Mot de passe: admin


## Accès aux services

  

-  **Interface Web** : [http://localhost:8080](http://localhost:8080)

-  **API** : [http://localhost:3000](http://localhost:3000)

-  **Swagger (pour tester l'API)** : [http://localhost:3000/swagger](http://localhost:3000/swagger)

  
  

## Fonctionnalités

  

### Création de tournoi

L'utilisateur connecté peut créer un tournoi en fournissant un nom, une description et la date à laquelle le tournoi aura lieu.

  

### Ajout d'équipes

Une fois le tournoi créé, l'utilisateur peut le modifier pour ajouter des équipes à ce tournoi en spécifiant leurs noms.

### Création de matchs

Une fois toutes les équipes voulues ajoutées (au moins 2), l'utilisateur peut générer les matchs du tournoi afin que chaque équipe se rencontre une fois.

### Gestion des matchs

Une fois les matchs créés, l'utilisateur peut les gérer en modifiant le score en direct, en terminant le match avec ou sans modifier le score au préalable, ou encore reprendre le match si celui-ci n'est finalement pas terminé.

### Page d'accueil

Sur la page d'accueil de l'application sont affichés tous les tournois créés ainsi que les matchs pour chaque tournoi pour suivre leur déroulé.

## Licence

Ce projet est sous licence MIT.
