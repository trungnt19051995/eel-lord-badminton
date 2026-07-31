<script setup>
import { onMounted } from 'vue'
import { useTournamentStore } from './store/tournamentStore.js'
import AppHeader from './components/AppHeader.vue'
import AdminPanel from './components/AdminPanel.vue'

const store = useTournamentStore()
onMounted(() => store.init())

const bannerUrl = `${import.meta.env.BASE_URL}eel-banner.png`
</script>

<template>
  <div class="min-h-screen bg-slate-200 text-slate-900">
    <AppHeader />
    <main class="mx-auto max-w-[1200px] px-4">
      <router-view />
      <div class="mb-8 flex justify-center">
        <img
          :src="bannerUrl"
          alt="Chào mừng đến với Đồng Lươn Official"
          class="h-auto w-full rounded-2xl shadow-lg md:w-1/2"
        />
      </div>
    </main>
    <AdminPanel />
  </div>
</template>
