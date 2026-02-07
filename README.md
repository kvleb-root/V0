# Data Intelligence Hub

Une application web moderne pour l'analyse intelligente de données avec interface IA, visualisations graphiques et détection d'anomalies.

## 🎯 Fonctionnalités

### 📊 Data Ingestion
- **Drag & Drop** : Glissez-déposez vos fichiers CSV/Excel
- **Multi-fichiers** : Importez plusieurs sources de données
- **Supabase Integration** : Connectez-vous via Supabase pour les données en temps réel
- **Validation** : Vérification automatique de la structure des données

### 💬 Interface Chat IA
- **Questions en langue naturelle** : Posez des questions sur vos données (ex: "Top 5 des ventes par région ?")
- **Traitement SQL simulé** : Conversion automatique des questions en requêtes SQL
- **Résultats instantanés** : Exécution rapide des requêtes sur les données en mémoire

### 📈 Visualisation Dynamique
- **Graphiques interactifs** :
  - Graphiques en barres (Bar charts)
  - Graphiques en lignes (Line charts)
  - Camemberts (Pie charts)
  - Nuages de points (Scatter plots)
- **Réactif** : Adaptations automatiques aux types de données
- **Thème sombre** : Design épuré à la Vercel

### 🚨 Détection d'Anomalies
- **Valeurs aberrantes** : Identification des outliers statistiques
- **Baisses critiques** : Détection des chutes importantes (-20%, -30%, -50%)
- **Pics anormaux** : Identification des augmentations inhabituelles
- **Niveaux de sévérité** : Classification automatique (Élevée, Moyenne, Basse)

### ✨ Interface Responsive
- **Mobile-first** : Design adapté à tous les appareils
- **Tailwind CSS** : Styles modernes et performants
- **Lucide Icons** : 500+ icônes choisies
- **Dark Mode** : Thème sombre élégant par défaut

## 🛠️ Stack Technologique

- **Framework** : Next.js 14+ (React 18+)
- **Styling** : Tailwind CSS 3.3+
- **Visualisations** : Recharts 2.10+
- **Analyse de données** : PapaParse 5.4+
- **Icônes** : Lucide-react 0.341+
- **Base de données** : Supabase (@supabase/supabase-js)
- **Utilitaires** : date-fns, clsx
- **Langage** : TypeScript

## 📦 Installation

### Prérequis
- Node.js 18+ et npm/yarn
- (Optionnel) Compte Supabase pour l'intégration BDD

### Étapes

```bash
# 1. Cloner le repository
git clone <repo-url>
cd data-intelligence-hub

# 2. Installer les dépendances
npm install
# ou yarn install

# 3. Créer un fichier .env.local (optionnel pour Supabase)
cp .env.example .env.local
# Remplir les variables:
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 4. Lancer le serveur de développement
npm run dev

# 5. Ouvrir le navigateur
# http://localhost:3000
```

## 🚀 Utilisation

### 1. Importer des données
- Cliquez dans la zone de drag-drop ou glissez-déposez un fichier CSV/Excel
- Les données sont validées et chargées automatiquement

### 2. Analyser avec le Chat IA
- Posez une question sur vos données en français
- L'IA transforme la question en requête SQL
- Les résultats s'affichent instantanément

### Exemples de questions
```
"Quel est le total des ventes ?"
"Affiche mes 5 meilleures régions"
"Quelle est la moyenne des prix ?"
"Compte les clients actifs"
"Quels sont les pics de ventes ?"
```

### 3. Visualiser les résultats
- Consultez les graphiques interactifs
- Exportez ou analysez en détail
- Inspectez les données brutes

### 4. Détecter les anomalies
- Consultez l'onglet "Anomalies"
- Identifiez les valeurs aberrantes
- Recevoir des alertes sur les changements importants

## 📁 Structure du Projet

```
src/
├── app/                    # Pages et layouts Next.js
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
│   ├── DragDropZone.tsx   # Zone de téléchargement
│   ├── DataTable.tsx      # Tableau de données
│   ├── Chart.tsx          # Composants de graphiques
│   ├── ChatInterface.tsx   # Interface de chat
│   ├── Anomalies.tsx      # Affichage des anomalies
│   ├── DataSources.tsx    # Gestion des sources
│   └── SupabaseConfig.tsx # Configuration BDD
├── hooks/                 # Hooks React personnalisés
│   ├── useDataSource.ts   # Gestion des données
│   └── useChat.ts         # Gestion du chat
├── lib/                   # Fondations et utilitaires
│   ├── sql-engine.ts      # Moteur SQL simulé
│   ├── anomaly-detection.ts # Détection d'anomalies
│   └── data-parser.ts     # Parsing de fichiers
└── types/                 # Définitions TypeScript
    └── index.ts           # Types globaux
```

## 🔧 Configuration

### Variables d'environnement (optionnel)

Créez un fichier `.env.local` :

```env
# Supabase (optionnel)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Exemples de Données

Créez un fichier CSV pour tester :

```csv
Date,Région,Ventes,Clients
2024-01-01,Nord,15000,450
2024-01-01,Sud,12000,380
2024-01-01,Est,18000,520
2024-01-02,Nord,16500,480
2024-01-02,Sud,11000,350
```

## 🎨 Personnalisation

### Modifier les couleurs du thème
Éditer `tailwind.config.ts` :

```typescript
theme: {
  extend: {
    colors: {
      dark: { /* couleurs sombres */ },
      accent: '#3b82f6', // Couleur d'accent
    }
  }
}
```

### Ajouter des types de graphiques
Modifier `src/components/Chart.tsx` pour ajouter d'autres types (Radar, Area, etc.)

## 🐛 Dépannage

### Erreur "Module not found"
```bash
npm install
npm run dev
```

### Les graphiques ne s'affichent pas
- Vérifiez que les colonnes numériques existent
- Essayez avec un ensemble de données plus petit
- Consultez la console pour les erreurs

### Problème de Supabase
- Vérifiez les clés d'API
- Testez la connexion manuellement
- Assurez-vous que la table existe

## 🚀 Déploiement

### Avec Vercel (recommandé)

```bash
npm i -g vercel
vercel
```

### Avec Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t data-intelligence-hub .
docker run -p 3000:3000 data-intelligence-hub
```

## 📝 License

MIT License - Libre d'utilisation et de modification

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
- Ouvrir des issues
- Proposer des pull requests
- Suggérer de nouvelles fonctionnalités

## 📧 Support

Pour toute question ou problème, consultez la documentation ou ouvrez une issue sur le repository.

---

**Fait avec ❤️ pour les data lovers**
