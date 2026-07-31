<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import { computeGroupStandings, getGroupWinner, isGroupComplete } from '../utils/bracket.js'

const props = defineProps({
  group: { type: String, required: true },
  accentClass: { type: String, default: 'bg-blue-600' },
})
const store = useTournamentStore()
const complete = computed(() => isGroupComplete(props.group, store.matches))

const rows = computed(() => {
  const stats = computeGroupStandings(props.group, store.matches)
  const winner = getGroupWinner(props.group, store.matches)
  const sorted = [...stats].sort((a, b) => b.points - a.points || b.diff - a.diff || b.scored - a.scored)
  if (winner != null) {
    const idx = sorted.findIndex((r) => r.coupleId === winner)
    if (idx > 0) {
      const [w] = sorted.splice(idx, 1)
      sorted.unshift(w)
    }
  }
  return sorted
})
const winnerId = computed(() => getGroupWinner(props.group, store.matches))

function coupleLabel(coupleId) {
  const c = store.couples.find((c) => c.id === coupleId)
  return c ? `${c.maleName} & ${c.femaleName}` : '?'
}
</script>

<template>
  <div>
    <div :class="['flex items-center justify-between px-3 py-2 text-white', accentClass]">
      <span class="text-sm font-bold">Bảng {{ group }}</span>
      <span class="text-[11px] font-semibold uppercase opacity-90">Nhất bảng = {{ group[0] }} Nhất {{ group.slice(1) }}</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead class="bg-slate-50 text-slate-500">
          <tr>
            <th class="px-2 py-1 text-left">Cặp</th>
            <th class="px-2 py-1">Tr</th>
            <th class="px-2 py-1">T</th>
            <th class="px-2 py-1">B</th>
            <th class="px-2 py-1">HS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.coupleId" :class="r.coupleId === winnerId ? 'bg-blue-50 font-semibold' : ''">
            <td class="px-2 py-1">{{ coupleLabel(r.coupleId) }}</td>
            <td class="px-2 py-1 text-center">{{ r.wins + r.losses }}</td>
            <td class="px-2 py-1 text-center">{{ r.wins }}</td>
            <td class="px-2 py-1 text-center">{{ r.losses }}</td>
            <td class="px-2 py-1 text-center">{{ r.diff }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="rows.length && complete && !winnerId" class="p-2 text-xs text-amber-700">
      Chưa xác định được đội nhất bảng — Admin cần chọn thủ công (dùng ô "tự động" ở mỗi trận Vòng 3 để chỉ định).
    </p>
    <p v-else-if="rows.length && !complete" class="border-t border-slate-100 p-2 text-xs text-slate-400">
      Đang thi đấu — bảng xếp hạng sẽ cập nhật khi có kết quả mới.
    </p>
  </div>
</template>
