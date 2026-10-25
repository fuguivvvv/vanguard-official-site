<template>
  <div class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white">User Profile</h1>
        <p class="text-sm text-slate-400 mt-2">Manage your account information and preferences</p>
      </div>

      <form @submit.prevent="handleUpdateProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Email Address (Account)</label>
          <input
              v-model="email"
              type="email"
              disabled
              class="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed"
          />
          <span class="text-xs text-slate-500 mt-1 block">Email address cannot be changed.</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Full Name / Company Name</label>
          <input
              v-model="name"
              type="text"
              placeholder="e.g. John Doe / Vanguard Client"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
          <input
              v-model="phone"
              type="text"
              placeholder="+1 (555) 000-0000"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div v-if="errorMsg" class="text-red-400 text-xs bg-red-950/50 border border-red-900 p-3 rounded-lg">
          {{ errorMsg }}
        </div>

        <div v-if="successMsg" class="text-emerald-400 text-xs bg-emerald-950/50 border border-emerald-900 p-3 rounded-lg text-center">
          {{ successMsg }}
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const email = ref('')
const name = ref('')
const phone = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(async () => {
  if (import.meta.client) {
    const storedEmail = localStorage.getItem('user_email') || ''
    email.value = storedEmail

    if (!storedEmail) return

    try {
      // 同时通过 Header 和 Query 传参，确保后端能稳定获取
      const res = await $fetch(`/api/user/profile?email=${encodeURIComponent(storedEmail)}`, {
        headers: {
          'x-user-email': storedEmail
        }
      })
      if (res && res.success && res.data) {
        name.value = res.data.name || ''
        phone.value = res.data.phone || ''
        // 同步更新本地缓存
        localStorage.setItem('user_name', name.value)
        localStorage.setItem('user_phone', phone.value)
      }
    } catch (err) {
      // 如果请求失败，降级读取本地缓存
      name.value = localStorage.getItem('user_name') || ''
      phone.value = localStorage.getItem('user_phone') || ''
    }
  }
})

const handleUpdateProfile = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    const res = await $fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'x-user-email': email.value
      },
      body: {
        email: email.value,
        name: name.value,
        phone: phone.value
      }
    })

    if (res.success) {
      successMsg.value = 'Profile updated successfully!'
      if (import.meta.client) {
        localStorage.setItem('user_name', name.value)
        localStorage.setItem('user_phone', phone.value)
        // 触发全局事件同步导航栏用户名
        window.dispatchEvent(new Event('auth-changed'))
      }
    }
  } catch (err) {
    errorMsg.value = err.data?.statusMessage || 'Failed to update profile. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>