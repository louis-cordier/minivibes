<a id="en">

<div align=center>
    <a href="#en">EN</a> . 
    <a href="#fr">FR</a>

# TrackMania Replica - Technical Specification
### Day 2 Project
*A fast-paced arcade racing game built with Three.js and Node.js*

---
</div>

## 1. Project Overview

**Game Type**: Arcade Time-Trial Racing  
**Platform**: Web Browser (Modern browsers with WebGL support)  
**Core Mechanic**: Players race against the clock on custom tracks, competing for the best times and comparing ghosts (replay data)

### Objective
Build a playable, feature-complete TrackMania-style racing game where players can:
- Race on tracks with real-time timing
- Reset instantly at any point
- Record and replay their best runs (ghosts)
- View leaderboards and compete with others
- Experience arcade-style, skill-based gameplay

---

## 2. Functional Breakdown

### 2.1 Client (Frontend - Game Engine)

#### Game Core
- **Game Loop**: Fixed-tick game loop with frame-independent physics
- **Time Management**: Real-time stopwatch, pause/resume, instant restart
- **Physics Engine**: Arcade-style vehicle physics (not realistic simulation)
  - Acceleration, braking, turning
  - Drift mechanics with grip parameters
  - Track collision and response

#### Track System
- **Modular Track Design**: Roads, boosts, ramps, loops built from blocks
- **Collision Detection**: Simple AABB or mesh-based collisions
- **Checkpoints**: Track segmentation for lap timing and validation

#### Input Handling
- **Keyboard Controls**: WASD for movement, Space for boost, R for reset
- **Gamepad Support**: Analog stick and button mapping (optional enhancement)
- **Ultra-responsive**: Frame-perfect input detection

#### Replay & Ghosts
- **Recording**: Capture player inputs and timestamps during gameplay
- **Deterministic Playback**: Replay exact run with same physics
- **Ghost Data**: Compact format (inputs + delta times) for network transfer

#### Camera System
- **Dynamic Camera**: Follows car with smooth acceleration
- **Race View**: Behind-the-car or isometric perspective
- **Cinematic**: Camera behavior supports player vision

#### UI / HUD
- **Real-time Stopwatch**: Current session time in milliseconds
- **Checkpoint Indicators**: Visual feedback when crossing checkpoints
- **Best Time Display**: Current personal best (PB)
- **Leaderboard Panel**: Top local times and global times
- **Status Messages**: Ready, Go!, Finished, etc.

### 2.2 Backend (Server - Lightweight)

#### API Endpoints (REST)
- `POST /api/runs` - Submit a completed run with time and ghost data
- `GET /api/leaderboard?track_id=X&limit=N` - Fetch top times for a track
- `GET /api/ghost/:run_id` - Retrieve ghost replay data for a specific run
- `GET /api/tracks` - List available tracks

#### Services
- **Score Management**: Store and rank best times per player/track
- **Ghost Storage**: Persist and serve replay data
- **Leaderboard Service**: Calculate and cache rankings
- **User Management**: Light authentication (optional - JWT)

#### Database
- **Schema**:
  - `users`: id, username, created_at
  - `tracks`: id, name, author, layout_data
  - `runs`: id, user_id, track_id, time_ms, ghost_data, created_at
  - `leaderboard_cache`: track_id, top_times (denormalized for performance)

---

## 3. Technical Stack

### Frontend (Game Client)

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | TypeScript | Latest |
| Framework | Three.js | ^r128+ |
| Build Tool | Vite | Latest |
| Testing | Vitest | Latest |
| Input Management | Keyboard API, Gamepad API | Native |
| HTTP Client | Fetch API | Native |
| State Management | Plain objects/functions | - |

### Backend (Server)

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | TypeScript | Latest |
| Runtime | Node.js | 20+ |
| Framework | Fastify | Latest |
| Database | PostgreSQL | 14+ |
| ORM | Prisma | Latest |
| Authentication | JWT (optional) | - |
| Testing | Vitest + Supertest | Latest |

### DevOps

| Component | Technology |
|-----------|-----------|
| Containerization | Docker |
| Orchestration | Docker Compose |
| Version Control | Git + GitHub |

---

