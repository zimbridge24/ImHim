<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Logo at top left -->
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      <img 
        src="/ImHim.png" 
        alt="I am Him Logo" 
        class="h-10 sm:h-12 md:h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity duration-200"
        @click="goToHome"
      />
    </div>

    <!-- Hero Section -->
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="text-center mb-8">
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-2xl mx-auto">
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong class="text-slate-800">✓ 개인정보를 수집하지 않습니다.</strong> 결과는 브라우저 내에서만 계산됩니다.<br>
            <strong class="text-slate-800">✓ 의학적 진단이 아닌,</strong> 자기 이해를 위한 참고용 도구입니다.
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="!showResult" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-slate-700">진행 상황</span>
          <span class="text-sm font-semibold text-blue-600">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Questions Section (One at a time) -->
      <div v-if="!showResult" class="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 mb-6">
        <div class="mb-6">
          <h3 class="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">
            Q{{ currentQuestion.id }}. {{ currentQuestion.text }}
          </h3>
          <p class="text-sm text-slate-500 mb-6">지난 6개월 동안의 경험을 기준으로 선택해주세요.</p>
          
          <div class="space-y-3">
            <label
              v-for="option in options"
              :key="option.value"
              :class="[
                'flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 min-h-[60px]',
                answers[currentQuestion.id] === option.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              ]"
            >
              <input
                type="radio"
                :name="`question-${currentQuestion.id}`"
                :value="option.value"
                v-model="answers[currentQuestion.id]"
                class="sr-only"
              />
              <div
                :class="[
                  'w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0',
                  answers[currentQuestion.id] === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 bg-white'
                ]"
              >
                <div
                  v-if="answers[currentQuestion.id] === option.value"
                  class="w-3 h-3 rounded-full bg-white"
                ></div>
              </div>
              <span class="text-base sm:text-lg text-slate-700 flex-1 font-medium">
                {{ option.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-8">
          <button
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            class="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            이전
          </button>
          <button
            @click="nextQuestion"
            :disabled="!answers[currentQuestion.id]"
            :class="[
              'flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200',
              answers[currentQuestion.id]
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{ currentQuestionIndex === questions.length - 1 ? '결과 보기' : '다음' }}
          </button>
        </div>
      </div>

      <!-- Result Section -->
      <div v-if="showResult" class="space-y-6">
        <!-- Result Container for Image Export (점수부터 남자의 섬 전까지) -->
        <div ref="resultContainer" class="space-y-6">
          <!-- Score Display -->
          <div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center">
            <div class="inline-block bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl px-8 py-6 mb-6">
              <div class="flex items-baseline justify-center gap-1">
                <span ref="scoreDisplayElement" class="text-5xl sm:text-6xl font-bold leading-none" :data-score="totalScore" v-text="totalScore"></span>
                <span class="text-lg opacity-90 leading-none whitespace-nowrap">점&nbsp;/&nbsp;25점</span>
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {{ resultCategory }}
            </h2>
            <p class="text-lg text-slate-600">
              {{ severityCategory }}
            </p>
          </div>

          <!-- Radar Chart -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-2 sm:p-3">
          <h3 class="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6 text-center">
            발기 기능 영역별 분석
          </h3>
          <div class="flex justify-center overflow-visible">
            <canvas ref="radarCanvas" class="max-w-full" width="600" height="600"></canvas>
          </div>
        </div>

          <!-- Summary Text -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl border border-blue-200 p-6 sm:p-8">
            <h3 class="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">
              결과 요약
            </h3>
            <div class="space-y-3 text-base sm:text-lg text-slate-700 leading-relaxed">
              <p>{{ summaryText }}</p>
            </div>
          </div>

          <!-- Body & Mind Analysis -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h4 class="text-lg font-semibold text-green-800 mb-3">Body (신체적 요인)</h4>
              <p class="text-sm sm:text-base text-green-700 leading-relaxed">{{ bodyComment }}</p>
            </div>
            <div class="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h4 class="text-lg font-semibold text-purple-800 mb-3">Mind (심리적 요인)</h4>
              <p class="text-sm sm:text-base text-purple-700 leading-relaxed">{{ mindComment }}</p>
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="bg-gray-100 rounded-2xl p-5 border-l-4 border-gray-400">
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ※ 이 테스트는 국제 발기 기능 지수(IIEF-5)를 참고한 자가 체크 도구로, 의학적 진단이나 치료를 대신할 수 없습니다. 증상이 지속되거나 불편감이 크다면 반드시 비뇨의학과(비뇨기과) 전문의와 상담하시기 바랍니다.
            </p>
          </div>
        </div>

        <!-- AI Consultation Section (이미지 저장에서 제외) -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <!-- 남자의 섬 Header -->
          <div class="text-center mb-6">
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">남자의 섬</h3>
            <p class="text-sm sm:text-base text-slate-600 mb-6">AI Men's Health Coach</p>
          </div>

          <!-- Opening Message -->
          <div class="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <p class="text-sm sm:text-base text-slate-700 leading-relaxed">
              반가워요. 남자의 섬 입니다. 여기서 나누는 모든 대화는 익명으로 처리되니 안심하세요. 말하기 힘든 고민일수록 쿨하게 털어놓는 게 해결의 시작입니다. 저는 의사는 아니지만, '가장 현실적인 조언'을 드리는 AI 코치예요. 오늘 어떤 점이 가장 신경 쓰이셨나요?
            </p>
          </div>

          <!-- Chat Messages (if any) -->
          <div v-if="chatMessages.length > 0" class="mb-6 space-y-4 max-h-96 overflow-y-auto">
            <div
              v-for="(msg, index) in chatMessages"
              :key="index"
              :class="[
                'flex w-full',
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'max-w-[75%] rounded-2xl px-5 py-3.5 shadow-md',
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
                ]"
              >
                <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {{ msg.text }}
                </p>
              </div>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="chatLoading" class="mb-6 flex justify-start">
            <div class="bg-gray-100 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-md border border-gray-200">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></span>
                <span class="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
                <span class="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
              </div>
            </div>
          </div>

          <!-- Input Section -->
          <div class="bg-gray-50 rounded-2xl p-4 mb-6 flex items-end gap-3">
            <textarea
              v-model="consultationQuestion"
              class="flex-1 resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm sm:text-base leading-relaxed max-h-32 overflow-y-auto"
              placeholder="고민을 입력하세요..."
              rows="2"
              @keydown.enter.exact.prevent="handleConsultationSend"
              @keydown.enter.shift.exact="handleShiftEnter"
            ></textarea>
            <button
              @click="handleConsultationSend"
              :disabled="chatLoading || !consultationQuestion.trim()"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 mb-6">
            <button
              @click="resetTest"
              class="flex-1 py-3 px-6 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              다시하기
            </button>
            <button
              @click="saveResultAsImage"
              class="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              결과저장
            </button>
          </div>

          <!-- Disclaimer -->
          <div class="text-center">
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
              본 결과는 의료적 진단이 아닙니다.<br>
              정확한 진단과 치료는 전문의와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Question {
  id: number
  text: string
  axisLabel: string
}

