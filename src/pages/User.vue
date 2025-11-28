<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <header class="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between transition-colors">
      <!-- LEFT SIDE: LOGO -->
      <h1 class="text-3xl font-bold text-[#28A428] dark:text-[#92cd2d] font-['Nunito']">
        HiviPlay
      </h1>
      <!-- RIGHT SIDE: THEME TOGGLE + LOGOUT -->
      <div class="flex items-center gap-4">
        <button @click="toggleDarkMode" class="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
          <i class="fa-solid" :class="isDark ? 'fa-moon text-[#435EBE]' : 'fa-sun text-yellow-500'"></i>
        </button>
        <!-- LOGOUT BUTTON -->
        <div class="relative group hidden md:flex">
          <button @click="logout"
            class="cursor-pointer items-center gap-2 text-sm text-[#607080] dark:text-gray-400 hover:text-[#1F2A56] dark:hover:text-white font-medium">
            <LogoutIcon />
          </button>
          <div class="absolute top-8 right-0 opacity-0 group-hover:opacity-100 bg-black text-white text-xs py-1 px-3 rounded-lg pointer-events-none shadow-lg">
            Logout
          </div>
        </div>
      </div>
    </header>
    <main class="flex-1 p-6 md:p-8">
      <div v-if="loading" class="text-center py-10">
        <p class="text-xl text-blue-500 dark:text-blue-400">Loading videos...</p>
      </div>
      <div v-else-if="errorMessage" class="bg-red-100 dark:bg-red-200 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-800 px-4 py-3 rounded relative">
        {{ errorMessage }}
      </div>
      <div v-else-if="!videos.length" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
        <p class="text-xl text-gray-500 dark:text-gray-400">No videos found for this session.</p>
      </div>
      <div v-else class="flex flex-col gap-6">
        <div v-for="video in videos" :key="video.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 relative transition-colors">
          <div class="flex flex-col md:flex-row items-start gap-4">
            <img :src="video.thumbnail_url" class="w-full h-[240px] md:w-[240px] md:h-[170px] object-cover rounded-xl" :alt="video.title" />
            <span class="hidden md:block text-lg font-medium text-gray-800 dark:text-gray-200 pt-2 font-['Nunito']">
              {{ video.title }}
            </span>
            <div class="hidden md:flex absolute top-4 right-4 flex-col items-center gap-4">
              <div class="relative group">
                <button @click="shareVideo(video)" class="w-11 h-11 bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] rounded-xl flex items-center justify-center shadow-md">
                  <ShareIcon class="w-5 h-5 text-white  dark:text-[#2A2A40]" />
                </button>
                <div class="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-3 py-1 rounded-full shadow-lg pointer-events-none">
                  Share
                </div>
              </div>
              <div class="relative group">
                <a :href="`${videoApiUrl}${video.id}/download/?registration_id=${registrationId}`" target="_blank">
                  <button
                    class="w-11 h-11 bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] rounded-xl flex items-center justify-center shadow-md">
                    <DownloadIcon class="w-5 h-5 text-white  dark:text-[#2A2A40]" />
                  </button>
                </a>
                <div class="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-3 py-1 rounded-full pointer-events-none shadow-lg">
                  Download
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 flex md:hidden items-center justify-between">
            <span class="text-lg font-semibold text-gray-800 dark:text-gray-200 font-['Nunito']">
              {{ video.title }}
            </span>
            <div class="flex gap-3">
              <button @click="shareVideo(video)" class="w-11 h-11 bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] text-white  dark:text-[#2A2A40] rounded-xl flex items-center justify-center shadow-md">
                <ShareIcon class="w-5 h-5 text-white  dark:text-[#2A2A40]" />
              </button>
              <a :href="`${videoApiUrl}${video.id}/download/?registration_id=${registrationId}`" target="_blank">
                <button class="w-11 h-11 bg-[#28A428] hover:bg-[#1F8220]  dark:bg-[#92CD2D] dark:hover:bg-[#76A726] rounded-xl flex items-center justify-center shadow-md">
                  <DownloadIcon class="w-5 h-5 text-white  dark:text-[#2A2A40]" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
    <transition name="fade">
      <div v-if="showPopup" class="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-md shadow-gray-300/30 dark:shadow-gray-950/50 flex gap-2 text-sm text-[#1F2A56] dark:text-gray-200 transition-colors">
        <LinkIcon class="w-4 h-4" />  {{ popupMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import LogoutIcon from "@/components/icons/LogoutIcon.vue";
import ShareIcon from "@/components/icons/ShareIcon.vue";
import DownloadIcon from "@/components/icons/DownloadIcon.vue";
import LinkIcon from '@/components/icons/LinkIcon.vue'
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
// API BASE
const videoApiUrl = "https://hiviplay.mbs-group.co.id/api/core/videos/";
// STATE
const videos = ref([]);
const loading = ref(true);
const errorMessage = ref(null);
const registrationId = localStorage.getItem("registrationId");
const customerName = localStorage.getItem("customerName") || "User";
const accessCode = localStorage.getItem("accessCode");
// POPUP
const showPopup = ref(false);
const popupMessage = ref("");
const isDark = ref(false)

// --- LOGIC DARK MODE ---
onMounted(() => {
  // 1. Cek theme saat komponen dimuat
  if (localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 2. Jalankan fetchVideos
  fetchVideos();
});
// -----------------------

const toast = (msg) => {
  popupMessage.value = msg;
  showPopup.value = true;
  setTimeout(() => (showPopup.value = false), 1500);
};
// Extract Drive ID
const getDriveID = (url) => url.match(/\/d\/(.+?)\//)?.[1];
// Add thumbnail generator
const parseVideo = (video) => ({
  ...video,
  thumbnail_url: `https://drive.google.com/thumbnail?id=${getDriveID(video.file)}&sz=w500`
});
// FETCH VIDEOS
async function fetchVideos() {
  try {
    const token = localStorage.getItem("userToken");
    const res = await axios.get(videoApiUrl, {
      params: { registration_id: registrationId },
      headers: { Authorization: `Token ${token}` },
    });
    videos.value = res.data.map(parseVideo);
  } catch (err) {
    errorMessage.value = "Failed to load videos.";
  } finally {
    loading.value = false;
  }
}
// SHARE LINK
const shareVideo = (video) => {
  const code = localStorage.getItem("accessCode");
  const url = `${window.location.origin}/login?access_code=${code}`;
  navigator.clipboard.writeText(url);
  toast("Share Link Copied");
};
// LOGOUT
const logout = () => {
  localStorage.clear();
  router.push("/login");
};
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light')
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
