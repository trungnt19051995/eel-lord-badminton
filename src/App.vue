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