interface Option {
  value: number
  label: string
}

const router = useRouter()

const questions: Question[] = [
  {
    id: 1,
    text: "지난 6개월 동안, 성적 자극을 받았을 때 발기가 얼마나 자주 되었나요?",
    axisLabel: "발기 빈도",
  },
  {
    id: 2,
    text: "성관계를 시작할 만큼 충분한 발기가 되는 빈도는 어느 정도였나요?",
    axisLabel: "발기\n준비도",
  },
  {
    id: 3,
    text: "성관계 중에 발기가 끝까지 유지되는 편인가요?",
    axisLabel: "발기 유지력",
  },
  {
    id: 4,
    text: "발기의 단단함(강도)에 얼마나 만족하시나요?",
    axisLabel: "발기 강도",
  },
  {
    id: 5,
    text: "전반적인 성관계 경험에 얼마나 만족하시나요?",
    axisLabel: "성관계\n만족도",
  },
]

const options: Option[] = [
  { value: 1, label: "매우 좋지 않음 / 거의 그렇지 않음" },
  { value: 2, label: "좋지 않음 / 가끔 그렇다" },
  { value: 3, label: "보통 / 절반 정도 그렇다" },
  { value: 4, label: "좋음 / 대부분 그렇다" },
  { value: 5, label: "매우 좋음 / 거의 항상 그렇다" },
]

