<template>
  <div class="h-dvh overflow-hidden flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow-sm p-4 transition-colors">
      <h1 class="text-3xl font-bold text-[#28A428] dark:text-[#92cd2d] font-['Nunito']">HiviPlay</h1>
      <div class="absolute top-4 right-4 z-50">
        <button @click="toggleDarkMode" class="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
          <i class="fa-solid" :class="isDark ? 'fa-moon text-[#435EBE]' : 'fa-sun text-yellow-500'"></i>
        </button>
      </div>
    </header>
    <div v-if="showSuccess" class="fixed top-20 left-0 right-0 mx-auto w-fit px-6 py-3 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center gap-2 animate-fade z-[9999]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium text-gray-700 dark:text-gray-200">Verification successful</span>
    </div>
    <main class="grow flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 shadow-[0_0_5px_rgba(0,0,0,0.25)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-xl p-10 w-full max-w-md text-center transition-colors">
        <h1 class="text-[32px] font-bold text-[#28A428] dark:text-[#92cd2d] mb-8 font-['Open Sans']">OTP verification</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 font-['Open Sans']">
          Please enter the OTP sent to your registered phone number.
        </p>
        <div class="flex justify-center gap-3 mb-6">
          <input v-for="(digit, index) in otp" :key="index" type="tel" maxlength="1" v-model="otp[index]" @input="handleInput($event, index)" @keydown.backspace="handleBackspace($event, index)" @paste.prevent="handlePaste($event)" class="w-10 h-10 md:w-12 md:h-12 border border-gray-300 dark:border-gray-600 rounded-md text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white transition-colors" :ref="el => inputRefs[index] = el" />
        </div>
        <p v-if="errorMessage" class="text-red-500 dark:text-red-400 text-sm mb-4">
          {{ errorMessage }}
        </p>
        <div class="flex flex-col gap-3">
          <button @click="verifyOtp" :disabled="loading" class="bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] text-white  dark:text-[#2A2A40] font-medium py-2 rounded-md transition disabled:opacity-50">
            {{ loading ? 'Verifying...' : 'Verify' }}
          </button>
          <button @click="cancel" class="border border-[#28A428] text-[#28A428] dark:border-[#92CD2D] dark:[#92CD2D] dark:text-[#92CD2D] font-medium py-2 rounded-md hover:bg-[#28A428]/10 dark:hover:bg-[#92CD2D]/10 transition">
            Cancel
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from 'axios';
const router = useRouter();
const route = useRoute();
const otp = ref(["", "", "", "", "", ""]);
const errorMessage = ref("");
const loading = ref(false);
const accessCode = ref(null);
const phoneNumber = ref(null);
const inputRefs = ref([]);
const showSuccess = ref(false);
const isDark = ref(false)
const verifyOtpUrl = 'https://hiviplay.mbs-group.co.id/api/accounts/verify-otp/';
// --- TAMBAHAN LOGIC DARK MODE ---
onMounted(() => {
  // Cek Theme saat halaman dimuat (agar konsisten dengan halaman login sebelumnya)
  if (localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // ... Logic Existing Anda ...
  const code = route.query.code || localStorage.getItem('accessCode');
  if (code) {
    accessCode.value = code;
  }
  const phone = localStorage.getItem('phoneNumber');
  if (phone) {
    phoneNumber.value = phone;
  } else {
    errorMessage.value = "Sesi verifikasi habis atau Nomor Telepon hilang. Silakan ulangi proses.";
    setTimeout(() => {
      router.push({ name: 'user-login' });
    }, 2000);
  }
});
// --------------------------------
const handleInput = (event, index) => {
  const value = event.target.value;
  if (!/^[0-9]$/.test(value)) {
    otp.value[index] = "";
    return;
  }
  if (index < otp.value.length - 1 && value) {
    inputRefs.value[index + 1]?.focus();
  }
};
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light')
  }
}

const handleBackspace = (event, index) => {
  if (event.key === "Backspace" && !otp.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
};

const verifyOtp = async () => {
  const otpValue = otp.value.join("");
  errorMessage.value = "";

  if (!phoneNumber.value) {
    errorMessage.value = "Error: Nomor telepon tidak ditemukan. Harap kembali ke halaman login.";
    return;
  }
  if (otpValue.length < 6) {
    errorMessage.value = "Please enter a complete 6-digit OTP";
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post(verifyOtpUrl, {
      phone_number: phoneNumber.value,
      otp_code: otpValue,
    });
    const token = response.data.token;
    const registrationId = response.data.registration_id;
    const customerName = response.data.court.customer_name;
    localStorage.setItem('userToken', token);
    localStorage.setItem('registrationId', registrationId);
    localStorage.setItem('customerName', customerName);
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
      router.push({
        name: 'user-video',
        params: { id: registrationId }
      });
    }, 1800);
  } catch (err) {
    console.error("OTP Verification Error:", err.response || err);
    errorMessage.value = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Verifikasi gagal. Cek kode OTP atau coba lagi.';
    otp.value = ["", "", "", "", "", ""];
    inputRefs.value[0]?.focus();
  } finally {
    loading.value = false;
  }
};
const cancel = () => {
  otp.value = ["", "", "", "", "", ""];
  errorMessage.value = "";
  localStorage.removeItem('accessCode');
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('userToken');
  localStorage.removeItem('registrationId');
  router.push({ name: 'user-login' });
};
const handlePaste = (event) => {
  const pastedData = event.clipboardData.getData('text');
  const digits = pastedData.replace(/\D/g, '').slice(0, otp.value.length);
  if (!digits) {
    return;
  }
  for (let i = 0; i < digits.length; i++) {
    otp.value[i] = digits[i];
  }
  const lastFilledIndex = Math.min(digits.length - 1, otp.value.length - 1);
  inputRefs.value[lastFilledIndex]?.focus();
};
</script>
<style scoped>
input:focus {
  /* Pastikan ring focus juga terlihat bagus di dark mode, default blue biasanya aman */
  box-shadow: 0 0 0 2px #2563eb44;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  15% {
    opacity: 1;
    transform: translateY(0);
  }

  85% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-fade {
  animation: fadeInOut 1.8s ease-in-out forwards;
}
</style>
