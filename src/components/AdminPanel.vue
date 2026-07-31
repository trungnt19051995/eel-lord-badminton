<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'
import { downloadJSON, readJSONFile } from '../utils/exportImport.js'

const auth = useAuthStore()
const store = useTournamentStore()
const username = ref('')
const password = ref('')
const error = ref('')
const importError = ref('')

function handleLogin() {
  const ok = auth.login(username.value, password.value)
  if (!ok) {
    error.value = 'Sai tài khoản hoặc mật khẩu'
  } else {
    error.value = ''
    username.value = ''
    password.value = ''
  }
}

function handleExport() {
  downloadJSON(store.exportData(), 'tournament.json')
}

async function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return
  try {
    const data = await readJSONFile(file)
    store.importData(data)
    importError.value = ''
  } catch (e) {
    importError.value = e.message
  }
  event.target.value = ''
}

function handleReset() {
  if (confirm('Reset toàn bộ dữ liệu về mặc định? Hành động này ảnh hưởng tất cả người đang xem.')) {
    store.resetData()
  }
}
</script>

<template>
  <section id="admin" class="mx-auto max-w-md px-4 py-8">
    <h2 class="mb-4 text-lg font-bold text-slate-900">Admin</h2>

    <form v-if="!auth.isAdmin" class="space-y-3" @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Tài khoản" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input v-model="password" type="password" placeholder="Mật khẩu" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white">Đăng nhập</button>
    </form>

    <div v-else class="space-y-3">
      <p class="text-sm text-emerald-700">Đã đăng nhập với quyền Admin.</p>
      <div class="flex flex-wrap gap-2">
        <button class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" @click="handleExport">Export JSON</button>
        <label class="cursor-pointer rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          Import JSON
          <input type="file" accept="application/json" class="hidden" @change="handleImport" />
        </label>
        <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" @click="handleReset">Reset dữ liệu</button>
        <button class="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" @click="auth.logout()">Đăng xuất</button>
      </div>
      <p v-if="importError" class="text-sm text-red-600">{{ importError }}</p>
    </div>
  </section>
</template>