const answers = ref<Record<number, number>>({})
const currentQuestionIndex = ref(0)
const showResult = ref(false)
const radarCanvas = ref<HTMLCanvasElement | null>(null)
const sessionId = ref<string>('')
const savingResult = ref(false)
const consultationQuestion = ref('')
const chatMessages = ref<Array<{ type: 'user' | 'ai'; text: string }>>([])
const chatLoading = ref(false)
const resultContainer = ref<HTMLElement | null>(null)
const scoreDisplayElement = ref<HTMLElement | null>(null)

// Generate anonymous session ID
const generateSessionId = () => {
  if (!sessionId.value) {
    // Check if session ID exists in sessionStorage
    const stored = sessionStorage.getItem('iief_session_id')
    if (stored) {
      sessionId.value = stored
    } else {
      // Generate new session ID
      sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('iief_session_id', sessionId.value)
    }
  }
  return sessionId.value
}

// Save test result to Firestore
const saveTestResult = async () => {
  if (savingResult.value) return // Prevent duplicate saves
  
  try {
    savingResult.value = true
    const userId = generateSessionId()
    
    await $fetch('/api/save-test-result', {
      method: 'POST',
      body: {
        user_id: userId,
        q1_score: answers.value[1] || 0,
        q2_score: answers.value[2] || 0,
        q3_score: answers.value[3] || 0,
        q4_score: answers.value[4] || 0,
        q5_score: answers.value[5] || 0,
        total_score: totalScore.value,
        severity_category: resultCategory.value,
      },
    })
  } catch (error: any) {
    console.error('Error saving test result:', error)
    // Don't show error to user, just log it
  } finally {
    savingResult.value = false
  }
}

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const totalScore = computed(() => {
  return questions.reduce((sum, q) => sum + (answers.value[q.id] || 0), 0)
})

const resultCategory = computed(() => {
  const score = totalScore.value
  if (score >= 22) return "정상 범위"
  if (score >= 17) return "경도 기능 저하"
  if (score >= 12) return "중등도 기능 저하"
  if (score >= 8) return "중등도~중증 기능 저하"
  return "중증 기능 저하 가능성"
})

const severityCategory = computed(() => {
  const score = totalScore.value
  if (score >= 22) return "정상 범위 (22-25점)"
  if (score >= 17) return "경도 기능 저하 (17-21점)"
  if (score >= 12) return "중등도 기능 저하 (12-16점)"
  if (score >= 8) return "중등도~중증 기능 저하 (8-11점)"
  return "중증 기능 저하 가능성 (5-7점)"
})

const summaryText = computed(() => {
  const score = totalScore.value
  const category = resultCategory.value
  
  if (score >= 22) {
    return `현재 IIEF-5 점수는 ${score}점으로, '${category}' 범위에 해당합니다. 전반적으로 발기 기능이 양호한 상태입니다. 일시적인 컨디션 저하나 스트레스의 영향일 수 있으며, 현재 상태를 유지하는 것이 중요합니다.`
  } else if (score >= 17) {
    return `현재 IIEF-5 점수는 ${score}점으로, '${category}' 범위에 해당합니다. 가벼운 수준의 변화가 느껴질 수 있는 구간입니다. 일시적인 컨디션 저하나 스트레스의 영향일 수 있으며, 생활 습관 관리만으로도 개선 여지가 큰 단계입니다. 너무 겁먹을 필요는 없지만, 지금 상태를 가볍게 넘기지 말고 점검해 보는 것이 좋습니다.`
  } else if (score >= 12) {
    return `현재 IIEF-5 점수는 ${score}점으로, '${category}' 범위에 해당합니다. 발기 기능에 대한 불편감이 꽤 느껴질 수 있는 구간입니다. 일상적인 성생활에 영향을 줄 수 있는 수준으로, 단순 피로나 일시적인 컨디션 저하만으로 보기 어려울 수 있습니다. 발기부전의 증상과 유사한 부분이 보입니다.`
  } else if (score >= 8) {
    return `현재 IIEF-5 점수는 ${score}점으로, '${category}' 범위에 해당합니다. 전문가와의 상담이 강하게 권장되는 구간입니다. 심혈관 건강, 호르몬, 만성질환, 약물 복용 등 다양한 요인을 함께 확인할 필요가 있습니다. 발기부전의 증상과 유사한 부분이 보입니다.`
  } else {
    return `현재 IIEF-5 점수는 ${score}점으로, '${category}' 범위에 해당합니다. 전문의 진료가 매우 권장되는 구간입니다. 이 테스트는 진단이 아니지만, 이 정도 점수라면 반드시 의학적 평가가 필요할 수 있습니다. 심혈관 질환, 당뇨, 고혈압 등과 연관될 가능성도 있어 전문의 상담이 중요합니다.`
  }
})

