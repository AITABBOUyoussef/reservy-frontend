# Reservy Frontend

Application web de Reservy, construite avec React et Vite. Elle fournit les interfaces client, gerant et administrateur et communique avec l'API Laravel du dossier `reservy-backend`.

## Fonctionnalites

- Inscription, connexion classique et connexion Google.
- Recuperation et reinitialisation du mot de passe.
- Consultation des etablissements acceptes qui disposent d'au moins un produit.
- Galerie complete des images d'un etablissement avec image principale.
- Consultation des categories, produits, options et images du menu.
- Creation et suivi des reservations et des commandes associees.
- Profil utilisateur responsive.
- Espaces de gestion pour les gerants et les administrateurs.
- Protection des pages selon le token et le role de l'utilisateur.

## Technologies

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React
- `@react-oauth/google`

## Prerequis

- Node.js 18 ou version ulterieure
- npm
- API Laravel lancee localement ou accessible sur un serveur

## Installation

Depuis ce dossier :

```powershell
npm install
Copy-Item .env.example .env
```

Configurez ensuite `.env` :

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
```

`VITE_GOOGLE_CLIENT_ID` est un identifiant public Google. Il ne doit pas contenir de secret. Si la variable est absente, les boutons Google sont desactives et l'authentification classique reste disponible.

## Commandes

```powershell
# Developpement
npm run dev

# Verification ESLint
npm run lint

# Build de production
npm run build

# Servir le build localement
npm run preview
```

L'application Vite est disponible par defaut sur `http://localhost:5173`.

## Structure

```text
src/
├── api/              # Instance Axios et appels API
├── components/       # Navbar, AuthShell, ProtectedRoute et composants partages
├── pages/            # Pages client, gerant, admin et authentification
├── assets/           # Ressources statiques
├── App.jsx           # Routes React
├── main.jsx          # Point d'entree et configuration Google
└── index.css         # Styles globaux
```

## Roles et navigation

Le frontend utilise les roles `client`, `gerant` et `admin`. `ProtectedRoute` verifie le token stocke dans `localStorage` et redirige les utilisateurs qui n'ont pas le role requis.

- Client : accueil, etablissements, reservations et profil.
- Gerant : tableau de bord de l'etablissement, tables, menu, images et reservations.
- Admin : tableau de bord, moderation et gestion globale des etablissements.

La verification frontend ameliore l'experience utilisateur, mais la securite est toujours assuree par les middlewares et controles d'appartenance du backend.

## Google Login

Pour activer Google Login :

1. Creez une application OAuth de type Web dans Google Cloud Console.
2. Ajoutez `http://localhost:5173` et `http://127.0.0.1:5173` aux origines JavaScript autorisees.
3. Placez uniquement le Client ID dans `VITE_GOOGLE_CLIENT_ID`.
4. Verifiez que le backend est configure avec les parametres Google necessaires.

## API

L'URL de base est definie par `VITE_API_URL`. Les tokens recus apres connexion sont envoyes par Axios dans l'en-tete `Authorization`.

Consultez [../reservy-backend/README.md](../reservy-backend/README.md) pour la liste des routes, la configuration Laravel et les roles.

## Validation

Avant une livraison, executez :

```powershell
npm run lint
npm run build
```

