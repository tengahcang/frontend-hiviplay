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

    <!-- HERO SECTION -->
    <section
      class="relative h-[600px] flex items-center px-10 bg-cover"
      style="background-image: url('/tenis.png'); background-position: top;"
    >
      <div class="absolute inset-0 bg-white/60"></div>

      <div class="relative z-10 px-6 md:px-0 md:mx-[260px] max-w-3xl">
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
          <span class="font-['Montserrat'] mr-3">Welcome to</span>
          <span class="text-blue-600 font-['Nunito']">HiviPlay</span>
        </h1>


        <p class="text-base md:text-lg text-gray-800 mb-8 leading-relaxed font-['Roboto']">
          We build powerful instant replay experiences for every sport, making
          every moment unforgettable."
        </p>

        <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg font-semibold">
            Get Started
          </button>

          <div @click="openVideo" class="flex items-center gap-3 cursor-pointer">
            <i class="bi bi-play-circle text-blue-500 text-4xl"></i>
            <span class="font-semibold text-gray-700">Watch Video</span>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY US -->
    <section id="why-us" class="w-full bg-[#F4F7FB] py-30 px-4 md:px-0">
      <div class="max-w-[1400px] mx-auto">

        <div class="w-full flex justify-center mb-10">
          <div class="px-6 py-2 bg-[#E8F1FF] text-blue-600 text-sm font-semibold rounded-full font-['Roboto']">
            WHY US?
          </div>
        </div>

        <!-- TITLE -->
        <h2 class="text-center text-4xl font-extrabold text-gray-900 mb-14">
          <span class="font-['Montserrat']">Find Out More</span>
          <span class="text-blue-600 font-['Montserrat']"> About Us</span>
        </h2>

        <!-- CONTENT WRAPPER -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          <!-- LEFT IMAGE -->
          <div>
            <video
              src="/movie.mp4"
              class="w-full rounded-xl shadow-lg"
              autoplay
              muted
              loop
              playsinline
            ></video>
          </div>


          <!-- RIGHT TEXT CONTENT -->
          <div>
            <!-- Big Heading -->
            <h3 class="text-[26px] font-['Montserrat'] font-bold text-gray-900 leading-snug mb-6">
              Seamless sports replays, anytime, anywhere, <br />for everyone.
            </h3>

            <p class="text-gray-700 font-['Roboto'] leading-relaxed mb-10 italic">
              Hivi Play empowers players, teams, and communities to capture, replay, and analyze every
              moment instantly. Built for simplicity, speed, and accuracy—making sports more engaging
              and unforgettable.
            </p>

            <!-- FEATURE 1 -->
            <div class="flex items-start gap-5 mb-10">
              <div class="w-[64px] h-[64px] rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
                <i class="bi bi-camera text-blue-600 text-2xl"></i>
              </div>

              <div>
                <h4 class="font-['Nunito'] text-xl font-bold text-gray-900 mb-1">Seamless Capture</h4>
                <p class="text-gray-700 font-['Roboto'] leading-relaxed">
                  Capture every game moment effortlessly with a single push. Hivi Play ensures
                  smooth recording from start to finish without interruptions or complicated setup—
                  so you never miss the action that matters.
                </p>
              </div>
            </div>

            <!-- FEATURE 2 -->
            <div class="flex items-start gap-5">
              <div class="w-[64px] h-[64px] bg-white rounded-full shadow-md flex items-center justify-center shrink-0">
                <i class="bi bi-share text-blue-600 text-2xl"></i>
              </div>

              <div>
                <h4 class="font-['Nunito'] text-xl font-bold text-gray-900 mb-1">Effortless Sharing</h4>
                <p class="text-gray-700 font-['Roboto'] leading-relaxed">
                  Share your game highlights instantly with teammates, friends, or fans. Hivi Play
                  makes distributing replays simple and fast, so everyone can enjoy and learn from
                  every moment.
                </p>
              </div>
            </div>

            <p class="text-gray-700 font-['Roboto'] leading-relaxed mt-12">
              With Hivi Play, capturing every moment is smooth and effortless, while sharing highlights
              is fast and simple. Whether you’re a player, coach, fan, or creator, our platform ensures
              every replay is accessible, engaging, and ready to inspire—bringing the excitement of
              every game directly to your fingertips.
            </p>

          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORK -->
    <section id="how-it-work" class="w-full py-22 px-6 md:px-0" >
      <div class="max-w-[1400px] mx-auto">

        <!-- BADGE -->
        <div class="w-full flex justify-center mb-10">
          <div class="px-6 py-2 bg-[#E8F1FF] text-blue-600 text-sm font-semibold rounded-full font-['Roboto']">
            HOW IT WORK?
          </div>
        </div>

        <!-- 3 FEATURES GRID -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

          <!-- CARD 1 -->
          <div class="group bg-white border border-[#DCE7F1] rounded-2xl p-6
            h-auto md:h-[400px]
            flex flex-col justify-center items-center
            text-center transition-all duration-300
            hover:border-[#007bff] hover:shadow-lg">
            <div class="flex justify-center mb-6">
              <div class="w-[64px] h-[64px] bg-[#007bff] rounded-lg flex items-center justify-center">
                <i class="bi bi-box-arrow-in-down text-white text-3xl"></i>
              </div>
            </div>

            <h3 class="font-['Montserrat'] text-2xl font-semibold mb-3
                      transition-colors duration-300 group-hover:text-[#007bff] text-center">Tap to capture</h3>
            <p class="text-gray-600 font-['Roboto'] leading-relaxed text-center">
              Record every key moment with just a single tap. Hivi Play makes capturing highlights quick
              and intuitive, so you can focus on the game while never missing the action.
            </p>
          </div>

          <!-- CARD 2 -->
          <div class="group bg-white border border-[#DCE7F1] rounded-2xl p-6
            h-auto md:h-[400px]
            flex flex-col justify-center items-center
            text-center transition-all duration-300
            hover:border-[#007bff] hover:shadow-lg">

            <div class="flex justify-center mb-6">
              <div class="w-[64px] h-[64px] bg-[#007bff] rounded-lg flex items-center justify-center">
                <i class="bi bi-save-fill text-white text-3xl"></i>
              </div>
            </div>

            <h3 class="font-['Montserrat'] text-2xl font-semibold mb-3
                      transition-colors duration-300 group-hover:text-[#007bff]">
              Auto-save
            </h3>

            <p class="text-gray-600 font-['Roboto'] leading-relaxed">
              Never worry about losing important moments. Hivi Play automatically saves every capture
              and replay in real time, ensuring your highlights are always secure and ready anytime.
            </p>

          </div>


          <!-- CARD 3 -->
          <div class="group bg-white border border-[#DCE7F1] rounded-2xl p-6
            h-auto md:h-[400px]
            flex flex-col justify-center items-center
            text-center transition-all duration-300
            hover:border-[#007bff] hover:shadow-lg">
            <div class="flex justify-center mb-6">
              <div class="w-[64px] h-[64px] bg-[#007bff] rounded-lg flex items-center justify-center">
                <i class="bi bi-share text-white text-3xl"></i>
              </div>
            </div>

            <h3 class="font-['Montserrat'] text-2xl font-semibold mb-3
                      transition-colors duration-300 group-hover:text-[#007bff]">Ready to Share</h3>
            <p class="text-gray-600 font-['Roboto'] leading-relaxed">
              Instantly share your captured highlights with teammates, friends, or fans. Hivi Play
              makes every replay easy to distribute, so your best moments are always ready to inspire
              and engage.
            </p>
          </div>

        </div>
      </div>
    </section>
    <!-- SETUP -->
    <section
      id="setup" class="w-full bg-cover bg-no-repeat py-24 px-0"
      style="background-image: url('/installation2.png'); background-position: center 0%;"
    >

      <div class="max-w-[1400px] mx-auto">

        <!-- SMALL TITLE -->
        <p class="text-center text-sm font-semibold tracking-wider text-gray-200 mb-3">
          SETUP
        </p>

        <!-- MAIN TITLE -->
        <h2 class="text-center text-4xl font-extrabold text-white mb-16">
          <span class="font-['Montserrat']">Easy to</span>
          <span class="text-[#007bff] font-['Montserrat']"> Install</span>
        </h2>

        <!-- CONTENT CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:mx-0 mx-4">

          <!-- CARD 1 -->
          <div class="group bg-white rounded-2xl p-10 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#007bff]">
            <div class="flex mb-4">
              <i class="bi bi-camera text-[#007bff] text-4xl transition-all duration-300 group-hover:text-white"></i>
            </div>

            <h3 class="font-['Montserrat'] text-2xl font-semibold mb-3 transition-all duration-300 group-hover:text-white">
              Connect Your Devices
            </h3>
            <p class="text-gray-600 font-['Roboto'] leading-relaxed transition-all duration-300 group-hover:text-white">
              Plug in your cameras and other equipment. Hiviplay works seamlessly
              with a variety of devices, so there's no need to replace your existing setup.
            </p>
          </div>

          <!-- CARD 2 -->
          <div
            class="group bg-white rounded-2xl p-10 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#007bff]"
          >
            <div class="flex mb-4">
              <i
                class="bi bi-wrench-adjustable-circle text-[#007bff] text-4xl transition-all duration-300 group-hover:text-white"
              ></i>
            </div>

            <h3
              class="font-['Montserrat'] text-2xl font-semibold mb-3 transition-all duration-300 group-hover:text-white"
            >
              Configure Settings
            </h3>

            <p
              class="text-gray-600 font-['Roboto'] leading-relaxed transition-all duration-300 group-hover:text-white"
            >
              Customize your Hivi Play experience by adjusting video quality,
              storage preferences, and capture options. Ensure everything is optimized
              for smooth recording and instant replay.
            </p>
          </div>

          <!-- CARD 3 -->
          <div class="group bg-white rounded-2xl p-10 shadow-sm transition-all duration-300 cursor-pointer hover:bg-[#007bff]">
            <div class="flex mb-4">
              <i class="bi bi-images text-[#007bff] text-4xl transition-all duration-300 group-hover:text-white"></i>
            </div>

            <h3 class="font-['Montserrat'] text-2xl font-semibold mb-3 transition-all duration-300 group-hover:text-white">
              Start Capturing
            </h3>
            <p class="text-gray-600 font-['Roboto'] leading-relaxed transition-all duration-300 group-hover:text-white">
              With everything connected and configured, you're ready to go. Press the
              capture button or use the app to start recording and managing your clips.
              Focus on capturing the action without worrying about technology.
            </p>
          </div>

        </div>

      </div>
    </section>
    <!-- ===== FEATURES===== -->
    <section id="features" class="w-full bg-[#F2F5FA] py-24 px-4 md:px-20">

      <!-- Label Features -->
      <div class="text-center mb-4">
        <span
          class="px-6 py-2 bg-[#E8F0FE] text-[#3378FF] rounded-full text-sm font-medium tracking-wide">
          FEATURES
        </span>
      </div>

      <!-- Title -->
      <h2 class="text-center text-3xl md:text-4xl font-bold mb-16 font-['Montserrat']">
        Powerful features <span class="text-[#3378FF]">for instant replay</span>
      </h2>

      <!-- Feature List Wrapper -->
      <div class="max-w-5xl mx-auto space-y-12">

        <!-- Feature Item -->
        <div class="flex items-start gap-6">
          <div class="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
            <i class="bi bi-diagram-3 text-[#3378FF] text-2xl"></i>
          </div>
          <div>
            <h3 class="font-semibold text-xl mb-1 font-['Montserrat']">Multi-Device Integration.</h3>
            <p class="text-gray-600 leading-relaxed">
              Hiviplay connects seamlessly with a wide range of cameras and equipment.
              No need to replace your existing setup—just plug in and start.
            </p>
          </div>
        </div>

        <!-- Feature Item -->
        <div class="flex items-start gap-6">
          <div class="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
            <i class="bi bi-hand-index text-[#3378FF] text-2xl"></i>
          </div>
          <div>
            <h3 class="font-semibold text-xl mb-1">One-Tap Capture</h3>
            <p class="text-gray-600 leading-relaxed">
              Capture and save important moments instantly with a single push, either through
              the physical button or directly from the app.
            </p>
          </div>
        </div>

        <!-- Feature Item -->
        <div class="flex items-start gap-6">
          <div class="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
            <i class="bi bi-key text-[#3378FF] text-2xl"></i>
          </div>
          <div>
            <h3 class="font-semibold text-xl mb-1">Secure Access</h3>
            <p class="text-gray-600 leading-relaxed">
              Your videos are protected with advanced security, ensuring privacy and safe access at all times.
            </p>
          </div>
        </div>

        <!-- Feature Item -->
        <div class="flex items-start gap-6">
          <div class="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
            <i class="bi bi-feather text-[#3378FF] text-2xl"></i>
          </div>
          <div>
            <h3 class="font-semibold text-xl mb-1">Easy Setup & Control</h3>
            <p class="text-gray-600 leading-relaxed">
              Easy Setup & Control. Simple installation with no technical expertise required.
              Manage everything effortlessly from a clean and intuitive mobile app.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="py-24 bg-white">
      <div class="max-w-[1400px] mx-auto px-6 text-center">
        <!-- Badge -->
        <div class="mb-6">
          <span class="inline-block bg-blue-100 text-blue-600 font-semibold text-sm px-4 py-1 rounded-full tracking-wider">
            PRICING
          </span>
        </div>

        <!-- Title -->
        <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
          <span class="mr-2 font-['Montserrat']">Maximize growth with</span>
          <span class="text-blue-600 font-['Montserrat']">HiviPlay’s</span>
          <span class="ml-2 font-['Montserrat']">flexible pricing</span>
        </h2>

        <!-- Card / CTA -->
        <div class="mt-12">
          <div class="bg-white rounded-xl overflow-hidden border border-[#DCE7F1]">
            <!-- Top white area -->
            <div class="py-12 px-8">
              <p class="text-lg md:text-xl text-gray-700 font-medium font-['Montserrat']">Include Hardware &amp; Installation</p>
            </div>

            <!-- Bottom area with light gray background and centered button -->
           <div class="bg-[#F5F5F5] py-8 px-6 flex justify-center">
              <button
                @click="$router.push('/purchase')"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-3 rounded-lg shadow-md transition font-['Montserrat']"
              >
                OWN IT NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- CONTACT -->
    <section id="contact" class="py-24 bg-white">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <!-- badge -->
        <div class="mb-6">
          <span class="inline-block bg-blue-100 text-blue-600 font-semibold text-sm px-4 py-1 rounded-full tracking-wider">
            CONTACT US
          </span>
        </div>

        <!-- heading -->
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          <span class="mr-2 font-['Montserrat']">Need Help?</span>
          <span class="text-blue-600 font-['Montserrat']">Contact Us</span>
        </h2>

        <!-- Layout: left contact card + right form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <!-- LEFT: contact info card -->
          <div class="bg-white rounded-lg border border-[#E9EEF6] shadow-sm p-8">
            <div class="space-y-8">
              <!-- Call Us -->
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                  <i class="bi bi-telephone text-blue-600 text-xl"></i>
                </div>

                <div class="text-left">
                  <p class="font-bold text-gray-800 font-['Montserrat']">Call Us</p>
                  <p class="text-sm text-gray-500 mt-1">+62 816 532 727</p>
                </div>
              </div>

              <!-- Email Us -->
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                  <i class="bi bi-envelope text-blue-600 text-xl"></i>
                </div>
                <div class="text-left">
                  <p class="font-bold text-gray-800 font-['Montserrat']">Email Us</p>
                  <p class="text-sm text-gray-500 mt-1">info@hiviplay.com</p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: contact form -->
          <div class="bg-white rounded-lg border border-[#E9EEF6] shadow-sm p-8">
            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm text-gray-700 mb-2 text-left font-['Roboto']">Your Name</label>
                  <input type="text" class="w-full border border-gray-200 rounded-sm py-3 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-2 text-left font-['Roboto']">Your Email</label>
                  <input type="email" class="w-full border border-gray-200 rounded-sm py-3 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
                </div>
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2 text-left font-['Roboto']">Subject</label>
                <input type="text" class="w-full border border-gray-200 rounded-sm py-3 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2 text-left font-['Roboto']">Message</label>
                <textarea rows="8" class="w-full border border-gray-200 rounded-sm py-3 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"></textarea>
              </div>

              <!-- button area: centered pill -->
              <div class="flex justify-center pt-4">
                <button type="button" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-md font-['Roboto']">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
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