## 4. File Structure & Organization

### Frontend Structure
```
client/
├── src/
│   ├── core/
│   │   ├── gameLoop.ts           # Main game tick
│   │   ├── time.ts               # Stopwatch logic
│   │   └── constants.ts           # Game constants
│   ├── physics/
│   │   ├── vehicle.ts            # Car physics
│   │   ├── collision.ts          # Collision detection
│   │   └── track.ts              # Track data & methods
│   ├── rendering/
│   │   ├── scene.ts              # Three.js scene setup
│   │   ├── renderer.ts           # Renderer management
│   │   ├── materials.ts          # Shaders and materials
│   │   └── camera.ts             # Camera controller
│   ├── replay/
│   │   ├── recorder.ts           # Input recording
│   │   ├── player.ts             # Ghost playback
│   │   └── serializer.ts         # Compression/decompression
│   ├── input/
│   │   ├── keyboard.ts           # Keyboard handler
│   │   ├── gamepad.ts            # Gamepad support
│   │   └── inputManager.ts       # Unified input system
│   ├── ui/
│   │   ├── hud.ts                # HUD elements
│   │   ├── menu.ts               # Main menu
│   │   └── leaderboard.ts        # Leaderboard display
│   ├── network/
│   │   ├── api.ts                # API client
│   │   └── types.ts              # API types
│   ├── tracks/
│   │   ├── trackLoader.ts        # Load track data
│   │   ├── trackBuilder.ts       # Build 3D geometry
│   │   └── presets.ts            # Demo tracks
│   └── main.ts                   # Entry point
├── assets/
│   ├── tracks/                   # Track JSON definitions
│   └── textures/                 # Textures (optional)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Backend Structure
```
server/
├── src/
│   ├── routes/
│   │   ├── runs.ts               # Run submission
│   │   ├── leaderboard.ts        # Leaderboard queries
│   │   ├── ghosts.ts             # Ghost retrieval
│   │   └── tracks.ts             # Track listings
│   ├── services/
│   │   ├── runService.ts         # Run business logic
│   │   ├── leaderboardService.ts # Ranking logic
│   │   └── ghostService.ts       # Ghost management
│   ├── db/
│   │   └── prisma.ts             # Prisma client
│   ├── middleware/
│   │   ├── auth.ts               # JWT validation
│   │   └── errorHandler.ts       # Error handling
│   └── index.ts                  # Server entry point
├── prisma/
│   └── schema.prisma             # Database schema
├── tests/
│   ├── api.test.ts               # API tests
│   └── services.test.ts          # Service tests
├── docker-compose.yml
├── Dockerfile
├── tsconfig.json
└── package.json
```

### Naming Conventions
- **Variables**: `camelCase`
- **Classes/Types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Functions**: `camelCase`, descriptive names
- **Files**: `camelCase.ts` for utilities, `PascalCase.ts` for classes/components

---

## 5. Development Strategy

### Phase 1: Foundation - "Fun First" (Hours 1-3)
**Goal**: Get a playable game loop running

**Tasks** (in order):
1. **Project Setup**
   - Initialize client and server projects
   - Set up build tools (Vite, TypeScript)
   - Configure Docker environment
   - Git repo with initial structure

2. **Game Loop**
   - Implement fixed-tick game loop (120 Hz physics, variable FPS render)
   - Time management (elapsed time, delta time)
   - Frame rate monitoring

3. **Minimal Track**
   - Create a simple rectangular track mesh
   - Define checkpoints for the track
   - Basic material/colors

4. **Vehicle Physics**
   - Basic car object with position, velocity, rotation
   - Simple forward/backward acceleration
   - Turn mechanics (rotate based on input)
   - Basic friction/damping

5. **Camera & Rendering**
   - Three.js scene setup
   - Camera following the car (behind-car or isometric)
   - Basic lighting
   - Render loop

6. **Input & Controls**
   - Keyboard input (WASD for movement)
   - Instant reset (R key)
   - Map inputs to vehicle forces

7. **Stopwatch & Reset**
   - Real-time timer from race start
   - Instant reset to start (clear timer, reset position)
   - Display timer on HUD

**Validation Gate**: 
- ✅ Game runs at 60+ FPS
- ✅ Car moves responsively
- ✅ Timer works
- ✅ Reset works instantly (<200ms)
- ✅ Fun to drive for 30 seconds?

---

### Phase 2: Competitiveness - "Beat Your Best" (Hours 4-6)
**Goal**: Add personal best tracking and ghost replays

**Tasks** (in order):
1. **Checkpoint System**
   - Detect when car crosses checkpoint
   - Lap completion detection
   - Lap split times

2. **Best Time Tracking (Local Storage)**
   - Save best time after race
   - Display "Personal Best" on HUD
   - Show splits for each checkpoint

3. **Ghost Recording**
   - Record player inputs + timestamps during play
   - Serialize ghost data (compress inputs)
   - Store best ghost locally (localStorage)

4. **Ghost Playback**
   - Load best ghost data
   - Replay car movement deterministically
   - Display ghost car semi-transparent during play
   - Compare times in real-time

5. **Enhanced UI**
   - Show personal best time
   - Show comparison with ghost
   - Lap/split times display
   - "Finished" screen with results

**Validation Gate**:
- ✅ Can save and load best time
- ✅ Ghost replays correctly
- ✅ Replay is bit-perfect deterministic
- ✅ Fun to beat your own time?

---

### Phase 3: Social - "Share & Compete" (Hours 7-8)
**Goal**: Add backend and leaderboards

**Tasks** (in order):
1. **Backend Setup**
   - Fastify server with TypeScript
   - PostgreSQL + Prisma setup
   - Docker Compose for DB

2. **API Implementation**
   - `POST /api/runs` - Submit run with ghost data
   - `GET /api/leaderboard` - Get top N times
   - `GET /api/ghost/:id` - Get ghost data
   - Error handling and validation

3. **Leaderboard Display**
   - Fetch top times from server
   - Display in-game leaderboard UI
   - Show global vs. personal times

4. **Ghost Downloading**
   - Fetch ghost data from leaderboard entry
   - Play downloaded ghost during race
   - Comparison with current run

5. **Polish & Testing**
   - Error handling (network, invalid data)
   - Rate limiting on API
   - Input validation
   - Basic tests for determinism

**Validation Gate**:
- ✅ Runs submit successfully
- ✅ Leaderboard updates
- ✅ Downloaded ghosts play correctly
- ✅ Network reliability verified

---

### Bonus Features (Time Permitting)
- Gamepad/controller support
- Multiple tracks
- Drift physics
- Boost mechanics
- Sound effects
- Visual effects (particle trails)
- Local multiplayer (ghost race mode)

---

## 6. Constraints & Performance Targets

### Performance
| Target | Metric |
|--------|--------|
| **Frame Rate** | 60 FPS minimum (stable) |
| **Physics Tick** | 120 Hz fixed tick |
| **Input Latency** | <33ms (frame-perfect) |
| **Reset Time** | <200ms (instant feel) |
| **Ghost Size** | Max 200 KB per run |

### Limits
- Max 100 runs per user per day
- Max 10 ghost downloads per minute per user
- Leaderboard: Top 50 times per track

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebGL 2.0 required

---

## 7. Rendering & Fidelity Rules

### Visual Style
- **Aesthetic**: Clean, arcade, high-contrast
- **Geometry**: Simple shapes (cubes, planes, simple meshes)
- **Colors**: Saturated, neon-like palette
- **Animations**: Instant (no easing on reset/spawn)
- **Polish**: Smooth camera, clear visibility

### Behavioral Requirements
- **Responsiveness**: Zero-latency feel (immediate input reaction)
- **Determinism**: Same inputs always produce same output
- **Restart**: Player position resets immediately, no animation
- **Collision**: Instant collision response, no jiggling
- **Physics**: Arcade (exaggerated, fun) not realistic

### Success Criteria (MVP)

**Mandatory Features**:
- [ ] One playable track
- [ ] Working stopwatch with millisecond precision
- [ ] Instant restart (R key)
- [ ] Personal best time saved locally
- [ ] Ghost of best run replays deterministically
- [ ] Basic leaderboard submission (can run offline during dev)
- [ ] Runs at 60+ FPS consistently

**Automated Tests**:
- [ ] Physics determinism test (same inputs → same result)
- [ ] Checkpoint collision test
- [ ] Stopwatch accuracy test
- [ ] API response format test
- [ ] Ghost compression/decompression test

---

## 8. Resource Plan & Constraints

### Token Budget (1 Premium Request Per Day)
- **Mini Model (0.33x)**: 90% of implementation
  - Phase 1 foundation: game loop, physics, rendering
  - Phase 2 feature expansion: ghosts, UI
  - Phase 3 backend: API, database
  - Testing and debugging
  
- **Premium Model (1x)**: Strategic use only
  - Complex physics bugs
  - Performance optimization bottlenecks
  - Critical architecture decisions
  - Advanced Three.js integration issues

### Time Budget (8 Hours)
- Hours 1-3: Phase 1 (Foundation)
- Hours 4-6: Phase 2 (Ghosts & Leaderboards)
- Hours 7-8: Phase 3 (Polish & Testing)

### Development Workflow
1. **Specification First**: Approve this spec before coding
2. **Build Vertical Slices**: Each phase should be playable
3. **Commit Frequently**: After each working feature
4. **Test Manually**: Race 2-3 times after each feature
5. **Document Decisions**: Log all prompts in COPILOT.md

---

## 9. Context Management (Vibe Coding)

### Each Feature = One Session
- One prompt per feature (when possible)
- Always include relevant file paths
- Reference previous solutions, don't repeat

### Testing Approach
- **Manual First**: Play the game after each feature
- **Automated Second**: Write tests only for determinism-critical logic
- **Integration**: Test end-to-end after each phase

### Rollback Strategy
- If a feature isn't fun → revert and try different approach
- Focus on playability over feature completeness
- Quality > Quantity

---

## 10. Success Metrics

### By End of Day
- **Code Quality**: Clean, no hardcoded values, follows conventions
- **Git History**: Intelligent commits with clear messages
- **Completeness**: Specification adherence (% features done)
- **Playability**: Is it fun? Would you play again?
- **Documentation**: COPILOT.md shows all prompts, SESSION.md summary

### Demo Ready
- App runs with `docker-compose up -d`
- Game is playable immediately after start
- Leaderboard works (or works offline)
- No console errors
- Responsive to input

---

## References & Resources

- **Three.js Docs**: https://threejs.org/docs/
- **TrackMania Reference**: TrackMania game mechanics (arcade time-trial)
- **Vite Docs**: https://vitejs.dev/
- **Fastify Docs**: https://www.fastify.io/
- **Prisma Docs**: https://www.prisma.io/docs/

---

</a>

<a id="fr">

<div align=center>
    <a href="#en">EN</a> . 
    <a href="#fr">FR</a>

# Spécification Technique - Réplique TrackMania
### Projet du Jour 2
*Un jeu de course arcade rapide construit avec Three.js et Node.js*

---
</div>

## 1. Aperçu du Projet

**Genre**: Course Arcade Time-Trial  
**Plateforme**: Navigateur Web (Navigateurs modernes avec support WebGL)  
**Mécanique Principale**: Les joueurs courent contre la montre sur des pistes personnalisées, en compétition pour les meilleurs temps et en comparant les fantômes (données de rejeu)

### Objectif
Construire un jeu de course jouable et complet de style TrackMania où les joueurs peuvent:
- Courir sur des pistes avec chrono en temps réel
- Redémarrer instantanément à tout moment
- Enregistrer et rejouer leurs meilleures courses (fantômes)
- Afficher les classements et rivaliser avec les autres
- Expérimenter un gameplay basé sur les compétences et de style arcade

---

## 2. Découpage Fonctionnel

### 2.1 Client (Frontend - Moteur de Jeu)

#### Noyau du Jeu
- **Boucle de Jeu**: Boucle de jeu à tick fixe avec physique indépendante du rendu
- **Gestion du Temps**: Chronomètre temps réel, pause/reprise, redémarrage instantané
- **Moteur Physique**: Physique véhicule de style arcade (pas de simulation réaliste)
  - Accélération, freinage, virage
  - Mécaniques de dérive avec paramètres d'adhérence
  - Collision de piste et réponse

#### Système de Piste
- **Conception Modulaire**: Routes, boosts, rampes, boucles construites en blocs
- **Détection de Collision**: Collisions simples AABB ou basées sur le maillage
- **Checkpoints**: Segmentation de piste pour le timing des tours et la validation

#### Gestion de l'Entrée
- **Contrôles Clavier**: WASD pour le mouvement, Espace pour le boost, R pour réinitialiser
- **Support Manette**: Mappage stick analogique et boutons (amélioration optionnelle)
- **Hyper-réactif**: Détection d'entrée frame-perfect

#### Rejeu & Fantômes
- **Enregistrement**: Capturer les entrées joueur et les timestamps pendant le jeu
- **Rejeu Déterministe**: Rejouer exactement avec la même physique
- **Données Fantôme**: Format compact (entrées + delta times) pour transfert réseau

#### Système de Caméra
- **Caméra Dynamique**: Suit la voiture avec accélération fluide
- **Vue de Course**: Derrière la voiture ou perspective isométrique
- **Cinématique**: Comportement de caméra supporte la vision du joueur

#### UI / HUD
- **Chronomètre Temps Réel**: Temps de session actuelle en millisecondes
- **Indicateurs Checkpoint**: Retour visuel en franchissant les checkpoints
- **Affichage Meilleur Temps**: Meilleur temps personnel (PB) actuel
- **Panneau Classement**: Meilleurs temps locaux et mondiaux
- **Messages d'État**: Prêt, C'est Parti!, Terminé, etc.

### 2.2 Backend (Serveur - Léger)

#### Points de Terminaison API (REST)
- `POST /api/runs` - Soumettre une course complétée avec temps et données fantôme
- `GET /api/leaderboard?track_id=X&limit=N` - Récupérer les meilleurs temps d'une piste
- `GET /api/ghost/:run_id` - Récupérer les données de rejeu fantôme d'une course
- `GET /api/tracks` - Lister les pistes disponibles

#### Services
- **Gestion des Scores**: Stocker et classer les meilleurs temps par joueur/piste
- **Stockage Fantôme**: Persister et servir les données de rejeu
- **Service de Classement**: Calculer et mettre en cache les classements
- **Gestion Utilisateur**: Authentification légère (optionnel - JWT)

#### Base de Données
- **Schéma**:
  - `users`: id, username, created_at
  - `tracks`: id, name, author, layout_data
  - `runs`: id, user_id, track_id, time_ms, ghost_data, created_at
  - `leaderboard_cache`: track_id, top_times (dénormalisé pour performance)

---

## 3. Stack Technique

### Frontend (Client de Jeu)

| Composant | Technologie | Version |
|-----------|-----------|---------|
| Langage | TypeScript | Dernier |
| Framework | Three.js | ^r128+ |
| Outil de Build | Vite | Dernier |
| Tests | Vitest | Dernier |
| Gestion Entrée | Keyboard API, Gamepad API | Natif |
| Client HTTP | Fetch API | Natif |
| Gestion État | Objets/fonctions simples | - |

### Backend (Serveur)

| Composant | Technologie | Version |
|-----------|-----------|---------|
| Langage | TypeScript | Dernier |
| Runtime | Node.js | 20+ |
| Framework | Fastify | Dernier |
| Base de Données | PostgreSQL | 14+ |
| ORM | Prisma | Dernier |
| Authentification | JWT (optionnel) | - |
| Tests | Vitest + Supertest | Dernier |

### DevOps

| Composant | Technologie |
|-----------|-----------|
| Conteneurisation | Docker |
| Orchestration | Docker Compose |
| Contrôle de Version | Git + GitHub |

---

## 4. Structure des Fichiers & Organisation

### Structure Frontend
```
client/
├── src/
│   ├── core/
│   │   ├── gameLoop.ts           # Tick principal du jeu
│   │   ├── time.ts               # Logique chronomètre
│   │   └── constants.ts           # Constantes jeu
│   ├── physics/
│   │   ├── vehicle.ts            # Physique voiture
│   │   ├── collision.ts          # Détection collision
│   │   └── track.ts              # Données piste & méthodes
│   ├── rendering/
│   │   ├── scene.ts              # Configuration scène Three.js
│   │   ├── renderer.ts           # Gestion renderer
│   │   ├── materials.ts          # Shaders et matériaux
│   │   └── camera.ts             # Contrôleur caméra
│   ├── replay/
│   │   ├── recorder.ts           # Enregistrement entrée
│   │   ├── player.ts             # Rejeu fantôme
│   │   └── serializer.ts         # Compression/décompression
│   ├── input/
│   │   ├── keyboard.ts           # Gestionnaire clavier
│   │   ├── gamepad.ts            # Support manette
│   │   └── inputManager.ts       # Système entrée unifié
│   ├── ui/
│   │   ├── hud.ts                # Éléments HUD
│   │   ├── menu.ts               # Menu principal
│   │   └── leaderboard.ts        # Affichage classement
│   ├── network/
│   │   ├── api.ts                # Client API
│   │   └── types.ts              # Types API
│   ├── tracks/
│   │   ├── trackLoader.ts        # Charger données piste
│   │   ├── trackBuilder.ts       # Construire géométrie 3D
│   │   └── presets.ts            # Pistes démo
│   └── main.ts                   # Point d'entrée
├── assets/
│   ├── tracks/                   # Définitions piste JSON
│   └── textures/                 # Textures (optionnel)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Structure Backend
```
server/
├── src/
│   ├── routes/
│   │   ├── runs.ts               # Soumission course
│   │   ├── leaderboard.ts        # Requêtes classement
│   │   ├── ghosts.ts             # Récupération fantôme
│   │   └── tracks.ts             # Listes pistes
│   ├── services/
│   │   ├── runService.ts         # Logique métier course
│   │   ├── leaderboardService.ts # Logique classement
│   │   └── ghostService.ts       # Gestion fantôme
│   ├── db/
│   │   └── prisma.ts             # Client Prisma
│   ├── middleware/
│   │   ├── auth.ts               # Validation JWT
│   │   └── errorHandler.ts       # Gestion erreurs
│   └── index.ts                  # Point d'entrée serveur
├── prisma/
│   └── schema.prisma             # Schéma BD
├── tests/
│   ├── api.test.ts               # Tests API
│   └── services.test.ts          # Tests services
├── docker-compose.yml
├── Dockerfile
├── tsconfig.json
└── package.json
```

