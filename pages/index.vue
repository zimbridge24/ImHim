<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 font-sans">
    <!-- Hero Section -->
    <div class="text-center mb-16 sm:mb-20 mt-6 sm:mt-8 max-w-4xl">
      <div class="flex items-center justify-center gap-4 mb-8">
        <img 
          src="/logo.png" 
          alt="I'm힘 Logo" 
          class="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-fit contain drop-shadow-sm"
        />
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight m-0 leading-none font-sans">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 inline-block" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.1), 4px 4px 8px rgba(0,0,0,0.1); letter-spacing: -0.02em;">I'm</span>
          <span class="mx-2"></span>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 inline-block" style="font-size: 1.1em; text-shadow: 2px 2px 4px rgba(0,0,0,0.1), 4px 4px 8px rgba(0,0,0,0.1); letter-spacing: -0.02em;">힘</span>
        </h1>
      </div>
      <p class="text-lg sm:text-xl md:text-2xl text-gray-600 m-0 font-normal leading-relaxed">
        남성의 몸과 자신감을 회복하는 공간
      </p>
    </div>

    <!-- Cards Section -->
    <div class="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-6xl">
      <!-- Card 1: Vitality Care -->
      <div 
        class="group bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:bg-white border border-white/60 flex-1"
        @click="handleVitalityClick"
      >
        <div class="mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-semibold mb-3 text-gray-800 tracking-tight">
            Vitality Care
          </h2>
          <p class="text-sm text-gray-500 mb-5 font-medium tracking-wide uppercase">
            남성 컨디션을 위한 근거 기반 영양제 가이드
          </p>
        </div>
        <p class="text-base text-gray-600 m-0 leading-relaxed font-light">
          근거 기반 영양제 분석을 제공합니다. (준비 중)
        </p>
      </div>

      <!-- Card 2: Mind & Confidence Talk -->
      <div 
        class="group bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:bg-white border border-white/60 flex-1"
        @click="handleChatClick"
      >
        <div class="mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-semibold mb-3 text-gray-800 tracking-tight">
            Mind & Confidence Talk
          </h2>
          <p class="text-sm text-gray-500 mb-5 font-medium tracking-wide uppercase">
            말하기 어려운 고민을 상담하는 AI 심리케어
          </p>
        </div>
        <p class="text-base text-gray-600 m-0 leading-relaxed font-light">
          성적 고민, 스트레스, 불안을 익명으로 안전하게 상담할 수 있습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const handleVitalityClick = () => {
  alert("영양제 케어 영역은 준비 중입니다.")
}

const handleChatClick = () => {
  router.push("/chat")
}
</script>
