<template>
  <div class="flex flex-col h-full w-full">
    <!-- 空状态设计 -->
    <div v-if="bookmarks.length === 0" class="flex flex-col items-center justify-center flex-1 p-4 bg-white rounded-lg shadow-sm border border-indigo-100 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <p class="text-gray-500 mb-1 text-sm">暂无收藏内容</p>
      <p class="text-xs text-gray-400">请在网页上右键点击并选择"添加到收藏箱"</p>
    </div>

    <template v-else>
      <!-- 搜索框 -->
      <div class="mb-2 sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-2">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索收藏..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-indigo-100 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300 text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- 同步状态指示器 -->
      <div v-if="isSyncing" class="flex items-center justify-center py-1 px-2 bg-indigo-50 rounded text-xs text-indigo-600 mx-2 mb-2">
        <svg class="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        数据同步中...
      </div>

      <!-- 书签列表 -->
      <div class="flex-1 overflow-y-auto space-y-1.5 px-2">
        <div v-for="bookmark in filteredBookmarks" :key="bookmark.id" 
          :class="[
            'group bg-white rounded-md shadow-sm border overflow-hidden transition-all duration-200',
            isOverdue(bookmark) ? 'border-red-300 hover:shadow-red-100' : 'border-indigo-100 hover:shadow'
          ]">
          
          <!-- 书签内容 -->
          <div class="p-2">
            <div class="flex justify-between items-start">
              <h3 class="text-sm font-semibold truncate max-w-[180px]"
                :class="isOverdue(bookmark) ? 'text-red-600 group-hover:text-red-700' : 'text-gray-700 group-hover:text-indigo-700'"
                :title="bookmark.title">
                {{ bookmark.title }}
              </h3>
              <span class="text-[10px] text-gray-400 whitespace-nowrap ml-1">{{ formatDate(bookmark.addedTime) }}</span>
            </div>
            
            <a :href="bookmark.url" target="_blank" 
              class="mt-0.5 text-xs block truncate hover:underline transition-colors"
              :class="isOverdue(bookmark) ? 'text-red-500 hover:text-red-700' : 'text-indigo-500 hover:text-indigo-700'">
              {{ formatUrl(bookmark.url) }}
            </a>
            
            <!-- 预期查看时间 -->
            <div v-if="bookmark.expectedViewTime" class="mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" 
                :class="[
                  'h-3 w-3 mr-1', 
                  isOverdue(bookmark) ? 'text-red-500' : 'text-indigo-400'
                ]" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span 
                :class="[
                  'text-[10px]', 
                  isOverdue(bookmark) ? 'text-red-500 font-medium' : 'text-gray-500'
                ]">
                {{ formatExpectedTime(bookmark.expectedViewTime) }}
                <span v-if="isOverdue(bookmark)" class="text-red-600 ml-1">(已超时)</span>
              </span>
            </div>
            
            <!-- 标签和操作按钮 -->
            <div class="mt-1.5 flex items-center justify-between">
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                :class="isOverdue(bookmark) ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700'">
                {{ getDomainName(bookmark.url) }}
              </span>
              
              <div class="flex items-center">
                <button 
                  @click.stop="copyUrl(bookmark.url)"
                  class="mr-2 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors p-1"
                  title="复制链接"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button 
                  @click.stop="removeBookmark(bookmark.id)"
                  class="text-gray-400 hover:text-red-600 focus:outline-none transition-colors p-1"
                  title="删除书签"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚信息 -->
      <div class="flex justify-between items-center text-[10px] text-gray-400 mt-1 px-2 py-1 border-t border-indigo-50">
        <span>共{{ filteredBookmarks.length }}个收藏 
          <span v-if="overdueCount > 0" class="text-red-500 ml-1">({{ overdueCount }}个已超时)</span>
        </span>
        <span class="flex items-center text-indigo-500" title="已启用跨设备同步">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          跨设备同步
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  addedTime: number;
  expectedViewTime?: number | null;
}

const bookmarks = ref<Bookmark[]>([]);
const searchQuery = ref('');
const isSyncing = ref(false);
const now = ref(Date.now());

// 每分钟更新当前时间，用于检查超时状态
setInterval(() => {
  now.value = Date.now();
}, 60000);

// 计算过滤后的书签列表
const filteredBookmarks = computed(() => {
  if (!searchQuery.value) return bookmarks.value;
  
  const query = searchQuery.value.toLowerCase();
  return bookmarks.value.filter(bookmark => 
    bookmark.title.toLowerCase().includes(query) || 
    bookmark.url.toLowerCase().includes(query)
  );
});