const bodyComment = computed(() => {
  const score = totalScore.value
  if (score >= 22) {
    return "신체적 요인은 크게 문제가 없어 보입니다. 규칙적인 운동과 건강한 생활습관을 유지하시면 됩니다."
  } else if (score >= 17) {
    return "신체적 요인보다는 일시적인 컨디션 저하나 스트레스의 영향일 가능성이 있습니다. 운동과 수면 관리를 중시해보세요."
  } else if (score >= 12) {
    return "신체적 요인(혈류, 호르몬, 만성질환 등)을 점검할 필요가 있습니다. 비뇨의학과 전문의와 상담을 권장합니다."
  } else {
    return "신체적 요인(심혈관 건강, 호르몬, 만성질환 등)을 반드시 확인해야 합니다. 전문의 진료가 필요합니다."
  }
})

const mindComment = computed(() => {
  const score = totalScore.value
  if (score >= 22) {
    return "심리적 요인은 크게 문제가 없어 보입니다. 자신감을 유지하시면 됩니다."
  } else if (score >= 17) {
    return "심리적 요인(스트레스, 불안, 자신감 등)이 영향을 줄 수 있습니다. 마음 관리와 스트레스 해소에 집중해보세요."
  } else if (score >= 12) {
    return "심리적 요인(스트레스, 불안, 자신감 저하 등)이 상당한 영향을 줄 수 있습니다. 전문 상담을 고려해보세요."
  } else {
    return "심리적 요인과 신체적 요인이 복합적으로 작용할 수 있습니다. 전문가의 종합적인 평가가 필요합니다."
  }
})

const chatbotOpeningMessage = `반가워요. 남자의 섬 입니다.

여기서 나누는 모든 대화는 익명으로 처리되니 안심하세요.

말하기 힘든 고민일수록 쿨하게 털어놓는 게 해결의 시작입니다.

저는 의사는 아니고, 대신 '가장 현실적인 조언'을 드리는 AI 코치예요.

오늘 어떤 점이 가장 신경 쓰이셨나요?`

const nextQuestion = async () => {
  // 현재 질문 인덱스 확인
  if (currentQuestionIndex.value < 0 || currentQuestionIndex.value >= questions.length) {
    console.error('Invalid question index:', currentQuestionIndex.value)
    return
  }
  
  const currentQ = questions[currentQuestionIndex.value]
  if (!currentQ) {
    console.error('Question not found at index:', currentQuestionIndex.value)
    return
  }
  
  // 현재 질문에 답이 없으면 리턴
  if (!answers.value[currentQ.id]) {
    console.log('No answer for question', currentQ.id)
    return
  }
  
  if (currentQuestionIndex.value < questions.length - 1) {
    // 다음 질문으로 이동
    currentQuestionIndex.value++
  } else {
    // 마지막 질문이면 결과 표시
    console.log('Showing results, total score:', totalScore.value)
    showResult.value = true
    await nextTick()
    drawRadarChart()
    // Save result to Firestore when showing results
    saveTestResult()
  }
}

onMounted(async () => {
  generateSessionId()
  
  // Track page view
  try {
    await $fetch('/api/page-view', {
      method: 'POST',
      body: {
        page: 'vitality-test',
      },
    })
  } catch (error) {
    // Silent fail
  }
})

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const resetTest = () => {
  answers.value = {}
  currentQuestionIndex.value = 0
  showResult.value = false
  chatMessages.value = []
  consultationQuestion.value = ''
}

