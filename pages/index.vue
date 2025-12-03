<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">I'm Him</h1>
      <p class="hero-subtitle">남성 컨디션과 마음을 익명으로 상담하는 공간</p>
    </div>

    <!-- Cards Section -->
    <div class="cards-container">
      <!-- Card 1: Vitality Care -->
      <div class="card" @click="handleVitalityClick">
        <h2 class="card-title">Vitality Care</h2>
        <p class="card-subtitle">남성 컨디션·기능을 위한 영양제 가이드</p>
        <p class="card-description">
          증거 기반 영양제 정보를 안내하는 섹션입니다. (준비 중)
        </p>
      </div>

      <!-- Card 2: Mind & Confidence Talk -->
      <div class="card" @click="handleChatClick">
        <h2 class="card-title">Mind & Confidence Talk</h2>
        <p class="card-subtitle">성에 대한 고민을 익명으로 나누는 AI 심리상담</p>
        <p class="card-description">
          성적 고민과 스트레스를 익명으로 상담할 수 있는 AI 심리상담 서비스입니다.
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

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f5ff 0%, #f0f4f8 100%);
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-section {
  text-align: center;
  margin-bottom: 5rem;
  margin-top: 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 500;
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #718096;
  margin: 0;
  font-weight: 400;
  line-height: 1.7;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
}

.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 3rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.card-title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  letter-spacing: -0.01em;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #a0aec0;
  margin: 0 0 1.25rem 0;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.card-description {
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.7;
  font-weight: 300;
}

/* Desktop: Two columns */
@media (min-width: 768px) {
  .home-container {
    padding: 6rem 2rem;
  }

  .cards-container {
    flex-direction: row;
    gap: 3rem;
  }

  .card {
    flex: 1;
    padding: 3.5rem;
  }

  .hero-title {
    font-size: 4.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }
}
</style>