// 计算超时的书签数量
const overdueCount = computed(() => {
  return bookmarks.value.filter(bookmark => 
    bookmark.expectedViewTime && bookmark.expectedViewTime < now.value
  ).length;
});

// 检查书签是否超时
const isOverdue = (bookmark: Bookmark): boolean => {
  return !!bookmark.expectedViewTime && bookmark.expectedViewTime < now.value;
};

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const currentNow = new Date();
  
  // 今天的日期
  if (date.toDateString() === currentNow.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 昨天的日期
  const yesterday = new Date(currentNow);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 其他日期
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 格式化预期查看时间
const formatExpectedTime = (timestamp: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const currentNow = new Date();
  
  // 相同的一天
  if (date.toDateString() === currentNow.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 明天
  const tomorrow = new Date(currentNow);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return `明天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 本周内其他日期
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const diffDays = Math.round((date.getTime() - currentNow.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7 && diffDays > 0) {
    return `${days[date.getDay()]} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 其他日期
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 格式化URL
const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch (e) {
    return url;
  }
};

// 获取域名
const getDomainName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return '未知';
  }
};

// 复制URL到剪贴板
const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板');
  }).catch(err => {
    console.error('复制失败:', err);
  });
};

// 加载书签
const loadBookmarks = () => {
  console.log('开始加载书签...');
  isSyncing.value = true;
  
  chrome.storage.sync.get('bookmarks', (result) => {
    console.log('同步存储中的书签数据:', result);
    // 确保 bookmarks 是数组
    bookmarks.value = Array.isArray(result.bookmarks) ? result.bookmarks : [];
    console.log('从同步存储加载到的书签:', bookmarks.value);
    isSyncing.value = false;
  });
};

// 删除书签
const removeBookmark = (id: string) => {
  console.log('删除书签:', id);
  isSyncing.value = true;
  
  const newBookmarks = bookmarks.value.filter(b => b.id !== id);
  chrome.storage.sync.set({ bookmarks: newBookmarks }, () => {
    console.log('书签已删除，更新后的书签列表:', newBookmarks);
    bookmarks.value = newBookmarks;
    isSyncing.value = false;
  });
};

// 监听存储变化
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.bookmarks) {
    console.log('同步存储变化:', changes);
    isSyncing.value = true;
    
    setTimeout(() => {
      console.log('书签数据变化，新值:', changes.bookmarks.newValue);
      // 确保变化后的新值也是数组
      bookmarks.value = Array.isArray(changes.bookmarks.newValue) ? changes.bookmarks.newValue : [];
      isSyncing.value = false;
    }, 300); // 添加小延迟以便显示同步动画
  }
});

// 添加一些测试数据，仅用于确认组件渲染正常
const addTestBookmark = () => {
  // 获取当前时间
  const currentTime = Date.now();
  
  // 创建三个测试书签，包括一个已过期、一个即将过期和一个未来的预期时间
  const testBookmarks = [
    {
      id: (currentTime).toString(),
      title: '已超时书签 - Vue.js 官方文档',
      url: 'https://vuejs.org/guide/introduction.html',
      addedTime: currentTime - 24 * 60 * 60 * 1000, // 昨天添加
      expectedViewTime: currentTime - 60 * 60 * 1000 // 1小时前到期
    },
    {
      id: (currentTime + 1).toString(),
      title: '未设置期限 - TailwindCSS 官方文档',
      url: 'https://tailwindcss.com/docs',
      addedTime: currentTime
    },
    {
      id: (currentTime + 2).toString(),
      title: '未来到期 - TypeScript 官方文档',
      url: 'https://www.typescriptlang.org/docs/',
      addedTime: currentTime,
      expectedViewTime: currentTime + 24 * 60 * 60 * 1000 // 明天到期
    }
  ];
  
  isSyncing.value = true;
  
  chrome.storage.sync.set({ bookmarks: testBookmarks }, () => {
    console.log('测试书签已添加到同步存储');
    bookmarks.value = testBookmarks;
    isSyncing.value = false;
  });
};

onMounted(() => {
  console.log('组件已挂载');
  loadBookmarks();
  
  // 如果书签数据为空，添加一些测试数据
  setTimeout(() => {
    if (bookmarks.value.length === 0) {
      console.log('没有书签数据，添加测试数据');
      addTestBookmark();
    }
  }, 1000);
});
</script>

<style>
.max-h-\[340px\] {
  max-height: 340px;
}
</style> 