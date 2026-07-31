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
