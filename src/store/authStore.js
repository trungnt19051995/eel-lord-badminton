import { defineStore } from 'pinia'

const ADMIN_USERNAME = 'trungnt'
const ADMIN_PASSWORD = '12345678'
const SESSION_KEY = 'isAdmin'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdmin: sessionStorage.getItem(SESSION_KEY) === 'true',
    isPanelOpen: false,
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
    verifyPassword(password) {
      return password === ADMIN_PASSWORD
    },
    openPanel() {
      this.isPanelOpen = true
    },
    closePanel() {
      this.isPanelOpen = false
    },
  },
})
