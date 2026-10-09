# LIFE OS

Personal RPG-style life operating system. Client-heavy React SPA backed by Supabase. Deterministic systems only — no external APIs, no LLM calls, no paid services.

**Live:** [life-os-chi-nine.vercel.app](https://life-os-chi-nine.vercel.app)  
**Repo:** [github.com/githwizardn/life-os](https://github.com/githwizardn/life-os)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Auth | Supabase Auth |
| Database | Supabase Postgres (RLS on every table) |
| Client state | React hooks + localStorage (offline fallback) |
| Styling | Custom CSS (no framework) |
| Font | Space Mono |
| PWA | Custom service worker (`public/sw.js`) |
| Hosting | Vercel (auto-deploy on push to `main`) |

---

## Setup

Requires Node.js 20+.

```bash
git clone https://github.com/githwizardn/life-os.git
cd life-os
npm install
```

Create `.env` at project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get both from **Supabase → Project Settings → API**.

---

## Commands

```bash
npm run dev        # dev server, localhost:5173
npm run build      # production build (tsc + vite build)
npm run preview    # preview build, localhost:4173
npm run lint       # eslint
```

The service worker only registers when `import.meta.env.PROD` is true. To test PWA behavior, run `build` then `preview` — not `dev`.

---

## Project Structure

```
life-os/
├── public/
│   ├── icon.svg               # PWA / Apple touch icon
│   ├── favicon.svg            # tab icon
│   ├── manifest.webmanifest   # PWA manifest
│   └── sw.js                  # service worker
├── src/
│   ├── App.tsx                # main component, all global state
│   ├── App.css                # all styles
│   ├── main.tsx               # entry, registers SW in prod
│   ├── data/                  # static definitions (tasks, skills, shadows, etc.)
│   ├── lib/                   # logic + Supabase calls
│   │   ├── supabase.ts        # client
│   │   ├── db.ts              # all queries
│   │   ├── honor.ts           # HONOR math
│   │   ├── skills.ts          # unlock rules
│   │   ├── shadows.ts         # extraction rules
│   │   ├── dungeons.ts        # timing
│   │   ├── seasons.ts         # season + boss logic
│   │   ├── chronicles.ts      # template narrative
│   │   ├── relationships.ts   # dossier logic
│   │   ├── decisions.ts       # decision journal logic
│   │   ├── bodyMind.ts        # sleep/workout/measure/reading/finance
│   │   ├── sound.ts           # Web Audio chimes
│   │   └── notifications.ts   # permission + dedupe + fire
│   ├── components/            # one file per section/modal
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

## Database

Every table has RLS enabled and is scoped to `auth.uid()`.

| Table | Purpose |
|---|---|
| `profiles` | name, goals, join date |
| `global_data` | total_xp, streak, best_streak, last_day, reset_count, active_categories, honor, honor_updated_at, last_honor_decay, category_xp |
| `task_state` | daily task completion + decline state |
| `notes` | current daily notes |
| `notes_history` | snapshot archive of notes |
| `quests` | multi-day quests with check-in state |
| `user_skill_progress` | unlocked skill nodes |
| `user_shadows` | collected shadows |
| `user_dungeons` | active / completed / failed dungeon runs |
| `user_gates` | gate encounters (pending / entered / ignored) |
| `user_seasons` | season runs + boss defeat status |
| `user_chronicles` | weekly narrative summaries |
| `relationships` | dossier entries (**birthday is `text`, not `date`** — stores DD-MM) |
| `decisions` | decision journal + time-gated reviews |
| `sleep_logs` | unique per (user_id, date) |
| `workouts` | individual exercise entries |
| `measurements` | unique per (user_id, date) |
| `reading_logs` | books, courses, articles |
| `finance_logs` | income / expense / net_worth entries |

---

## Architecture Notes

- **Single big `App.tsx`.** All global state, all handlers, all layout live in one file. Sections are extracted into components but receive state and callbacks as props. No context, no state library.
- **Hybrid persistence.** State is mirrored to localStorage on every change (`useLocalStorage` hook) and synced to Supabase asynchronously. If Supabase fails, UI stays responsive; next successful call reconciles.
- **Deterministic randomness.** Gate appearances use a seeded PRNG on `userId + hour`. Same user, same hour = same gate. No `Math.random()` in gameplay paths.
- **Service worker.** Caches the app shell (`/`, `/index.html`, manifest, icons). Never caches Supabase or cross-origin requests. Network-first for HTML navigation, cache-first for static assets.
- **Notifications.** Deduped per day via localStorage. Mute toggle in Settings so you can silence without revoking browser permission.
- **No backend code.** All logic runs client-side. Supabase is data + auth only.

---

## Deployment

Vercel, auto-deploy on push to `main`.

**Env vars required in Vercel project settings:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Redeploy:**
```bash
git push origin main
```

---

## Phases

| Phase | Status | Scope |
|---|---|---|
| 1 | ✅ | HONOR + System Voice + Decline |
| 2 | ✅ | Skill Trees |
| 3 | ✅ | Shadow Army |
| 4 | ✅ | Dungeons |
| 5 | ✅ | Gates |
| 6 | ✅ | Seasons |
| 7 | ✅ | Chronicles |
| 8 | ✅ | Relationship Dossier |
| 9 | ✅ | Decision Journal |
| 10 | ✅ | Body & Mind |
| 11 | ✅ | PWA, notifications, sound, a11y |
| 12 | ⏳ | Data & Settings (search, export, import) |

---

## License

MIT.

## Author

[@githwizardn](https://github.com/githwizardn)