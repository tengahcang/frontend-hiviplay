<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Order</h1>
    <div class="bg-white shadow-md rounded-xl overflow-hidden">
      <OrderTable />
    </div>
  </div>
</template>

<script setup>
import OrderTable from '../components/OrderTable.vue'
</script>
