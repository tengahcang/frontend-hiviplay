<template>
  <div>
    <h1 class="text-2xl font-semibold text-[#1F8220] dark:text-[#C2C2D9] mb-6 transition-colors duration-300">Order</h1>

    <div
      class="bg-white dark:bg-[#1E1E2D] shadow-md dark:shadow-none rounded-xl overflow-hidden p-6 w-full transition-colors duration-300">
      <h2 class="text-2xl font-medium text-gray-800 dark:text-white mb-6 transition-colors duration-300">Add Order</h2>

      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">

        <!-- ORDER NUMBER -->
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="md:w-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">Order Number</label>
          <input v-model="order.order_number" type="text" class="flex-1 border border-gray-200 dark:border-[#333547] bg-white dark:bg-[#2A2A40] text-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435EBE] transition-colors duration-300"
            placeholder="Enter order number" required />
        </div>

        <!-- NAME -->
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="md:w-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">Name</label>
          <input v-model="order.name" type="text" class="flex-1 border border-gray-200 dark:border-[#333547] bg-white dark:bg-[#2A2A40] text-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435EBE] transition-colors duration-300"
            placeholder="Enter client name" required />
        </div>

        <!-- FIELD -->
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="md:w-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">Field</label>
          <select v-model="order.field" class="flex-1 border border-gray-200 dark:border-[#333547]bg-white dark:bg-[#2A2A40] text-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435EBE] transition-colors duration-300" required>
            <option disabled value="">Select field</option>
            <option value="1">Padel 1</option>
          </select>
        </div>

        <!-- DATE -->
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="md:w-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">Date</label>
          <input ref="datePicker" v-model="order.date" type="text" placeholder="Date" class="flex-1 border border-gray-200 dark:border-[#333547] bg-white dark:bg-[#2A2A40] text-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435EBE] transition-colors duration-300" required />
        </div>

        <!-- TIME START -->
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="md:w-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">Time Start</label>
          <input ref="timeStartPicker" v-model="order.time_start" type="text" placeholder="Time Start" class="flex-1 border border-gray-200 dark:border-[#333547] bg-white dark:bg-[#2A2A40] text-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435EBE] transition-colors duration-300" required />
        </div>
        <!-- TIME END -->
        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="md:w-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">Time End</label>
          <input ref="timeEndPicker" v-model="order.time_end" type="text" placeholder="Time End" class="flex-1 border border-gray-200 dark:border-[#333547] bg-white dark:bg-[#2A2A40] text-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#435EBE] transition-colors duration-300" required />
        </div>

        <!-- BUTTONS -->
        <div class="flex justify-end gap-3 pt-6">
          <button type="submit" :disabled="loading" class="bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] text-white  dark:text-[#2A2A40] px-5 py-2 rounded-md transition disabled:opacity-50">
            {{ loading ? 'Submitting...' : 'Submit' }}
          </button>

          <button type="button" @click="goBack" class="bg-[#E6EAEE] hover:bg-[#D0D6DB] text-gray-800 px-5 py-2 rounded-md transition">
            Back
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'


const router = useRouter()
const route = useRoute()
const datePicker = ref(null)
const timeStartPicker = ref(null)
const timeEndPicker = ref(null)

const order = ref({
  name: '',
  order_number: '',
  field: '',
  date: '',
  time_start: '',
  time_end: '',
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const apiUrl = 'https://hiviplay.mbs-group.co.id/api/core/registrations/'

onMounted(() => {
  flatpickr(datePicker.value, {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: (_, dateStr) => (order.value.date = dateStr),
  });

  flatpickr(timeStartPicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    onChange: (_, timeStr) => (order.value.time_start = timeStr),
  });

  flatpickr(timeEndPicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    onChange: (_, timeStr) => (order.value.time_end = timeStr),
  });
});


const handleSubmit = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  if (
    !order.value.date ||
    !order.value.time_start ||
    !order.value.time_end
  ) {
    errorMessage.value = "Data belum terisi lengkap."
    loading.value = false
    return
  }

  const userToken = localStorage.getItem('userToken')

  if (!userToken) {
    errorMessage.value = "Anda tidak terautentikasi. Silakan login ulang."
    loading.value = false
    router.push('/admin/login')
    return
  }

  const dataToSend = {
    customer_name: order.value.name,
    order_number: order.value.order_number,
    field_id: order.value.field,
    date: order.value.date,
    time_start: order.value.time_start,
    time_end: order.value.time_end,
  }

  try {
    const response = await axios.post(apiUrl, dataToSend, {
      headers: { Authorization: `Token ${userToken}` }
    })

    successMessage.value = `Order ${response.data.order_number} berhasil ditambahkan!`

    order.value = {
      name: '',
      order_number: '',
      field: '',
      date: '',
      time_start: '',
      time_end: ''
    }

    setTimeout(() => router.push('/admin/orders'), 1500)

  } catch (err) {
    if (err.response && err.response.status === 400) {
      const errorData = err.response.data
      let text = 'Validasi Gagal: '
      for (const key in errorData) {
        text += `${key}: ${errorData[key].join(' ')} `
      }
      errorMessage.value = text
    } else if (err.response && [401, 403].includes(err.response.status)) {
      errorMessage.value = "Sesi habis atau Token tidak valid. Silakan Login ulang."
      localStorage.removeItem('userToken')
      router.push('/admin/login')
    } else {
      errorMessage.value = 'Gagal menyimpan data ke server.'
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
</script>

<style scoped>
body {
  background-color: #f5f8ff;
}

.dark .flatpickr-calendar {
  background: #1E1E2D !important;
  border: 1px solid #333547 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
}

.dark .flatpickr-day {
  color: #e2e8f0 !important;
}

.dark .flatpickr-day:hover {
  background: #2A2A40 !important;
}

.dark .flatpickr-day.selected {
  background: #435EBE !important;
  border-color: #435EBE !important;
}

.dark .flatpickr-months .flatpickr-month {
  background: #1E1E2D !important;
  color: #fff !important;
}

.dark .flatpickr-weekdays {
  background: #1E1E2D !important;
}

.dark span.flatpickr-weekday {
  color: #cbd5e1 !important;
}

.dark .flatpickr-time {
  background: #1E1E2D !important;
  border-top: 1px solid #333547 !important;
}

.dark .flatpickr-time input {
  color: #fff !important;
}

.dark .flatpickr-time .flatpickr-am-pm {
  color: #fff !important;
}

.dark .flatpickr-time .numInputWrapper span.arrowUp:after {
  border-bottom-color: #fff !important;
}

.dark .flatpickr-time .numInputWrapper span.arrowDown:after {
  border-top-color: #fff !important;
}


/* Default Styles */
.flatpickr-small {
  font-size: 0.875rem;
  height: 2rem;
  line-height: 1.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.flatpickr-calendar {
  font-size: 0.85rem !important;
}
</style>
