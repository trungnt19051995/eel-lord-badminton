<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const store = useTournamentStore()
const auth = useAuthStore()
const route = useRoute()

const headerEl = ref(null)
let resizeObserver = null

// Ngày/giờ/địa điểm lấy từ 3 thẻ đầu của "Thông tin thi đấu" ở trang Thể lệ — Admin sửa ở đó thì header cũng đổi theo
const eventSummary = computed(() =>
  (store.rulesContent.eventInfoCards ?? [])
    .slice(0, 3)
    .map((c) => c.value)
    .filter(Boolean)
    .join(' · '),
)

// Đo chiều cao thật của header (thay đổi theo màn hình/chữ xuống dòng) rồi lưu vào biến CSS,
// để mọi phần tử "sticky" hoặc "scroll-margin" khác trong trang luôn né đúng, không đoán số px cố định.
function syncHeaderHeight() {
  if (headerEl.value) {
    document.documentElement.style.setProperty('--header-height', `${headerEl.value.offsetHeight}px`)
  }
}

onMounted(() => {
  syncHeaderHeight()
  resizeObserver = new ResizeObserver(syncHeaderHeight)
  if (headerEl.value) resizeObserver.observe(headerEl.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <header ref="headerEl" class="sticky top-0 z-50 bg-blue-700 text-white shadow-md">
    <div class="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3">
      <img
        src="/eel-logo.png"
        alt="Đồng Lươn Badminton Cup"
        class="aspect-square max-h-20 shrink-0 self-stretch rounded-full object-cover ring-2 ring-white/50"
      />
      <div class="min-w-0">
        <p class="text-xl font-extrabold leading-tight sm:text-2xl">{{ store.rulesContent.announcementTitle }}</p>
        <p class="mt-1 text-xs text-blue-50 sm:text-sm">{{ eventSummary }}</p>
        <p class="text-xs text-blue-50 sm:text-sm">{{ store.couples.length }} cặp đôi · {{ store.matches.length }} trận · 1 Lươn Chúa</p>
      </div>
    </div>
    <nav class="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4 pb-2 sm:gap-2">
      <RouterLink
        to="/"
        :class="[
          'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
          route.path === '/' ? 'bg-white text-blue-700' : 'text-blue-50 hover:bg-blue-600',
        ]"
      >
        Lịch thi đấu
      </RouterLink>
      <RouterLink
        to="/cap-dau"
        :class="[
          'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
          route.path === '/cap-dau' ? 'bg-white text-blue-700' : 'text-blue-50 hover:bg-blue-600',
        ]"
      >
        Cặp đấu
      </RouterLink>
      <RouterLink
        to="/the-le"
        :class="[
          'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
          route.path === '/the-le' ? 'bg-white text-blue-700' : 'text-blue-50 hover:bg-blue-600',
        ]"
      >
        Thể lệ
      </RouterLink>
      <button
        :class="[
          'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
          auth.isPanelOpen ? 'bg-white text-blue-700' : 'text-blue-50 hover:bg-blue-600',
        ]"
        @click="auth.openPanel()"
      >
        Admin
      </button>
    </nav>
  </header>
</template>
