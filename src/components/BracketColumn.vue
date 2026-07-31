<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import MatchCard from './MatchCard.vue'
import GroupStandings from './GroupStandings.vue'

const props = defineProps({
  round: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  colorClass: { type: String, required: true },
})

const store = useTournamentStore()
const roundMatches = computed(() => store.matches.filter((m) => m.round === props.round))
const groups = computed(() => [...new Set(roundMatches.value.map((m) => m.group).filter(Boolean))])
const courtsUsed = computed(() => new Set(roundMatches.value.map((m) => m.court)).size)
const timeRange = computed(() => {
  const times = roundMatches.value.map((m) => m.time).filter(Boolean)
  if (!times.length) return ''
  const starts = times.map((t) => t.split('-')[0]).sort()
  const ends = times.map((t) => t.split('-')[1] ?? t).sort()
  return `${starts[0]} - ${ends[ends.length - 1]}`
})

// Số cột lưới tuỳ theo số trận trong vòng — 6 trận (Vòng 1) lên tới 3 cột, 2 trận (Vòng 3) 2 cột, 1 trận (Vòng 4) 1 cột
const matchGridClass = computed(() => {
  const n = roundMatches.value.length
  if (n <= 1) return 'grid-cols-1'
  if (n === 2) return 'grid-cols-1 sm:grid-cols-2'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
})

function matchesInGroup(group) {
  return roundMatches.value.filter((m) => m.group === group)
}

// Nhánh Thắng (A) tô xanh dương, Nhánh Thua (B) tô cam — giúp phân biệt nhanh trên Vòng 2/3
function branchOf(group, matchId) {
  if (group) return group[0]
  if (matchId === 'm19') return 'A'
  if (matchId === 'm20') return 'B'
  return null
}
function accentClass(group, matchId) {
  const branch = branchOf(group, matchId)
  if (branch === 'A') return 'bg-blue-600'
  if (branch === 'B') return 'bg-orange-600'
  return props.colorClass
}
function chipClass(group, matchId) {
  const branch = branchOf(group, matchId)
  if (branch === 'A') return 'bg-blue-100 text-blue-700'
  if (branch === 'B') return 'bg-orange-100 text-orange-700'
  return 'bg-slate-200 text-slate-600'
}
</script>

<template>
  <div class="w-full">
    <div :data-round-banner="round" :class="['flex flex-wrap items-center justify-between gap-2 rounded-t-xl px-4 py-3 text-white', colorClass]">
      <div>
        <span class="inline-block rounded bg-black/20 px-2 py-0.5 text-[11px] font-bold uppercase">Vòng {{ round }} · {{ timeRange }}</span>
        <p class="mt-1 text-base font-extrabold uppercase">{{ title }}</p>
        <p class="text-xs opacity-90">{{ subtitle || `${roundMatches.length} trận · ${courtsUsed} sân` }}</p>
      </div>
    </div>
    <div class="rounded-b-xl border border-t-0 border-slate-200 bg-slate-50 p-3 sm:p-4">
      <div v-if="groups.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div v-for="g in groups" :key="g" class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <GroupStandings :group="g" :accent-class="accentClass(g, null)" />
          <div class="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2">
            <MatchCard v-for="m in matchesInGroup(g)" :key="m.id" :match-id="m.id" :chip-class="chipClass(g, null)" />
          </div>
        </div>
      </div>
      <div v-else :class="['grid gap-3', matchGridClass]">
        <MatchCard v-for="m in roundMatches" :key="m.id" :match-id="m.id" :chip-class="chipClass(null, m.id)" />
      </div>
    </div>
  </div>
</template>
