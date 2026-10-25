<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-900 px-4">
    <!-- 如果正在加载验证状态，显示简单的过渡提示，避免闪烁 -->
    <div v-if="checking" class="text-slate-400 text-sm">
      Checking authentication status...
    </div>

    <!-- 未登录时显示登录窗口 -->
    <div v-else class="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white">Admin Portal</h1>
        <p class="text-sm text-slate-400 mt-2">Vanguard E&R Management System</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Admin Username</label>
          <input v-model="email" type="text" required placeholder="admin" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <input v-model="password" type="password" required placeholder="••••••••" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
        </div>

        <div v-if="errorMsg" class="text-red-400 text-xs bg-red-950/50 border border-red-900 p-3 rounded-lg">{{ errorMsg }}</div>

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg transition">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const checking = ref(true) // 控制初始加载状态，防止闪烁

// 页面加载时统一检查本地 localStorage 和后端 Token 校验
onMounted(async () => {
  if (import.meta.client) {
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        const res = await $fetch('/api/admin/verify', {
          method: 'POST',
          body: { token }
        })
        if (res.success) {
          // Token 有效，直接免登进入仪表盘
          router.push('/admin/dashboard')
          return
        }
      } catch (err) {
        // 校验失败说明 token 无效，清除脏数据
        localStorage.removeItem('admin_token')
      }
    }
  }
  // 如果未登录或 Token 无效，放行展示登录表单
  checking.value = false
})

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/admin/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    if (res.success) {
      localStorage.setItem('admin_token', res.token)
      router.push('/admin/dashboard')
    }
  } catch (err) {
    errorMsg.value = err.data?.statusMessage || 'Login failed.'
  }
}
</script>