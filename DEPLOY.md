# 🚀 Déploiement Rapide - Checklist

## ✅ Avant de commiter sur GitHub

- [x] `.gitignore` est configuré et protège `.env`
- [x] `.env` contient vos secrets locaux (PAS sur GitHub)
- [x] `.env.example` est un template sans secrets
- [x] Le mot de passe est en variable d'environnement
- [x] Vérification : `git status` ne montre PAS `.env`

## 📤 Pousser sur GitHub

```bash
# 1. Premier commit (déjà fait si vous avez lancé git init)
git commit -m "Initial commit - Jeune Patron Production 🎬"

# 2. Créez le repository sur GitHub avec :
#    - Visibility: Public
#    - README: Off
#    - .gitignore: No .gitignore
#    - License: No license

# 3. Ajoutez le remote (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/orgaclip.git

# 4. Poussez
git branch -M main
git push -u origin main
```

## 🚂 Déployer sur Railway

### Via l'interface web

1. Allez sur [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Sélectionnez votre repo `orgaclip`
4. Railway détecte automatiquement la config ✅

### Ajouter PostgreSQL

1. Dans votre projet Railway : **+ New** → **Database** → **PostgreSQL**
2. Railway crée automatiquement `DATABASE_URL` ✅
3. Redéployez (cliquez sur le bouton redeploy)

### Configurer le mot de passe

1. Allez dans **Variables**
2. Ajoutez :
   ```
   APP_PASSWORD=VotreMotDePasseSecurise2025!
   ```
3. ⚠️ **CHANGEZ** le mot de passe par défaut !

### Finaliser

1. Railway build et déploie automatiquement 🚀
2. Obtenez votre URL : `https://xxx.up.railway.app`
3. Testez la connexion avec votre nouveau mot de passe
4. Partagez l'URL avec votre équipe ! 🎉

## 🔐 Sécurité - Points critiques

| ✅ Sécurisé | ❌ JAMAIS faire |
|-------------|-----------------|
| `.env` dans `.gitignore` | Commiter `.env` sur GitHub |
| Variables d'env sur Railway | Mot de passe en dur dans le code |
| HTTPS activé (auto Railway) | Désactiver SSL |
| Mot de passe fort en prod | Utiliser "clipbeles" en prod |

## 🆘 Résolution de problèmes

### Erreur : "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Erreur : ".env appears in git status"
```bash
# Vérifiez que .gitignore contient ".env"
cat .gitignore | grep .env

# Si nécessaire, ajoutez-le
echo ".env" >> .gitignore
git rm --cached .env
```

### Erreur : "Database connection failed"
- Vérifiez que PostgreSQL est ajouté sur Railway
- Vérifiez que `DATABASE_URL` est défini
- Attendez 1-2 minutes après l'ajout de la DB

### L'app ne se met pas à jour
- Les données se rafraîchissent toutes les 3 secondes
- Rechargez la page (Cmd/Ctrl + R)
- Vérifiez la console pour les erreurs

## 📊 État du déploiement

```bash
# Vérifier le status Git
git status

# Voir l'URL du remote
git remote -v

# Voir les derniers commits
git log --oneline -5
```

## 🎯 Prochaines étapes

1. ✅ Tester l'app localement
2. ✅ Pousser sur GitHub
3. ✅ Déployer sur Railway
4. ✅ Ajouter PostgreSQL
5. ✅ Configurer APP_PASSWORD
6. ✅ Tester en production
7. 🎉 Partager avec l'équipe !

---

**Temps estimé** : 10-15 minutes ⏱️
**Coût** : Gratuit (Railway plan gratuit) 💰
