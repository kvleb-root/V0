# Déploiement sur Vercel

## 🚀 Déploiement Automatique

### Étape 1 : Préparez votre repository GitHub

```bash
# Initialiser Git si nécessaire
git init
git add .
git commit -m "Initial commit: Data Intelligence Hub"

# Pousser sur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/data-intelligence-hub.git
git branch -M main
git push -u origin main
```

### Étape 2 : Connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Sélectionnez votre repository GitHub
4. Vercel détecte automatiquement que c'est un projet Next.js
5. Cliquez sur "Deploy"

### Étape 3 : Variables d'Environnement

Si vous utilisez Supabase :

1. Dans les paramètres du projet Vercel
2. Allez dans "Settings" → "Environment Variables"
3. Ajoutez :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Redéployez

## 📋 Pré-requis

- Compte GitHub
- Compte Vercel (gratuit)
- (Optionnel) Compte Supabase

## ⚙️ Configuration Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodejs": "18.x"
}
```

Vercel le détecte automatiquement !

## 🌐 Domaine Personnalisé

1. Après le déploiement, allez dans "Settings" → "Domains"
2. Ajoutez votre domaine personnalisé
3. Pointez les DNS vers Vercel
4. Le certificat SSL est gratuit et automatique

## 📊 Monitoring

- **Logs** : Allez dans "Deployments" pour voir les logs en temps réel
- **Performance** : Vercel fournit des analytics d'utilisation
- **Erreurs** : Configurez les notifications Slack/Email

## 🔄 Mise à Jour Continue

Chaque push sur `main` entraîne :
- ✅ Déploi automatique (0s downtime)
- ✅ Preview URLs pour les PRs
- ✅ Rollback possible en un clic

## 💡 Conseils

- Utilisez les Preview Deployments pour tester les PRs
- Configurez les GitHub Actions pour les tests automatiques
- Utilisez les Analytics de Vercel pour surveiller la performance
- Mettez en place les alertes de performance

## 🆘 Dépannage

### Le build échoue
- Vérifiez les logs dans "Deployment Logs"
- Assurez-vous que `npm run build` fonctionne localement
- Vérifiez les types TypeScript : `npm run build`

### Erreur 500 en production
- Vérifiez les Environment Variables
- Consultez les "Function Logs" (pour les API routes)
- Utilisez Vercel CLI : `vercel logs`

### Problèmes de performance
- Utilisez Vercel Analytics pour identifier les pages lentes
- Optimisez les images avec `next/image`
- Réduisez la taille des bundles JS

## 📚 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel CLI](https://vercel.com/docs/cli)

---

Votre site sera accessible à `https://data-intelligence-hub.vercel.app` 🎉
