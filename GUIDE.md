# 🐗 Donjon des Sangliers - Guide Complet

## Description
Donjon des Sangliers est un jeu de type roguelite avec des combats au tour par tour. Dirigez une équipe de 3 sangliers héroïques à travers des donjons pleins de dangers, personnalisez vos sangliers, et participez à des tournois épiques !

## 🚀 Fonctionnalités Principales

### 🎮 Mode Aventure
- **Combat au tour par tour** avec une équipe de 3 sangliers
- **Système de progression** avec choix de chemins stratégiques
- **Amélioration des sangliers** après chaque victoire
- **Difficultés croissantes** avec des boss de plus en plus puissants

### 🎒 Système d'Inventaire
- **Boutique intégrée** pour acheter des objets utiles
- **Potions de soin** pour restaurer les PV de vos sangliers
- **Potions de buff** temporaires (Force, Défense, Vitesse)
- **Cristaux de résurrection** pour ramener les sangliers KO
- **Équipements permanents** pour améliorer définitivement vos stats
- **Système de rareté** : Common, Uncommon, Rare, Epic, Legendary

### 🎨 Éditeur de Sangliers Personnalisés
- **Personnalisation visuelle complète** :
  - 8 têtes différentes (🐷 🐗 🦏 🐴 🦄 🐺 🦊 🐻)
  - 8 couleurs disponibles (marron, rose, gris, noir, blanc, doré, argenté, arc-en-ciel)
  - 6 accessoires (couronne, casque, bandana, écharpe, lunettes, boucles d'oreilles)
- **Templates de stats prédéfinis** :
  - **Équilibré** : Stats moyennes partout
  - **Attaquant** : Forte attaque, défense faible
  - **Tank** : Forte défense, attaque faible, beaucoup de PV
  - **Speedster** : Très rapide, stats moyennes ailleurs
  - **Personnalisé** : Répartition libre de 50 points bonus
- **Système de rareté automatique** basé sur les stats et apparence
- **Sauvegarde automatique** de vos créations

### 🏆 Mode Tournoi
- **Tournois 8 équipes** (3 rounds) :
  - Gagnant : 3200 or
  - Finaliste : 1600 or
  - Participation : 400 or
- **Tournois 16 équipes** (4 rounds) :
  - Gagnant : 6400 or
  - Finaliste : 3200 or
  - Participation : 800 or
- **Simulation automatique** des matchs IA vs IA
- **Matchs éliminatoires** - une défaite et c'est fini !
- **Équipes générées aléatoirement** pour chaque tournoi

### 📊 Système d'Analyse et Performance
- **Analytics avancées** :
  - Suivi des sessions de jeu
  - Statistiques de combat détaillées
  - Analyse des performances par sanglier
  - Historique des tournois
- **Monitoring de performance** :
  - Métriques de rendu React
  - Temps de chargement des composants
  - Optimisations automatiques

### 📱 Application Web Progressive (PWA)
- **Installation sur mobile et desktop**
- **Mode hors ligne** avec Service Worker
- **Icônes d'application personnalisées**
- **Expérience native** sur tous les appareils

## 🎯 Stratégies de Jeu

### Gestion d'Équipe
1. **Équilibrez vos rôles** : Tank (défense), DPS (attaque), Support (vitesse)
2. **Utilisez les objets stratégiquement** pendant les combats
3. **Gardez toujours des potions de soin** pour les situations critiques
4. **Investissez dans les équipements permanents** pour le long terme

### Économie
- **Gagnez de l'or** en battant les ennemis et en participant aux tournois
- **Dépensez intelligemment** : priorité aux potions de soin puis aux équipements
- **Participez aux tournois** même si vous n'êtes pas sûr de gagner (récompense de participation)

### Création de Sangliers
- **Expérimentez avec les templates** pour trouver votre style de jeu
- **Les sangliers légendaires** (rareté or) ont des stats exceptionnelles
- **Variez les couleurs et accessoires** pour augmenter la rareté
- **Sauvegardez plusieurs builds** pour différentes situations

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15.4.2** - Framework React avec App Router
- **React 18** - Bibliothèque UI avec hooks et context
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animations fluides et interactives

### Développement
- **TypeScript** - Typage statique pour plus de sécurité
- **Jest + React Testing Library** - Tests unitaires et d'intégration
- **ESLint + Prettier** - Qualité et formatage du code

### Performance et Analytics
- **Service Worker** - Cache et mode hors ligne
- **Analytics personnalisées** - Suivi des métriques de jeu
- **Performance monitoring** - Optimisation automatique

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <votre-repo>
cd createxyz-project

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build

# Lancer les tests
npm test
```

### Scripts Disponibles
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run test` - Tests unitaires
- `npm run test:watch` - Tests en mode watch
- `npm run lint` - Vérification du code

## 📝 Architecture du Projet

```
src/
├── app/                    # App Router Next.js
│   ├── layout.js          # Layout principal
│   ├── page.jsx           # Page d'accueil
│   └── combat-sangliers/  # Page du jeu
├── components/
│   └── game/              # Composants du jeu
│       ├── GameApp.jsx    # Composant principal
│       ├── MainMenu.jsx   # Menu principal
│       ├── BattleScreen.jsx
│       ├── InventoryScreen.js
│       ├── BoarEditor.js
│       └── TournamentMode.js
├── contexts/
│   └── GameContext.js     # État global avec useReducer
├── constants/
│   └── gameData.js        # Données constantes du jeu
├── utils/
│   ├── gameLogic.js       # Logique de combat
│   ├── inventory.ts       # Système d'inventaire
│   ├── analytics.ts       # Analytics du jeu
│   └── performance.ts     # Monitoring de performance
├── hooks/
│   └── useGameActions.js  # Actions réutilisables
└── types/
    └── gameTypes.js       # Types TypeScript
```

## 🎮 Guide de Jeu Rapide

1. **Démarrer** : Cliquez sur "Commencer l'Aventure !"
2. **Combat** : Choisissez les attaques de vos sangliers à tour de rôle
3. **Progression** : Après chaque victoire, choisissez votre chemin
4. **Amélioration** : Dépensez vos points pour améliorer vos sangliers
5. **Boutique** : Achetez des objets utiles avec votre or
6. **Créativité** : Créez des sangliers personnalisés dans l'éditeur
7. **Compétition** : Participez aux tournois pour de gros gains !

## 🏅 Objectifs et Défis

### Objectifs Principaux
- [ ] Atteindre le niveau 20
- [ ] Gagner un tournoi 16 équipes
- [ ] Créer un sanglier légendaire
- [ ] Collecter 10000 pièces d'or
- [ ] Débloquer tous les équipements

### Défis Avancés
- [ ] Gagner un tournoi avec uniquement des sangliers personnalisés
- [ ] Terminer une run sans utiliser d'objets
- [ ] Créer une équipe où tous les sangliers ont +90 dans une stat
- [ ] Survivre 50 étages consécutifs

## 💡 Conseils Pro

1. **Diversifiez vos attaques** - Chaque type d'attaque a ses avantages
2. **Gérez vos ressources** - L'or et les objets sont précieux
3. **Expérimentez** - Testez différentes compositions d'équipe
4. **Planifiez à long terme** - Les équipements permanents valent l'investissement
5. **Amusez-vous** - Le jeu est fait pour être exploré et apprécié !

---

**Développé avec ❤️ en utilisant Next.js et React**

*Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub !*
