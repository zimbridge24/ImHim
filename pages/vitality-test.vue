<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 font-sans">
    <!-- Logo at top left -->
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      <img 
        src="/logo.png" 
        alt="ImHim Logo" 
        class="h-12 sm:h-16 md:h-20 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity duration-200"
        @click="goToHome"
      />
    </div>

    <!-- Header -->
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
          국제 발기력 자가 테스트 (5문항)
        </h1>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          지난 6개월 동안의 경험을 떠올리며, 각 문항에 가장 가깝다고 느끼는 답을 선택해주세요. 
          모든 문항은 익명이며 결과는 저장되지 않습니다.
        </p>
      </div>

      <!-- Questions Section -->
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-6 sm:p-8 mb-6">
        <div class="space-y-8">
          <div
            v-for="question in questions"
            :key="question.id"
            class="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
          >
            <h3 class="text-lg sm:text-xl font-medium text-gray-800 mb-4">
              Q{{ question.id }}. {{ question.text }}
            </h3>
            <div class="space-y-2">
              <label
                v-for="option in options"
                :key="option.value"
                :class="[
                  'flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                  answers[question.id] === option.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <input
                  type="radio"
                  :name="`question-${question.id}`"
                  :value="option.value"
                  v-model="answers[question.id]"
                  class="sr-only"
                />
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0',
                    answers[question.id] === option.value
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300 bg-white'
                  ]"
                >
                  <div
                    v-if="answers[question.id] === option.value"
                    class="w-2 h-2 rounded-full bg-white"
                  ></div>
                </div>
                <span class="text-sm sm:text-base text-gray-700 flex-1">
                  {{ option.label }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Button -->
      <div class="text-center mb-6">
        <button
          @click="showResult = true"
          :disabled="!isComplete"
          :class="[
            'px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg',
            isComplete
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          결과 보기
        </button>
      </div>

      <!-- Result Card -->
      <div
        v-if="showResult"
        class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-8 mb-6"
      >
        <div class="text-center mb-6">
          <div class="inline-block bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl px-6 py-3 mb-4">
            <div class="text-4xl sm:text-5xl font-bold">{{ totalScore }}</div>
            <div class="text-sm sm:text-base opacity-90">점 / 25점</div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            {{ resultCategory }}
          </h2>
          <p class="text-lg text-gray-600">
            {{ resultSummary }}
          </p>
        </div>

        <div class="space-y-6">
          <!-- Detailed Description -->
          <div class="bg-gray-50 rounded-2xl p-5">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">상세 설명</h3>
            <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {{ resultDescription }}
            </p>
          </div>

          <!-- Lifestyle Tips -->
          <div class="bg-blue-50 rounded-2xl p-5">
            <h3 class="text-lg font-semibold text-blue-800 mb-3">생활습관 팁</h3>
            <ul class="space-y-2 text-base text-blue-700">
              <li v-for="(tip, index) in lifestyleTips" :key="index" class="flex items-start">
                <span class="text-blue-500 mr-2">•</span>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>

          <!-- Nutrition Guide -->
          <div class="bg-amber-50 rounded-2xl p-5">
            <h3 class="text-lg font-semibold text-amber-800 mb-3">도움이 될 수 있는 영양소</h3>
            <ul class="space-y-2 text-base text-amber-700">
              <li v-for="(nutrient, index) in nutritionGuide" :key="index" class="flex items-start">
                <span class="text-amber-500 mr-2">•</span>
                <span>{{ nutrient }}</span>
              </li>
            </ul>
          </div>

          <!-- Additional Note for Lower Scores -->
          <div
            v-if="totalScore <= 16"
            class="bg-orange-50 rounded-2xl p-5 border border-orange-200"
          >
            <p class="text-base text-orange-800 leading-relaxed">
              생활습관과 영양 관리를 해보는 것도 도움이 될 수 있지만, 이 점수 구간에서는 혼자 고민하기보다 비뇨의학과(비뇨기과) 전문의와 상의해 보는 것이 좋습니다.
            </p>
          </div>

          <!-- Disclaimer -->
          <div class="bg-gray-100 rounded-2xl p-5 border-l-4 border-gray-400">
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              ※ 이 테스트는 국제 발기 기능 지수(IIEF-5)를 참고한 자가 체크 도구로, 의학적 진단이나 치료를 대신할 수 없습니다. 증상이 지속되거나 불편감이 크다면 반드시 비뇨의학과(비뇨기과) 전문의와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Question {
  id: number
  text: string
}

interface Option {
  value: number
  label: string
}

const router = useRouter()

const questions: Question[] = [
  {
    id: 1,
    text: "지난 6개월 동안, 성적인 자극이 있을 때 발기가 시작되는 데 얼마나 자주 성공했나요?",
  },
  {
    id: 2,
    text: "성적인 자극이 있거나 성관계를 시도할 때, 삽입이 가능한 수준까지 발기를 유지하는 데 얼마나 자주 성공했나요?",
  },
  {
    id: 3,
    text: "성관계 중에, 끝날 때까지 발기를 유지할 수 있다는 자신감이 어느 정도였나요?",
  },
  {
    id: 4,
    text: "실제 성관계 시 발기가 충분히 단단하다고 느낀 정도는 어느 정도였나요?",
  },
  {
    id: 5,
    text: "전반적으로 지난 6개월 동안, 자신의 발기 기능에 얼마나 만족하셨나요?",
  },
]

const options: Option[] = [
  { value: 1, label: "거의 그렇지 않았다" },
  { value: 2, label: "가끔 그렇다" },
  { value: 3, label: "절반 정도 그렇다" },
  { value: 4, label: "대부분 그렇다" },
  { value: 5, label: "거의 항상 그렇다" },
]

const answers = ref<Record<number, number>>({})
const showResult = ref(false)

const totalScore = computed(() => {
  return questions.reduce((sum, q) => sum + (answers.value[q.id] || 0), 0)
})

const isComplete = computed(() => {
  return questions.every((q) => answers.value[q.id] !== undefined)
})

const resultCategory = computed(() => {
  const score = totalScore.value
  if (score >= 22) return "전반적으로 양호한 발기 기능"
  if (score >= 17) return "경도 수준의 발기 기능 저하 가능성"
  if (score >= 12) return "경도~중등도 수준의 발기 기능 저하 가능성"
  if (score >= 8) return "중등도 수준의 발기 기능 저하 가능성"
  return "중증 수준의 발기 기능 저하 가능성"
})

const resultSummary = computed(() => {
  const score = totalScore.value
  if (score >= 22) return "현재 전반적인 발기 기능은 비교적 양호한 편입니다."
  if (score >= 17) return "가벼운 수준의 변화가 느껴질 수 있는 구간입니다."
  if (score >= 12) return "발기 상태에 대한 불편감이 꽤 느껴질 수 있는 구간입니다."
  if (score >= 8) return "전문가와의 상담이 강하게 권장되는 구간입니다."
  return "전문의 진료가 매우 권장되는 구간입니다."
})

const resultDescription = computed(() => {
  const score = totalScore.value
  if (score >= 22) {
    return "일상적인 스트레스, 피로, 수면부족 등 일시적인 요인에 따라 컨디션이 변할 수 있지만, 현재로서는 큰 문제는 없어 보입니다.\n\n운동, 수면, 스트레스 관리를 잘 유지하는 것이 좋습니다."
  }
  if (score >= 17) {
    return "스트레스, 과로, 수면부족, 음주 등이 겹치면 컨디션 변화가 더 뚜렷하게 느껴질 수 있습니다.\n\n생활습관을 조정하면서 경과를 지켜보는 것이 좋습니다. 불편감이 계속된다면 전문의 상담을 고려할 수 있습니다."
  }
  if (score >= 12) {
    return "일상적인 성생활에 영향을 줄 수 있는 수준으로, 단순 피로나 일시적인 컨디션 저하만으로 보기 어려울 수 있습니다.\n\n비뇨의학과(비뇨기과) 전문의와 상의해 보는 것을 권장합니다."
  }
  if (score >= 8) {
    return "심혈관 건강, 호르몬, 만성질환, 약물 복용 등 다양한 요인을 함께 확인할 필요가 있습니다.\n\n혼자 고민하기보다는 비뇨의학과 전문의와 충분히 상담해 보세요."
  }
  return "이 테스트는 진단이 아니지만, 이 정도 점수라면 반드시 의학적 평가가 필요할 수 있습니다.\n\n심혈관 질환, 당뇨, 고혈압 등과 연관될 가능성도 있어 전문의 상담이 중요합니다."
})

const lifestyleTips = computed(() => {
  const score = totalScore.value
  const tips = [
    "주 3~4회, 30분 이상 유산소 운동(걷기, 조깅, 자전거 등)을 유지해 보세요.",
    "주 2~3회, 하체 및 코어 중심의 근력운동을 병행하면 혈류 개선과 체력 유지에 도움이 됩니다.",
    "수면 시간을 6~8시간으로 유지하고, 야근/야식을 줄이는 것이 좋습니다.",
    "과도한 음주와 흡연은 혈관 기능에 좋지 않으므로 가능한 줄이는 것이 좋습니다.",
  ]
  return tips
})

const nutritionGuide = computed(() => {
  return [
    "아르기닌, 시트룰린: 혈류와 순환을 돕는 아미노산으로, 운동 전/후 섭취가 연구되고 있습니다.",
    "아연, 비타민 D: 남성 건강과 전반적인 에너지 대사에 중요한 영양소로 알려져 있습니다.",
    "오메가-3 지방산: 심혈관 건강과 염증 조절에 도움이 될 수 있습니다.",
  ]
})

const goToHome = () => {
  router.push("/")
}
</script>

