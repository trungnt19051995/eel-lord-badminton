<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const auth = useAuthStore()
const store = useTournamentStore()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  const ok = auth.login(username.value, password.value)
  if (!ok) {
    error.value = 'Sai tài khoản hoặc mật khẩu'
  } else {
    error.value = ''
    username.value = ''
    password.value = ''
    auth.closePanel()
  }
}

function handleLogout() {
  auth.logout()
  auth.closePanel()
}

function handleReset() {
  const input = prompt(
    'Nhập lại mật khẩu Admin để xác nhận: xoá tỉ số & trạng thái của TẤT CẢ các trận, đưa về "Chưa thi đấu". Hành động này ảnh hưởng tất cả người đang xem.',
  )
  if (input === null) return
  if (!auth.verifyPassword(input)) {
    alert('Sai mật khẩu — đã huỷ Reset.')
    return
  }
  store.resetData()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="auth.isPanelOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      @click.self="auth.closePanel()"
    >
      <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-extrabold text-slate-900">Admin</h2>
          <button
            class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
            @click="auth.closePanel()"
          >
            ✕
          </button>
        </div>

        <form v-if="!auth.isAdmin" class="space-y-3" @submit.prevent="handleLogin">
          <input v-model="username" type="text" placeholder="Tài khoản" class="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <button type="submit" class="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white">Đăng nhập</button>
        </form>

        <div v-else class="space-y-3">
          <p class="text-sm text-emerald-700">Đã đăng nhập với quyền Admin.</p>
          <p v-if="store.syncError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Lỗi đồng bộ dữ liệu: {{ store.syncError }} — kiểm tra kết nối mạng hoặc cấu hình Firebase.
          </p>
          <div class="flex flex-wrap gap-2">
            <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" @click="handleReset">Reset tỉ số</button>
            <button class="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" @click="handleLogout">Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
