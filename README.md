# Jeune Patron Production - Gestion de Clips Vidéo

Application web moderne de gestion de production pour clips musicaux avec planning visuel, drag & drop et **collaboration en temps réel**.

## 🎬 Fonctionnalités

### Contrôle d'Accès
- **Écran de connexion** sécurisé avec mot de passe : `clipbeles`
- **Persistance de session** (pas besoin de se reconnecter)

### Planning Visuel Collaboratif
- **Calendrier configurable** (dates personnalisables)
- **Cartes déplaçables** par drag & drop entre les jours
- **Édition complète** : titre, description, horaire, catégorie, lien Google Maps
- **10 catégories colorées** : Tournage, Catering, Déplacement, Réunion, Rouge, Orange, Rose, Indigo, Turquoise, Autre

### Sidebars d'Organisation
- **Sidebar gauche (Besoins)** : Gérez le matériel et accessoires
- **Sidebar droite (To-Do)** : Liste de tâches avec cases à cocher
- **Sidebars minimisables** : Plus d'espace pour le planning

### 🚀 Collaboration en Temps Réel
- ✅ **Données partagées** : Tous les utilisateurs voient les mêmes informations
- ✅ **Modifications synchronisées** : Les changements apparaissent pour tout le monde
- ✅ **Base de données PostgreSQL** : Stockage centralisé et sécurisé

### Design Responsive
- **Desktop** : Layout 3 colonnes (Besoins | Planning | To-Do)
- **Mobile/Tablette** : Sidebars en menu hamburger, planning défilable

## 🚂 Déploiement sur Railway

### 1. **Prérequis**
- Compte Railway : [railway.app](https://railway.app)
- Compte GitHub (recommandé)

### 2. **Préparer le déploiement**

```bash
# Si Git n'est pas initialisé
git init
git add .
git commit -m "Ready for Railway deployment"

# Créez un repo GitHub et poussez le code
git remote add origin <votre-repo-github>
git push -u origin main
```

### 3. **Déployer sur Railway**

#### Via l'interface web (recommandé)

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Choisissez votre repo `orgaclip`
5. Railway va détecter automatiquement la configuration

#### Ajouter la base de données PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database" → "Add PostgreSQL"**
3. Railway va créer automatiquement la variable `DATABASE_URL`
4. **Redéployez** votre application (elle va se reconnecter automatiquement)

### 4. **Variables d'environnement**

Railway configure automatiquement :
- `DATABASE_URL` : Connexion PostgreSQL
- `PORT` : Port du serveur
- `NODE_ENV` : Production

### 5. **Obtenir votre URL**

Railway vous donnera une URL type : `https://orgaclip.up.railway.app`

**Partagez cette URL** avec votre équipe ! 🎉

## 💻 Développement Local

### Avec base de données locale

```bash
# Installer PostgreSQL localement
# Sur macOS avec Homebrew:
brew install postgresql
brew services start postgresql

# Créer une base de données
createdb orgaclip

# Définir la variable d'environnement
export DATABASE_URL="postgresql://localhost/orgaclip"

# Lancer le serveur backend
npm run dev:server

# Dans un autre terminal, lancer le frontend
npm run dev
```

### Sans base de données (mode localStorage)

Si vous voulez tester sans PostgreSQL, l'ancienne version localStorage est disponible dans le commit précédent.

## 🎨 Stack Technique

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Drag & Drop** : @dnd-kit

### Backend
- **Serveur** : Express.js
- **Base de données** : PostgreSQL
- **ORM** : pg (node-postgres)

## 🔐 Sécurité

⚠️ **Note** : L'authentification actuelle est basique (mot de passe partagé). Pour une utilisation professionnelle, considérez :
- Authentification multi-utilisateurs (JWT, OAuth)
- Gestion des rôles et permissions
- Chiffrement des données sensibles

## 🎯 Utilisation

1. **Connexion** : Mot de passe `clipbeles`
2. **Configurer les dates** : Bouton "Dates" dans le header
3. **Ajouter des tâches** : Cliquez sur "+ Ajouter une tâche"
4. **Éditer** : Cliquez sur une carte pour la modifier
5. **Déplacer** : Glissez-déposez entre les jours
6. **Collaborer** : Toutes les modifications sont visibles par tout le monde !

## 📄 License

Projet personnel - Tous droits réservés

---

Développé avec ❤️ pour la production de clips musicaux
