<template>
  <div class="flex bg-white dark:bg-[#151521] transition-colors duration-300">
    <aside class="sidebar-base bg-white dark:bg-[#1E1E2D] dark:text-white transition-colors duration-300" :class="sidebarOpen ? 'sidebar-open' : 'sidebar-closed'">
      <div>
        <!-- HEADER -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-[32px] font-bold text-[#28A428] dark:text-[#92cd2d] font-['Nunito']">HiviPlay</h1>
          <button class="md:hidden p-2" @click="closeSidebar">
            <i class="fa-solid fa-xmark text-2xl text-[#435EBE] dark:text-white"></i>
          </button>
        </div>
        <!-- THEME SWITCHER (diambil dari Kode 1) -->
        <div class="flex items-center gap-3 mb-8">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-[#2A2A40] p-2 rounded-lg">
            <i class="fa-solid fa-sun text-sm transition-colors duration-300" :class="!isDark ? 'text-yellow-500' : 'text-gray-400'"></i>
            <button @click="toggleDarkMode" class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none" :class="isDark ? 'bg-[#92cd2d]' : 'bg-gray-300'">
              <div class="absolute top-1 left-1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300" :class="isDark ? 'translate-x-5 bg-[#151521]' : 'translate-x-0 bg-white'"></div>
            </button>
            <i class="fa-solid fa-moon text-sm transition-colors duration-300" :class="isDark ? 'text-[#435EBE]' : 'text-gray-400'"></i>
          </div>
        </div>
        <!-- NAV -->
        <nav class="space-y-2">
          <router-link to="/admin/orders" class="flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-white dark:text-[#2A2A40] bg-[#28A428] dark:bg-[#92cd2d]" @click="closeSidebar">
            <i class="fa-regular fa-file-lines text-xl"></i>
            Order
          </router-link>

          <router-link to="/admin/login" class="flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-[#25396F] dark:text-[#C6D2F0] hover:bg-[#F2F2F2] dark:hover:bg-[#1F2733]" @click="handleLogout">
            <i class="fa-solid fa-right-from-bracket text-xl text-[#7C8DB5]"></i>
            Logout
          </router-link>
        </nav>
      </div>
    </aside>
    <main class="w-full bg-[#F2F7FF] dark:bg-[#151521] min-h-screen pt-6 px-4 sm:p-4 md:p-8 max-w-[430px] md:max-w-[1748.85px] mx-auto text-black dark:text-white transition-colors duration-300">
      <!-- HAMBURGER -->
      <button class="md:hidden mb-4 mt-4" @click="toggleSidebar">
        <i class="fa-solid fa-bars text-2xl text-[#435EBE] dark:text-white"></i>
      </button>
      <router-view />
      <footer class="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">
        2025 © On Repeat — Developed by
        <a href="https://mbscctv.com/" target="_blank" class="text-[#28A428] dark:text-[#92cd2d] font-medium">PT. Media
          Bersama Sukses</a>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const sidebarOpen = ref(false);
const isDark = ref(false);
const router = useRouter();
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
const closeSidebar = () => {
  sidebarOpen.value = false;
};
const handleLogout = () => {
  localStorage.removeItem("userToken");
};
/* -------------------- DARK MODE -------------------- */
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
</script>
<style>
.sidebar-base {
  width: 260px;
  min-height: 100vh;
  /* Tambahkan ini */
  height: 100vh;
  padding: 1.5rem;
  position: static;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
  z-index: 50;
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar-base {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }
}
</style>
