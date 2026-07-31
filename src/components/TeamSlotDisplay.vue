<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'
import { resolveTeam, getSlotLabel } from '../utils/bracket.js'

const props = defineProps({
  matchId: { type: String, required: true },
  slotKey: { type: String, required: true }, // 'team1' | 'team2'
  chipClass: { type: String, default: 'bg-slate-200 text-slate-600' },
})

const auth = useAuthStore()
const store = useTournamentStore()

const match = computed(() => store.matches.find((m) => m.id === props.matchId))
const slot = computed(() => match.value?.[props.slotKey])
const coupleId = computed(() => (slot.value ? resolveTeam(slot.value, store.matches) : null))
const chipLabel = computed(() => (slot.value ? getSlotLabel(slot.value, store.matches) : null))
const displayName = computed(() => {
  if (coupleId.value == null) return 'Chờ kết quả'
  const c = store.couples.find((c) => c.id === coupleId.value)
  return c ? `${c.maleName} & ${c.femaleName}` : 'Không xác định'
})
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
  <div class="flex flex-wrap items-center justify-between gap-2 py-1">
    <span class="flex min-w-0 items-center gap-2">
      <span v-if="chipLabel" :class="['shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold', chipClass]">{{ chipLabel }}</span>
      <span
        :class="[
          'truncate',
          coupleId != null ? 'font-bold text-slate-900' : 'font-medium text-slate-400',
          isWinner ? 'rounded border border-emerald-600 px-1' : '',
        ]"
      >
        {{ displayName }}
      </span>
    </span>
    <div class="flex shrink-0 items-center gap-2">
      <slot />
      <select v-if="auth.isAdmin" class="rounded border border-slate-300 text-xs" :value="slot.override ?? ''" @change="chooseOverride">
        <option value="">(tự động)</option>
        <option v-for="c in store.couples" :key="c.id" :value="c.id">{{ c.maleName }} &amp; {{ c.femaleName }}</option>
      </select>
    </div>
  </div>
</template>
