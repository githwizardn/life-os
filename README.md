# LIFE OS

> A personal RPG-style life operating system. Zero AI. Zero cost. Deterministic systems only.

**Live:** [life-os-chi-nine.vercel.app](https://life-os-chi-nine.vercel.app)  
**Stack:** React 19 · TypeScript · Vite · Supabase · Custom CSS  
**Cost:** $0/month forever (Supabase free tier + Vercel free tier)

---

## What is this?

LIFE OS turns daily life into a Solo Leveling–style "System." You complete real tasks, earn XP, unlock skill trees, collect shadows, run dungeons, and get called out by a System Voice when you slack. Everything is deterministic — no random loot boxes, no LLM calls, no hidden costs.

Every feature is designed against one rule:

> **Does this change real life in 90 days?**

If not, it doesn't ship.

---

## Design Principles

1. **Zero AI** — template-based systems only, no LLM APIs, $0 forever
2. **Free forever** — Supabase free tier + Vercel free tier
3. **Real impact** — every feature must change real life in 90 days
4. **Deterministic over random** — seeded PRNG, no gambling mechanics
5. **Depth over breadth** — fewer systems, done deeply
6. **Honor over comfort** — declining tasks has real consequence

---

## Features

### Phase 1 — Foundation
- **HONOR stat** (0–100, starts at 50)
  - +1 per task, +2 for full category completion, −3 for declining
  - 20% weekly decay toward 50
- **System Voice** — 500+ hand-written lines across 6 moods (observing, pleased, concerned, disappointed, impressed, ancient)
- **Decline mechanic** — refusing a task costs HONOR

### Phase 2 — Skill Trees
- 7 paths: **Iron** (body) · **Mind** · **Craft** (mastery) · **Coin** (autonomy) · **Grove** (growth) · **Voice** (connection) · **Flame** (joy)
- 42 nodes total (6 tiers per path)
- Auto-unlock when category XP + HONOR requirements are met
- Passive XP bonuses scale from +2% (T1) to +20% (T6)

### Phase 3 — Shadow Army
- 10 collectible shadows extracted from **Legendary** task completions
- Permanent passive abilities that stack with skill tree bonuses
- **Shadow of the Monarch** — awarded for collecting all 7 base shadows

### Phase 4 — Dungeons
- 7 multi-hour instances (one per path)
- 2–8 hour durations with auto-fail on expiry
- Guaranteed Shadow on completion
- Locked until category XP thresholds are met

### Phase 5 — Gates
- 100 hand-written random encounters
- 2% chance per hour (deterministic PRNG on `userId + hour`)
- 60-second countdown to enter or ignore
- Entering awards XP · ignoring costs HONOR
- Only one gate per hour

### Phase 6 — Seasons
- 7 seasons that cycle every 90 days
- Each has a themed boss with 3 requirements
- Boss defeat awards **Shadow of the Monarch** (+25% all XP)
- Auto-transitions when the season duration expires

### Phase 7 — Chronicles
- Weekly narrative summaries generated from real data
- Template-based (zero AI)
- Stored in `user_chronicles`

### Phase 8 — Relationship Dossier
- Full-profile CRM for unlimited people
- 6 tiers with soft caps: inner / close / family / friend / pro / ext
- Tracks: name, emoji, tier, birthday (`MM-DD`), contact frequency, last contact, key facts, their people, their work, their struggles, their wins, gift ideas, shared history, notes
- Overdue detection + urgency sorting
- **Reach Out widget** — surfaces overdue contacts + birthdays within 7 days at the top of the dashboard
- One-tap **Mark Contacted** resets the timer

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Auth | Supabase Auth |
| Database | Supabase Postgres (with RLS) |
| Storage | Supabase (row-based) + localStorage hybrid |
| Styling | Custom CSS (dark cyberpunk) |
| Font | Space Mono |
| Hosting | Vercel |

---

## Local Development

### Prerequisites
- Node.js 20+
- A Supabase project (free tier works)
- Git

### 1. Clone

```bash
git clone https://github.com/githwizardn/life-os.git
cd life-os
```

### 2. Install

```bash
npm install
```

### 3. Environment variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get both from **Supabase → Project Settings → API**.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Build

```bash
npm run build
npm run preview
```

---

## Database Schema

All tables use Row-Level Security. Every row is scoped to `auth.uid()`.

| Table | Purpose |
|---|---|
| `profiles` | User name, goals, join date |
| `global_data` | XP, streak, HONOR, category XP, decay tracking |
| `task_state` | Daily task completion + decline state |
| `notes` | Current daily notes |
| `notes_history` | Snapshot archive of past notes |
| `quests` | Multi-day quests with check-in tracking |
| `user_skill_progress` | Unlocked skill nodes |
| `user_shadows` | Collected shadows |
| `user_dungeons` | Active + completed + failed dungeon runs |
| `user_gates` | Gate encounters (pending / entered / ignored) |
| `user_seasons` | Season runs + boss defeat status |
| `user_chronicles` | Weekly narrative summaries |
| `relationships` | Full relationship dossier entries |

---

## Project Structure

```
life-os/
├── public/
├── src/
│   ├── App.tsx                      # Main app — all state, handlers, layout
│   ├── App.css                      # All styles (dark cyberpunk)
│   ├── main.tsx
│   ├── index.css
│   ├── data/
│   │   ├── tasks.ts                 # 700+ tasks across 7 categories
│   │   ├── skillTrees.ts            # 42 skill node definitions
│   │   ├── shadows.ts               # 10 shadow definitions
│   │   ├── dungeons.ts              # 7 dungeon definitions
│   │   ├── gates.ts                 # 100 gate encounters
│   │   ├── seasons.ts               # 7 season definitions
│   │   ├── systemVoice.ts           # 500+ voice lines
│   │   └── relationships.ts         # Tier definitions + emoji set
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   ├── db.ts                    # All Supabase calls
│   │   ├── honor.ts                 # HONOR math
│   │   ├── skills.ts                # Skill unlock logic
│   │   ├── shadows.ts               # Shadow extraction logic
│   │   ├── dungeons.ts              # Dungeon timing logic
│   │   ├── seasons.ts               # Season + boss logic
│   │   ├── chronicles.ts            # Narrative generation
│   │   └── relationships.ts         # Dossier logic
│   ├── components/
│   │   ├── Auth.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Header.tsx
│   │   ├── XPBar.tsx
│   │   ├── HonorBar.tsx
│   │   ├── SystemVoice.tsx
│   │   ├── TaskList.tsx
│   │   ├── ScoreCards.tsx
│   │   ├── DayProgress.tsx
│   │   ├── SkillTree.tsx
│   │   ├── ShadowArmy.tsx
│   │   ├── DungeonList.tsx
│   │   ├── GateModal.tsx
│   │   ├── SeasonBanner.tsx
│   │   ├── Chronicle.tsx
│   │   ├── RelationshipCRM.tsx
│   │   ├── ReachOutWidget.tsx
│   │   ├── Notes.tsx
│   │   ├── LevelUpModal.tsx
│   │   ├── CategorySelectModal.tsx
│   │   └── QuestTracker.tsx
│   └── hooks/
│       └── useLocalStorage.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Design Aesthetic

- Dark cyberpunk / Solo Leveling "System" vibe
- Primary: neon green `#00ffaa`
- Secondary: purple `#a855f7`
- Font: **Space Mono**
- Card-based layout, every section has icon + title + count
- Animations are subtle, never distracting

---

## Deployment

Deployed to Vercel. Every push to `main` auto-deploys.

### First-time setup
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `github.com/githwizardn/life-os`
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Redeploy
Just push to `main`:

```bash
git push origin main
```

---

## Roadmap

| Phase | Status | Feature |
|---|---|---|
| 1 | ✅ | HONOR + System Voice + Decline |
| 2 | ✅ | Skill Trees (7 paths, 42 nodes) |
| 3 | ✅ | Shadow Army (10 shadows) |
| 4 | ✅ | Dungeons (7 instances) |
| 5 | ✅ | Gates (100 encounters) |
| 6 | ✅ | Seasons (7 arcs, 90-day cycle) |
| 7 | ✅ | Chronicles (weekly narratives) |
| 8 | ✅ | Relationship Dossier + Reach Out widget |
| 9 | ⏳ | **Decision Journal** |
| 10 | ⏳ | Body & Mind Tracking |
| 11 | ⏳ | Polish (PWA, notifications, sound) |

---

## Philosophy

LIFE OS is not a productivity app. It's not a habit tracker. It's a **mirror**.

- It rewards showing up.
- It punishes hiding.
- It remembers what you said you'd do.
- It tells you the truth about who you're becoming.

No streaks to "protect." No dopamine loops. No AI to flatter you. Just a system that watches what you actually do, and reflects it back.

> *"Honor over comfort."*

---

## License

MIT — do whatever you want, just don't call it yours.

---

## Author

Built by [@githwizardn](https://github.com/githwizardn).

Solo dev. Free tier everything. Zero AI.