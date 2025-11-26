<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Order</h1>

    <div class="bg-white shadow-md rounded-xl overflow-hidden p-6">
      <h2 class="text-2xl font-medium text-gray-800 mb-6">Add Order</h2>

      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- ORDER NUMBER -->
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="md:w-40 text-gray-600">Order Number</label>
            <input
              v-model="order.order_number"
              type="text"
              class="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
              placeholder="Enter order number"
              required
            />
          </div>

          <!-- NAME -->
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="md:w-40 text-gray-600">Name</label>
            <input
              v-model="order.name"
              type="text"
              class="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
              placeholder="Enter client name"
              required
            />
          </div>

          <!-- FIELD -->
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="md:w-40 text-gray-600">Field</label>
            <select
              v-model="order.field"
              class="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm max-w-full"
              required
            >
              <option disabled value="">Select field</option>
              <option value="1">Padel 1</option>
            </select>
          </div>

          <!-- DATE -->
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="md:w-40 text-gray-600">Date</label>
            <input
              ref="datePicker"
              v-model="order.date"
              type="text"
              placeholder="Date"
              class="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <!-- TIME START -->
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="md:w-40 text-gray-600">Time Start</label>
            <input
              ref="timeStartPicker"
              v-model="order.time_start"
              type="text" placeholder="Time Start"
              class="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <!-- TIME END -->
          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="md:w-40 text-gray-600">Time End</label>
            <input
              ref="timeEndPicker"
              v-model="order.time_end"
              type="text" placeholder="Time End"
              class="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <!-- BUTTONS -->
          <div class="flex justify-end gap-3 pt-6">
            <button
              type="submit"
              :disabled="loading"
              class="bg-[#435EBE] hover:bg-[#3950A2] text-white px-5 py-2 rounded-md transition disabled:opacity-50"
            >
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>

            <button
              type="button"
              @click="goBack"
              class="bg-[#E6EAEE] hover:bg-[#D0D6DB] text-gray-800 px-5 py-2 rounded-md transition"
            >
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
const apiUrl = 'http://101.50.3.105/api/core/registrations/'

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
</style>
