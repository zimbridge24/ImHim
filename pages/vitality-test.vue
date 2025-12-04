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
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
          I am Him
        </h1>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
          국제 발기 기능 지수(IIEF) 테스트
        </h2>
        <p class="text-base sm:text-lg text-slate-600 mb-2 max-w-2xl mx-auto">
          남자의 컨디션과 자신감을 점검하는 과학적 셀프 체크
        </p>
        <p class="text-sm sm:text-base text-slate-500 mb-4 max-w-2xl mx-auto">
          남자의 자신감을 숫자로 확인해보는 과학적 자기 점검
        </p>
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
        <!-- Score Display -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center">
          <div class="inline-block bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl px-8 py-6 mb-6">
            <div class="text-5xl sm:text-6xl font-bold mb-2">{{ totalScore }}</div>
            <div class="text-lg opacity-90">점 / 25점</div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {{ resultCategory }}
          </h2>
          <p class="text-lg text-slate-600">
            {{ severityCategory }}
          </p>
        </div>

        <!-- Radar Chart -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <h3 class="text-xl sm:text-2xl font-semibold text-slate-900 mb-6 text-center">
            발기 기능 영역별 분석
          </h3>
          <div class="flex justify-center">
            <canvas ref="radarCanvas" class="max-w-full" width="400" height="400"></canvas>
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

        <!-- AI Chatbot Section -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 text-white">
          <div class="text-center mb-6">
            <h3 class="text-2xl sm:text-3xl font-bold mb-3">남자의 섬</h3>
            <p class="text-base sm:text-lg text-slate-300 mb-4">
              결과가 신경 쓰이시나요? 아래에서 익명으로 '남자의 섬'과 대화를 나눠보세요.
            </p>
            <p class="text-sm sm:text-base text-slate-400">
              지금 점수가 왜 이렇게 나왔는지, 몸 때문인지 마음 때문인지 같이 정리해 드릴게요.
            </p>
          </div>
          
          <div class="bg-slate-700/50 rounded-2xl p-5 mb-6">
            <div class="flex items-start gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold">섬</span>
              </div>
              <div class="flex-1">
                <p class="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                  {{ chatbotOpeningMessage }}
                </p>
              </div>
            </div>
          </div>

          <button
            @click="goToChat"
            class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            대화 시작하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

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
    axisLabel: "발기 준비도",
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
    axisLabel: "관계 만족도",
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
    const nuxtApp = useNuxtApp()
    const db = nuxtApp.$db as any
    
    if (!db) {
      console.warn('Firestore not available')
      return
    }

    const userId = generateSessionId()
    const testData = {
      user_id: userId,
      test_date: serverTimestamp(),
      q1_score: answers.value[1] || 0,
      q2_score: answers.value[2] || 0,
      q3_score: answers.value[3] || 0,
      q4_score: answers.value[4] || 0,
      q5_score: answers.value[5] || 0,
      total_score: totalScore.value,
      severity_category: resultCategory.value,
      clientType: 'web',
    }

    await addDoc(collection(db, 'iiefTests'), testData)
    console.log('Test result saved to Firestore')
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

const nextQuestion = () => {
  if (!answers.value[currentQuestion.value.id]) return
  
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    showResult.value = true
    nextTick(() => {
      drawRadarChart()
      // Save result to Firestore when showing results
      saveTestResult()
    })
  }
}

onMounted(() => {
  generateSessionId()
})

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const drawRadarChart = () => {
  if (!radarCanvas.value) return

  const canvas = radarCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 40
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

  // Draw labels
  ctx.fillStyle = '#475569'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  questions.forEach((q, i) => {
    const angle = i * angleStep - Math.PI / 2
    const labelRadius = radius + 25
    const x = centerX + Math.cos(angle) * labelRadius
    const y = centerY + Math.sin(angle) * labelRadius
    ctx.fillText(q.axisLabel, x, y)
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

const goToChat = () => {
  router.push('/chat')
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
