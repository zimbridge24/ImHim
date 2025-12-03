<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <h1 class="page-title">Mind & Confidence Talk</h1>
      <p class="header-description">
        지금 가장 고민되는 점을 자유롭게 적어주세요. AI가 먼저 당신의 상황을 정리해 줍니다.
      </p>
    </div>

    <!-- Chat Messages Area -->
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.type]"
      >
        <div class="message-bubble">
          <p class="message-text">{{ message.text }}</p>
        </div>
      </div>
      <div v-if="loading" class="message ai">
        <div class="message-bubble">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="chat-input-section">
      <div class="input-wrapper">
        <textarea
          v-model="userText"
          class="chat-input"
          placeholder="메시지를 입력하세요..."
          rows="2"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.enter.shift.exact="handleShiftEnter"
        ></textarea>
        <button
          class="send-button"
          :disabled="loading || !userText.trim()"
          @click="handleSend"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
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
.chat-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f5ff 0%, #f0f4f8 100%);
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.chat-header {
  margin-bottom: 2rem;
  text-align: left;
}

.page-title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  color: #2d3748;
  letter-spacing: -0.01em;
}

.header-description {
  font-size: 1rem;
  color: #718096;
  margin: 0;
  line-height: 1.7;
  font-weight: 400;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 400px;
  max-height: 600px;
}

.message {
  display: flex;
  width: 100%;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  position: relative;
  word-wrap: break-word;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message.ai .message-bubble {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #2d3748;
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message-text {
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap;
}

.message.user .message-text {
  color: white;
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a0aec0;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-section {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  background: transparent;
  color: #2d3748;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
}

.chat-input::placeholder {
  color: #a0aec0;
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .chat-container {
    padding: 3rem 2rem;
    height: 100vh;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .chat-messages {
    max-height: calc(100vh - 300px);
  }
}
</style>
