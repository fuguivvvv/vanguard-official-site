<template>
  <div class="flex items-center justify-center min-h-[80vh] px-4">
    <div class="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white">Client Portal Login</h1>
        <p class="text-sm text-slate-400 mt-2">Access your testing reports and consultation data</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Username or Email Address</label>
          <input
              v-model="account"
              type="text"
              required
              placeholder="Enter your username or email"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div v-if="errorMsg" class="text-red-400 text-xs bg-red-950/50 border border-red-900 p-3 rounded-lg">
          {{ errorMsg }}
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/30 transition"
        >
          Sign In
        </button>

        <div class="text-center text-sm text-slate-400 pt-2">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-400 hover:underline font-medium">Create an account</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const account = ref('') // 对应用户名或邮箱
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: { account: account.value, password: password.value }
    })

    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user_email', response.email)
      localStorage.setItem('user_name', response.name || '')
      localStorage.setItem('user_phone', response.phone || '')

      window.dispatchEvent(new Event('auth-changed'))
      router.push('/')
    }
  } catch (err) {
    errorMsg.value = err.data?.statusMessage || 'Login failed. Please check your credentials.'
  }
}
</script>