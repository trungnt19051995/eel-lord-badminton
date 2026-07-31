<script setup>
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const props = defineProps({ couple: { type: Object, required: true } })
const auth = useAuthStore()
const store = useTournamentStore()

function onEdit(field, event) {
  store.updateCoupleName(props.couple.id, field, event.target.value)
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p class="text-xs font-semibold text-slate-400">Cặp #{{ couple.id }}</p>
    <div v-if="!auth.isAdmin" class="mt-1 text-base font-semibold text-slate-900">
      {{ couple.maleName }} &amp; {{ couple.femaleName }}
    </div>
    <div v-else class="mt-1 flex flex-col gap-2">
      <input :value="couple.maleName" class="rounded-lg border border-slate-300 px-2 py-1 text-sm" @change="onEdit('maleName', $event)" />
      <input :value="couple.femaleName" class="rounded-lg border border-slate-300 px-2 py-1 text-sm" @change="onEdit('femaleName', $event)" />
    </div>
  </div>
</template>
