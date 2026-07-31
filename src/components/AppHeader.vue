<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTournamentStore } from '../store/tournamentStore.js'

const store = useTournamentStore()
const route = useRoute()

const navItems = [
  { id: 'couples', label: 'Cặp đấu', hash: '#couples' },
  { id: 'schedule', label: 'Lịch thi đấu', hash: '#schedule' },
  { id: 'rules', label: 'Thể lệ', to: '/the-le' },
  { id: 'admin', label: 'Admin', hash: '#admin' },
]
const homeSectionIds = navItems.filter((n) => n.hash).map((n) => n.id)

const activeId = ref('couples')
const headerEl = ref(null)
let sectionObserver = null
let resizeObserver = null

function isActive(item) {
  if (item.to) return route.path === item.to
  return route.path === '/' && activeId.value === item.id
}

// Đo chiều cao thật của header (thay đổi theo màn hình/chữ xuống dòng) rồi lưu vào biến CSS,
// để mọi phần tử "sticky" hoặc "scroll-margin" khác trong trang luôn né đúng, không đoán số px cố định.
function syncHeaderHeight() {
  if (headerEl.value) {
    document.documentElement.style.setProperty('--header-height', `${headerEl.value.offsetHeight}px`)
  }
}

// Trang chủ được render/huỷ lại mỗi lần điều hướng qua Thể lệ rồi quay lại,
// nên phải quan sát lại đúng các section mới mỗi lần trở về "/".
async function setupSectionObserver() {
  if (sectionObserver) sectionObserver.disconnect()
  await nextTick()
  const headerHeight = headerEl.value?.offsetHeight ?? 140
  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length) {
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: `-${headerHeight}px 0px -70% 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] },
  )
  homeSectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) sectionObserver.observe(el)
  })
}

onMounted(() => {
  syncHeaderHeight()
  resizeObserver = new ResizeObserver(syncHeaderHeight)
  if (headerEl.value) resizeObserver.observe(headerEl.value)
  if (route.path === '/') setupSectionObserver()
})

watch(
  () => route.path,
  (path) => {
    if (path === '/') setupSectionObserver()
    else if (sectionObserver) sectionObserver.disconnect()
  },
)

onBeforeUnmount(() => {
  if (sectionObserver) sectionObserver.disconnect()
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
        <p class="text-xl font-extrabold leading-tight sm:text-2xl">Đồng Lươn Badminton Cup 2026</p>
        <p class="mt-1 text-xs text-blue-50 sm:text-sm">Thứ 6 · 31/07/2026 · 19h30 – 21h30 · Sân 1-2-3 THPT Khương Đình</p>
        <p class="text-xs text-blue-50 sm:text-sm">{{ store.couples.length }} cặp đôi nam nữ · {{ store.matches.length }} trận · 1 Lươn Chúa</p>
      </div>
    </div>
    <nav class="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4 pb-2 sm:gap-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to ?? { path: '/', hash: item.hash }"
        :class="[
          'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
          isActive(item) ? 'bg-white text-blue-700' : 'text-blue-50 hover:bg-blue-600',
        ]"
        @click="!item.to && (activeId = item.id)"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>
