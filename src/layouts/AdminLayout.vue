<template>
  <div class="flex bg-white">

    <aside
      class="sidebar-base"
      :class="sidebarOpen ? 'sidebar-open' : 'sidebar-closed'"
    >
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-[32px] font-bold text-[#435EBE] font-['Nunito']">HiviPlay</h1>

          <button
            class="md:hidden p-2"
            @click="closeSidebar"
          >
            <i class="fa-solid fa-xmark text-2xl text-[#435EBE]"></i>
          </button>
        </div>

        <!-- NAV -->
        <nav class="space-y-2">
          <router-link
            to="/admin/orders"
            class="flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-white bg-[#435EBE]"
            @click="closeSidebar"
          >
            <i class="fa-regular fa-file-lines text-xl"></i>
            Order
          </router-link>

          <router-link
            to="/admin/login"
            class="flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-[#25396F] hover:bg-[#F2F2F2]"
            @click="handleLogout"
          >
            <i class="fa-solid fa-right-from-bracket text-xl text-[#7C8DB5]"></i>
            Logout
          </router-link>
        </nav>
      </div>
    </aside>

    <main class="w-full bg-[#F2F7FF] min-h-screen pt-6 px-4 sm:p-4 md:p-8 max-w-[430px] md:max-w-[1748.85px] mx-auto">

      <!-- HAMBURGER (mobile only) -->
      <button
        class="md:hidden mb-4 mt-4"
        @click="toggleSidebar"
      >
        <i class="fa-solid fa-bars text-2xl text-[#435EBE]"></i>
      </button>
      <router-view />

      <footer class="text-sm text-gray-500 text-center mt-10">
        2025 © On Repeat — Developed by
        <a href="#" class="text-blue-600 font-medium">PT. Media Bersama Sukses</a>
      </footer>
    </main>

  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const sidebarOpen = ref(false);
const router = useRouter();

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

/* --- LOGOUT (fungsi sederhana) --- */
const handleLogout = () => {
  localStorage.removeItem("userToken");
};
</script>


<style>
.sidebar-base {
  width: 260px;
  height: 100%;
  background: white;
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

/* Mobile override */
@media (max-width: 768px) {
  .sidebar-base {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%); /* default hidden */
  }

  .sidebar-open {
    transform: translateX(0); /* slide in */
  }

  .sidebar-closed {
    transform: translateX(-100%); /* slide out */
  }
}
</style>
