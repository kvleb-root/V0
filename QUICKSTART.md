# 🚀 Quick Start Guide

## Installation Rapide (5 minutes)

### 1. Installer les dépendances

```bash
# Assurez-vous d'être dans le dossier du projet
cd c:\Users\ACER\Desktop\Analyse\V0

# Installer les dépendances
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎯 Premiers Pas

### Étape 1 : Préparer vos données

Vous avez deux options :

**A. Utiliser les données d'exemple**
- Un fichier `sample-data.csv` est inclus
- Il contient des données de ventes simulées (jan 2024)

**B. Créer votre propre CSV**
- Format attendu :
  ```csv
  Date,Region,Ventes,Clients
  2024-01-01,Nord,15000,450
  2024-01-01,Sud,12000,380
  ```

### Étape 2 : Importer les données

1. Ouvrez l'application à http://localhost:3000
2. Dans le panneau **"Données"** à gauche
3. Drag & Drop votre fichier CSV
4. Les données apparaissent dans la section "Sources chargées"

Si des erreurs apparaissent, vérifiez :
- ✅ Que le fichier est en format CSV
- ✅ Que la première ligne contient les en-têtes
- ✅ Que les données sont bien structurées

### Étape 3 : Poser des questions

1. Allez à l'onglet **"Analyse"**
2. Consultez l'interface Chat
3. Posez des questions en français :

**Exemples :**
```
"Combien de lignes mes données contiennent-elles ?"
"Top 5 des régions avec les meilleures ventes"
"Quelle est la somme totale des ventes ?"
"Moyenne par région"
```

### Étape 4 : Visualiser les résultats

- Les graphiques s'affichent automatiquement en bas
- Vous pouvez voir les données en détail dans l'onglet "Données"

### Étape 5 : Analyser les anomalies

1. Allez à l'onglet **"Anomalies"**
2. Vous verrez :
   - ⚠️ Valeurs aberrantes
   - 📉 Baisses critiques
   - 📈 Pics anormaux

Chaque anomalie est classée par sévérité (Élevée, Moyenne, Basse)

## 📝 Commandes Utiles

```bash
# Lancer en mode développement
npm run dev

# Build pour la production
npm run build

# Lancer la version de production
npm run start

# Vérifier le lint
npm run lint

# Créer une build avec analyse d'optimisation
npm run build -- --debug
```

## 🔧 Configuration Optionnelle

### Supabase (Pour une vraie base de données)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Récupérez votre URL et clé d'API
3. Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key
```

Consultez `SUPABASE_GUIDE.md` pour plus de détails.

## 🎨 Personnalisation Rapide

### Changer les couleurs

Modifiez `tailwind.config.ts` :

```typescript
colors: {
  accent: '#your-color', // Ex: '#ff6b6b' pour du rouge
}
```

### Ajouter un logo personnalisé

1. Ajoutez votre image dans `public/`
2. Modifiez la page dans `src/app/page.tsx` :

```typescript
<Image src="/logo.png" alt="Logo" width={40} height={40} />
```

## ⚡ Conseils de Performance

- La plupart des données sont traitées **côté client** (rapide)
- Les fichiers CSV jusqu'à 100 000 lignes sont supportés
- Les graphiques s'affichent dynamiquement selon les données
- L'anomalie détected est instant

## 🆘 Besoin d'Aide ?

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé
```bash
# Utiliser un autre port
npm run dev -- -p 3001
```

### Les graphiques ne s'affichent pas
- Vérifiez que vos données ont au moins une colonne numérique
- Essayez d'abord avec `sample-data.csv`
- Consultez la console du navigateur (F12) pour les erreurs

### Les données ne s'importent pas
- Assurez-vous que le fichier est en UTF-8
- Vérifiez que la première ligne contient les en-têtes
- Essayez d'ouvrir le fichier pour vérifier sa structure

## 📚 Prochaines Étapes

1. **Explorez la documentation** :
   - [README.md](README.md) - Vue d'ensemble
   - [ADVANCED.md](ADVANCED.md) - Features avancées
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Déployer sur Vercel

2. **Modifiez selon vos besoins** :
   - Ajoutez des nouveaux types de graphiques
   - Intégrez votre propre API
   - Connectez la vraie base de données Supabase

3. **Déployez !**
   - Gratuitement sur Vercel
   - Suivez [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎯 Checklist du Déploiement

- [ ] Testez localement avec `npm run dev`
- [ ] Buildez avec `npm run build`
- [ ] Poussez sur GitHub
- [ ] Connectez Vercel
- [ ] Ajoutez les variables d'environnement
- [ ] Testez la version live

---

**Vous êtes prêt ! Commencez maintenant :**

```bash
npm install
npm run dev
```

Allez à http://localhost:3000 et commencez à analyser ! 🎉
