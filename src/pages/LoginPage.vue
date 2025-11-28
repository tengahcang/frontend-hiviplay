<template>
  <div class="min-h-screen grid md:grid-cols-[0.8fr_1.2fr] bg-white dark:bg-[#151521] transition-colors duration-300">
    <!-- LEFT SECTION (FORM) -->
    <div class="flex flex-col justify-start items-center bg-[#f2f6ff] dark:bg-[#1E1E2D] px-8 w-full transition-colors duration-300">
      <div class="w-full max-w-sm flex flex-col items-center mt-20 md:mt-24">
        <h1 class="ttext-5xl md:text-6xl font-bold text-[#28A428] dark:text-[#92cd2d] mb-2 font-['Nunito']">
          HiviPlay
        </h1>
        <p class="text-base md:text-lg font-bold text-[#28A428] dark:text-[#92cd2d] mb-6 font-['Nunito']">
          Admin Page
        </p>
        <!-- TOGGLE THEME -->
        <div class="flex items-center gap-3 mb-6">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-[#2A2A40] p-2 rounded-lg">
            <!-- SUN ICON -->
            <i class="fa-solid fa-sun text-sm transition-colors duration-300" :class="!isDark ? 'text-yellow-500' : 'text-gray-400'"></i>
            <!-- TOGGLE BUTTON -->
            <button @click="toggleDarkMode" class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none" :class="isDark ? 'bg-[#92cd2d]' : 'bg-gray-300'">
              <div class="absolute top-1 left-1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300" :class="isDark ? 'translate-x-5 bg-[#151521]' : 'translate-x-0 bg-white'"></div>
            </button>
            <!-- MOON ICON -->
            <i class="fa-solid fa-moon text-sm transition-colors duration-300" :class="isDark ? 'text-[#435EBE]' : 'text-gray-400'"></i>
          </div>
        </div>
        <!-- ERROR BANNER -->
        <div v-if="error" class="bbg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4 w-full max-w-sm" role="alert">
          {{ error }}
        </div>
        <!-- LOGIN FORM -->
        <form @submit.prevent="handleLogin" class="w-full max-w-sm">
          <!-- USERNAME -->
          <div class="mb-4">
            <div class="flex items-center border rounded-lg border-[#ADB5C3] dark:border-[#333547] px-3 py-2 bg-white dark:bg-[#2A2A40] shadow-sm">
              <i class="fa fa-user text-gray-400 dark:text-gray-300 mr-2"></i>
              <input type="text" placeholder="Username" class="w-full bg-transparent text-black dark:text-white focus:outline-none" v-model="username" required />
            </div>
          </div>
          <!-- PASSWORD -->
          <div class="mb-6">
            <div class="flex items-center border rounded-lg border-[#ADB5C3] dark:border-[#333547] px-3 py-2 bg-white dark:bg-[#2A2A40] shadow-sm">
              <i class="fa fa-lock text-gray-400 dark:text-gray-300 mr-2"></i>
              <input type="password" placeholder="Password" class="w-full bg-transparent text-black dark:text-white focus:outline-none" v-model="password" required />
            </div>
          </div>
          <!-- BUTTON -->
          <button type="submit" class="w-full bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] text-white  dark:text-[#2A2A40] font-semibold py-2 rounded-lg hover:bg-[#3950A2] transition shadow-sm" :disabled="loading">
            {{ loading ? "Authenticating..." : "Log In" }}
          </button>
        </form>
      </div>
    </div>
    <!-- RIGHT SECTION (IMAGE) — disembunyikan di mobile -->
    <div class="hidden md:block bg-cover bg-center" :style="{ backgroundImage: 'url(/padel-court.png)' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"; // ⬅️ Import Axios
const router = useRouter();
// 1. Data State
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const loginUrl = 'https://hiviplay.mbs-group.co.id/api/api-token-auth/';
const isDark = ref(false);
// Toggle theme
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
});
// 2. Logic Login
const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(loginUrl, {
      username: username.value,
      password: password.value
    });
    const token = response.data.token;
    // const userId = response.data.user_id;
    // Simpan Token di Local Storage
    localStorage.setItem('userToken', token);
    // localStorage.setItem('userId', userId);
    // Arahkan ke halaman admin/orders setelah sukses
    router.push({ name: 'orders' });
  } catch (err) {
    console.error("Login Error:", err);
    // Menangani error dari Django (misalnya 400 Bad Request)
    if (err.response && err.response.data.non_field_errors) {
      error.value = err.response.data.non_field_errors[0];
    } else {
      error.value = 'Login failed. Check username and password or network connection.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
