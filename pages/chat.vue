<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 font-sans">
    <!-- Content -->
    <div class="relative z-10">
      <!-- Header with Logo -->
      <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div class="flex flex-col items-center justify-center mb-8">
          <div class="flex items-center gap-3 mb-4">
            <img 
              src="/logo.png" 
              alt="I'm힘 Logo" 
              class="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-lg"
            />
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 tracking-tight leading-none">
              I'm힘
            </h1>
          </div>
          <h2 class="text-2xl sm:text-3xl font-medium text-gray-700 mb-3">
            Mind & Confidence Talk
          </h2>
          <p class="text-base sm:text-lg text-gray-600 text-center max-w-2xl leading-relaxed">
            지금 가장 고민되는 점을 자유롭게 적어주세요. AI가 먼저 당신의 상황을 정리해 줍니다.
          </p>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div 
          ref="messagesContainer"
          class="relative bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 min-h-[400px] max-h-[500px] sm:max-h-[600px] overflow-y-auto space-y-4"
          style="background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.6)), url('/남자의섬.png'); background-size: cover; background-position: center; background-attachment: local;"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'flex w-full',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[75%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-lg',
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white rounded-br-md' 
                  : 'bg-white/95 text-gray-800 rounded-bl-md border border-gray-200/50'
              ]"
            >
              <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
                {{ message.text }}
              </p>
            </div>
          </div>
          
          <div v-if="loading" class="flex justify-start">
            <div class="bg-white/95 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-lg border border-gray-200/50">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"></span>
                <span class="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
                <span class="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Section -->
      <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div class="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 p-4 sm:p-5 flex items-end gap-3">
          <textarea
            v-model="userText"
            class="flex-1 resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm sm:text-base leading-relaxed max-h-32 overflow-y-auto font-normal"
            placeholder="메시지를 입력하세요..."
            rows="2"
            @keydown.enter.exact.prevent="handleSend"
            @keydown.enter.shift.exact="handleShiftEnter"
          ></textarea>
          <button
            class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
            :disabled="loading || !userText.trim()"
            @click="handleSend"
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
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  type: 'user' | 'ai'
  text: string
}

const userText = ref('')
const messages = ref<Message[]>([])
const loading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const handleShiftEnter = () => {
  // Shift+Enter는 줄바꿈 허용
}

const handleSend = async () => {
  if (!userText.value.trim() || loading.value) return

  const userMessage = userText.value.trim()
  userText.value = ''

  // 사용자 메시지 추가
  messages.value.push({
    type: 'user',
    text: userMessage,
  })

  scrollToBottom()
  loading.value = true

  try {
    const res = await $fetch<{ reply: string; summary: string }>('/api/ai-chat', {
      method: 'POST',
      body: {
        userText: userMessage,
        sessionType: 'mental',
      },
    })

    // AI 응답 추가
    messages.value.push({
      type: 'ai',
      text: res.reply,
    })
  } catch (error) {
    console.error(error)
    messages.value.push({
      type: 'ai',
      text: '죄송합니다. 지금은 상담 서버에 문제가 있어 응답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
/* Custom scrollbar for chat messages */
:deep(.overflow-y-auto) {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.4) rgba(255, 255, 255, 0.1);
}

:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 8px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background-color: rgba(139, 92, 246, 0.4);
  border-radius: 4px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background-color: rgba(139, 92, 246, 0.6);
}
</style>
