<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import MatchCard from './MatchCard.vue'
import GroupStandings from './GroupStandings.vue'

const props = defineProps({
  round: { type: Number, required: true },
  title: { type: String, required: true },
  colorClass: { type: String, required: true },
})

const store = useTournamentStore()
const roundMatches = computed(() => store.matches.filter((m) => m.round === props.round))
const groups = computed(() => [...new Set(roundMatches.value.map((m) => m.group).filter(Boolean))])

function matchesInGroup(group) {
  return roundMatches.value.filter((m) => m.group === group)
}
</script>

<template>
  <div class="w-72 shrink-0">
    <div :class="['rounded-t-xl px-3 py-2 text-center text-sm font-bold text-white', colorClass]">
      {{ title }}
    </div>
    <div class="space-y-4 rounded-b-xl bg-slate-100 p-3">
      <template v-if="groups.length">
        <div v-for="g in groups" :key="g">
          <p class="mb-1 text-xs font-bold text-slate-500">Bảng {{ g }}</p>
          <div class="space-y-2">
            <MatchCard v-for="m in matchesInGroup(g)" :key="m.id" :match-id="m.id" />
          </div>
          <GroupStandings :group="g" />
        </div>
      </template>
      <div v-else class="space-y-2">
        <MatchCard v-for="m in roundMatches" :key="m.id" :match-id="m.id" />
      </div>
    </div>
  </div>
</template>
