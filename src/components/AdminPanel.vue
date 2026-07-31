<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/authStore.js'

const auth = useAuthStore()
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
      <button class="rounded-lg bg-slate-200 px-3 py-2 font-semibold text-slate-700" @click="auth.logout()">Đăng xuất</button>
    </div>
  </section>
</template>
