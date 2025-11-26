<template>
  <div class="h-dvh overflow-hidden flex flex-col bg-gray-100">
    <header class="bg-white shadow-sm p-4">
      <h1 class="text-3xl font-extrabold text-[#1F2A56] font-['Nunito']">HiviPlay</h1>
    </header>

    <div
      v-if="showSuccess"
      class="fixed top-20 left-0 right-0 mx-auto w-fit px-6 py-3 bg-white shadow-lg rounded-full flex items-center gap-2 animate-fade"
      style="z-index: 9999;"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>

      <span class="font-medium text-gray-700">Verification successful</span>
    </div>

    <main class="grow flex items-center justify-center p-4">
       <div class="bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-xl p-10 w-full max-w-md text-center">
        <h1 class="text-[32px] font-bold text-[#1F2A56] mb-8">OTP verification</h1>
        <p class="text-sm text-gray-500 mb-6">
          Please enter the OTP sent to your registered phone number.
        </p>

        <div class="flex justify-center gap-3 mb-6">
          <input
            v-for="(digit, index) in otp"
            :key="index"
            type="tel"
            maxlength="1"
            v-model="otp[index]"
            @input="handleInput($event, index)"
            @keydown.backspace="handleBackspace($event, index)"
            @paste.prevent="handlePaste($event)"
            class="w-10 h-10 md:w-12 md:h-12 border border-gray-300 rounded-md text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
           :ref="el => inputRefs[index] = el"

            />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </p>

        <div class="flex flex-col gap-3">
          <button @click="verifyOtp" :disabled="loading"
            class="bg-[#435EBE] text-white font-medium py-2 rounded-md hover:bg-[#3950A2] transition disabled:opacity-50">
            {{ loading ? 'Verifying...' : 'Verify' }}
          </button>
          <button @click="cancel"
            class="border border-[#435EBE] text-[#435EBE] font-medium py-2 rounded-md hover:bg-[#435EBE]/10 transition">
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
const phoneNumber = ref(null); // ⬅️ DITAMBAHKAN: State untuk nomor telepon
const inputRefs = ref([]); // Untuk manajemen fokus input
const showSuccess = ref(false);

// ENDPOINT
const verifyOtpUrl = 'http://101.50.3.105/api/accounts/verify-otp/';

// ----------------------------------------------------------------------
// LOGIC PENTING: Mengambil data saat komponen dimuat
onMounted(() => {
  // 1. Ambil Access Code (jika diperlukan untuk proses API)
  const code = route.query.code || localStorage.getItem('accessCode');
  if (code) {
    accessCode.value = code;
  }

  // 2. Ambil Nomor Telepon (PENTING untuk dikirim ke API)
  const phone = localStorage.getItem('phoneNumber'); // ⬅️ Mengambil dari localStorage
  if (phone) {
    phoneNumber.value = phone;
  } else {
    // Jika nomor telepon tidak ada, anggap sesi tidak valid
    errorMessage.value = "Sesi verifikasi habis atau Nomor Telepon hilang. Silakan ulangi proses.";
    setTimeout(() => {
      router.push({ name: 'user-login' });
    }, 2000);
  }
});
// ----------------------------------------------------------------------


const handleInput = (event, index) => {
  const value = event.target.value;
  if (!/^[0-9]$/.test(value)) {
    otp.value[index] = "";
    return;
  }
  // Pindah fokus ke input berikutnya
  if (index < otp.value.length - 1 && value) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handleBackspace = (event, index) => {
  if (event.key === "Backspace" && !otp.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
};

// ----------------------------------------------------------------------
// MODIFIKASI: INTEGRASI API VERIFY OTP
const verifyOtp = async () => {
  const otpValue = otp.value.join("");
  errorMessage.value = "";

  // Validasi Nomor Telepon
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

    // 🚨 MODIFIKASI INI: Ambil dan Simpan Data Kunci dari Respons
    const token = response.data.token;
    const registrationId = response.data.registration_id;
    const customerName = response.data.court.customer_name;

    localStorage.setItem('userToken', token);
    localStorage.setItem('registrationId', registrationId);
    localStorage.setItem('customerName', customerName);

    // 3. Bersihkan data sementara (phone number dan access code)
    // localStorage.removeItem('accessCode');
    // localStorage.removeItem('phoneNumber');

    showSuccess.value = true;


    setTimeout(() => {
      showSuccess.value = false;

      router.push({
        name: 'user-video',
        params: { id: registrationId }
      });
    }, 1800);

  } catch (err) {
    // Gagal: Tampilkan error dari Django
    console.error("OTP Verification Error:", err.response || err);
    errorMessage.value = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Verifikasi gagal. Cek kode OTP atau coba lagi.';

    // Bersihkan OTP input dan fokuskan kembali
    otp.value = ["", "", "", "", "", ""];
    inputRefs.value[0]?.focus();

  } finally {
    loading.value = false;
  }
};
// ----------------------------------------------------------------------


const cancel = () => {
  otp.value = ["", "", "", "", "", ""];
  errorMessage.value = "";
  localStorage.removeItem('accessCode');
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('userToken'); // Opsional, jika token sempat disimpan sebelumnya
  localStorage.removeItem('registrationId'); // Hapus data sementara

  // Navigasi ke halaman utama login
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

  // Pindahkan fokus ke input terakhir yang terisi
  const lastFilledIndex = Math.min(digits.length - 1, otp.value.length - 1);
  inputRefs.value[lastFilledIndex]?.focus();
};

</script>

<style scoped>
input:focus {
  box-shadow: 0 0 0 2px #2563eb44;
}
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

.animate-fade {
  animation: fadeInOut 1.8s ease-in-out forwards;
}

</style>
