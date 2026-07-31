<script setup>
import { computed } from 'vue'
import { useTournamentStore } from '../store/tournamentStore.js'
import { computeGroupStandings, getGroupWinner } from '../utils/bracket.js'

const props = defineProps({ group: { type: String, required: true } })
const store = useTournamentStore()

const rows = computed(() => {
  const stats = computeGroupStandings(props.group, store.matches)
  return [...stats].sort((a, b) => b.points - a.points || b.diff - a.diff || b.scored - a.scored)
})
const winnerId = computed(() => getGroupWinner(props.group, store.matches))

function coupleLabel(coupleId) {
  const c = store.couples.find((c) => c.id === coupleId)
  return c ? `${c.maleName} & ${c.femaleName}` : '?'
}
</script>

<template>
  <div class="mt-2 overflow-x-auto rounded-lg border border-slate-200">
    <table class="w-full text-xs">
      <thead class="bg-slate-100 text-slate-500">
        <tr>
          <th class="px-2 py-1 text-left">STT</th>
          <th class="px-2 py-1 text-left">Cặp đấu</th>
          <th class="px-2 py-1">T</th>
          <th class="px-2 py-1">B</th>
          <th class="px-2 py-1">Đ</th>
          <th class="px-2 py-1">Ghi</th>
          <th class="px-2 py-1">Thua</th>
          <th class="px-2 py-1">HS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r.coupleId" :class="r.coupleId === winnerId ? 'bg-blue-50 font-semibold' : ''">
          <td class="px-2 py-1">{{ i + 1 }}</td>
          <td class="px-2 py-1">{{ coupleLabel(r.coupleId) }}</td>
          <td class="px-2 py-1 text-center">{{ r.wins }}</td>
          <td class="px-2 py-1 text-center">{{ r.losses }}</td>
          <td class="px-2 py-1 text-center">{{ r.points }}</td>
          <td class="px-2 py-1 text-center">{{ r.scored }}</td>
          <td class="px-2 py-1 text-center">{{ r.conceded }}</td>
          <td class="px-2 py-1 text-center">{{ r.diff }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="rows.length && !winnerId" class="p-2 text-xs text-amber-700">
      Chưa xác định được đội nhất bảng — Admin cần chọn thủ công (dùng ô "tự động" ở mỗi trận Vòng 3 để chỉ định).
    </p>
  </div>
</template>
