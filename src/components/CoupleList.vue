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
