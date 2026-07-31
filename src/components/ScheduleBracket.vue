<script setup>
import BracketColumn from './BracketColumn.vue'

const rounds = [
  {
    round: 1,
    title: 'Loại trực tiếp',
    subtitle: 'Thắng đi Nhánh Thắng, thua đi Nhánh Thua. Nhập điểm để hệ thống tự chia nhánh.',
    colorClass: 'bg-emerald-600',
  },
  {
    round: 2,
    title: '4 bảng vòng tròn',
    subtitle: 'Mỗi bảng 3 cặp, đấu vòng tròn 3 trận. Nhất bảng đi tiếp.',
    colorClass: 'bg-blue-600',
  },
  {
    round: 3,
    title: 'Chung kết nhánh',
    subtitle: 'Nhất bảng gặp nhau trong cùng nhánh để tìm đại diện.',
    colorClass: 'bg-violet-600',
  },
  {
    round: 4,
    title: 'Chung kết tổng — Tìm nhà vô địch',
    subtitle: 'Đại diện Nhánh Thắng gặp đại diện Nhánh Thua.',
    colorClass: 'bg-amber-600',
  },
]

function jumpTo(round) {
  const el = document.getElementById(`round-${round}`)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="schedule" class="py-8">
    <h2 class="mb-4 text-xl font-extrabold text-slate-900">Lịch thi đấu &amp; Kết quả</h2>

    <!-- Mobile: tab xem nhanh, dính cố định dưới header (chiều cao header đo tự động, xem AppHeader.vue) để luôn bấm được khi cuộn -->
    <div
      class="sticky z-40 mb-4 flex gap-2 overflow-x-auto bg-slate-200/95 py-2 backdrop-blur md:hidden"
      style="top: var(--header-height)"
    >
      <button
        v-for="r in rounds"
        :key="r.round"
        :class="['shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white', r.colorClass]"
        @click="jumpTo(r.round)"
      >
        Vòng {{ r.round }}
      </button>
    </div>

    <div class="space-y-8">
      <div
        v-for="r in rounds"
        :key="r.round"
        :id="`round-${r.round}`"
        style="scroll-margin-top: calc(var(--header-height) + 3.5rem)"
      >
        <BracketColumn v-bind="r" />
      </div>
    </div>
  </section>
</template>
