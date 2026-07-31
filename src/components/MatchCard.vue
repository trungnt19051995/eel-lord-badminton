<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'
import { resolveTeam, getSlotLabel } from '../utils/bracket.js'
import TeamSlotDisplay from './TeamSlotDisplay.vue'

const props = defineProps({
  matchId: { type: String, required: true },
  chipClass: { type: String, default: 'bg-slate-200 text-slate-600' },
})
const auth = useAuthStore()
const store = useTournamentStore()

const match = computed(() => store.matches.find((m) => m.id === props.matchId))
const bothResolved = computed(
  () =>
    match.value &&
    resolveTeam(match.value.team1, store.matches) != null &&
    resolveTeam(match.value.team2, store.matches) != null,
)
// "Thắng → A1 / Thua → B1" chỉ áp dụng cho các trận Vòng 1 nuôi trực tiếp vào Vòng 2 (getSlotLabel trả về null với trận không phải Vòng 1)
const advanceLabels = computed(() => {
  if (!match.value) return null
  const winnerLabel = getSlotLabel({ type: 'winner', matchId: match.value.id }, store.matches)
  const loserLabel = getSlotLabel({ type: 'loser', matchId: match.value.id }, store.matches)
  return winnerLabel && loserLabel ? { winnerLabel, loserLabel } : null
})

const score1 = ref('')
const score2 = ref('')
const editingScore = ref(false)

watch(
  () => [match.value?.score1, match.value?.score2],
  ([s1, s2]) => {
    if (editingScore.value) return
    score1.value = s1 ?? ''
    score2.value = s2 ?? ''
  },
  { immediate: true },
)

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

function resetMatch() {
  if (confirm('Xoá tỉ số và đặt lại trận này về trạng thái "Chưa thi đấu"? Không thể hoàn tác.')) {
    store.resetMatch(props.matchId)
  }
}
</script>

<template>
  <div v-if="match" class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
    <div v-if="!auth.isAdmin" class="flex items-center justify-between text-xs text-slate-500">
      <span class="font-bold text-slate-700">⏰ {{ match.time }}</span>
      <span class="rounded bg-slate-100 px-1.5 py-0.5 font-medium">📍 Sân {{ match.court }}</span>
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
        type="number"
        min="1"
        class="w-10 rounded border border-slate-300 px-1 py-0.5"
        @change="store.updateMatchCourt(match.id, Number($event.target.value) || match.court)"
      />
    </div>

    <div class="mt-2 divide-y divide-slate-100 border-y border-slate-100">
      <TeamSlotDisplay :match-id="match.id" slot-key="team1" :chip-class="chipClass">
        <input
          v-if="auth.isAdmin && bothResolved && match.status !== 'done'"
          v-model="score1"
          type="number"
          min="0"
          class="w-12 rounded border border-slate-300 px-1 py-0.5 text-sm"
          @focus="editingScore = true"
          @blur="editingScore = false"
        />
        <span v-else-if="match.score1 != null" class="text-sm font-bold text-slate-900">{{ match.score1 }}</span>
      </TeamSlotDisplay>
      <TeamSlotDisplay :match-id="match.id" slot-key="team2" :chip-class="chipClass">
        <input
          v-if="auth.isAdmin && bothResolved && match.status !== 'done'"
          v-model="score2"
          type="number"
          min="0"
          class="w-12 rounded border border-slate-300 px-1 py-0.5 text-sm"
          @focus="editingScore = true"
          @blur="editingScore = false"
        />
        <span v-else-if="match.score2 != null" class="text-sm font-bold text-slate-900">{{ match.score2 }}</span>
      </TeamSlotDisplay>
    </div>

    <p v-if="advanceLabels" class="mt-2 flex items-center justify-between text-[11px] font-semibold">
      <span class="text-blue-700">Thắng → {{ advanceLabels.winnerLabel }}</span>
      <span class="text-orange-700">Thua → {{ advanceLabels.loserLabel }}</span>
    </p>

    <div class="mt-2 flex items-center justify-between gap-2">
      <span class="text-xs italic text-slate-400">{{ statusStyle.dot }} {{ statusStyle.text }}</span>
      <button
        v-if="auth.isAdmin && bothResolved && match.status !== 'done'"
        class="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white"
        @click="saveScore"
      >
        Lưu
      </button>
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
      Mở lại trận (giữ tỉ số)
    </button>
    <button
      v-if="auth.isAdmin && match.status !== 'pending'"
      class="mt-2 w-full rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
      @click="resetMatch"
    >
      Đặt lại trận (xoá tỉ số)
    </button>
  </div>
</template>
