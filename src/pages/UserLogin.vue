<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <div v-if="showExpiredToast" class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900 text-red-600 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-50">
      <span class="text-red-500 text-lg">✖</span>
      <span class="font-medium dark:text-red-400">The access code has expired</span>
    </div>
    <div v-if="showToastIsNotRegistered" class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900 text-red-600 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-50">
      <span class="text-red-500 text-lg">✖</span>
      <span class="font-medium dark:text-red-400">Access code not registered</span>
    </div>
    <header class="bg-white dark:bg-gray-800 shadow-sm p-4 transition-colors">
      <h1 class="text-3xl font-bold text-[#28A428] dark:text-[#92cd2d] font-['Nunito']">HiviPlay</h1>
      <div class="absolute top-4 right-4 z-50">
        <button @click="toggleDarkMode" class="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
          <i class="fa-solid" :class="isDark ? 'fa-moon text-[#435EBE]' : 'fa-sun text-yellow-500'"></i>
        </button>
      </div>
    </header>
    <main class="flex flex-1 items-start md:items-center justify-center px-6">
      <div class="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center justify-items-center">
        <img src="/register-img.png" alt="Football illustration" class="max-w-full md:w-[600px] hidden md:block" />
        <div class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-md mx-auto mt-4 md:mt-0 transition-colors">
          <form @submit.prevent="requestOtp" class="space-y-6">
            <div>
              <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Access Code</label>
              <input v-model="accessCode" type="text" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors" required />
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Phone Number</label>
              <div class="flex items-center">
                <span class="text-lg font-medium text-gray-700 dark:text-gray-300 mr-2">+62</span>
                <input v-model="phone" type="tel" inputmode="numeric" pattern="[0-9]*" @input="validateNumber" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors" required />
              </div>
              <p class="text-sm italic mt-2 ml-10 text-gray-400 dark:text-gray-500">
                Contoh : 81234567890
              </p>
            </div>
            <button type="submit" :disabled="loading" class="w-full bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] text-white  dark:text-[#2A2A40] font-semibold py-2 rounded-md transition disabled:opacity-50">
              {{ loading ? 'Mengirim OTP...' : 'Submit' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
const router = useRouter()
const route = useRoute()
// --- STATE ---
const accessCode = ref('')
const phone = ref('')
const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)
// 1. DEFINISIKAN VARIABLE INI (yang sebelumnya error missing)
const showExpiredToast = ref(false)
const showToastIsNotRegistered = ref(false)
const isDark = ref(false)
onMounted(() => {
  // Auto-fill Access Code from URL query
  if (route.query.access_code) {
    accessCode.value = route.query.access_code.toUpperCase()
  }
})
// ENDPOINT DJANGO
const requestOtpUrl = 'https://hiviplay.mbs-group.co.id/api/accounts/request-access/';
const validateNumber = (event) => {
  // Hanya izinkan digit
  const numeric = event.target.value.replace(/\D/g, '')
  phone.value = numeric
}
const requestOtp = async () => {
  // 1. Validasi Input
  if (!accessCode.value || !phone.value) {
    message.value = 'Access Code dan Nomor WhatsApp harus diisi.';
    return;
  }
  loading.value = true;
  message.value = '';
  const fullWaNumber = `+62${phone.value}`;
  try {
    const response = await axios.post(requestOtpUrl, {
      access_code: accessCode.value,
      phone_number: fullWaNumber,
    });
    // Jika Sukses (HTTP 200/201)
    message.value = response.data.detail;
    isSuccess.value = true;
    localStorage.setItem('accessCode', accessCode.value);
    localStorage.setItem('phoneNumber', fullWaNumber);
    setTimeout(() => {
      router.push({
        path: '/login/code',
        query: { code: accessCode.value }
      });
    }, 1000);

  } catch (err) {
    // 2. TANGKAP ERROR DI SINI (Karena backend return 400)
    console.log("Error Response:", err.response); // Debugging
    const errorDetail = err.response?.data?.detail;
    // Cek spesifik pesan expired dari backend
    if (errorDetail === "Access code expired.") {
      showExpiredToast.value = true; // Munculkan Toast
      // Sembunyikan Toast setelah 3 detik
      setTimeout(() => {
        showExpiredToast.value = false;
      }, 3000);
    } if (errorDetail === "Invalid access code.") {
      showToastIsNotRegistered.value = true; // Munculkan Toast
      // Sembunyikan Toast setelah 3 detik
      setTimeout(() => {
        showToastIsNotRegistered.value = false;
      }, 3000);
    } else {
      // Error lainnya (misal: Code not found, Network Error)
      message.value = errorDetail || 'Gagal terhubung ke server.';
      isSuccess.value = false;
    }
  } finally {
    loading.value = false;
  }
}
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light')
  }
}
onMounted(() => {
  if (route.query.access_code) accessCode.value = route.query.access_code.toUpperCase()
  // Cek theme...
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true; document.documentElement.classList.add('dark')
  }
})
</script>
