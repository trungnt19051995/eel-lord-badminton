<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
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

const activeRound = ref(1)
let ticking = false

// Vòng "đang xem" xét theo 3 mức ưu tiên:
// 1) Đã cuộn chạm đáy trang → luôn là vòng cuối cùng (nội dung Vòng 4 có thể ngắn hơn 1 màn hình nên không tự khớp được).
// 2) Có banner tiêu đề (chỗ ghi "VÒNG N · ...") đang hiện trong màn hình → chọn banner đó; nếu nhiều banner cùng hiện
//    (ví dụ cuộn gần cuối trang, thấy cả banner Vòng 3 và Vòng 4) thì ưu tiên vòng lớn hơn.
// 3) Không banner nào hiện (đã cuộn qua khỏi banner, đang ở giữa nội dung của 1 vòng, dù cuộn xuôi hay ngược) →
//    chọn vòng mà cả khối nội dung (banner + card) của nó vẫn đang chứa đường mốc.
function recomputeActiveRound() {
  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 140
  const viewTop = headerHeight + 60
  const viewBottom = window.innerHeight

  const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  if (scrolledToBottom) {
    activeRound.value = rounds[rounds.length - 1].round
    return
  }

  let bannerMatch = null
  for (const r of rounds) {
    const banner = document.querySelector(`[data-round-banner="${r.round}"]`)
    if (!banner) continue
    const rect = banner.getBoundingClientRect()
    if (rect.bottom > viewTop && rect.top < viewBottom) {
      bannerMatch = r.round
    }
  }
  if (bannerMatch != null) {
    activeRound.value = bannerMatch
    return
  }

  for (const r of rounds) {
    const el = document.getElementById(`round-${r.round}`)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= viewTop && rect.bottom > viewTop) {
      activeRound.value = r.round
      return
    }
  }
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    recomputeActiveRound()
    ticking = false
  })
}

function jumpTo(round) {
  activeRound.value = round
  const el = document.getElementById(`round-${round}`)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  recomputeActiveRound()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
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
        :class="[
          'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
          activeRound === r.round ? [r.colorClass, 'text-white'] : 'bg-white text-slate-900',
        ]"
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
