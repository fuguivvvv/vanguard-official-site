<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 p-8">
    <div class="max-w-7xl mx-auto">
      <header class="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <h1 class="text-2xl font-bold">Admin Dashboard - User & Message Management</h1>
        <button @click="logout" class="bg-red-600/20 text-red-400 border border-red-900 px-4 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white transition">Logout</button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：用户列表 -->
        <div class="lg:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 class="text-lg font-semibold mb-4">Registered Users</h2>
          <div class="space-y-3 overflow-y-auto max-h-[600px]">
            <div
                v-for="user in users"
                :key="user.id"
                @click="selectUser(user)"
                :class="['p-4 rounded-lg cursor-pointer border transition', selectedUser?.email === user.email ? 'bg-blue-950/40 border-blue-600' : 'bg-slate-900 border-slate-800 hover:border-slate-700']"
            >
              <div class="font-semibold text-white">{{ user.name || 'Unnamed User' }}</div>
              <div class="text-xs text-slate-400 mt-1">{{ user.email }}</div>
              <div class="text-xs text-slate-500 mt-1">Phone: {{ user.phone || 'N/A' }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧：选中用户的留言详情 -->
        <div class="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 class="text-lg font-semibold mb-4">
            Messages from: <span class="text-blue-400">{{ selectedUser ? selectedUser.email : 'Select a user' }}</span>
          </h2>

          <div v-if="!selectedUser" class="text-slate-500 text-center py-20">Please select a user from the left list to view their messages.</div>

          <div v-else-if="loadingMessages" class="text-slate-400 text-center py-10">Loading messages...</div>

          <div v-else-if="userMessages.length === 0" class="text-slate-500 text-center py-10">This user has no messages.</div>

          <div v-else class="space-y-4 overflow-y-auto max-h-[600px]">
            <div v-for="msg in userMessages" :key="msg.id" class="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-blue-300 text-sm">Message ID: {{ msg.id }}</span>
                <span class="text-xs text-slate-500">{{ msg.createdAt }}</span>
              </div>
              <p class="text-sm text-slate-300 whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])
const selectedUser = ref(null)
const userMessages = ref([])
const loadingMessages = ref(false)

onMounted(async () => {
  if (import.meta.client) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    // 后端鉴权校验
    try {
      const verifyRes = await $fetch('/api/admin/verify', {
        method: 'POST',
        body: { token }
      })
      if (!verifyRes.success) {
        localStorage.removeItem('admin_token')
        router.push('/admin')
        return
      }
    } catch (e) {
      localStorage.removeItem('admin_token')
      router.push('/admin')
      return
    }
  }

  try {
    const res = await $fetch('/api/admin/users')
    if (res.success) {
      users.value = res.data
    }
  } catch (err) {
    console.error(err)
  }
})

const selectUser = async (user) => {
  selectedUser.value = user
  loadingMessages.value = true
  userMessages.value = []

  try {
    const res = await $fetch(`/api/admin/user-messages?email=${encodeURIComponent(user.email)}`)
    if (res.success) {
      userMessages.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingMessages.value = false
  }
}

const logout = () => {
  localStorage.removeItem('admin_token')
  router.push('/admin')
}
</script>