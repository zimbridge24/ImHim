<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 flex flex-col items-center py-4 sm:py-12 md:py-16 px-4 sm:px-6 font-sans">
    <!-- Logo at top left -->
    <div class="w-full max-w-6xl px-2 sm:px-4 md:px-6 mb-4 sm:mb-6 md:mb-8">
      <img 
        src="/ImHim.png" 
        alt="ImHim Logo" 
        class="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain"
      />
    </div>

    <!-- Cards Section -->
    <div class="flex justify-center items-center w-full max-w-2xl">
      <!-- Card: Vitality Self Check -->
      <div 
        class="group bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:bg-white border border-white/60 w-full"
        @click="handleTestClick"
      >
        <div class="mb-4 sm:mb-6">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21C12 21 5 13.5 5 9.5C5 7.01472 7.01472 5 9.5 5C11.038 5 12.5 5.879 13 7.15385C13.5 5.879 14.962 5 16.5 5C18.9853 5 21 7.01472 21 9.5C21 13.5 14 21 14 21H12Z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4 text-gray-800 tracking-tight">
            Vitality Self Check 시작
          </h2>
          <p class="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 font-medium tracking-wide uppercase">
            국제 발기력 테스트(5문항) 기반 자가 체크
          </p>
        </div>
        <p class="text-base sm:text-lg text-gray-600 m-0 leading-relaxed font-light">
          5개의 간단한 질문으로 나의 발기 컨디션 점수를 확인해보세요.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleTestClick = () => {
  router.push("/vitality-test")
}
</script>
