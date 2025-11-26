<template>
  <div class="min-h-screen flex flex-col bg-gray-100">

    <!-- HEADER -->
    <header class="bg-white shadow-sm p-4 flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-[#1F2A56] font-['Nunito']">HiviPlay</h1>

      <!-- Mobile -->
      <button
        @click="logout"
        class="block md:hidden text-[#607080] hover:text-[#1F2A56]">
        <LogoutIcon class="w-7 h-7" />
      </button>

      <!-- Desktop -->
      <div class="relative group hidden md:flex">
        <button
          @click="logout"
          class="cursor-pointer items-center gap-2 text-sm text-[#607080] hover:text-[#1F2A56] font-medium">
          <LogoutIcon />
        </button>

        <div
          class="absolute top-8 right-0 opacity-0 group-hover:opacity-100
                 bg-black text-white text-xs py-1 px-3 rounded-lg pointer-events-none shadow-lg">
          Logout
        </div>
      </div>
    </header>

    <!-- MAIN -->
    <main class="flex-1 p-6 md:p-8">
      <!-- LOADING -->
      <div v-if="loading" class="text-center py-10">
        <p class="text-xl text-blue-500">Loading videos...</p>
      </div>

      <!-- ERROR -->
      <div v-else-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {{ errorMessage }}
      </div>

      <!-- EMPTY -->
      <div v-else-if="!videos.length"
        class="text-center py-10 bg-white rounded-xl shadow-md">
        <p class="text-xl text-gray-500">No videos found for this session.</p>
      </div>

      <!-- VIDEO LIST -->
      <div v-else class="flex flex-col gap-6">

        <div
          v-for="video in videos"
          :key="video.id"
          class="bg-white rounded-2xl shadow-md p-4 relative">

          <!-- VIDEO WRAPPER -->
          <div class="flex flex-col md:flex-row items-start gap-4">

            <!-- THUMB -->
            <img
              :src="video.thumbnail_url"
              class="w-full h-[240px] md:w-[240px] md:h-[170px] object-cover rounded-xl"
              :alt="video.title"
            />

            <!-- TITLE (DESKTOP) -->
            <span class="hidden md:block text-lg font-medium text-gray-800 pt-2">
              {{ video.title }}
            </span>

            <!-- DESKTOP SHARE + DOWNLOAD -->
            <div class="hidden md:flex absolute top-4 right-4 flex-col items-center gap-4">

              <!-- Share -->
              <div class="relative group">
                <button
                  @click="shareVideo(video)"
                  class="w-11 h-11 bg-[#435EBE] hover:bg-[#3950A2]
                         rounded-xl flex items-center justify-center shadow-md">
                  <ShareIcon class="w-5 h-5 text-white" />
                </button>

                <div
                  class="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0
                         group-hover:opacity-100 bg-black text-white text-xs px-3 py-1
                         rounded-full shadow-lg pointer-events-none">
                  Share
                </div>
              </div>

              <!-- Download -->
              <div class="relative group">
                <a :href="`${videoApiUrl}${video.id}/download/?registration_id=${registrationId}`" target="_blank">
                  <button
                    class="w-11 h-11 bg-[#435EBE] hover:bg-[#3950A2]
                           rounded-xl flex items-center justify-center shadow-md">
                    <DownloadIcon class="w-5 h-5 text-white" />
                  </button>
                </a>

                <div
                  class="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0
                         group-hover:opacity-100 bg-black text-white text-xs px-3 py-1
                         rounded-full pointer-events-none shadow-lg">
                  Download
                </div>
              </div>

            </div>
          </div>

          <!-- MOBILE -->
          <div class="mt-5 flex md:hidden items-center justify-between">

            <!-- Title Mobile -->
            <span class="text-lg font-semibold text-gray-800">
              {{ video.title }}
            </span>

            <div class="flex gap-3">
              <!-- Share -->
              <button
                @click="shareVideo(video)"
                class="w-11 h-11 bg-[#435EBE] rounded-xl flex items-center justify-center shadow-md">
                <ShareIcon class="w-5 h-5 text-white" />
              </button>

              <!-- Download Mobile -->
              <a :href="`${videoApiUrl}${video.id}/download/?registration_id=${registrationId}`" target="_blank">
                <button
                  class="w-11 h-11 bg-[#435EBE] rounded-xl flex items-center justify-center shadow-md">
                  <DownloadIcon class="w-5 h-5 text-white" />
                </button>
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- POPUP TOAST -->
    <transition name="fade">
      <div
        v-if="showPopup"
        class="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white
              rounded-xl px-4 py-3 shadow-md shadow-gray-300/30
              flex gap-2 text-sm text-[#1F2A56]">
         <LinkIcon class="w-4 h-4" />  {{ popupMessage }}
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
const videoApiUrl = "http://127.0.0.1:8000/core/videos/";

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

onMounted(fetchVideos);
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
