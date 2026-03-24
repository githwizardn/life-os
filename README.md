# Life OS

**Life OS** is a deterministic human-performance engine developed to quantify personal development through a gamified RPG framework. It moves beyond passive task management by implementing high-stakes accountability across seven core life domains.

**Live System:** [life-os-chi-nine.vercel.app](https://life-os-chi-nine.vercel.app/)

---

## 📖 System Overview

Life OS operates on the principle of **constrained productivity**. By limiting the daily focus to exactly 5 tasks per category, the system eliminates decision fatigue while ensuring consistent progress across the following domains:

* **Body:** Physical infrastructure and metabolic health.
* **Mind:** Cognitive ownership and emotional regulation.
* **Mastery:** Technical skill acquisition and professional craft.
* **Autonomy:** Financial independence and resource management.
* **Growth:** Intellectual expansion and meta-learning.
* **Connection:** Relational depth and social capital.
* **Joy:** Deliberate recovery and aesthetic appreciation.

---

## 🛠 Technical Architecture

The application is built as a highly performant, secure Single Page Application (SPA) using a modern full-stack approach.

### 1. The Frontend Stack
* **React 18:** Functional architecture utilizing the latest hooks for state management.
* **TypeScript:** Full type-safety across the data layer, ensuring reliable quest and task handling.
* **Vite:** Optimized build-tooling for near-instant HMR (Hot Module Replacement) and efficient bundling.

### 2. The Persistence Layer (Hybrid Model)
To ensure zero-latency and multi-device continuity, the system employs a dual-layer strategy:
* **Local Persistence:** A custom `useLocalStorage` hook maintains state locally for offline-first responsiveness.
* **Cloud Synchronization:** Supabase (PostgreSQL) acts as the single source of truth, handling cross-device data integrity via real-time syncing.

### 3. Key Algorithms
* **Deterministic PRNG Task Rotation:** Instead of traditional random queries, Life OS uses a seeded Pseudo-Random Number Generator. This ensures that every user sees a consistent task list for 24 hours based on the date and their specific `resetCount`, without requiring daily database writes for task selection.
* **XP Scaling Logic:** A non-linear mathematical progression system across 10 difficulty-adjusted levels.

---

## 🛡 Security & Data Integrity

The system is architected with a "Security-First" mindset, particularly at the database level.

* **Row Level Security (RLS):** Policies are enforced in PostgreSQL to ensure strict data isolation. Users can only access their records.
* **JWT-Based Authentication:** Identity is managed through Supabase Auth (GoTrue), providing secure, encrypted session management.
* **Environment Encapsulation:** Sensitive API endpoints are protected using Vite's environment variable injection.

---


## ⚙️ Development Setup

### Prerequisites
* Node.js (v16+)
* NPM or Yarn
* A Supabase Project

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/githwizardn/life-os.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create a `.env` file in the root:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  **Launch:**
    ```bash
    npm run dev
    ```

---

## 👤 Author

**Nodo** GitHub: [@githwizardn](https://github.com/githwizardn)

---
*"You don't rise to the level of your goals. You fall to the level of your systems."*