<template>
  <div class="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
    <header class="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo 区域 -->
        <NuxtLink to="/" class="flex items-center space-x-3 shrink-0">
          <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-600/30">V</div>
          <div class="hidden sm:block">
            <span class="text-lg font-bold tracking-tight text-white block">Vanguard E&R Solutions</span>
            <span class="text-xs text-blue-400 font-medium">Environmental & Reliability Consulting</span>
          </div>
          <span class="text-sm font-bold text-white sm:hidden">Vanguard E&R</span>
        </NuxtLink>

        <!-- 桌面端导航链接 -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
          <NuxtLink to="/" class="hover:text-blue-400 transition">Home</NuxtLink>
          <NuxtLink to="/services" class="hover:text-blue-400 transition">Services</NuxtLink>
          <NuxtLink to="/about" class="hover:text-blue-400 transition">About Us</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-blue-400 transition">Contact</NuxtLink>
        </nav>

        <!-- 桌面端右侧用户状态 / 下拉菜单 -->
        <div class="hidden md:flex items-center space-x-4 relative">
          <div v-if="isLoggedIn" ref="userMenuRef" class="relative">
            <!-- 下拉触发按钮：显示用户名 (DisplayName) -->
            <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg hover:border-slate-700 transition focus:outline-none"
            >
              <span>{{ userDisplayName }}</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- 下拉菜单面板 -->
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-xl py-2 z-50">
              <div class="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 truncate">
                Signed in as <span class="font-medium text-white">{{ userEmail }}</span>
              </div>
              <NuxtLink
                  to="/profile"
                  @click="dropdownOpen = false"
                  class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Profile
              </NuxtLink>
              <NuxtLink
                  to="/change-password"
                  @click="dropdownOpen = false"
                  class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Change Password
              </NuxtLink>
              <div class="border-t border-slate-800 my-1"></div>
              <button
                  @click="logout(); dropdownOpen = false"
                  class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-900 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div v-else class="flex items-center space-x-3">
            <NuxtLink to="/login" class="text-sm text-slate-300 hover:text-white transition">Login</NuxtLink>
            <NuxtLink to="/register" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-600/20 transition">
              Register
            </NuxtLink>
          </div>
        </div>

        <!-- 手机端：汉堡菜单按钮 -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-slate-300 hover:text-white focus:outline-none p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 手机端折叠菜单 -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-xl">
        <nav class="flex flex-col space-y-3 text-base font-medium">
          <NuxtLink @click="mobileMenuOpen = false" to="/" class="hover:text-blue-400 transition py-1">Home</NuxtLink>
          <NuxtLink @click="mobileMenuOpen = false" to="/services" class="hover:text-blue-400 transition py-1">Services</NuxtLink>
          <NuxtLink @click="mobileMenuOpen = false" to="/about" class="hover:text-blue-400 transition py-1">About Us</NuxtLink>
          <NuxtLink @click="mobileMenuOpen = false" to="/contact" class="hover:text-blue-400 transition py-1">Contact</NuxtLink>
        </nav>

        <div class="pt-4 border-t border-slate-800 flex flex-col space-y-3">
          <div v-if="isLoggedIn" class="space-y-2">
            <span class="text-xs text-slate-400 block truncate">Signed in as <span class="text-white">{{ userEmail }}</span></span>
            <NuxtLink @click="mobileMenuOpen = false" to="/profile" class="block py-1.5 text-sm text-slate-300 hover:text-white transition">Profile</NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/change-password" class="block py-1.5 text-sm text-slate-300 hover:text-white transition">Change Password</NuxtLink>
            <button @click="logout(); mobileMenuOpen = false" class="w-full text-left py-1.5 text-sm text-red-400 transition">Logout</button>
          </div>
          <div v-else class="flex flex-col space-y-2">
            <NuxtLink @click="mobileMenuOpen = false" to="/login" class="w-full text-center py-2 text-sm text-slate-300 hover:text-white border border-slate-700 rounded-lg transition">Login</NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/register" class="w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold shadow-md transition">Register</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <footer class="bg-slate-950 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        <p>&copy; 2026 Vanguard Environmental and Reliability Solutions, LLC. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const userEmail = ref('')
const userDisplayName = ref('')
const mobileMenuOpen = ref(false)
const dropdownOpen = ref(false)
const userMenuRef = ref(null)

const updateAuth = () => {
  if (import.meta.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      isLoggedIn.value = true
      userEmail.value = localStorage.getItem('user_email') || ''
      const storedName = localStorage.getItem('user_name')
      userDisplayName.value = storedName || userEmail.value.split('@')[0] || 'User'
    } else {
      isLoggedIn.value = false
      userEmail.value = ''
      userDisplayName.value = ''
    }
  }
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  updateAuth()
  window.addEventListener('auth-changed', updateAuth)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', updateAuth)
  document.removeEventListener('click', handleClickOutside)
})

const logout = () => {
  if (import.meta.client) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_phone')
  }
  isLoggedIn.value = false
  userEmail.value = ''
  userDisplayName.value = ''
  window.dispatchEvent(new Event('auth-changed'))
  router.push('/login')
}
</script>