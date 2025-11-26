<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Order</h1>

    <div class="bg-white shadow-md rounded-xl overflow-hidden p-6">
      <h2 class="text-2xl font-medium text-gray-800 mb-6">Edit Order: {{ order.order_number }}</h2>

      <div v-if="loading" class="text-blue-500 mb-4">Loading data...</div>
      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleUpdate" v-if="!loading" class="space-y-4">

        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="w-40 text-gray-600 mr-20">Name</label>
          <input
            v-model="order.customer_name"
            type="text"
            class="flex-1 border border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter client name"
            required
          />
        </div>

        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="w-40 text-gray-600 mr-20">Order Number</label>
          <input
            v-model="order.order_number"
            type="text"
            class="flex-1 border border-gray-200 rounded-md px-4 py-2 bg-gray-100 focus:outline-none"
            placeholder="Order number"
            readonly
          />
        </div>

        <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <label class="w-40 text-gray-600 mr-20">Field</label>
          <select
            v-model="order.field.id"
            class="flex-1 border border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option disabled :value="null">Select field</option>
            <option value="1">Padel 1</option>
            </select>
        </div>

          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="w-40 text-gray-600 mr-20">Date</label>
            <input
              ref="datePicker"
              v-model="order.date"
              type="text"
              placeholder="Select date"
              class="flex-1 border border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="w-40 text-gray-600 mr-20">Time Start</label>
            <input
              ref="timeStartPicker"
              v-model="order.time_start"
              type="text"
              placeholder="Select time"
              class="flex-1 border border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div class="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <label class="w-40 text-gray-600 mr-20">Time End</label>
            <input
              ref="timeEndPicker"
              v-model="order.time_end"
              type="text"
              placeholder="Select time"
              class="flex-1 border border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

        <div class="flex justify-end gap-3 pt-6">
          <button
            type="submit"
            :disabled="isUpdating"
            class="bg-[#435EBE] hover:bg-[#3950A2] text-white px-5 py-2 rounded-md transition disabled:opacity-50"
          >
            {{ isUpdating ? 'Updating...' : 'Save Changes' }}
          </button>

          <!-- Tombol Back -->
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

// Router
const router = useRouter()
const route = useRoute()

// State order
const order = ref({
  id: null,
  order_number: '',
  customer_name: '',
  field: { id: null },
  date: '',
  time_start: '',
  time_end: '',
})

// UI states
const loading = ref(true)
const isUpdating = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const baseUrl = 'http://101.50.3.105/api/core/registrations/'

// Flatpickr refs
const datePicker = ref(null)
const timeStartPicker = ref(null)
const timeEndPicker = ref(null)

function initFlatpickr() {
  flatpickr(datePicker.value, {
    dateFormat: "Y-m-d",
    defaultDate: order.value.date,
    onChange: (_, dateStr) => {
      order.value.date = dateStr
    }
  })

  flatpickr(timeStartPicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    defaultDate: order.value.time_start,
    onChange: (_, timeStr) => {
      order.value.time_start = timeStr
    }
  })

  flatpickr(timeEndPicker.value, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    defaultDate: order.value.time_end,
    onChange: (_, timeStr) => {
      order.value.time_end = timeStr
    }
  })
}

// GET order
async function fetchOrderData(id) {
  loading.value = true
  errorMessage.value = ''

  const userToken = localStorage.getItem('userToken')
  if (!userToken) {
    router.push('/admin/login')
    return
  }

  try {
    const response = await axios.get(`${baseUrl}${id}/`, {
      headers: { Authorization: `Token ${userToken}` }
    })

    // Jangan timpa object order!
    Object.assign(order.value, response.data)

    // Tunggu DOM update, lalu init flatpickr
    await nextTick()
    setTimeout(() => initFlatpickr(), 50)

  } catch (err) {
    console.error("Error fetching order:", err)
    errorMessage.value = "Gagal memuat data order. Mungkin ID tidak ditemukan atau sesi habis."

    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem('userToken')
      router.push('/admin/login')
    }

  } finally {
    loading.value = false
  }
}

// PATCH update
async function handleUpdate() {
  isUpdating.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const userToken = localStorage.getItem('userToken')
  const id = order.value.id

  if (!id) {
    errorMessage.value = "Order ID tidak ditemukan untuk pembaruan."
    isUpdating.value = false
    return
  }

  const dataToSend = {
    customer_name: order.value.customer_name,
    field: order.value.field.id,
    date: order.value.date,
    time_start: order.value.time_start,
    time_end: order.value.time_end
  }

  try {
    const response = await axios.patch(`${baseUrl}${id}/`, dataToSend, {
      headers: { Authorization: `Token ${userToken}` }
    })

    successMessage.value = `Order ${response.data.order_number} berhasil diperbarui!`

    setTimeout(() => {
      router.push('/admin/orders')
    }, 1500)

  } catch (err) {
    console.error("Error updating order:", err.response || err)

    if (err.response && err.response.data) {
      errorMessage.value = JSON.stringify(err.response.data)
    } else {
      errorMessage.value = "Gagal menyimpan perubahan. Periksa koneksi atau validasi."
    }

  } finally {
    isUpdating.value = false
  }
}

// Back button
const goBack = () => router.back()

// Load on mount
onMounted(async () => {
  const orderId = route.query.id

  if (orderId) {
    order.value.id = orderId

    await nextTick()
    setTimeout(() => {
      fetchOrderData(orderId)
    }, 100)

  } else {
    errorMessage.value = "Order ID tidak ditemukan."
    loading.value = false
  }
})

</script>
