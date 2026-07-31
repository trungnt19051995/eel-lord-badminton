<script setup>
import { onMounted } from 'vue'
import { useTournamentStore } from './store/tournamentStore.js'
import AppHeader from './components/AppHeader.vue'
import AdminPanel from './components/AdminPanel.vue'

const store = useTournamentStore()
onMounted(() => store.init())
</script>

<template>
  <div class="min-h-screen bg-slate-200 text-slate-900">
    <AppHeader />
    <main class="mx-auto max-w-[1200px] px-4">
      <router-view />
    </main>
    <AdminPanel />
  </div>
</template>
