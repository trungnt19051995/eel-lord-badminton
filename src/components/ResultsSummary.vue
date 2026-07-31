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
