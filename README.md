<div align="center">

# Reservy — Frontend (Client)

**Interface utilisateur de la plateforme de réservation Reservy — Cafés & Restaurants**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

</div>

---

## Présentation

Ce dépôt contient l'interface utilisateur (Frontend) de **Reservy**, une plateforme web centralisée de mise en relation entre clients et gérants de cafés/restaurants. Développée en **React.js**, elle offre trois espaces distincts : Client, Gérant et Super Admin, consommant l'API REST du backend Laravel.

---

## Problématique

Les clients ont du mal à trouver des places disponibles lors des heures de pointe (matchs, soirées, week-ends) et à gérer les temps d'attente sur place. Les gérants, eux, manquent d'outils numériques centralisés pour optimiser leurs réservations et leur visibilité en ligne.

## Objectifs

Offrir une expérience de réservation et de pré-commande fluide côté client, et une interface de gestion claire et efficace côté gérant.

---

## Architecture globale du projet

Reservy est découpé en deux dépôts distincts qui communiquent via une API REST :

<div align="center">

| Dépôt | Rôle | Stack |
|---|---|---|
| **reservy-backend** | API REST, logique métier, base de données | Laravel, MySQL, Sanctum |
| **reservy-frontend** (ce dépôt) | Interface utilisateur (SPA) | React.js, Tailwind CSS |

</div>

---

## Fonctionnalités principales (par Epic)

### Epic 1 — Authentification et sécurité

* Pages Login / Register (maquettes Figma → intégration React/Tailwind).
* Validation des formulaires côté frontend.
* Routes privées selon le rôle de l'utilisateur (Client, Gérant, Admin).

### Epic 2 — Gestion des établissements et menus (Espace Gérant)

* Formulaire de création/modification du profil de l'établissement (nom, adresse, photos, horaires).
* Dashboard de gestion du menu : tableaux et modals d'ajout/modification de catégories et produits.

### Epic 3 — Découverte, réservation et pré-commande (Espace Client)

* Page d'accueil avec barre de recherche et filtrage des établissements par ville/nom.
* Cards d'affichage des cafés/restaurants.
* Panier de pré-commande avec gestion d'état (Zustand / Redux).
* Formulaire de réservation (Datepicker, Timepicker, nombre de personnes).
* Dashboard Gérant en vue Kanban pour la validation des réservations (Acceptée / Refusée / Terminée).

### Epic 4 — Avis et administration globale

* Composant de notation par étoiles + commentaire.
* Affichage de la moyenne des notes sur le profil d'un établissement.
* Dashboard Super Admin pour la validation des nouveaux établissements inscrits.

---

## Stack technique

<div align="center">

![React](https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

</div>

* **React.js :** Bibliothèque principale pour la création d'interfaces dynamiques.
* **Tailwind CSS :** Framework CSS utilitaire pour un design responsive.
* **Zustand / Redux :** Gestion de l'état global (panier de pré-commande, session utilisateur).
* **Axios :** Client HTTP pour communiquer avec l'API Laravel (Backend).

---

## Installation et configuration

### 1. Prérequis

* [Node.js](https://nodejs.org/) (version 16 ou supérieure)
* npm (ou yarn)
* Le backend **reservy-backend** (Laravel) lancé localement

### 2. Cloner le projet

```bash
git clone https://github.com/AITABBOUyoussef/reservy-frontend.git
cd reservy-frontend
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Variables d'environnement

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur :

```
http://localhost:5173
```

---

## Dépôts liés

* [Reservy — Backend (API Laravel)](https://github.com/AITABBOUyoussef/reservy-backend/blob/main/README.md)

---

## Auteur

**Youssef Ait Abbou**
Étudiant en Développement Web Full-Stack | École Numérique Ahmed El Hansali
