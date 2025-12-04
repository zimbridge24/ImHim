<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 font-sans">
    <!-- Logo at top left -->
    <div class="w-full max-w-6xl px-4 sm:px-6 mb-8">
      <img 
        src="/logo.png" 
        alt="ImHim Logo" 
        class="h-12 sm:h-16 md:h-20 w-auto object-contain"
      />
    </div>

    <!-- Hero Section -->
    <div class="text-center mb-16 sm:mb-20 mt-6 sm:mt-8 max-w-4xl">
      <p class="text-lg sm:text-xl md:text-2xl text-gray-600 m-0 font-normal leading-relaxed">
        남성의 몸과 자신감을 회복하는 공간
      </p>
    </div>

    <!-- Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
      <!-- Card 1: Vitality Care -->
      <div 
        class="group bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:bg-white border border-white/60"
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
        class="group bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:bg-white border border-white/60"
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

      <!-- Card 3: Vitality Self Check -->
      <div 
        class="group bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:bg-white border border-white/60"
        @click="handleTestClick"
      >
        <div class="mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21C12 21 5 13.5 5 9.5C5 7.01472 7.01472 5 9.5 5C11.038 5 12.5 5.879 13 7.15385C13.5 5.879 14.962 5 16.5 5C18.9853 5 21 7.01472 21 9.5C21 13.5 14 21 14 21H12Z"></path>
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-semibold mb-3 text-gray-800 tracking-tight">
            Vitality Self Check
          </h2>
          <p class="text-sm text-gray-500 mb-5 font-medium tracking-wide uppercase">
            국제 발기력 테스트(5문항) 기반 자가 체크
          </p>
        </div>
        <p class="text-base text-gray-600 m-0 leading-relaxed font-light">
          5개의 간단한 질문으로 나의 발기 컨디션 점수를 확인해보세요. (익명, 결과 저장 없음)
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

const handleTestClick = () => {
  router.push("/vitality-test")
}
</script>
