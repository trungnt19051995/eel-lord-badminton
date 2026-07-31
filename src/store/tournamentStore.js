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
    syncError: null,
  }),
  actions: {
    init() {
      const cached = loadCache()
      if (cached) this.$patch(cached)

      subscribeTournament(
        (data) => {
          this.loaded = true
          this.syncError = null
          if (data) {
            this.$patch(data)
            saveCache(data)
          } else {
            this.seedIfEmpty()
          }
        },
        (error) => {
          this.syncError = error.message
        },
      )
    },
    seedIfEmpty() {
      if (this.couples.length > 0) return
      this.$patch({
        couples: JSON.parse(JSON.stringify(defaultCouples)),
        matches: JSON.parse(JSON.stringify(defaultMatches)),
        rules: defaultRules,
      })
      this.persist()
    },
    persist() {
      clearTimeout(persistTimer)
      persistTimer = setTimeout(() => {
        const data = { couples: this.couples, matches: this.matches, rules: this.rules }
        writeTournament(data)
          .then(() => {
            this.syncError = null
          })
          .catch((error) => {
            this.syncError = error.message
          })
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
      this.$patch({
        couples: JSON.parse(JSON.stringify(defaultCouples)),
        matches: JSON.parse(JSON.stringify(defaultMatches)),
        rules: defaultRules,
      })
      this.persist()
    },
  },
})
