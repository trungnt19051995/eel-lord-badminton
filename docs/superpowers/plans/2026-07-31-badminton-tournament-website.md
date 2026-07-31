# Đồng Lươn Badminton Cup 2026 Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first single-page badminton tournament website (Vue 3 + Vite + Tailwind + Pinia) that tracks a 12-couple, 4-round bracket, syncing live via Firebase Realtime Database so every viewer's phone reflects the Admin's updates.

**Architecture:** A single Pinia store (`tournamentStore`) holds `couples`, `matches`, `rules`; every mutation debounced-writes the whole object to one Firebase Realtime Database node, and every client (including the writer) re-renders from a live `onValue` listener on that node, with a LocalStorage cache for instant paint. A pure-function bracket engine (`utils/bracket.js`) resolves each match's two team slots (fixed couple, or winner/loser/group-winner of another match, with Admin override) — this is what makes Round 2–4 pairings "flow" automatically once Round 1 results are entered.

**Tech Stack:** Vue 3 (`<script setup>`), Vite, Pinia, Tailwind CSS, Firebase (Realtime Database, client SDK only, no self-hosted backend).

## Global Constraints

- Mobile-first: bracket scrolls horizontally at ~1600px logical width, never shrinks columns; menu collapses to a hamburger on mobile.
- No self-managed backend/server code — Firebase Realtime Database (Spark free plan) is the only external service, used purely as a synced data store via its client SDK.
- Round accent colors: Vòng 1 = emerald (`bg-emerald-600`), Vòng 2 = blue (`bg-blue-600`), Vòng 3 = violet (`bg-violet-600`), Vòng 4 = amber (`bg-amber-600`). Match status: ⚪ pending / 🟡 live / 🟢 done. Winning team gets an emerald border.
- Admin credentials are hardcoded: username `trungnt`, password `12345678` (per `DETAIL_DESIGN(1).md` mục 12). Admin session lives in `sessionStorage`, not `localStorage`.
- Tournament name shown in the header: "Đồng Lươn Badminton Cup 2026".
- No automated test suite (explicit project decision, spec §8) — every task is verified by `npm run build` (compiles clean) plus, where noted, a one-off manual `node` sanity script that is deleted after use. The final task is a manual QA pass through the 8 scenarios in the spec.
- 12 couples and all 21 matches (courts/times) are hardcoded in `src/data/defaultData.js` exactly as specified below — do not invent different courts/times.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/assets/main.css`
- Create: `.gitignore`
- Create: `.env.example`

**Interfaces:**
- Produces: a working Vite dev/build pipeline that every later task's Vue/JS files plug into. `src/App.vue` is a placeholder that Task 14 replaces.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "dong-luon-badminton-cup",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "firebase": "^10.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Write `vite.config.js`**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

- [ ] **Step 3: Write `tailwind.config.js` and `postcss.config.js`**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: { extend: {} },
  plugins: [],
}
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Write `index.html`**

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Đồng Lươn Badminton Cup 2026</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `src/assets/main.css`, `src/main.js`, `src/App.vue`**

```css
/* src/assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

createApp(App).use(createPinia()).mount('#app')
```

```vue
<!-- src/App.vue (placeholder, replaced in Task 14) -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <h1 class="p-4 text-xl font-bold">Đồng Lươn Badminton Cup 2026</h1>
  </div>
</template>
```

- [ ] **Step 6: Write `.gitignore` and `.env.example`**

```
# .gitignore
node_modules
dist
.env.local
.env*.local
```

```
# .env.example
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 7: Install and verify**

Run: `npm install && npm run build`
Expected: build succeeds, `dist/` is created, no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js tailwind.config.js postcss.config.js index.html src .gitignore .env.example package-lock.json
git commit -m "chore: scaffold Vite + Vue3 + Pinia + Tailwind project"
```

---

## Task 2: Data model & default tournament data

**Files:**
- Create: `src/data/defaultData.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `defaultCouples` (array of `{id, maleName, femaleName}`), `defaultMatches` (array of `Match`), `defaultRules` (string). `Match` shape: `{id, round, group, court, time, team1, team2, score1, score2, status}`. `TeamSlot` shape: `{type: 'couple'|'winner'|'loser'|'groupWinner', coupleId?, matchId?, group?, override}`. These exact shapes are relied on by every later task.

- [ ] **Step 1: Write `src/data/defaultData.js`**

```js
export const defaultCouples = [
  { id: 1, maleName: 'Hoàng Anh', femaleName: 'Phương Anh' },
  { id: 2, maleName: 'Nhật Minh', femaleName: 'Lan Anh' },
  { id: 3, maleName: 'Hùng Hr', femaleName: 'Loan' },
  { id: 4, maleName: 'Ck My', femaleName: 'My' },
  { id: 5, maleName: 'Huy Sapo', femaleName: 'Trần Trang' },
  { id: 6, maleName: 'Chiến', femaleName: 'Hiền' },
  { id: 7, maleName: 'Lương', femaleName: 'Thanh' },
  { id: 8, maleName: 'Hiếu', femaleName: 'Thảo' },
  { id: 9, maleName: 'Hải', femaleName: 'Liên' },
  { id: 10, maleName: 'Phong', femaleName: 'Lê' },
  { id: 11, maleName: 'Lâm', femaleName: 'Linh' },
  { id: 12, maleName: 'Trung', femaleName: 'Thủy' },
]

function coupleSlot(coupleId) {
  return { type: 'couple', coupleId, override: null }
}
function winnerSlot(matchId) {
  return { type: 'winner', matchId, override: null }
}
function loserSlot(matchId) {
  return { type: 'loser', matchId, override: null }
}
function groupWinnerSlot(group) {
  return { type: 'groupWinner', group, override: null }
}
function baseMatch(id, round, group, court, time, team1, team2) {
  return { id, round, group, court, time, team1, team2, score1: null, score2: null, status: 'pending' }
}

export const defaultMatches = [
  // Vòng 1 — Loại trực tiếp (07:30–08:00)
  baseMatch('m1', 1, null, 1, '07:30-07:45', coupleSlot(1), coupleSlot(2)),
  baseMatch('m2', 1, null, 1, '07:45-08:00', coupleSlot(3), coupleSlot(4)),
  baseMatch('m3', 1, null, 2, '07:30-07:45', coupleSlot(5), coupleSlot(6)),
  baseMatch('m4', 1, null, 2, '07:45-08:00', coupleSlot(7), coupleSlot(8)),
  baseMatch('m5', 1, null, 3, '07:30-07:45', coupleSlot(9), coupleSlot(10)),
  baseMatch('m6', 1, null, 3, '07:45-08:00', coupleSlot(11), coupleSlot(12)),

  // Vòng 2 — Vòng tròn tính điểm (20:00–21:00)
  baseMatch('m7', 2, 'A1', 1, '20:00-20:15', winnerSlot('m1'), winnerSlot('m2')),
  baseMatch('m8', 2, 'A2', 2, '20:00-20:15', winnerSlot('m4'), winnerSlot('m5')),
  baseMatch('m9', 2, 'B1', 3, '20:00-20:15', loserSlot('m1'), loserSlot('m2')),
  baseMatch('m10', 2, 'A1', 1, '20:15-20:30', winnerSlot('m2'), winnerSlot('m3')),
  baseMatch('m11', 2, 'A2', 2, '20:15-20:30', winnerSlot('m5'), winnerSlot('m6')),
  baseMatch('m12', 2, 'B1', 3, '20:15-20:30', loserSlot('m2'), loserSlot('m3')),
  baseMatch('m13', 2, 'A1', 1, '20:30-20:45', winnerSlot('m1'), winnerSlot('m3')),
  baseMatch('m14', 2, 'A2', 2, '20:30-20:45', winnerSlot('m4'), winnerSlot('m6')),
  baseMatch('m15', 2, 'B1', 3, '20:30-20:45', loserSlot('m1'), loserSlot('m3')),
  baseMatch('m16', 2, 'B2', 1, '20:45-21:00', loserSlot('m4'), loserSlot('m5')),
  baseMatch('m17', 2, 'B2', 2, '20:45-21:00', loserSlot('m5'), loserSlot('m6')),
  baseMatch('m18', 2, 'B2', 3, '20:45-21:00', loserSlot('m4'), loserSlot('m6')),

  // Vòng 3 — Chung kết nhánh (21:00–21:15)
  baseMatch('m19', 3, null, 1, '21:00-21:15', groupWinnerSlot('A1'), groupWinnerSlot('A2')),
  baseMatch('m20', 3, null, 2, '21:00-21:15', groupWinnerSlot('B1'), groupWinnerSlot('B2')),

  // Vòng 4 — Chung kết tổng (21:15–21:30)
  baseMatch('m21', 4, null, 1, '21:15-21:30', winnerSlot('m19'), winnerSlot('m20')),
]

export const defaultRules = 'Thể lệ giải đấu sẽ được Admin cập nhật tại đây.'
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds (this file has no consumers yet, so this only checks for syntax errors).

- [ ] **Step 3: Commit**

```bash
git add src/data/defaultData.js
git commit -m "feat: add default tournament data (12 couples, 21 matches)"
```

---

## Task 3: Bracket resolution engine

**Files:**
- Create: `src/utils/bracket.js`

**Interfaces:**
- Consumes: `Match`/`TeamSlot` shapes from Task 2.
- Produces: `resolveTeam(teamSlot, matches) -> coupleId|null`, `computeGroupStandings(group, matches) -> Array<{coupleId, wins, losses, points, scored, conceded, diff}>`, `getGroupWinner(group, matches) -> coupleId|null`, `describeTeamSlot(teamSlot, matches, couples) -> string`. Every later component that renders a match or standings table uses these four functions — names and signatures must not change.

- [ ] **Step 1: Write `src/utils/bracket.js`**

```js
export function resolveTeam(teamSlot, matches) {
  if (!teamSlot) return null
  if (teamSlot.override != null) return teamSlot.override

  if (teamSlot.type === 'couple') {
    return teamSlot.coupleId
  }

  if (teamSlot.type === 'winner' || teamSlot.type === 'loser') {
    const source = matches.find((m) => m.id === teamSlot.matchId)
    if (!source || source.status !== 'done') return null
    const id1 = resolveTeam(source.team1, matches)
    const id2 = resolveTeam(source.team2, matches)
    if (id1 == null || id2 == null) return null
    const winnerId = source.score1 > source.score2 ? id1 : id2
    const loserId = source.score1 > source.score2 ? id2 : id1
    return teamSlot.type === 'winner' ? winnerId : loserId
  }

  if (teamSlot.type === 'groupWinner') {
    return getGroupWinner(teamSlot.group, matches)
  }

  return null
}

export function computeGroupStandings(group, matches) {
  const groupMatches = matches.filter((m) => m.group === group)
  const stats = {}

  groupMatches.forEach((m) => {
    const id1 = resolveTeam(m.team1, matches)
    const id2 = resolveTeam(m.team2, matches)
    if (id1 != null && !stats[id1]) stats[id1] = { coupleId: id1, wins: 0, losses: 0, points: 0, scored: 0, conceded: 0 }
    if (id2 != null && !stats[id2]) stats[id2] = { coupleId: id2, wins: 0, losses: 0, points: 0, scored: 0, conceded: 0 }
  })

  groupMatches.forEach((m) => {
    if (m.status !== 'done') return
    const id1 = resolveTeam(m.team1, matches)
    const id2 = resolveTeam(m.team2, matches)
    if (id1 == null || id2 == null) return
    stats[id1].scored += m.score1
    stats[id1].conceded += m.score2
    stats[id2].scored += m.score2
    stats[id2].conceded += m.score1
    if (m.score1 > m.score2) {
      stats[id1].wins += 1
      stats[id1].points += 1
      stats[id2].losses += 1
    } else {
      stats[id2].wins += 1
      stats[id2].points += 1
      stats[id1].losses += 1
    }
  })

  return Object.values(stats).map((s) => ({ ...s, diff: s.scored - s.conceded }))
}

// Thứ tự xếp hạng: điểm -> đối đầu trực tiếp (chỉ khi đúng 2 đội bằng điểm) -> hiệu số -> tổng điểm ghi -> không phân định được (Admin override)
export function getGroupWinner(group, matches) {
  const standings = computeGroupStandings(group, matches)
  if (standings.length === 0) return null

  const maxPoints = Math.max(...standings.map((s) => s.points))
  let leaders = standings.filter((s) => s.points === maxPoints)
  if (leaders.length === 1) return leaders[0].coupleId

  if (leaders.length === 2) {
    const h2h = matches.find((m) => {
      if (m.group !== group || m.status !== 'done') return false
      const id1 = resolveTeam(m.team1, matches)
      const id2 = resolveTeam(m.team2, matches)
      const pair = [leaders[0].coupleId, leaders[1].coupleId].sort().join(',')
      return [id1, id2].sort().join(',') === pair
    })
    if (h2h) {
      const id1 = resolveTeam(h2h.team1, matches)
      const id2 = resolveTeam(h2h.team2, matches)
      return h2h.score1 > h2h.score2 ? id1 : id2
    }
  }

  const maxDiff = Math.max(...leaders.map((s) => s.diff))
  leaders = leaders.filter((s) => s.diff === maxDiff)
  if (leaders.length === 1) return leaders[0].coupleId

  const maxScored = Math.max(...leaders.map((s) => s.scored))
  leaders = leaders.filter((s) => s.scored === maxScored)
  if (leaders.length === 1) return leaders[0].coupleId

  return null
}

export function describeTeamSlot(teamSlot, matches, couples) {
  const coupleId = resolveTeam(teamSlot, matches)
  if (coupleId != null) {
    const couple = couples.find((c) => c.id === coupleId)
    return couple ? `${couple.maleName} & ${couple.femaleName}` : 'Không xác định'
  }
  if (teamSlot.type === 'winner') return `Chờ thắng trận ${teamSlot.matchId}`
  if (teamSlot.type === 'loser') return `Chờ thua trận ${teamSlot.matchId}`
  if (teamSlot.type === 'groupWinner') return `Chờ Nhất bảng ${teamSlot.group}`
  return 'Chưa xác định'
}
```

- [ ] **Step 2: Manually verify with a throwaway script**

Create a temporary file `src/utils/bracket-check-temp.mjs`:

```js
import { resolveTeam, computeGroupStandings, getGroupWinner, describeTeamSlot } from './bracket.js'

const matches = [
  { id: 'r1', round: 1, group: null, team1: { type: 'couple', coupleId: 1 }, team2: { type: 'couple', coupleId: 2 }, score1: 21, score2: 15, status: 'done' },
  { id: 'g1', round: 2, group: 'G', team1: { type: 'winner', matchId: 'r1' }, team2: { type: 'couple', coupleId: 3 }, score1: null, score2: null, status: 'pending' },
]

console.assert(resolveTeam(matches[1].team1, matches) === 1, 'FAIL: winner của r1 phải là couple 1')

const pendingSlot = { type: 'winner', matchId: 'does-not-exist' }
console.assert(describeTeamSlot(pendingSlot, matches, []) === 'Chờ thắng trận does-not-exist', 'FAIL: placeholder text sai')

const overridden = { type: 'couple', coupleId: 1, override: 3 }
console.assert(resolveTeam(overridden, matches) === 3, 'FAIL: override phải được ưu tiên')

const groupMatches = [
  { id: 'gm1', round: 2, group: 'G', team1: { type: 'couple', coupleId: 1 }, team2: { type: 'couple', coupleId: 2 }, score1: 21, score2: 18, status: 'done' },
  { id: 'gm2', round: 2, group: 'G', team1: { type: 'couple', coupleId: 2 }, team2: { type: 'couple', coupleId: 3 }, score1: 21, score2: 10, status: 'done' },
  { id: 'gm3', round: 2, group: 'G', team1: { type: 'couple', coupleId: 1 }, team2: { type: 'couple', coupleId: 3 }, score1: 21, score2: 5, status: 'done' },
]
console.assert(getGroupWinner('G', groupMatches) === 1, 'FAIL: couple1 phải là nhất bảng rõ ràng (2 thắng)')

const tiedMatches = [
  { id: 'tm1', round: 2, group: 'T', team1: { type: 'couple', coupleId: 1 }, team2: { type: 'couple', coupleId: 2 }, score1: 21, score2: 15, status: 'done' },
  { id: 'tm2', round: 2, group: 'T', team1: { type: 'couple', coupleId: 2 }, team2: { type: 'couple', coupleId: 3 }, score1: 21, score2: 10, status: 'done' },
  { id: 'tm3', round: 2, group: 'T', team1: { type: 'couple', coupleId: 3 }, team2: { type: 'couple', coupleId: 1 }, score1: 21, score2: 5, status: 'done' },
]
console.assert(getGroupWinner('T', tiedMatches) !== null, 'FAIL: mỗi đội 1 thắng 1 thua nhưng hiệu số khác nhau nên vẫn phải phân định được')

console.log('bracket.js: tất cả assertion PASS')
```

Run: `node src/utils/bracket-check-temp.mjs`
Expected: prints `bracket.js: tất cả assertion PASS` with no `Assertion failed` lines on stderr.

- [ ] **Step 3: Delete the throwaway script**

Run: `rm src/utils/bracket-check-temp.mjs`

- [ ] **Step 4: Commit**

```bash
git add src/utils/bracket.js
git commit -m "feat: add bracket resolution engine (resolveTeam, standings, tie-break)"
```

---

## Task 4: Firebase setup & storage layer

**Files:**
- Create: `src/utils/firebase.js`
- Create: `src/utils/storage.js`

**Interfaces:**
- Consumes: `import.meta.env.VITE_FIREBASE_*` vars.
- Produces: `subscribeTournament(callback) -> unsubscribeFn`, `writeTournament(data) -> Promise`, `loadCache() -> object|null`, `saveCache(data)`. Task 5's Pinia store is the sole consumer of these four functions.

- [ ] **Step 1: Create the Firebase project (one-time, manual, outside this repo)**

This step is done by you (the project owner), not by editing code:

1. Go to https://console.firebase.google.com, create a project (Spark/free plan is enough).
2. In the project, open "Build → Realtime Database" and click "Create Database" (start in test mode is fine — Step 3 below sets the real rules).
3. Set the Realtime Database rules to:
   ```json
   { "rules": { ".read": true, ".write": true } }
   ```
   (Matches spec §6's accepted-risk decision for a short-lived club tournament — open read/write, no Firebase Auth.)
4. Open "Project settings → General → Your apps", add a Web app, copy the config values.
5. Copy `.env.example` to `.env.local` in the repo root and fill in the values (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`). `.env.local` is gitignored — never commit it.

Until `.env.local` exists with real values, the app will build but Firebase calls will fail at runtime — that's expected and fine for Steps 2–4 below, which only check that the code compiles.

- [ ] **Step 2: Write `src/utils/firebase.js`**

```js
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
```

- [ ] **Step 3: Write `src/utils/storage.js`**

```js
import { ref, onValue, set } from 'firebase/database'
import { db } from './firebase.js'

const TOURNAMENT_PATH = 'tournament'
const CACHE_KEY = 'tournament-cache'

export function subscribeTournament(callback) {
  const tournamentRef = ref(db, TOURNAMENT_PATH)
  return onValue(tournamentRef, (snapshot) => {
    const data = snapshot.val()
    if (data) callback(data)
  })
}

export function writeTournament(data) {
  const tournamentRef = ref(db, TOURNAMENT_PATH)
  return set(tournamentRef, data)
}

export function loadCache() {
  const raw = localStorage.getItem(CACHE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveCache(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds. (Runtime behavior against a real Firebase project is verified once Task 5 wires this into the store and Task 14 does the manual QA pass.)

- [ ] **Step 5: Commit**

```bash
git add src/utils/firebase.js src/utils/storage.js
git commit -m "feat: add Firebase Realtime Database sync layer"
```

---

## Task 5: Pinia tournament store

**Files:**
- Create: `src/store/tournamentStore.js`

**Interfaces:**
- Consumes: `defaultCouples`/`defaultMatches`/`defaultRules` (Task 2), `subscribeTournament`/`writeTournament`/`loadCache`/`saveCache` (Task 4).
- Produces: Pinia store `useTournamentStore` with state `{couples, matches, rules, loaded}` and actions `init()`, `updateCoupleName(coupleId, field, value)`, `updateMatchScore(matchId, score1, score2)`, `confirmMatchDone(matchId)`, `reopenMatch(matchId)`, `updateMatchCourt(matchId, court)`, `updateMatchTime(matchId, time)`, `setOverride(matchId, slotKey, coupleId)`, `updateRules(text)`, `exportData()`, `importData(data)`, `resetData()`. Every UI component from Task 6 onward calls these action names exactly.

- [ ] **Step 1: Write `src/store/tournamentStore.js`**

```js
import { defineStore } from 'pinia'
import { defaultCouples, defaultMatches, defaultRules } from '../data/defaultData.js'
import { subscribeTournament, writeTournament, loadCache, saveCache } from '../utils/storage.js'

let persistTimer = null

export const useTournamentStore = defineStore('tournament', {
  state: () => ({
    couples: [],
    matches: [],
    rules: '',
    loaded: false,
  }),
  actions: {
    init() {
      const cached = loadCache()
      if (cached) this.$patch(cached)

      subscribeTournament((data) => {
        this.$patch(data)
        this.loaded = true
        saveCache(data)
      })

      setTimeout(() => {
        if (!this.loaded) this.seedIfEmpty()
      }, 2000)
    },
    seedIfEmpty() {
      if (this.couples.length > 0) return
      this.$patch({ couples: defaultCouples, matches: defaultMatches, rules: defaultRules })
      this.persist()
    },
    persist() {
      clearTimeout(persistTimer)
      persistTimer = setTimeout(() => {
        const data = { couples: this.couples, matches: this.matches, rules: this.rules }
        writeTournament(data)
        saveCache(data)
      }, 300)
    },
    updateCoupleName(coupleId, field, value) {
      const couple = this.couples.find((c) => c.id === coupleId)
      if (!couple) return
      couple[field] = value
      this.persist()
    },
    updateMatchScore(matchId, score1, score2) {
      const match = this.matches.find((m) => m.id === matchId)
      if (!match) return
      match.score1 = score1
      match.score2 = score2
      match.status = 'live'
      this.persist()
    },
    confirmMatchDone(matchId) {
      const match = this.matches.find((m) => m.id === matchId)
      if (!match || match.score1 == null || match.score2 == null) return
      match.status = 'done'
      this.persist()
    },
    reopenMatch(matchId) {
      const match = this.matches.find((m) => m.id === matchId)
      if (!match) return
      match.status = 'live'
      this.persist()
    },
    updateMatchCourt(matchId, court) {
      const match = this.matches.find((m) => m.id === matchId)
      if (!match) return
      match.court = court
      this.persist()
    },
    updateMatchTime(matchId, time) {
      const match = this.matches.find((m) => m.id === matchId)
      if (!match) return
      match.time = time
      this.persist()
    },
    setOverride(matchId, slotKey, coupleId) {
      const match = this.matches.find((m) => m.id === matchId)
      if (!match) return
      match[slotKey].override = coupleId
      this.persist()
    },
    updateRules(text) {
      this.rules = text
      this.persist()
    },
    exportData() {
      return { couples: this.couples, matches: this.matches, rules: this.rules }
    },
    importData(data) {
      if (!data || !Array.isArray(data.couples) || !Array.isArray(data.matches)) {
        throw new Error('File không đúng định dạng tournament.json')
      }
      this.$patch({ couples: data.couples, matches: data.matches, rules: data.rules || '' })
      this.persist()
    },
    resetData() {
      this.$patch({ couples: defaultCouples, matches: defaultMatches, rules: defaultRules })
      this.persist()
    },
  },
})
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds. (Full runtime verification — seeding, live sync, persistence — happens in Task 14's manual QA once `.env.local` is populated and components are wired up.)

- [ ] **Step 3: Commit**

```bash
git add src/store/tournamentStore.js
git commit -m "feat: add Pinia tournament store wired to Firebase sync"
```

---

## Task 6: Admin auth store + login UI

**Files:**
- Create: `src/store/authStore.js`
- Create: `src/components/AdminPanel.vue`

**Interfaces:**
- Consumes: nothing external.
- Produces: Pinia store `useAuthStore` with state `{isAdmin}` and actions `login(username, password) -> boolean`, `logout()`. `AdminPanel.vue` is mounted once in `App.vue` (Task 14) at `#admin`; Task 13 extends this same file with Export/Import/Reset buttons.

- [ ] **Step 1: Write `src/store/authStore.js`**

```js
import { defineStore } from 'pinia'

const ADMIN_USERNAME = 'trungnt'
const ADMIN_PASSWORD = '12345678'
const SESSION_KEY = 'isAdmin'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdmin: sessionStorage.getItem(SESSION_KEY) === 'true',
  }),
  actions: {
    login(username, password) {
      const ok = username === ADMIN_USERNAME && password === ADMIN_PASSWORD
      if (ok) {
        this.isAdmin = true
        sessionStorage.setItem(SESSION_KEY, 'true')
      }
      return ok
    },
    logout() {
      this.isAdmin = false
      sessionStorage.removeItem(SESSION_KEY)
    },
  },
})
```

- [ ] **Step 2: Write `src/components/AdminPanel.vue`**

```vue
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/authStore.js'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  const ok = auth.login(username.value, password.value)
  if (!ok) {
    error.value = 'Sai tài khoản hoặc mật khẩu'
  } else {
    error.value = ''
    username.value = ''
    password.value = ''
  }
}
</script>

<template>
  <section id="admin" class="mx-auto max-w-md px-4 py-8">
    <h2 class="mb-4 text-lg font-bold text-slate-900">Admin</h2>

    <form v-if="!auth.isAdmin" class="space-y-3" @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Tài khoản" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input v-model="password" type="password" placeholder="Mật khẩu" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white">Đăng nhập</button>
    </form>

    <div v-else class="space-y-3">
      <p class="text-sm text-emerald-700">Đã đăng nhập với quyền Admin.</p>
      <button class="rounded-lg bg-slate-200 px-3 py-2 font-semibold text-slate-700" @click="auth.logout()">Đăng xuất</button>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/store/authStore.js src/components/AdminPanel.vue
git commit -m "feat: add admin auth store and login panel"
```

---

## Task 7: Sticky header with mobile menu

**Files:**
- Create: `src/components/AppHeader.vue`

**Interfaces:**
- Consumes: nothing (uses plain DOM `scrollIntoView`, no store).
- Produces: `AppHeader.vue`, mounted once in `App.vue` (Task 14). Expects each section component to set `id="couples"`, `id="schedule"`, `id="results"`, `id="rules"`, `id="admin"` on its root element (already done in Tasks 8, 10, 11, 12, 6).

- [ ] **Step 1: Write `src/components/AppHeader.vue`**

```vue
<script setup>
import { ref } from 'vue'

const sections = [
  { id: 'couples', label: 'Cặp đấu' },
  { id: 'schedule', label: 'Lịch thi đấu' },
  { id: 'results', label: 'Kết quả' },
  { id: 'rules', label: 'Thể lệ' },
  { id: 'admin', label: 'Admin' },
]

const menuOpen = ref(false)

function scrollTo(id) {
  menuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <span class="text-base font-extrabold text-blue-700">🏸 Đồng Lươn Badminton Cup 2026</span>
      <button class="rounded-lg p-2 text-slate-700 md:hidden" aria-label="Mở menu" @click="menuOpen = !menuOpen">
        <span v-if="!menuOpen">☰</span>
        <span v-else>✕</span>
      </button>
      <nav class="hidden gap-4 md:flex">
        <button
          v-for="s in sections"
          :key="s.id"
          class="text-sm font-medium text-slate-700 hover:text-blue-700"
          @click="scrollTo(s.id)"
        >
          {{ s.label }}
        </button>
      </nav>
    </div>
    <nav v-if="menuOpen" class="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-2 md:hidden">
      <button
        v-for="s in sections"
        :key="s.id"
        class="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
        @click="scrollTo(s.id)"
      >
        {{ s.label }}
      </button>
    </nav>
  </header>
</template>
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppHeader.vue
git commit -m "feat: add sticky header with mobile hamburger menu"
```

---

## Task 8: Cặp đấu section

**Files:**
- Create: `src/components/CoupleCard.vue`
- Create: `src/components/CoupleList.vue`

**Interfaces:**
- Consumes: `useAuthStore` (Task 6), `useTournamentStore.couples` + `updateCoupleName` (Task 5).
- Produces: `CoupleList.vue` with root `id="couples"`, mounted once in `App.vue` (Task 14).

- [ ] **Step 1: Write `src/components/CoupleCard.vue`**

```vue
<script setup>
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const props = defineProps({ couple: { type: Object, required: true } })
const auth = useAuthStore()
const store = useTournamentStore()

function onEdit(field, event) {
  store.updateCoupleName(props.couple.id, field, event.target.value)
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p class="text-xs font-semibold text-slate-400">Cặp #{{ couple.id }}</p>
    <div v-if="!auth.isAdmin" class="mt-1 text-base font-semibold text-slate-900">
      {{ couple.maleName }} &amp; {{ couple.femaleName }}
    </div>
    <div v-else class="mt-1 flex flex-col gap-2">
      <input :value="couple.maleName" class="rounded-lg border border-slate-300 px-2 py-1 text-sm" @change="onEdit('maleName', $event)" />
      <input :value="couple.femaleName" class="rounded-lg border border-slate-300 px-2 py-1 text-sm" @change="onEdit('femaleName', $event)" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Write `src/components/CoupleList.vue`**

```vue
<script setup>
import { useTournamentStore } from '../store/tournamentStore.js'
import CoupleCard from './CoupleCard.vue'

const store = useTournamentStore()
</script>

<template>
  <section id="couples" class="mx-auto max-w-5xl px-4 py-8">
    <h2 class="mb-4 text-lg font-bold text-slate-900">Cặp đấu</h2>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <CoupleCard v-for="c in store.couples" :key="c.id" :couple="c" />
    </div>
  </section>
</template>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/CoupleCard.vue src/components/CoupleList.vue
git commit -m "feat: add couples list section"
```

---

## Task 9: Match card with score entry, status, and team-slot display

**Files:**
- Create: `src/components/TeamSlotDisplay.vue`
- Create: `src/components/MatchCard.vue`

**Interfaces:**
- Consumes: `resolveTeam`/`describeTeamSlot` (Task 3), `useAuthStore` (Task 6), `useTournamentStore.matches` + `updateMatchScore`/`confirmMatchDone`/`reopenMatch`/`setOverride`/`updateMatchTime`/`updateMatchCourt` (Task 5).
- Produces: `MatchCard.vue` taking prop `matchId: string`, used by `BracketColumn.vue` (Task 10).

- [ ] **Step 1: Write `src/components/TeamSlotDisplay.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'
import { resolveTeam, describeTeamSlot } from '../utils/bracket.js'

const props = defineProps({
  matchId: { type: String, required: true },
  slotKey: { type: String, required: true }, // 'team1' | 'team2'
})

const auth = useAuthStore()
const store = useTournamentStore()

const match = computed(() => store.matches.find((m) => m.id === props.matchId))
const slot = computed(() => match.value?.[props.slotKey])
const coupleId = computed(() => (slot.value ? resolveTeam(slot.value, store.matches) : null))
const label = computed(() => (slot.value ? describeTeamSlot(slot.value, store.matches, store.couples) : ''))
const isWinner = computed(() => {
  if (!match.value || match.value.status !== 'done') return false
  return props.slotKey === 'team1' ? match.value.score1 > match.value.score2 : match.value.score2 > match.value.score1
})

function chooseOverride(event) {
  const value = event.target.value
  store.setOverride(props.matchId, props.slotKey, value ? Number(value) : null)
}
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <span
      :class="[
        coupleId ? 'font-semibold text-slate-900' : 'italic text-slate-400',
        isWinner ? 'rounded border border-emerald-600 px-1' : '',
      ]"
    >
      {{ label }}
    </span>
    <select v-if="auth.isAdmin" class="rounded border border-slate-300 text-xs" :value="slot.override ?? ''" @change="chooseOverride">
      <option value="">(tự động)</option>
      <option v-for="c in store.couples" :key="c.id" :value="c.id">{{ c.maleName }} &amp; {{ c.femaleName }}</option>
    </select>
  </div>
</template>
```

- [ ] **Step 2: Write `src/components/MatchCard.vue`**

```vue
<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'
import TeamSlotDisplay from './TeamSlotDisplay.vue'

const props = defineProps({ matchId: { type: String, required: true } })
const auth = useAuthStore()
const store = useTournamentStore()

const match = computed(() => store.matches.find((m) => m.id === props.matchId))

const score1 = ref('')
const score2 = ref('')
watchEffect(() => {
  score1.value = match.value?.score1 ?? ''
  score2.value = match.value?.score2 ?? ''
})

const statusStyle = computed(
  () =>
    ({
      pending: { dot: '⚪', text: 'Chưa thi đấu' },
      live: { dot: '🟡', text: 'Đang cập nhật' },
      done: { dot: '🟢', text: 'Hoàn thành' },
    })[match.value?.status ?? 'pending'],
)

function saveScore() {
  const s1 = score1.value === '' ? null : Number(score1.value)
  const s2 = score2.value === '' ? null : Number(score2.value)
  store.updateMatchScore(props.matchId, s1, s2)
}
</script>

<template>
  <div v-if="match" class="w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
    <div v-if="!auth.isAdmin" class="flex items-center justify-between text-xs text-slate-500">
      <span>{{ match.time }} · Sân {{ match.court }}</span>
      <span>{{ statusStyle.dot }} {{ statusStyle.text }}</span>
    </div>
    <div v-else class="flex items-center justify-between gap-1 text-xs text-slate-500">
      <input
        :value="match.time"
        class="w-24 rounded border border-slate-300 px-1 py-0.5"
        @change="store.updateMatchTime(match.id, $event.target.value)"
      />
      <span>· Sân</span>
      <input
        :value="match.court"
        class="w-10 rounded border border-slate-300 px-1 py-0.5"
        @change="store.updateMatchCourt(match.id, $event.target.value)"
      />
      <span>{{ statusStyle.dot }} {{ statusStyle.text }}</span>
    </div>
    <div class="mt-2 space-y-1">
      <TeamSlotDisplay :match-id="match.id" slot-key="team1" />
      <TeamSlotDisplay :match-id="match.id" slot-key="team2" />
    </div>
    <div class="mt-2 text-center text-sm font-bold" :class="match.status === 'done' ? 'text-emerald-700' : 'text-slate-700'">
      {{ match.score1 ?? '-' }} : {{ match.score2 ?? '-' }}
    </div>

    <div v-if="auth.isAdmin && match.status !== 'done'" class="mt-2 flex items-center gap-2">
      <input v-model="score1" type="number" min="0" class="w-14 rounded border border-slate-300 px-1 py-0.5 text-sm" />
      <span>-</span>
      <input v-model="score2" type="number" min="0" class="w-14 rounded border border-slate-300 px-1 py-0.5 text-sm" />
      <button class="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white" @click="saveScore">Lưu</button>
    </div>
    <button
      v-if="auth.isAdmin && match.status === 'live'"
      class="mt-2 w-full rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
      @click="store.confirmMatchDone(match.id)"
    >
      Xác nhận kết thúc trận
    </button>
    <button
      v-if="auth.isAdmin && match.status === 'done'"
      class="mt-2 w-full rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
      @click="store.reopenMatch(match.id)"
    >
      Mở lại trận
    </button>
  </div>
</template>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/TeamSlotDisplay.vue src/components/MatchCard.vue
git commit -m "feat: add match card with score entry, status transitions, and override"
```

---

## Task 10: Group standings + bracket columns + schedule section

**Files:**
- Create: `src/components/GroupStandings.vue`
- Create: `src/components/BracketColumn.vue`
- Create: `src/components/ScheduleBracket.vue`

**Interfaces:**
- Consumes: `computeGroupStandings`/`getGroupWinner` (Task 3), `useTournamentStore.matches`/`couples` (Task 5), `MatchCard.vue` (Task 9).
- Produces: `ScheduleBracket.vue` with root `id="schedule"`, mounted once in `App.vue` (Task 14).

- [ ] **Step 1: Write `src/components/GroupStandings.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import { computeGroupStandings, getGroupWinner } from '../utils/bracket.js'

const props = defineProps({ group: { type: String, required: true } })
const store = useTournamentStore()

const rows = computed(() => {
  const stats = computeGroupStandings(props.group, store.matches)
  return [...stats].sort((a, b) => b.points - a.points || b.diff - a.diff || b.scored - a.scored)
})
const winnerId = computed(() => getGroupWinner(props.group, store.matches))

function coupleLabel(coupleId) {
  const c = store.couples.find((c) => c.id === coupleId)
  return c ? `${c.maleName} & ${c.femaleName}` : '?'
}
</script>

<template>
  <div class="mt-2 overflow-x-auto rounded-lg border border-slate-200">
    <table class="w-full text-xs">
      <thead class="bg-slate-100 text-slate-500">
        <tr>
          <th class="px-2 py-1 text-left">STT</th>
          <th class="px-2 py-1 text-left">Cặp đấu</th>
          <th class="px-2 py-1">T</th>
          <th class="px-2 py-1">B</th>
          <th class="px-2 py-1">Đ</th>
          <th class="px-2 py-1">Ghi</th>
          <th class="px-2 py-1">Thua</th>
          <th class="px-2 py-1">HS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r.coupleId" :class="r.coupleId === winnerId ? 'bg-blue-50 font-semibold' : ''">
          <td class="px-2 py-1">{{ i + 1 }}</td>
          <td class="px-2 py-1">{{ coupleLabel(r.coupleId) }}</td>
          <td class="px-2 py-1 text-center">{{ r.wins }}</td>
          <td class="px-2 py-1 text-center">{{ r.losses }}</td>
          <td class="px-2 py-1 text-center">{{ r.points }}</td>
          <td class="px-2 py-1 text-center">{{ r.scored }}</td>
          <td class="px-2 py-1 text-center">{{ r.conceded }}</td>
          <td class="px-2 py-1 text-center">{{ r.diff }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="rows.length && !winnerId" class="p-2 text-xs text-amber-700">
      Chưa xác định được đội nhất bảng — Admin cần chọn thủ công (dùng ô "tự động" ở mỗi trận Vòng 3 để chỉ định).
    </p>
  </div>
</template>
```

- [ ] **Step 2: Write `src/components/BracketColumn.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import MatchCard from './MatchCard.vue'
import GroupStandings from './GroupStandings.vue'

const props = defineProps({
  round: { type: Number, required: true },
  title: { type: String, required: true },
  colorClass: { type: String, required: true },
})

const store = useTournamentStore()
const roundMatches = computed(() => store.matches.filter((m) => m.round === props.round))
const groups = computed(() => [...new Set(roundMatches.value.map((m) => m.group).filter(Boolean))])

function matchesInGroup(group) {
  return roundMatches.value.filter((m) => m.group === group)
}
</script>

<template>
  <div class="w-72 shrink-0">
    <div :class="['rounded-t-xl px-3 py-2 text-center text-sm font-bold text-white', colorClass]">
      {{ title }}
    </div>
    <div class="space-y-4 rounded-b-xl bg-slate-100 p-3">
      <template v-if="groups.length">
        <div v-for="g in groups" :key="g">
          <p class="mb-1 text-xs font-bold text-slate-500">Bảng {{ g }}</p>
          <div class="space-y-2">
            <MatchCard v-for="m in matchesInGroup(g)" :key="m.id" :match-id="m.id" />
          </div>
          <GroupStandings :group="g" />
        </div>
      </template>
      <div v-else class="space-y-2">
        <MatchCard v-for="m in roundMatches" :key="m.id" :match-id="m.id" />
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Write `src/components/ScheduleBracket.vue`**

```vue
<script setup>
import BracketColumn from './BracketColumn.vue'

const rounds = [
  { round: 1, title: 'Vòng 1 — Loại trực tiếp', colorClass: 'bg-emerald-600' },
  { round: 2, title: 'Vòng 2 — Vòng tròn tính điểm', colorClass: 'bg-blue-600' },
  { round: 3, title: 'Vòng 3 — Chung kết nhánh', colorClass: 'bg-violet-600' },
  { round: 4, title: 'Vòng 4 — Chung kết tổng', colorClass: 'bg-amber-600' },
]
</script>

<template>
  <section id="schedule" class="px-4 py-8">
    <h2 class="mx-auto mb-4 max-w-5xl text-lg font-bold text-slate-900">Lịch thi đấu</h2>
    <div class="flex gap-4 overflow-x-auto pb-4">
      <BracketColumn v-for="r in rounds" :key="r.round" v-bind="r" />
    </div>
  </section>
</template>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/GroupStandings.vue src/components/BracketColumn.vue src/components/ScheduleBracket.vue
git commit -m "feat: add horizontally-scrolling bracket with group standings"
```

---

## Task 11: Kết quả section

**Files:**
- Create: `src/components/ResultsSummary.vue`

**Interfaces:**
- Consumes: `getGroupWinner`/`resolveTeam` (Task 3), `useTournamentStore.matches`/`couples` (Task 5).
- Produces: `ResultsSummary.vue` with root `id="results"`, mounted once in `App.vue` (Task 14).

- [ ] **Step 1: Write `src/components/ResultsSummary.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import { getGroupWinner, resolveTeam } from '../utils/bracket.js'

const store = useTournamentStore()

function coupleLabel(coupleId) {
  if (!coupleId) return 'Chưa xác định'
  const c = store.couples.find((c) => c.id === coupleId)
  return c ? `${c.maleName} & ${c.femaleName}` : 'Chưa xác định'
}

const items = computed(() => [
  { label: 'Nhất bảng A1', value: coupleLabel(getGroupWinner('A1', store.matches)) },
  { label: 'Nhất bảng A2', value: coupleLabel(getGroupWinner('A2', store.matches)) },
  { label: 'Nhất bảng B1', value: coupleLabel(getGroupWinner('B1', store.matches)) },
  { label: 'Nhất bảng B2', value: coupleLabel(getGroupWinner('B2', store.matches)) },
  { label: 'Vô địch Nhánh A', value: coupleLabel(resolveTeam({ type: 'winner', matchId: 'm19' }, store.matches)) },
  { label: 'Vô địch Nhánh B', value: coupleLabel(resolveTeam({ type: 'winner', matchId: 'm20' }, store.matches)) },
  { label: 'Nhà vô địch', value: coupleLabel(resolveTeam({ type: 'winner', matchId: 'm21' }, store.matches)) },
])
</script>

<template>
  <section id="results" class="mx-auto max-w-5xl px-4 py-8">
    <h2 class="mb-4 text-lg font-bold text-slate-900">Kết quả</h2>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div v-for="item in items" :key="item.label" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold text-slate-400">{{ item.label }}</p>
        <p class="mt-1 font-bold text-slate-900">{{ item.value }}</p>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ResultsSummary.vue
git commit -m "feat: add results summary section"
```

---

## Task 12: Thể lệ section

**Files:**
- Create: `src/components/RulesSection.vue`

**Interfaces:**
- Consumes: `useAuthStore` (Task 6), `useTournamentStore.rules` + `updateRules` (Task 5).
- Produces: `RulesSection.vue` with root `id="rules"`, mounted once in `App.vue` (Task 14).

- [ ] **Step 1: Write `src/components/RulesSection.vue`**

```vue
<script setup>
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const auth = useAuthStore()
const store = useTournamentStore()
const draft = ref('')
watchEffect(() => {
  draft.value = store.rules
})

function save() {
  store.updateRules(draft.value)
}
</script>

<template>
  <section id="rules" class="mx-auto max-w-5xl px-4 py-8">
    <h2 class="mb-4 text-lg font-bold text-slate-900">Thể lệ</h2>
    <div v-if="!auth.isAdmin" class="whitespace-pre-line rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
      {{ store.rules }}
    </div>
    <div v-else class="space-y-2">
      <textarea v-model="draft" rows="8" class="w-full rounded-xl border border-slate-300 p-3 text-sm"></textarea>
      <button class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" @click="save">Lưu thể lệ</button>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/RulesSection.vue
git commit -m "feat: add rules section with admin edit"
```

---

## Task 13: Export / Import / Reset admin actions

**Files:**
- Create: `src/utils/exportImport.js`
- Modify: `src/components/AdminPanel.vue` (from Task 6)

**Interfaces:**
- Consumes: `useTournamentStore.exportData`/`importData`/`resetData` (Task 5).
- Produces: `downloadJSON(data, filename)`, `readJSONFile(file) -> Promise<object>` in `exportImport.js`.

- [ ] **Step 1: Write `src/utils/exportImport.js`**

```js
export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result))
      } catch {
        reject(new Error('File không phải JSON hợp lệ'))
      }
    }
    reader.onerror = () => reject(new Error('Không đọc được file'))
    reader.readAsText(file)
  })
}
```

- [ ] **Step 2: Modify `src/components/AdminPanel.vue`**

Add to the `<script setup>` block (after the existing imports):

```js
import { useTournamentStore } from '../store/tournamentStore.js'
import { downloadJSON, readJSONFile } from '../utils/exportImport.js'

const store = useTournamentStore()
const importError = ref('')

function handleExport() {
  downloadJSON(store.exportData(), 'tournament.json')
}

async function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return
  try {
    const data = await readJSONFile(file)
    store.importData(data)
    importError.value = ''
  } catch (e) {
    importError.value = e.message
  }
  event.target.value = ''
}

function handleReset() {
  if (confirm('Reset toàn bộ dữ liệu về mặc định? Hành động này ảnh hưởng tất cả người đang xem.')) {
    store.resetData()
  }
}
```

Replace the `<div v-else class="space-y-3">...</div>` block in the template with:

```html
<div v-else class="space-y-3">
  <p class="text-sm text-emerald-700">Đã đăng nhập với quyền Admin.</p>
  <div class="flex flex-wrap gap-2">
    <button class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" @click="handleExport">Export JSON</button>
    <label class="cursor-pointer rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
      Import JSON
      <input type="file" accept="application/json" class="hidden" @change="handleImport" />
    </label>
    <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" @click="handleReset">Reset dữ liệu</button>
    <button class="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" @click="auth.logout()">Đăng xuất</button>
  </div>
  <p v-if="importError" class="text-sm text-red-600">{{ importError }}</p>
</div>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/utils/exportImport.js src/components/AdminPanel.vue
git commit -m "feat: add export/import/reset admin actions"
```

---

## Task 14: Assemble App.vue and run manual QA

**Files:**
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `useTournamentStore.init` (Task 5), and every section component from Tasks 7–13.

- [ ] **Step 1: Replace `src/App.vue`**

```vue
<script setup>
import { onMounted } from 'vue'
import { useTournamentStore } from './store/tournamentStore.js'
import AppHeader from './components/AppHeader.vue'
import CoupleList from './components/CoupleList.vue'
import ScheduleBracket from './components/ScheduleBracket.vue'
import ResultsSummary from './components/ResultsSummary.vue'
import RulesSection from './components/RulesSection.vue'
import AdminPanel from './components/AdminPanel.vue'

const store = useTournamentStore()
onMounted(() => store.init())
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />
    <main>
      <CoupleList />
      <ScheduleBracket />
      <ResultsSummary />
      <RulesSection />
      <AdminPanel />
    </main>
  </div>
</template>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Confirm `.env.local` is populated**

Check that `.env.local` (created in Task 4, Step 1) has real Firebase config values, not blanks. If it's still empty, stop and fill it in now — the manual QA below needs a live Firebase connection.

- [ ] **Step 4: Manual QA pass (spec §8 scenarios)**

Run: `npm run dev`, open the printed local URL in a desktop browser, and separately open the printed "Network" URL on a phone on the same Wi-Fi (or use browser devtools' mobile emulation if a second device isn't available). Log in as Admin (`trungnt` / `12345678`) on one of the two, and walk through each scenario, confirming the described behavior before moving to the next:

1. Enter scores for all 6 Vòng 1 matches → confirm Vòng 2 match cards automatically show the correct couples (winners in Bảng A1/A2, losers in Bảng B1/B2) instead of "Chờ thắng/thua trận...".
2. Enter scores for all 3 matches in one Vòng 2 group (e.g. Bảng A1) → confirm the standings table under that group computes wins/losses/points/diff correctly and the leading row is highlighted; confirm that couple then appears as team1 or team2 on the corresponding Vòng 3 match.
3. Construct a tie in one group (e.g. two couples end with equal points and equal diff) → confirm the "Chưa xác định được đội nhất bảng" message appears, then use the admin override dropdown on the Vòng 3 match to manually pick the advancing couple, and confirm it takes effect immediately.
4. Enter scores for both Vòng 3 matches, then the Vòng 4 match → confirm "Kết quả" section fills in Vô địch Nhánh A/B and Nhà vô địch correctly.
5. Click Export JSON, then modify a score in the UI, then Import the previously exported file → confirm the UI reverts to the exported state.
6. Click Reset dữ liệu, confirm the dialog, confirm all matches return to "Chưa thi đấu" and couples return to the default names.
7. On the phone viewport: confirm the bracket scrolls horizontally without shrinking columns, the header collapses into a working hamburger menu, and admin score-entry inputs are usable with touch.
8. With Admin logged in on one device and a second device/browser as a plain viewer (not logged in), change a score as Admin → confirm the viewer's screen updates within a couple of seconds without a manual page reload, and confirm the viewer sees no edit controls anywhere.

- [ ] **Step 5: Commit**

```bash
git add src/App.vue
git commit -m "feat: assemble full app in App.vue"
```
