<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 font-sans">
    <!-- I AM HIM Brand -->
    <div class="text-center mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6" style="color: #6B9B7A;">
        I am Him
      </h1>
      <!-- Circular Icon with Graph Symbol -->
      <div class="flex justify-center mb-6 sm:mb-8">
        <div class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-slate-900 flex items-center justify-center">
          <svg class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12 L6 12 L7 4 L8 20 L9 12 L13 12 L14 6 L15 18 L16 12 L20 12 L22 12" stroke="#00ff01" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Title -->
    <div class="text-center mb-6 sm:mb-8 max-w-3xl">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" style="color: #2563eb;">
        국제 발기 기능 지수(IIEF-5)
      </h2>
      
      <!-- Subtitle 3 lines -->
      <div class="mb-4 sm:mb-6">
        <p class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight" style="color: #1E3A5F;">
          남자의 자신감을
        </p>
        <p class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight" style="color: #2563eb;">
          숫자로 확인하는
        </p>
        <p class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight" style="color: #1E3A5F;">
          과학적 셀프 체크
        </p>
      </div>

      <!-- Description -->
      <p class="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10">
        병원 가기 전, 나의 현재 상태를<br>
        객관적인 데이터로 먼저 정리해보세요.
      </p>

      <!-- Start Test Button -->
      <button
        @click="handleTestClick"
        class="w-full sm:w-auto px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-2xl text-white font-semibold text-lg sm:text-xl md:text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto"
        style="background: linear-gradient(180deg, #4A90E2 0%, #3A7BD5 100%);"
      >
        <span>테스트 시작하기</span>
        <svg class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Disclaimer Box -->
    <div class="mt-8 sm:mt-12 max-w-2xl w-full">
      <div class="bg-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
        <div class="flex items-start gap-3 sm:gap-4">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
            <p class="mb-2">
              <strong>100% 익명 보장.</strong> 개인정보를 수집하지 않으며,
            </p>
            <p class="mb-2">
              모든 결과는 브라우저 내에서만 계산됩니다.
            </p>
            <p class="text-xs sm:text-sm text-gray-600 mt-2">
              *본 테스트는 의학적 진단이 아닌 참고용 도구입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

// Function to generate a simple session ID
const generateSessionId = () => {
  let sessionId = sessionStorage.getItem('app_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('app_session_id', sessionId)
  }
  return sessionId
}

// Track page view
onMounted(async () => {
  const userId = generateSessionId()
  try {
    await $fetch('/api/page-view', {
      method: 'POST',
      body: {
        page: 'index',
        user_id: userId,
      },
    })
  } catch (error) {
    // Silent fail - don't interrupt user experience
    console.warn('Failed to track page view:', error)
  }
})

const handleTestClick = () => {
  router.push("/vitality-test")
}
</script>
