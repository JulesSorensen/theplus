# The +

## Description

Ce projet est une application mobile permettant de discuter avec tout les monde, ou avec vos amis !

Créez des groupes, échangez en temps réel !

## Projets techniques

### Frontend

Le frontend est réalisé en React Native (JS)

Attention à définir les variables d'environnement dans `front/env.js` en fonction de l'hébergement du backend.

Si hébergement local, veuillez y mettre la valeur `http://localhost:3000`.
A noter que les sockets ne fonctionnent pas en HTTP.

Pour lancer le projet :

```bash
cd front
nvm use 16.20.2
npm install
npm run [android|ios]
```

### Backend

Le backend est réalisé en NestJS (TS)

Pour lancer le projet :

```bash
cd backend
nvm use 20.8.0
npm install
npm run start:dev
```

#### Base de données

La base de données est en SQLite, voici les différentes tables :

- users
- messages
- groups
- group_users
- invits

Pour voir leur structure, voir le code en back-end via les fichiers `entity` au sein de chaque modules.

## Auteurs

| Prénom | Rôle                              |
| ------ | --------------------------------- |
| Pierre | Développeur Front-end             |
| Yan    | Développeur Front-end             |
| Jules  | Développeur Back-end et Front-end |
