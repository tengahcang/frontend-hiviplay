<template>
  <div class="h-dvh flex flex-col bg-gray-100">

    <!-- Toast Expired -->
    <div
      v-if="showExpiredToast"
      class="fixed top-6 left-1/2 transform -translate-x-1/2
            bg-white border border-red-200 text-red-600
            px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-50"
    >
      <!-- Icon -->
      <span class="text-red-500 text-lg">✖</span>

      <!-- Text -->
      <span class="font-medium">The access code has expired</span>
    </div>

    <!-- Header -->
    <header class="bg-white shadow-sm p-4">
      <h1 class="text-3xl font-extrabold text-indigo-900 font-['Nunito']">HiviPlay</h1>
    </header>

    <!-- Main Section -->
    <main class="flex flex-1 items-start md:items-center justify-center px-6">

      <div class="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center justify-items-center">

        <!-- Illustration (desktop only) -->
        <img
          src="/register-img.png"
          alt="Football illustration"
          class="max-w-full md:w-[600px]"
        />



        <!-- Login Card -->
        <div
          class="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-4 mt-6
                md:mx-0 md:mt-0 md:rounded-2xl md:translate-x-10"
        >

          <form @submit.prevent="requestOtp" class="space-y-6">

            <!-- Access Code -->
            <div>
              <label class="block text-gray-700 font-bold mb-2">Access Code</label>
              <input
                v-model="accessCode"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-gray-700 font-bold mb-2">Phone Number</label>

              <div class="flex items-center">
                <span class="text-lg font-medium text-gray-700 mr-2">+62</span>
                <input
                  v-model="phone"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  @input="validateNumber"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <p class="text-sm italic mt-2 ml-10 text-gray-400">
                Contoh : 81234567890
              </p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#1B00FF] hover:bg-[#1600CC] text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
            >
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

// STATE
const accessCode = ref('')
const phone = ref('') // Hanya sisa nomor tanpa '+62'
const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

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

// Menggantikan handleSubmit
const requestOtp = async () => {
    // 1. Validasi
    if (!accessCode.value || !phone.value) {
        message.value = 'Access Code dan Nomor WhatsApp harus diisi.';
        isSuccess.value = false;
        return;
    }

    loading.value = true;
    message.value = '';

    // Gabungkan +62 dengan input phone user
    const fullWaNumber = `+62${phone.value}`;

    try {
        const response = await axios.post(requestOtpUrl, {
            access_code: accessCode.value,
            phone_number: fullWaNumber, // Kirim format lengkap (+628xxxx)
        });

        // 2. Sukses API: Simpan Access Code dan Redirect
        message.value = response.data.detail;
        isSuccess.value = true;

        // 🚨 SIMPAN ACCESS CODE di Local Storage agar bisa dipakai di halaman OTP
        localStorage.setItem('accessCode', accessCode.value);
        localStorage.setItem('phoneNumber', fullWaNumber);

        // Redirect ke halaman OTP verification
        setTimeout(() => {
            router.push({
                path: '/login/code',
                query: { code: accessCode.value } // Kirim juga via query params
            });
        }, 1000); // Delay 1 detik untuk user membaca pesan sukses

    } catch (err) {
    message.value = err.response?.data?.detail || 'Gagal terhubung ke server. Cek koneksi Anda.';
    isSuccess.value = false;

    if (message.value === "The access code has expired") {
        showExpiredToast.value = true;

        // Auto hide setelah 3 detik
        setTimeout(() => {
            showExpiredToast.value = false;
        }, 3000);
    }
    } finally {
            loading.value = false;
        }
}

</script>
