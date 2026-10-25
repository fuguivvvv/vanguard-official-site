<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const userEmail = ref('')
const messageContent = ref('')
const submittinng = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// 检查客户端 localStorage 的登录状态
const updateAuth = () => {
  if (import.meta.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      isLoggedIn.value = true
      userEmail.value = localStorage.getItem('user_email') || 'User'
    } else {
      isLoggedIn.value = false
      userEmail.value = ''
    }
  }
}

onMounted(() => {
  updateAuth()
  window.addEventListener('auth-changed', updateAuth)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', updateAuth)
})

// 提交留言逻辑（带上认证请求头）
const submitMessage = async () => {
  if (!messageContent.value.trim()) return
  submittinng.value = true
  errorMsg.value = ''
  successMsg.value = ''

  const token = localStorage.getItem('auth_token')
  const email = localStorage.getItem('user_email')

  try {
    const res = await $fetch('/api/messages', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${token}`,
        'x-user-email': email
      },
      body: { content: messageContent.value }
    })

    if (res.success) {
      successMsg.value = 'Message submitted successfully, thank you for your feedback!'
      messageContent.value = ''
    }
  } catch (err) {
    errorMsg.value = err.data?.statusMessage || err.data?.message || 'Submission failed, please try again later.'
  } finally {
    submittinng.value = false
  }
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-extrabold text-white mb-4">Contact Us</h1>
        <p class="text-slate-400">Get in touch for expert technical consulting and validation services.</p>
      </div>

      <div class="bg-slate-950 border border-slate-800 p-8 rounded-2xl space-y-6">
        <img src="/images/contact-office.jpg" alt="Contact & Office" class="w-full h-80 object-cover rounded-lg mb-6 border border-slate-800" />

        <h3 class="text-xl font-bold text-white">Direct Consultation Inquiry</h3>
        <p class="text-slate-400 text-sm">Whether you are tackling a challenging test anomaly or planning a validation campaign from scratch, Vanguard is ready to assist.</p>

        <div class="space-y-4 pt-4 border-t border-slate-800 text-slate-300">
          <p><strong>Phone:</strong> <a href="tel:+1 4013654302" class="text-sky-400 hover:underline">+14013654302</a></p>
          <p><strong>Email:</strong> <a href="mailto:contact@vanguarder-solutions.com" class="text-sky-400 hover:underline">contact@vanguarder-solutions.com</a></p>
          <p><strong>Address:</strong> 16682 OLIVE HILL DRIVE, WINTER GARDEN, FL. US 34787</p>
          <p><strong>Operations:</strong> Supporting clients in US across advanced industrial sectors.</p>
        </div>

        <!-- 客户留言区域 -->
        <div class="pt-6 border-t border-slate-800">
          <h3 class="text-lg font-bold text-white mb-3">Customer Message</h3>

          <!-- 已登录状态：显示留言表单 -->
          <div v-if="isLoggedIn" class="space-y-4">
            <p class="text-xs text-slate-400">Current Account: <span class="text-sky-400">{{ userEmail }}</span></p>
            <textarea
                v-model="messageContent"
                rows="4"
                placeholder="Please enter your technical inquiry or business requirements..."
                class="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-sky-500"
            ></textarea>

            <div class="flex items-center justify-between">
              <button
                  @click="submitMessage"
                  :disabled="submittinng"
                  class="bg-sky-600 hover:bg-sky-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition disabled:opacity-50"
              >
                {{ submittinng ? 'Submitting...' : 'Submit Message' }}
              </button>

              <span v-if="successMsg" class="text-emerald-400 text-xs">{{ successMsg }}</span>
              <span v-if="errorMsg" class="text-rose-400 text-xs">{{ errorMsg }}</span>
            </div>
          </div>

          <!-- 未登录状态：提示登录并提供跳转按钮 -->
          <div v-else class="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center space-y-4">
            <p class="text-slate-400 text-sm">You are currently not logged in. Please sign in to submit a customer message.</p>
            <button
                @click="goToLogin"
                class="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium px-6 py-2 rounded-lg text-sm transition"
            >
              Sign In
            </button>
          </div>
        </div>
        <!-- 留言区域结束 -->

      </div>
    </div>
  </div>
</template>