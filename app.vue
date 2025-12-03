<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// 예전 코드에서 useUserStore 같은 건 전부 제거합니다.
// 여기서는 아무 상태도 사용하지 않고,
// 단순히 페이지를 렌더링만 합니다.
</script>

<style>
/* 간단한 글로벌 스타일 (원하면 조정 가능) */
html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
}
</style>
