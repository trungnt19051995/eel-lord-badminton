<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'
import { resolveTeam } from '../utils/bracket.js'
import TeamSlotDisplay from './TeamSlotDisplay.vue'

const props = defineProps({ matchId: { type: String, required: true } })
const auth = useAuthStore()
const store = useTournamentStore()

const match = computed(() => store.matches.find((m) => m.id === props.matchId))
const bothResolved = computed(
  () =>
    match.value &&
    resolveTeam(match.value.team1, store.matches) != null &&
    resolveTeam(match.value.team2, store.matches) != null,
)

const score1 = ref('')
const score2 = ref('')
const editingScore = ref(false)

watchEffect(() => {
  if (editingScore.value) return
  score1.value = match.value?.score1 ?? ''
  score2.value = match.value?.score2 ?? ''
})

const statusStyle = computed(
  () =>
    ({
      pending: { dot: '⚪', text: 'Chưa thi đấu' },
      live: { dot: '🟡', text: 'Đang cập nhật' },
      done: { dot: '🟢', text: 'Hoàn thành' },
    })[match.value?.status ?? 'pending'],
)

function saveScore() {
  const s1 = score1.value === '' ? null : Number(score1.value)
  const s2 = score2.value === '' ? null : Number(score2.value)
  store.updateMatchScore(props.matchId, s1, s2)
}
</script>

<template>
  <div v-if="match" class="w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
    <div v-if="!auth.isAdmin" class="flex items-center justify-between text-xs text-slate-500">
      <span>{{ match.time }} · Sân {{ match.court }}</span>
      <span>{{ statusStyle.dot }} {{ statusStyle.text }}</span>
    </div>
    <div v-else class="flex items-center justify-between gap-1 text-xs text-slate-500">
      <input
        :value="match.time"
        class="w-24 rounded border border-slate-300 px-1 py-0.5"
        @change="store.updateMatchTime(match.id, $event.target.value)"
      />
      <span>· Sân</span>
      <input
        :value="match.court"
        class="w-10 rounded border border-slate-300 px-1 py-0.5"
        @change="store.updateMatchCourt(match.id, Number($event.target.value))"
      />
      <span>{{ statusStyle.dot }} {{ statusStyle.text }}</span>
    </div>
    <div class="mt-2 space-y-1">
      <TeamSlotDisplay :match-id="match.id" slot-key="team1" />
      <TeamSlotDisplay :match-id="match.id" slot-key="team2" />
    </div>
    <div class="mt-2 text-center text-sm font-bold" :class="match.status === 'done' ? 'text-emerald-700' : 'text-slate-700'">
      {{ match.score1 ?? '-' }} : {{ match.score2 ?? '-' }}
    </div>

    <div v-if="auth.isAdmin && bothResolved && match.status !== 'done'" class="mt-2 flex items-center gap-2">
      <input v-model="score1" type="number" min="0" class="w-14 rounded border border-slate-300 px-1 py-0.5 text-sm" @focus="editingScore = true" @blur="editingScore = false" />
      <span>-</span>
      <input v-model="score2" type="number" min="0" class="w-14 rounded border border-slate-300 px-1 py-0.5 text-sm" @focus="editingScore = true" @blur="editingScore = false" />
      <button class="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white" @click="saveScore">Lưu</button>
    </div>
    <button
      v-if="auth.isAdmin && match.status === 'live'"
      class="mt-2 w-full rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
      @click="store.confirmMatchDone(match.id)"
    >
      Xác nhận kết thúc trận
    </button>
    <button
      v-if="auth.isAdmin && match.status === 'done'"
      class="mt-2 w-full rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
      @click="store.reopenMatch(match.id)"
    >
      Mở lại trận
    </button>
  </div>
</template>
