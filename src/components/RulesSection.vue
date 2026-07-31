<script setup>
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const auth = useAuthStore()
const store = useTournamentStore()
const draft = ref('')
const editingRules = ref(false)
watchEffect(() => {
  if (editingRules.value) return
  draft.value = store.rules
})

function save() {
  store.updateRules(draft.value)
}
</script>

<template>
  <section id="rules" class="mx-auto max-w-5xl px-4 py-8">
    <h2 class="mb-4 text-lg font-bold text-slate-900">Thể lệ</h2>
    <div v-if="!auth.isAdmin" class="whitespace-pre-line rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
      {{ store.rules }}
    </div>
    <div v-else class="space-y-2">
      <textarea
        v-model="draft"
        rows="8"
        class="w-full rounded-xl border border-slate-300 p-3 text-sm"
        @focus="editingRules = true"
        @blur="editingRules = false"
      ></textarea>
      <button class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" @click="save">Lưu thể lệ</button>
    </div>
  </section>
</template>
