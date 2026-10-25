<template>
  <div class="flex items-center justify-center min-h-[80vh] px-4 py-8">
    <div class="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-white">Create an Account</h1>
        <p class="text-sm text-slate-400 mt-2">Register to access V&R Solutions client portal</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Full Name / Company Name</label>
          <input
              v-model="name"
              type="text"
              required
              placeholder="e.g. John Doe / Vanguard Client"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <input
              v-model="email"
              type="email"
              required
              placeholder="contact@vanguarder-solutions.com"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <!-- 新增：Phone Number 选填项 -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Phone Number <span class="text-xs text-slate-500">(Optional)</span></label>
          <input
              v-model="phone"
              type="text"
              placeholder="+1 (555) 000-0000"
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

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
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

        <div v-if="successMsg" class="text-green-400 text-xs bg-green-950/50 border border-green-900 p-3 rounded-lg text-center">
          {{ successMsg }}
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/30 transition"
        >
          Register
        </button>

        <div class="text-center text-sm text-slate-400 pt-2">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-400 hover:underline font-medium">Sign In</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const phone = ref('') // 新增 phone 响应式变量
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match. Please check again.'
    return
  }

  try {
    const response = await $fetch('/api/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        phone: phone.value, // 提交 phone
        password: password.value
      }
    })

    if (response.success) {
      successMsg.value = 'Registration successful! Redirecting to login...'
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  } catch (err) {
    errorMsg.value = err.data?.statusMessage || 'Registration failed. Please try again.'
  }
}
</script>