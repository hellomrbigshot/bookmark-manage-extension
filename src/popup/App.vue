<template>
  <div class="w-80 min-h-[450px] max-h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col p-4 overflow-hidden">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-indigo-800">收藏箱</h1>
      <div class="text-xs text-indigo-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        <span>{{ new Date().toLocaleDateString() }}</span>
      </div>
    </div>
    <BookmarkList class="flex-grow overflow-hidden" />
  </div>
</template>

<script setup lang="ts">
import BookmarkList from '@/pages/BookmarkList.vue';
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: transparent;
  width: 320px;
  height: 500px;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style> 