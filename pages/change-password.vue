<template>
  <div class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white">Change Password</h1>
        <p class="text-sm text-slate-400 mt-2">Ensure your account is using a secure password</p>
      </div>

      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
          <input
              v-model="oldPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">New Password</label>
          <input
              v-model="newPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
          <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
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
          {{ loading ? 'Updating...' : 'Update Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleChangePassword = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'New passwords do not match.'
    return
  }

  loading.value = true
  try {
    const userEmail = localStorage.getItem('user_email') || ''

    const res = await $fetch('/api/user/change-password', {
      method: 'POST',
      headers: {
        'x-user-email': userEmail
      },
      body: {
        email: userEmail,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      }
    })

    if (res.success) {
      successMsg.value = 'Password changed successfully!'
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }
  } catch (err) {
    errorMsg.value = err.data?.statusMessage || 'Failed to change password. Please check your current password.'
  } finally {
    loading.value = false
  }
}
</script>