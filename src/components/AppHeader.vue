<script setup>
import { ref } from 'vue'

const sections = [
  { id: 'couples', label: 'Cặp đấu' },
  { id: 'schedule', label: 'Lịch thi đấu' },
  { id: 'results', label: 'Kết quả' },
  { id: 'rules', label: 'Thể lệ' },
  { id: 'admin', label: 'Admin' },
]

const menuOpen = ref(false)

function scrollTo(id) {
  menuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <span class="text-base font-extrabold text-blue-700">🏸 Đồng Lươn Badminton Cup 2026</span>
      <button class="rounded-lg p-2 text-slate-700 md:hidden" aria-label="Mở menu" @click="menuOpen = !menuOpen">
        <span v-if="!menuOpen">☰</span>
        <span v-else>✕</span>
      </button>
      <nav class="hidden gap-4 md:flex">
        <button
          v-for="s in sections"
          :key="s.id"
          class="text-sm font-medium text-slate-700 hover:text-blue-700"
          @click="scrollTo(s.id)"
        >
          {{ s.label }}
        </button>
      </nav>
    </div>
    <nav v-if="menuOpen" class="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-2 md:hidden">
      <button
        v-for="s in sections"
        :key="s.id"
        class="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
        @click="scrollTo(s.id)"
      >
        {{ s.label }}
      </button>
    </nav>
  </header>
</template>
