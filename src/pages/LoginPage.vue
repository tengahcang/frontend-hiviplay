<template>
  <div class="min-h-screen grid md:grid-cols-[0.8fr_1.2fr] bg-white">

    <!-- LEFT SECTION (FORM) -->
    <div class="flex flex-col justify-start items-center bg-[#f2f6ff] px-8 w-full">
      <div class="w-full max-w-sm flex flex-col items-center mt-20 md:mt-24">
        <h1 class="text-5xl md:text-6xl font-bold text-[#25396F] mb-2 font-['Nunito']">
          HiviPlay
        </h1>
        <p class="text-base md:text-lg font-bold text-[#25396F] mb-6 font-['Nunito']">
          Admin Page
        </p>

        <!-- ERROR BANNER -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-sm"
          role="alert"
        >
          {{ error }}
        </div>

        <!-- LOGIN FORM -->
        <form @submit.prevent="handleLogin" class="w-full max-w-sm">

          <!-- USERNAME -->
          <div class="mb-4">
            <div class="flex items-center border rounded-lg border-[#ADB5C3] px-3 py-2 bg-white shadow-sm">
              <i class="fa fa-user text-gray-400 mr-2"></i>
              <input
                type="text"
                placeholder="Username"
                class="w-full focus:outline-none"
                v-model="username"
                required
              />
            </div>
          </div>

          <!-- PASSWORD -->
          <div class="mb-6">
            <div class="flex items-center border rounded-lg border-[#ADB5C3] px-3 py-2 bg-white shadow-sm">
              <i class="fa fa-lock text-gray-400 mr-2"></i>
              <input
                type="password"
                placeholder="Password"
                class="w-full focus:outline-none"
                v-model="password"
                required
              />
            </div>
          </div>

          <!-- BUTTON -->
          <button
            type="submit"
            class="w-full bg-[#435EBE] text-white font-semibold py-2 rounded-lg hover:bg-[#3950A2] transition shadow-sm"
            :disabled="loading"
          >
            {{ loading ? "Authenticating..." : "Log In" }}
          </button>
        </form>
      </div>
    </div>

    <!-- RIGHT SECTION (IMAGE) — disembunyikan di mobile -->
    <div
      class="hidden md:block bg-cover bg-center"
      :style="{ backgroundImage: 'url(/padel-court.png)' }"
    ></div>
  </div>


</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"; // ⬅️ Import Axios

const router = useRouter();

// 1. Data State
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const loginUrl = 'http://127.0.0.1:8000/api-token-auth/'; // ⬅️ Sesuaikan URL API Django Anda

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

// Fungsi goToAdmin (yang asli) dihapus dan diganti dengan handleLogin
</script>