const drawRadarChart = () => {
  if (!radarCanvas.value) return

  const canvas = radarCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 80 // 차트 크기 줄임 (60 -> 80, 더 작은 차트)
  const numAxes = 5
  const angleStep = (Math.PI * 2) / numAxes

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw grid circles
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Draw axes
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  // Draw labels (라벨을 차트에 가깝게 배치하여 잘림 방지)
  ctx.fillStyle = '#475569'
  ctx.font = 'bold 20px sans-serif' // 글씨 크기 증가 (18px -> 20px)
  ctx.textBaseline = 'middle'
  
  questions.forEach((q, i) => {
    const angle = i * angleStep - Math.PI / 2
    const labelRadius = radius + 25 // 라벨을 차트에 가깝게 배치 (70 -> 25)
    let x = centerX + Math.cos(angle) * labelRadius
    const y = centerY + Math.sin(angle) * labelRadius
    
    // 텍스트 정렬 조정 (각도에 따라)
    if (Math.abs(Math.cos(angle)) < 0.1) {
      // 위/아래
      ctx.textAlign = 'center'
    } else if (Math.cos(angle) > 0) {
      // 오른쪽
      ctx.textAlign = 'left'
      x = x + 5 // 약간의 여백만
    } else {
      // 왼쪽
      ctx.textAlign = 'right'
      x = x - 5 // 약간의 여백만
    }
    
    // 줄바꿈이 있는 경우 처리
    const labelText = q.axisLabel
    if (labelText.includes('\n')) {
      const lines = labelText.split('\n')
      const lineHeight = 22
      const startY = y - ((lines.length - 1) * lineHeight) / 2
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, x, startY + lineIndex * lineHeight)
      })
    } else {
      ctx.fillText(labelText, x, y)
    }
  })

  // Draw data polygon
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.beginPath()

  questions.forEach((q, i) => {
    const value = answers.value[q.id] || 0
    const normalizedValue = (value / 5) * radius
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + Math.cos(angle) * normalizedValue
    const y = centerY + Math.sin(angle) * normalizedValue

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Draw data points
  ctx.fillStyle = '#3b82f6'
  questions.forEach((q, i) => {
    const value = answers.value[q.id] || 0
    const normalizedValue = (value / 5) * radius
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + Math.cos(angle) * normalizedValue
    const y = centerY + Math.sin(angle) * normalizedValue

    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()
  })
}

const goToHome = () => {
  router.push('/')
}

const handleShiftEnter = () => {
  // Shift+Enter는 줄바꿈 허용
}

const handleConsultationSend = async () => {
  if (!consultationQuestion.value.trim() || chatLoading.value) return

  const userMessage = consultationQuestion.value.trim()
  consultationQuestion.value = ''

  // 사용자 메시지 추가
  chatMessages.value.push({
    type: 'user',
    text: userMessage,
  })

  chatLoading.value = true

  try {
    // 테스트 결과 데이터 준비
    const testResultData = {
      totalScore: totalScore.value,
      resultCategory: resultCategory.value,
      severityCategory: severityCategory.value,
      q1Score: answers.value[1] || 0,
      q2Score: answers.value[2] || 0,
      q3Score: answers.value[3] || 0,
      q4Score: answers.value[4] || 0,
      q5Score: answers.value[5] || 0,
      summaryText: summaryText.value,
      bodyComment: bodyComment.value,
      mindComment: mindComment.value,
    }

    const res = await $fetch<{ reply: string; summary: string }>('/api/ai-chat', {
      method: 'POST',
      body: {
        userText: userMessage,
        sessionType: 'mental',
        testResult: testResultData, // 테스트 결과 데이터 전달
      },
    })

    // AI 응답 추가
    chatMessages.value.push({
      type: 'ai',
      text: res.reply,
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    let errorMessage = '죄송합니다. 지금은 상담 서버에 문제가 있어 응답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    
    if (error.status === 400) {
      errorMessage = error.data?.message || error.statusMessage || '요청 형식이 올바르지 않습니다. 다시 시도해 주세요.'
    } else if (error.status === 500) {
      errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    }
    
    chatMessages.value.push({
      type: 'ai',
      text: errorMessage,
    })
  } finally {
    chatLoading.value = false
    // Scroll to bottom of chat messages
    nextTick(() => {
      const chatContainer = document.querySelector('.space-y-4')
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    })
  }
}

const saveResultAsImage = async () => {
  if (!resultContainer.value) {
    alert('결과를 불러올 수 없습니다.')
    return
  }

  try {
    // Vue DOM 렌더링이 끝나도록 잠깐 대기
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    // 폰트 로딩 대기 (Pretendard 등)
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }
    
    // 추가 대기 시간 (폰트 완전 로딩 보장)
    await new Promise(resolve => setTimeout(resolve, 200))

    // html-to-image 동적 import
    const { toPng } = await import('html-to-image')

    const node = resultContainer.value as HTMLElement

    // 네트워크 요청을 차단하여 폰트 재로드 방지
    const originalFetch = window.fetch
    const originalXHROpen = XMLHttpRequest.prototype.open
    const originalXHRSend = XMLHttpRequest.prototype.send
    
    window.fetch = function(...args) {
      const url = args[0]?.toString() || ''
      // Pretendard 폰트 관련 요청 차단
      if (url.includes('pretendard') || url.includes('woff') || url.includes('woff2')) {
        // 빈 응답 반환 (에러 방지)
        return Promise.resolve(new Response('', { status: 200 }))
      }
      return originalFetch.apply(this, args)
    }
    
    // XMLHttpRequest도 차단
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) {
      const urlStr = url.toString()
      if (urlStr.includes('pretendard') || urlStr.includes('woff') || urlStr.includes('woff2')) {
        // 빈 URL로 설정하여 요청 방지
        return (originalXHROpen as any).call(this, method, 'about:blank', async ?? true, username, password)
      }
      return (originalXHROpen as any).call(this, method, url, async ?? true, username, password)
    }

    // 폰트 및 CSS 관련 에러를 무시하고 계속 진행
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const errorText = args.map(arg => String(arg)).join(' ')
      // 폰트 및 CSS 보안 관련 에러는 무시
      if (errorText.includes('ERR_INSUFFICIENT_RESOURCES') || 
          errorText.includes('pretendard') ||
          errorText.includes('cssRules') ||
          errorText.includes('SecurityError') ||
          errorText.includes('Cannot access rules')) {
        return
      }
      originalConsoleError.apply(console, args)
    }

    let dataUrl: string
    
    try {
      dataUrl = await toPng(node, {
        cacheBust: false,          // 외부 폰트 재로드 방지
        pixelRatio: 2,             // 고해상도
        backgroundColor: '#ffffff',
      })
    } catch (error: any) {
      // CSS 보안 오류나 폰트 관련 에러인 경우 재시도
      const errorMessage = error?.message || error?.toString() || ''
      if (errorMessage.includes('ERR_INSUFFICIENT_RESOURCES') || 
          errorMessage.includes('cssRules') || 
          errorMessage.includes('SecurityError') ||
          errorMessage.includes('Cannot access rules')) {
        // CSS 인라인을 시도하지 않고 바로 캡처 (최소 옵션)
        try {
          dataUrl = await toPng(node, {
            pixelRatio: 2,
            backgroundColor: '#ffffff',
          })
        } catch (retryError: any) {
          // 마지막 시도: 기본 옵션만
          dataUrl = await toPng(node, {
            backgroundColor: '#ffffff',
          })
        }
      } else {
        throw error
      }
    } finally {
      // 원래 함수들 복원
      window.fetch = originalFetch
      XMLHttpRequest.prototype.open = originalXHROpen
      XMLHttpRequest.prototype.send = originalXHRSend
      console.error = originalConsoleError
    }

    // 다운로드 링크 생성
    const link = document.createElement('a')
    link.download = `IIEF-5-결과-${Date.now()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error saving image:', error)
    alert('이미지 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  }
}

// Data schema for Google Looker Studio
// {
//   user_id: string (anonymous session ID),
//   test_date: timestamp,
//   q1_score: number (1-5),
//   q2_score: number (1-5),
//   q3_score: number (1-5),
//   q4_score: number (1-5),
//   q5_score: number (1-5),
//   total_score: number (5-25),
//   severity_category: string ("정상", "경도", "중등도", "중등도중증", "중증")
// }
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
