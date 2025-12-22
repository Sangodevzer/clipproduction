# 🔑 Authentification GitHub - Guide Rapide

## Option 1 : Personal Access Token (RECOMMANDÉ - Plus simple)

### Étapes :

1. **Créer un token sur GitHub** :
   - Allez sur : https://github.com/settings/tokens
   - Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
   - Donnez-lui un nom : `orgaclip-deploy`
   - Cochez : ✅ **repo** (full control)
   - Cliquez sur **"Generate token"**
   - ⚠️ **COPIEZ le token** (vous ne le reverrez plus !)

2. **Utilisez le token pour pusher** :

```bash
cd /Users/pierrebredin/Desktop/orgaclip

# Remplacez VOTRE_TOKEN par le token que vous avez copié
git remote set-url origin https://VOTRE_TOKEN@github.com/Sangodevzer/clipproduction.git

# Poussez !
git push -u origin main
```

**Exemple** :
```bash
# Si votre token est : ghp_xxxxxxxxxxxx
git remote set-url origin https://ghp_xxxxxxxxxxxx@github.com/Sangodevzer/clipproduction.git
git push -u origin main
```

## Option 2 : GitHub CLI (gh)

```bash
# Installer GitHub CLI
brew install gh

# Se connecter
gh auth login

# Suivez les instructions (choisissez HTTPS)

# Puis poussez
cd /Users/pierrebredin/Desktop/orgaclip
git push -u origin main
```

## Option 3 : SSH (Plus sécurisé à long terme)

### Si vous n'avez pas de clé SSH :

```bash
# 1. Générer une clé SSH
ssh-keygen -t ed25519 -C "votre.email@example.com"

# 2. Afficher la clé publique
cat ~/.ssh/id_ed25519.pub

# 3. Copiez la clé complète (commence par "ssh-ed25519")

# 4. Ajoutez-la sur GitHub :
#    https://github.com/settings/ssh/new
#    - Title: MacBook Air
#    - Key: Collez votre clé

# 5. Testez
ssh -T git@github.com

# 6. Si ça marche, poussez !
cd /Users/pierrebredin/Desktop/orgaclip
git remote set-url origin git@github.com:Sangodevzer/clipproduction.git
git push -u origin main
```

## ⚡ Solution la plus rapide

**Option 1 avec le token** est la plus rapide (2 minutes) !

1. Token : https://github.com/settings/tokens
2. Générez (cochez "repo")
3. Copiez le token
4. Commande :
```bash
git remote set-url origin https://VOTRE_TOKEN@github.com/Sangodevzer/clipproduction.git
git push -u origin main
```

Et c'est tout ! 🚀

---

**Après le push**, continuez avec Railway dans `DEPLOY.md` !
