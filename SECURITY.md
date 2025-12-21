# 🔐 Guide de Sécurité - Jeune Patron Production

## ⚠️ IMPORTANT - À lire avant de déployer !

### Fichiers sensibles protégés

Le fichier `.gitignore` est configuré pour **NE PAS** publier sur GitHub :

✅ **Fichiers automatiquement ignorés** :
- `.env` - Variables d'environnement (mot de passe, DATABASE_URL)
- `node_modules/` - Dépendances
- `dist/` - Build de production
- `.DS_Store` - Fichiers système macOS
- Logs et fichiers temporaires

### Configuration du mot de passe

#### En développement local

1. Créez un fichier `.env` à la racine du projet :
```bash
cp .env.example .env
```

2. Modifiez le mot de passe dans `.env` :
```
APP_PASSWORD=votre_mot_de_passe_securise
```

⚠️ **Ne commitez JAMAIS le fichier `.env` !**

#### En production (Railway)

1. Allez dans votre projet Railway
2. Cliquez sur **"Variables"**
3. Ajoutez la variable :
   - **Clé** : `APP_PASSWORD`
   - **Valeur** : Votre mot de passe sécurisé

Railway va automatiquement utiliser cette variable.

### Bonnes pratiques de sécurité

#### 1. Changez le mot de passe par défaut

⛔ **NE PAS utiliser** : `clipbeles` en production

✅ **Utilisez** : Un mot de passe fort
```
APP_PASSWORD=MonMotDePasse2025!Securise
```

#### 2. Protégez la base de données

Railway génère automatiquement `DATABASE_URL` avec :
- Mot de passe aléatoire sécurisé
- Connexion SSL activée
- Accès restreint

**Ne partagez JAMAIS** la `DATABASE_URL` publiquement !

#### 3. Variables d'environnement sur Railway

Configurez ces variables dans Railway :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `APP_PASSWORD` | Mot de passe de l'app | `VotreMotDePasse!` |
| `DATABASE_URL` | Connexion PostgreSQL | *(auto-généré)* |
| `NODE_ENV` | Environnement | `production` |

#### 4. HTTPS uniquement

Railway active automatiquement HTTPS. **Ne désactivez jamais HTTPS** !

### Vérification avant commit

Avant de faire `git add .`, vérifiez :

```bash
# Vérifiez que .env n'est PAS dans la liste
git status

# Si .env apparaît, c'est un problème !
# Assurez-vous que .gitignore contient bien ".env"
```

### Si vous avez accidentellement commité .env

```bash
# 1. Supprimez .env du tracking Git
git rm --cached .env

# 2. Commitez la suppression
git commit -m "Remove .env from tracking"

# 3. Changez IMMÉDIATEMENT votre mot de passe
# (car l'ancien est maintenant dans l'historique Git)
```

### Authentification avancée (recommandé pour le futur)

Pour une sécurité maximale, envisagez :

1. **Authentification multi-utilisateurs**
   - Système de comptes utilisateurs
   - Hashing des mots de passe (bcrypt)
   - JWT tokens

2. **OAuth / SSO**
   - Connexion Google
   - Connexion GitHub
   - Auth0 / Supabase Auth

3. **Rôles et permissions**
   - Administrateur
   - Éditeur
   - Lecteur seul

### Contact en cas de problème

Si vous pensez que des données sensibles ont été exposées :

1. ⚡ Changez immédiatement le mot de passe
2. 🔄 Régénérez la base de données Railway
3. 🗑️ Supprimez l'historique Git si nécessaire
4. 📝 Documentez l'incident

---

**Dernière mise à jour** : 21 décembre 2025
