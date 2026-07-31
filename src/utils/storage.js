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