### Conventions de Nommage
- **Variables**: `camelCase`
- **Classes/Types**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Fonctions**: `camelCase`, noms descriptifs
- **Fichiers**: `camelCase.ts` pour utilitaires, `PascalCase.ts` pour classes/composants

---

## 5. Stratégie de Développement

### Phase 1: Fondation - "Fun First" (Heures 1-3)
**Objectif**: Avoir une boucle de jeu jouable

**Tâches** (dans l'ordre):
1. **Configuration Projet**
   - Initialiser projets client et serveur
   - Configurer outils build (Vite, TypeScript)
   - Configurer environnement Docker
   - Repo Git avec structure initiale

2. **Boucle de Jeu**
   - Implémenter boucle de jeu à tick fixe (120 Hz physique, FPS variable rendu)
   - Gestion temps (temps écoulé, delta time)
   - Monitoring fréquence rafraîchissement

3. **Piste Minimale**
   - Créer simple maillage piste rectangulaire
   - Définir checkpoints pour piste
   - Matériaux/couleurs basiques

4. **Physique Véhicule**
   - Objet voiture basique avec position, vélocité, rotation
   - Accélération simple avant/arrière
   - Mécaniques virage (pivoter selon entrée)
   - Friction/amortissement basique

5. **Caméra & Rendu**
   - Configuration scène Three.js
   - Caméra suivant voiture (derrière-voiture ou isométrique)
   - Éclairage basique
   - Boucle rendu

6. **Entrée & Contrôles**
   - Entrée clavier (WASD pour mouvement)
   - Redémarrage instantané (touche R)
   - Mapper entrées aux forces véhicule

7. **Chronomètre & Redémarrage**
   - Chrono temps réel depuis début course
   - Redémarrage instantané au départ (effacer chrono, réinitialiser position)
   - Afficher chrono sur HUD

**Porte de Validation**:
- ✅ Jeu s'exécute à 60+ FPS
- ✅ Voiture se déplace réactif
- ✅ Chrono fonctionne
- ✅ Redémarrage fonctionne instantanément (<200ms)
- ✅ C'est fun de conduire 30 secondes?

---

### Phase 2: Compétitivité - "Battre Votre Meilleur" (Heures 4-6)
**Objectif**: Ajouter suivi meilleur temps personnel et rejeus fantôme

**Tâches** (dans l'ordre):
1. **Système Checkpoints**
   - Détecter when voiture traverse checkpoint
   - Détection complétion tour
   - Temps splits tour

2. **Suivi Meilleur Temps (Stockage Local)**
   - Sauvegarder meilleur temps après course
   - Afficher "Meilleur Temps Personnel" sur HUD
   - Afficher splits pour chaque checkpoint

3. **Enregistrement Fantôme**
   - Enregistrer entrées joueur + timestamps pendant jeu
   - Sérialiser données fantôme (compresser entrées)
   - Stocker meilleur fantôme localement (localStorage)

4. **Rejeu Fantôme**
   - Charger données meilleur fantôme
   - Rejouer mouvement voiture déterministiquement
   - Afficher voiture fantôme semi-transparente pendant jeu
   - Comparer temps en temps réel

5. **UI Améliorée**
   - Afficher meilleur temps personnel
   - Afficher comparaison avec fantôme
   - Affichage temps tours/splits
   - Écran "Terminé" avec résultats

**Porte de Validation**:
- ✅ Peut sauvegarder et charger meilleur temps
- ✅ Fantôme rejoue correctement
- ✅ Rejeu bit-perfect déterministe
- ✅ C'est fun de battre votre propre temps?

---

### Phase 3: Social - "Partager & Rivaliser" (Heures 7-8)
**Objectif**: Ajouter backend et classements

**Tâches** (dans l'ordre):
1. **Configuration Backend**
   - Serveur Fastify avec TypeScript
   - Configuration PostgreSQL + Prisma
   - Docker Compose pour BD

2. **Implémentation API**
   - `POST /api/runs` - Soumettre course avec données fantôme
   - `GET /api/leaderboard` - Obtenir N meilleurs temps
   - `GET /api/ghost/:id` - Obtenir données fantôme
   - Gestion erreurs et validation

3. **Affichage Classement**
   - Récupérer meilleurs temps du serveur
   - Afficher dans UI jeu classement
   - Afficher temps mondiaux vs. temps personnels

4. **Téléchargement Fantôme**
   - Récupérer données fantôme d'entrée classement
   - Jouer fantôme téléchargé pendant course
   - Comparaison avec course actuelle

5. **Polish & Tests**
   - Gestion erreurs (réseau, données invalides)
   - Rate limiting sur API
   - Validation entrée
   - Tests basiques pour déterminisme

**Porte de Validation**:
- ✅ Courses se soumettent avec succès
- ✅ Classement se met à jour
- ✅ Fantômes téléchargés jouent correctement
- ✅ Fiabilité réseau vérifiée

---

### Fonctionnalités Bonus (Si Temps Permet)
- Support manette/contrôleur
- Pistes multiples
- Physique dérive
- Mécaniques boost
- Effets sonores
- Effets visuels (traînées particules)
- Multijoueur local (mode course fantôme)

---

## 6. Contraintes & Cibles Performance

### Performance
| Cible | Métrique |
|-------|--------|
| **Fréquence Images** | 60 FPS minimum (stable) |
| **Tick Physique** | Tick fixe 120 Hz |
| **Latence Entrée** | <33ms (frame-perfect) |
| **Temps Redémarrage** | <200ms (sensation instantanée) |
| **Taille Fantôme** | Max 200 KB par course |

### Limites
- Max 100 courses par utilisateur par jour
- Max 10 téléchargements fantôme par minute par utilisateur
- Classement: Top 50 temps par piste

### Support Navigateur
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebGL 2.0 requis

---

## 7. Règles Rendu & Fidélité

### Style Visuel
- **Esthétique**: Propre, arcade, contraste élevé
- **Géométrie**: Formes simples (cubes, plans, mailles simples)
- **Couleurs**: Saturées, palette néon
- **Animations**: Instantanées (pas d'assouplissement au redémarrage/apparition)
- **Polish**: Caméra fluide, visibilité claire

### Exigences Comportementales
- **Réactivité**: Sensation zéro-latence (réaction entrée immédiate)
- **Déterminisme**: Mêmes entrées produisent toujours même résultat
- **Redémarrage**: Position joueur réinitialise immédiatement, pas animation
- **Collision**: Réponse collision instantanée, pas de vibration
- **Physique**: Arcade (exagérée, amusante) pas réaliste

### Critères Succès (MVP)

**Fonctionnalités Obligatoires**:
- [ ] Une piste jouable
- [ ] Chronomètre fonctionnel avec précision milliseconde
- [ ] Redémarrage instantané (touche R)
- [ ] Meilleur temps personnel sauvegardé localement
- [ ] Fantôme meilleure course rejoue déterministiquement
- [ ] Soumission classement basique (peut fonctionner hors ligne pendant dev)
- [ ] S'exécute à 60+ FPS de manière cohérente

**Tests Automatisés**:
- [ ] Test déterminisme physique (mêmes entrées → même résultat)
- [ ] Test collision checkpoint
- [ ] Test précision chronomètre
- [ ] Test format réponse API
- [ ] Test compression/décompression fantôme

---

## 8. Plan de Ressources & Contraintes

### Budget Tokens (1 Requête Premium Par Jour)
- **Modèle Mini (0.33x)**: 90% de l'implémentation
  - Phase 1 fondation: boucle jeu, physique, rendu
  - Phase 2 expansion features: fantômes, UI
  - Phase 3 backend: API, base données
  - Tests et debugging
  
- **Modèle Premium (1x)**: Usage stratégique seulement
  - Bugs physique complexe
  - Goulots d'étranglement optimisation performance
  - Décisions architecture critique
  - Problèmes intégration Three.js avancées

### Budget Temps (8 Heures)
- Heures 1-3: Phase 1 (Fondation)
- Heures 4-6: Phase 2 (Fantômes & Classements)
- Heures 7-8: Phase 3 (Polish & Tests)

### Flux de Développement
1. **Spécification Première**: Approuver cette spec avant coding
2. **Construire Tranches Verticales**: Chaque phase doit être jouable
3. **Committer Fréquemment**: Après chaque feature fonctionnelle
4. **Tester Manuellement**: Jouer 2-3 fois après chaque feature
5. **Documenter Décisions**: Logger tous prompts dans COPILOT.md

---

## 9. Gestion du Contexte (Vibe Coding)

### Chaque Feature = Une Session
- Un prompt par feature (quand possible)
- Toujours inclure chemins fichiers pertinents
- Référencer solutions précédentes, ne pas répéter

### Approche Tests
- **Manuel D'abord**: Jouer jeu après chaque feature
- **Automatisé Ensuite**: Écrire tests seulement pour logique critique déterminisme
- **Intégration**: Tester bout-en-bout après chaque phase

### Stratégie Rollback
- Si feature n'est pas fun → revenir et essayer approche différente
- Focusser jouabilité sur complétude features
- Qualité > Quantité

---

## 10. Métriques de Succès

### En Fin de Journée
- **Qualité Code**: Propre, pas valeurs hardcoded, suit conventions
- **Historique Git**: Commits intelligents avec messages clairs
- **Complétude**: Adhérence spécification (% features faites)
- **Jouabilité**: C'est fun? Rejouerez-vous?
- **Documentation**: COPILOT.md affiche tous prompts, résumé SESSION.md

### Prêt pour Démo
- App s'exécute avec `docker-compose up -d`
- Jeu jouable immédiatement après démarrage
- Classement fonctionne (ou fonctionne hors ligne)
- Pas d'erreurs console
- Réactif à l'entrée

---

## Références & Ressources

- **Documentation Three.js**: https://threejs.org/docs/
- **Référence TrackMania**: Mécaniques jeu TrackMania (time-trial arcade)
- **Documentation Vite**: https://vitejs.dev/
- **Documentation Fastify**: https://www.fastify.io/
- **Documentation Prisma**: https://www.prisma.io/docs/

---

</a>
