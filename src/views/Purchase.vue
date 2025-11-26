<template>
  <div id="videoModal"
    class="fixed inset-0 bg-black/80 flex items-center justify-center hidden z-[99999]">

      <button
        @click="closeVideo"
        class="
          absolute
          top-6 right-6 z-[100000] text-white hover:text-[#ADB5C3] transition-colors duration-200
        "
      >
        <i class="bi bi-x-circle text-4xl md:text-2xl"></i>
      </button>


      <div class="relative">

        <div
          class="rounded-xl overflow-hidden bg-black shadow-2xl
                  w-[430px] h-[242px]
                  md:w-[1100px] md:h-auto"
        >
          <video id="gvideo0" controls class="w-full h-full object-cover">
            <source src="/movie.mp4" type="video/mp4">
            Your browser does not support video.
          </video>
        </div>

      </div>

  </div>
  <div class="w-full">
    <!-- TOP CONTACT BAR -->
    <div class="bg-[#007bff] text-white text-sm py-2 px-6">
      <div class="max-w-[1520px] mx-auto w-full flex justify-between items-center px-4">

        <!-- CONTACT LEFT (EMAIL + PHONE) -->
        <div class="flex items-center gap-6 mx-auto md:mx-0">

          <div class="flex items-center gap-2">
            <i class="bi bi-envelope text-[14px]"></i>
            <span class="font-['Open Sans']">info@hiviplay.com</span>
          </div>

          <div class="flex items-center gap-2">
            <i class="bi bi-phone text-[14px]"></i>
            <span class="font-['Open Sans']">+62 816 532 727</span>
          </div>

        </div>

        <!-- SOCIAL ICONS (Hanya tampil di desktop) -->
        <div class="hidden md:flex items-center gap-4 text-[14px] text-[#9FC5F7]">
          <i class="bi bi-twitter-x cursor-pointer hover:text-white"></i>
          <i class="bi bi-facebook cursor-pointer hover:text-white"></i>
          <i class="bi bi-instagram cursor-pointer hover:text-white"></i>
          <i class="bi bi-linkedin cursor-pointer hover:text-white"></i>
        </div>

      </div>
    </div>

    <!-- NAVBAR -->
    <nav class="sticky top-0 z-[9999] bg-white shadow-sm">
      <div class="flex justify-between items-center w-full px-10 md:px-24 py-5">

        <!-- LOGO -->
        <h1 class="text-3xl font-extrabold text-[#1F2A56] font-['Nunito']">
          HiviPlay
        </h1>

        <!-- MENU DESKTOP -->
        <ul class="hidden md:flex gap-10 font-medium text-gray-700 open-sans">
          <li class="cursor-pointer"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'why-us' }"
              @click="scrollTo('why-us')">Why Us?</li>

          <li class="cursor-pointer"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'how-it-work' }"
              @click="scrollTo('how-it-work')">How it works?</li>

          <li class="cursor-pointer"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'setup' }"
              @click="scrollTo('setup')">Setup</li>

          <li class="cursor-pointer"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'features' }"
              @click="scrollTo('features')">Features</li>

          <li class="cursor-pointer"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'pricing' }"
              @click="scrollTo('pricing')">Pricing</li>

          <li class="cursor-pointer"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'contact' }"
              @click="scrollTo('contact')">Contact Us</li>
        </ul>

        <!-- HAMBURGER (Mobile Only) -->
        <button
          class="md:hidden text-3xl text-gray-700"
          @click="mobileMenuOpen = true"
        >
          <i class="bi bi-list"></i>
        </button>

      </div>

      <!-- OVERLAY (klik area gelap untuk close) -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 transition-all"
        @click.self="mobileMenuOpen = false"
      >
        <div
          class="bg-white w-[390.4px] h-[832px] rounded-xl shadow-2xl flex flex-col p-6 overflow-y-auto relative"
        >
          <div class="flex justify-end items-center mb-10">

            <button
                class="w-12 h-12 flex items-center justify-center text-2xl text-gray-500 hover:text-red-500 transition"
                @click="mobileMenuOpen = false"
              >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <ul class="flex flex-col gap-6 font-medium text-lg text-gray-700 open-sans">

            <li
              class="cursor-pointer hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'why-us' }"
              @click="scrollTo('why-us'); mobileMenuOpen = false"
            >Why Us?</li>

            <li
              class="cursor-pointer hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'how-it-work' }"
              @click="scrollTo('how-it-work'); mobileMenuOpen = false"
            >How it works?</li>

            <li
              class="cursor-pointer hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'setup' }"
              @click="scrollTo('setup'); mobileMenuOpen = false"
            >Setup</li>

            <li
              class="cursor-pointer hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'features' }"
              @click="scrollTo('features'); mobileMenuOpen = false"
            >Features</li>

            <li
              class="cursor-pointer hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'pricing' }"
              @click="scrollTo('pricing'); mobileMenuOpen = false"
            >Pricing</li>

            <li
              class="cursor-pointer hover:text-blue-600 transition-colors"
              :class="{ 'text-blue-600 font-semibold': activeSection === 'contact' }"
              @click="scrollTo('contact'); mobileMenuOpen = false"
            >Contact Us</li>

          </ul>
        </div>
      </div>
    </nav>

    <section id="purchase" class="w-full py-20 bg-[#F8F9FC]">
    <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <form class="space-y-6">

        <!-- NAME -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Name</label>
            <input
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <!-- EMAIL -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Email</label>
            <input
            type="email"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <!-- PHONE -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Phone</label>
            <input
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <!-- COURT NAME -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Court Name</label>
            <input
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <!-- NUMBER OF COURTS -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Number of courts</label>
            <input
            type="number"
            min="1"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value="1"
            />
        </div>

        <!-- MONTHS OF SUBSCRIPTION -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Months of subscription</label>
            <input
            type="number"
            min="1"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value="12"
            />
        </div>

        <!-- VOUCHER -->
        <div>
            <label class="block text-gray-700 text-sm mb-1 font-semibold">Voucher Code</label>
            <input
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <!-- BUTTON -->
        <div class="pt-4 flex justify-center">
            <button
            type="submit"
            class="px-10 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
            Submit
            </button>
        </div>

        </form>

    </div>
    </section>

  </div>
  <footer class="w-full bg-white py-8">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        <!-- LEFT SECTION -->
        <div>
          <h2 class="text-2xl font-bold text-[#1F2A56] font-['Nunito']">HiviPlay</h2>

          <div class="mt-6 space-y-3 text-sm text-gray-700 font-['Roboto']">
            <p><span class="font-semibold">Phone:</span> +62 816 532 727</p>
            <p><span class="font-semibold">Email:</span> info@hiviplay.com</p>
          </div>
        </div>

        <!-- RIGHT SECTION -->
        <div class="text-left md:text-left">
          <h3 class="font-semibold text-gray-800 mb-4">Follow Us</h3>

          <div class="flex gap-4 justify-center md:justify-start">

            <!-- X -->
            <button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
              <i class="bi bi-twitter-x text-xl text-gray-700"></i>
            </button>

            <!-- Facebook -->
            <button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
              <i class="bi bi-facebook text-xl text-gray-700"></i>
            </button>

            <!-- Instagram -->
            <button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
              <i class="bi bi-instagram text-xl text-gray-700"></i>
            </button>

            <!-- LinkedIn -->
            <button class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
              <i class="bi bi-linkedin text-xl text-gray-700"></i>
            </button>

          </div>
        </div>
      </div>

      <!-- LINE DIVIDER -->
      <div class="border-t border-gray-300 mt-12"></div>

      <!-- COPYRIGHT -->
      <p class="text-center text-sm text-gray-600 mt-6">
        © Copyright <span class="font-semibold">HiviPlay</span> All Rights Reserved
      </p>
    </div>
  </footer>
</template>


<script>
export default {
  data() {
    return {
      activeSection: null,
      mobileMenuOpen: false,   // <--- WAJIB ADA
    };
  },
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset;
        const offset = 100;
        window.scrollTo({
          top: y - offset,
          behavior: "smooth",
        });
      }
    },

    handleScroll() {
      const sections = ["why-us", "how-it-work", "setup", "features", "pricing", "contact"];

      let foundActive = false;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 200 && rect.bottom >= 200) {
          this.activeSection = id;
          foundActive = true;
          break;
        }
      }

      if (!foundActive) {
        this.activeSection = null;
      }
    },

    // ✅ Tambahkan fungsi baru disini
    openVideo() {
      const modal = document.getElementById("videoModal");
      const video = document.getElementById("gvideo0");

      modal.classList.remove("hidden");
      video.play();
    },

    closeVideo() {
      const modal = document.getElementById("videoModal");
      const video = document.getElementById("gvideo0");

      modal.classList.add("hidden");
      video.pause();
      video.currentTime = 0;
    }
  },


  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>


<style>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.25s ease-out;
}

</style>
