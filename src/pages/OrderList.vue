<template>
  <div>
    <h1 class="text-2xl font-semibold text-[#1F8220] dark:text-[#C2C2D9] mb-6 transition-colors duration-300">Order</h1>
    <div class="g-white dark:bg-[#1E1E2D] shadow-md dark:shadow-none rounded-xl overflow-hidden transition-colors duration-300">
      <OrderTable />
    </div>
  </div>
</template>

<script setup>
import OrderTable from '../components/OrderTable.vue'
</script>
