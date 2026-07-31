<script setup>
import BracketColumn from './BracketColumn.vue'

const rounds = [
  { round: 1, title: 'Vòng 1 — Loại trực tiếp', colorClass: 'bg-emerald-600' },
  { round: 2, title: 'Vòng 2 — Vòng tròn tính điểm', colorClass: 'bg-blue-600' },
  { round: 3, title: 'Vòng 3 — Chung kết nhánh', colorClass: 'bg-violet-600' },
  { round: 4, title: 'Vòng 4 — Chung kết tổng', colorClass: 'bg-amber-600' },
]
</script>

<template>
  <section id="schedule" class="px-4 py-8">
    <h2 class="mx-auto mb-4 max-w-5xl text-lg font-bold text-slate-900">Lịch thi đấu</h2>
    <div class="flex gap-4 overflow-x-auto pb-4">
      <BracketColumn v-for="r in rounds" :key="r.round" v-bind="r" />
    </div>
  </section>
</template>
