# 🚀 Guide de Déploiement sur Railway

## Prérequis
- ✅ Compte GitHub (déjà fait)
- ✅ Code pushé sur GitHub (déjà fait)
- ⏳ Compte Railway (à créer)

---

## Étape 1 : Créer un compte Railway

1. **Allez sur** https://railway.app/
2. **Cliquez sur** "Login" ou "Start a New Project"
3. **Connectez-vous avec GitHub**
   - Cliquez sur "Login with GitHub"
   - Autorisez Railway à accéder à votre compte GitHub

---

## Étape 2 : Créer un nouveau projet

1. **Sur le dashboard Railway**, cliquez sur **"New Project"**
2. Choisissez **"Deploy from GitHub repo"**
3. **Sélectionnez votre dépôt** : `Sangodevzer/clipproduction`
   - Si vous ne le voyez pas, cliquez sur "Configure GitHub App" pour autoriser l'accès

---

## Étape 3 : Ajouter une base de données PostgreSQL

1. **Dans votre projet Railway**, cliquez sur **"+ New"**
2. Sélectionnez **"Database"**
3. Choisissez **"Add PostgreSQL"**
4. Railway va créer automatiquement une base de données PostgreSQL

---

## Étape 4 : Configurer les variables d'environnement

1. **Cliquez sur votre service** (clipproduction)
2. Allez dans l'onglet **"Variables"**
3. **Ajoutez les variables suivantes** :

   Cliquez sur **"+ New Variable"** et ajoutez :

   **Variable 1 :**
   - Name: `APP_PASSWORD`
   - Value: `clipbeles` (ou changez-le pour plus de sécurité)

   **Variable 2 :**
   - Name: `NODE_ENV`
   - Value: `production`

   **Important :** Railway ajoute automatiquement `DATABASE_URL` et `PORT`, ne les ajoutez pas manuellement !

4. **Cliquez sur "Deploy"** ou attendez le redéploiement automatique

---

## Étape 5 : Lier la base de données au service

1. **Cliquez sur votre service** (clipproduction)
2. Allez dans l'onglet **"Settings"**
3. Descendez jusqu'à **"Service"** → **"Connect"**
4. **Connectez le service PostgreSQL** si ce n'est pas déjà fait
   - Railway devrait automatiquement ajouter la variable `DATABASE_URL`

---

## Étape 6 : Vérifier le déploiement

1. **Attendez que le build se termine** (2-3 minutes)
   - Vous verrez les logs en temps réel
   - Cherchez "Build successful" ou "Deployment live"

2. **Si le build réussit**, allez dans l'onglet **"Settings"**
3. Descendez jusqu'à **"Networking"** → **"Public Networking"**
4. Cliquez sur **"Generate Domain"**
5. Railway va créer une URL publique (ex: `clipproduction-production.up.railway.app`)

---

## Étape 7 : Tester votre application

1. **Cliquez sur l'URL générée** ou copiez-la dans votre navigateur
2. Vous devriez voir votre écran de connexion
3. **Connectez-vous avec le mot de passe** : `clipbeles`

---

## 🎉 C'est terminé !

Votre application est maintenant en ligne et accessible publiquement !

---

## 🔧 Configuration déjà prête dans votre projet

✅ `railway.json` - Configuration Railway
✅ `nixpacks.toml` - Configuration du build
✅ `server.cjs` - Serveur backend configuré
✅ `package.json` - Scripts de démarrage

Railway détectera automatiquement ces fichiers et les utilisera pour déployer votre application.

---

## 📝 Commandes utiles

### Redéployer après une mise à jour du code
Simplement **pusher sur GitHub** :
```bash
git add .
git commit -m "Update"
git push origin main
```
Railway redéploiera automatiquement !

### Voir les logs
1. Dans Railway, cliquez sur votre service
2. Allez dans l'onglet **"Deployments"**
3. Cliquez sur le déploiement actif
4. Vous verrez tous les logs en temps réel

---

## ⚙️ Paramètres importants

### Changer le mot de passe de l'application
1. Dans Railway → Variables
2. Modifiez `APP_PASSWORD`
3. Redéployez

### Domaine personnalisé (optionnel)
1. Settings → Networking → Custom Domain
2. Ajoutez votre propre domaine
3. Suivez les instructions DNS

---

## 🆘 Problèmes courants

### "Application error" ou "503"
- Vérifiez que `DATABASE_URL` est bien configurée
- Vérifiez les logs pour voir l'erreur exacte

### La base de données ne se connecte pas
- Assurez-vous que le service PostgreSQL est bien créé
- Vérifiez que le service est bien lié à votre application

### Le build échoue
- Vérifiez les logs de build
- Assurez-vous que tous les fichiers sont bien poussés sur GitHub

---

## 💡 Conseils

1. **Gratuit au début** : Railway offre 5$ de crédit gratuit par mois
2. **Surveillez l'utilisation** : Vérifiez votre consommation dans le dashboard
3. **Sécurité** : Changez le mot de passe par défaut en production
4. **Backups** : Railway fait des backups automatiques de votre base de données

---

## 🔗 Liens utiles

- Dashboard Railway : https://railway.app/dashboard
- Documentation : https://docs.railway.app/
- Support : https://help.railway.app/

---

**Votre application sera accessible à cette adresse :**
`https://[votre-projet].up.railway.app`

Bonne chance ! 🚀
