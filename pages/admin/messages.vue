<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-white">Admin Dashboard</h1>
        <p class="text-slate-400 text-sm mt-1">Manage customer inquiries and technical consulting requests.</p>
      </div>
      <button
          @fetch="fetchMessages"
          class="bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg border border-slate-700 transition"
      >
        Refresh List
      </button>
    </div>

    <!-- 数据表格展示区域 -->
    <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th class="py-4 px-6">ID</th>
            <th class="py-4 px-6">User Email</th>
            <th class="py-4 px-6">Content</th>
            <th class="py-4 px-6">Status</th>
            <th class="py-4 px-6">Submitted At</th>
            <th class="py-4 px-6 text-right">Actions</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-slate-800 text-sm text-slate-300">
          <tr v-if="loading">
            <td colspan="6" class="py-8 text-center text-slate-500">Loading messages...</td>
          </tr>
          <tr v-else-if="messages.length === 0">
            <td colspan="6" class="py-8 text-center text-slate-500">No customer messages found.</td>
          </tr>
          <tr v-for="item in messages" :key="item.id" class="hover:bg-slate-900/50 transition">
            <td class="py-4 px-6 text-slate-400">#{{ item.id }}</td>
            <td class="py-4 px-6 font-medium text-sky-400">{{ item.userEmail }}</td>
            <td class="py-4 px-6 max-w-xs truncate text-slate-200">{{ item.content }}</td>
            <td class="py-4 px-6">
                <span
                    :class="{
                      'bg-amber-500/10 text-amber-400 border-amber-500/30': item.status === 'pending',
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30': item.status === 'resolved'
                    }"
                    class="px-2.5 py-1 rounded-full text-xs font-medium border"
                >
                  {{ item.status }}
                </span>
            </td>
            <td class="py-4 px-6 text-xs text-slate-400">{{ new Date(item.createdAt).toLocaleString() }}</td>
            <td class="py-4 px-6 text-right space-x-2">
              <button
                  @click="updateStatus(item.id, 'resolved')"
                  class="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-md hover:bg-emerald-600/30 transition"
              >
                Resolve
              </button>
              <button
                  @click="deleteMessage(item.id)"
                  class="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-md hover:bg-red-600/30 transition"
              >
                Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const messages = ref([])
const loading = ref(false)

const fetchMessages = async () => {
  loading.value = true
  try {
    // 对接后端获取留言列表的接口
    const res = await $fetch('/api/messages').catch(() => [])
    messages.value = Array.isArray(res) ? res : (res.data || [])
  } catch (err) {
    console.error('Failed to fetch messages:', err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status) => {
  try {
    await $fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      body: { status }
    })
    fetchMessages()
  } catch (err) {
    alert('Failed to update status.')
  }
}

const deleteMessage = async (id) => {
  if (!confirm('Are you sure you want to delete this message?')) return
  try {
    await $fetch(`/api/messages/${id}`, {
      method: 'DELETE'
    })
    fetchMessages()
  } catch (err) {
    alert('Failed to delete message.')
  }
}

onMounted(() => {
  fetchMessages()
})
</script>