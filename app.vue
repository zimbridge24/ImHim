<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Pretendard 폰트를 head에 직접 추가
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://cdn.jsdelivr.net'
    },
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css'
    }
  ],
  style: [
    {
      children: `
        html, body, #app, * {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif !important;
        }
      `
    }
  ]
})
</script>

<style>
/* Tailwind 지시자 직접 포함 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 글로벌 기본 스타일 */
@layer base {
  html {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif !important;
    font-weight: 400;
    letter-spacing: -0.01em;
    line-height: 1.6;
  }
  
  * {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif !important;
  }
}

/* 간단한 글로벌 스타일 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
}
</style>
