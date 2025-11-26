<template>
  <div class="p-4 bg-white rounded-lg shadow">

    <!-- DELETE MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-3xl shadow-xl w-[90%] max-w-md text-center">

        <!-- Icon Warning -->
        <div class="text-red-500 text-6xl mb-4">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <!-- Title -->
        <h2 class="text-xl font-bold mb-2">Delete this item?</h2>

        <p class="text-gray-500 mb-6">
          This will permanently remove the data
        </p>

        <!-- Buttons -->
        <div class="flex justify-center gap-3">
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-[#DC3545] hover:bg-[#B02A37] text-white rounded-lg"
          >
            Delete
          </button>

          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 mb-4">
      <div>
        <router-link
          to="/admin/orders/add"
          class="bg-[#198754] hover:bg-[#157347] text-white text-sm font-medium px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-colors w-[120px]"
        >
          <i class="fa-regular fa-plus"></i>
          Add New
        </router-link>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <select
            v-model.number="pageSize"
            class="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring focus:ring-green-200"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="30">30</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span>entries per page</span>
        </div>

        <input
          v-model="globalFilter"
          type="text"
          placeholder="Search..."
          class="w-[140px] md:w-60 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200"
        />
      </div>
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-gray-700 border-collapse">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr class="border-b border-gray-200">
            <th
              v-for="header in table.getHeaderGroups()[0].headers"
              :key="header.id"
              class="px-4 py-3 cursor-pointer select-none text-left whitespace-nowrap"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center justify-between">
                {{ header.column.columnDef.header }}

                <span class="text-gray-400">
                  <i
                    v-if="header.column.getIsSorted() === 'asc'"
                    class="fa-solid fa-sort-up"
                  ></i>
                  <i
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    class="fa-solid fa-sort-down"
                  ></i>
                  <i v-else class="fa-solid fa-sort text-gray-300"></i>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b border-gray-200 odd:bg-white even:bg-slate-50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 text-gray-800 whitespace-nowrap"
            >
              <span v-if="cell.column.id !== 'action'">
                {{ cell.getValue() }}
              </span>

              <div v-else class="flex justify-center gap-2">
                <router-link
                  :to="{ name: 'edit-order', query: { id: row.original.id } }"
                  class="bg-[#435EBE] hover:bg-[#3348A0] text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1"
                >
                  <i class="fa-regular fa-pen-to-square"></i>
                  Edit
                </router-link>

                <button
                  @click="handleDelete(row.original.id)"
                  class="bg-[#DC3545] hover:bg-[#B02A37] text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1"
                >
                  <i class="fa-regular fa-trash-can"></i>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div class="flex flex-col md:flex-row flex-wrap justify-between items-center mt-4 text-sm text-gray-600 gap-2">
      <div class="text-xs md:text-sm whitespace-nowrap">
        Showing
        <span class="font-medium">{{ startEntry }}</span>
        to
        <span class="font-medium">{{ endEntry }}</span>
        of
        <span class="font-medium">{{ table.getFilteredRowModel().rows.length }}</span>
        entries
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
          class="px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-gray-100"
        >
          ‹
        </button>

        <button
          v-for="page in pages"
          :key="page"
          @click="table.setPageIndex(page - 1)"
          :class="[
            'px-3 py-1 rounded-lg cursor-pointer',
            page === table.getState().pagination.pageIndex + 1
              ? 'bg-[#435EBE] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="table.nextPage()"
          :disabled="!table.getCanNextPage()"
          class="px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-gray-100"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable
} from "@tanstack/vue-table";

import axios from "axios";
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

function globalContainsFilter(row, columnId, filterValue) {
  const value = row.getValue(columnId);
  if (!value) return false;
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
}



const router = useRouter();

// =====================
// STATE
// =====================
const orders = ref([]);
const apiUrl = "http://101.50.3.105/api/core/registrations/";

const globalFilter = ref("");
const pageSize = ref(10);
const sorting = ref([]);
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const error = ref(null);

const showDeleteModal = ref(false)
const deleteId = ref(null)

// =====================
// FETCH FROM DJANGO API
// =====================
async function fetchOrders() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    router.push("/admin/login");
    return;
  }

  try {
    const res = await axios.get(apiUrl, {
      headers: { Authorization: `Token ${token}` },
    });

    orders.value = res.data.map(o => ({
      id: o.id,
      orderNumber: o.order_number,
      name: o.customer_name,
      code: o.access_code,
      field: o.field?.name ?? "-",
      date: o.date,
      start: o.time_start,
      end: o.time_end
    }));

    console.log("Orders:", orders.value);

  } catch (e) {
    console.log(e);
    error.value = "Failed to load data";
  }
}

// =====================
// DELETE ORDER
// =====================
function handleDelete(id) {
  deleteId.value = id
  showDeleteModal.value = true
}

// 👉 Fungsi ini benar-benar hapus data
async function confirmDelete() {
  const token = localStorage.getItem("userToken")

  try {
    await axios.delete(`${apiUrl}${deleteId.value}/`, {
      headers: { Authorization: `Token ${token}` }
    })

    orders.value = orders.value.filter(o => o.id !== deleteId.value)
    showDeleteModal.value = false

  } catch (e) {
    alert("Failed to delete")
  }
}

// =====================
// TABLE COLUMNS
// =====================
const columnHelper = createColumnHelper();

const columns = computed(() => [
  columnHelper.accessor("orderNumber", {
    header: "Order Number",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),
  columnHelper.accessor("code", {
    header: "Access Code",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),
  columnHelper.accessor("field", {
    header: "Field",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),
  columnHelper.accessor("date", {
    header: "Date",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),
  columnHelper.accessor("start", {
    header: "Time Start",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),
  columnHelper.accessor("end", {
    header: "Time End",
    filterFn: globalContainsFilter,
    enableGlobalFilter: true
  }),

  columnHelper.display({
    id: "action",
    header: "Action",
    cell: info => info.row.original.id
  })
]);

// =====================
// TABLE CONFIG
// =====================
const table = useVueTable({
  get data() { return orders.value },
  get columns() { return columns.value },

  state: {
    get sorting() { return sorting.value },
    get globalFilter() { return globalFilter.value },
    get pagination() { return pagination.value },
  },

filterFns: {
  contains: globalContainsFilter,
},
globalFilterFn: "contains",



  onSortingChange: updater => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater;
  },

  onPaginationChange: updater => {
    pagination.value = typeof updater === "function" ? updater(pagination.value) : updater;
  },

  onGlobalFilterChange: val => globalFilter.value = val,

  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

watch(pageSize, (newSize) => {
  pagination.value = {
    ...pagination.value,
    pageSize: newSize,
    pageIndex: 0, // reset ke halaman pertama
  };
});

// =====================
// COMPUTED FOOTER
// =====================
const startEntry = computed(() =>
  table.getPaginationRowModel().rows.length
    ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
    : 0
);

const endEntry = computed(() =>
  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
  table.getPaginationRowModel().rows.length
);

const pages = computed(() =>
  Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
);

// =====================
// LIFECYCLE
// =====================
onMounted(fetchOrders);
</script>
