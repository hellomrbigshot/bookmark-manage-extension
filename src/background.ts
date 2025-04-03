// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Bookmark Manager Extension installed');
  
  // 创建右键菜单
  chrome.contextMenus.create({
    id: 'addBookmark',
    title: '添加到收藏箱',
    contexts: ['page', 'link']
  }, () => {
    console.log('右键菜单创建成功');
    if (chrome.runtime.lastError) {
      console.error('创建右键菜单出错:', chrome.runtime.lastError);
    }
  });
  
  // 创建添加收藏箱带预期时间的菜单
  chrome.contextMenus.create({
    id: 'addBookmarkWithDeadline',
    title: '添加到收藏箱（设置预期查看时间）',
    contexts: ['page', 'link']
  }, () => {
    console.log('带预期时间的右键菜单创建成功');
    if (chrome.runtime.lastError) {
      console.error('创建右键菜单出错:', chrome.runtime.lastError);
    }
  });
  
  // 初始化存储，确保有一个空的书签数组
  chrome.storage.sync.get('bookmarks', (result) => {
    if (!result.bookmarks) {
      chrome.storage.sync.set({ bookmarks: [] }, () => {
        console.log('初始化同步存储：创建空书签数组');
      });
    } else {
      console.log('同步存储中已有书签数据:', result.bookmarks);
    }
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('右键菜单被点击:', info.menuItemId);
  
  if (info.menuItemId === 'addBookmark') {
    addBookmarkToStorage(info, tab);
  } else if (info.menuItemId === 'addBookmarkWithDeadline') {
    // 打开设置预期时间的弹窗
    chrome.windows.create({
      url: chrome.runtime.getURL('deadline-picker.html') + 
           `?url=${encodeURIComponent(info.linkUrl || info.pageUrl || '')}` + 
           `&title=${encodeURIComponent(tab?.title || '')}`,
      type: 'popup',
      width: 400,
      height: 300
    });
  }
});

interface BookmarkInfo {
  linkUrl?: string;
  pageUrl?: string;
}

interface TabInfo {
  title?: string;
}

// 添加书签到存储的公共函数
function addBookmarkToStorage(info: BookmarkInfo, tab: TabInfo, expectedViewTime: number | null = null) {
  const url = info.linkUrl || info.pageUrl || '';
  const title = tab?.title || url;
  
  console.log('准备添加书签:', { title, url, expectedViewTime });
  
  // 保存书签到同步存储
  chrome.storage.sync.get('bookmarks', (result) => {
    // 确保 bookmarks 是数组
    const bookmarks = Array.isArray(result.bookmarks) ? result.bookmarks : [];
    
    console.log('获取到的书签数据类型:', typeof result.bookmarks, Array.isArray(result.bookmarks));
    
    const newBookmark = {
      id: Date.now().toString(),
      title,
      url,
      addedTime: Date.now(),
      expectedViewTime
    };
    
    console.log('添加新书签:', newBookmark);
    console.log('现有书签数量:', bookmarks.length);
    
    // 避免使用展开运算符，以防止潜在的迭代错误
    const updatedBookmarks = bookmarks.concat([newBookmark]);
    
    chrome.storage.sync.set({
      bookmarks: updatedBookmarks
    }, () => {
      console.log('书签保存成功到同步存储');
      if (chrome.runtime.lastError) {
        console.error('保存书签时出错:', chrome.runtime.lastError);
      } else {
        // 显示通知
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: '书签已添加',
          message: expectedViewTime 
            ? `"${title}" 已保存到收藏箱，预期查看时间：${new Date(expectedViewTime).toLocaleString()}` 
            : `"${title}" 已保存到收藏箱并同步到你的所有设备`,
          priority: 2
        });
      }
    });
  });
}

// 监听来自预期时间设置页面的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addBookmarkWithDeadline') {
    const { url, title, expectedViewTime } = message;
    
    // 使用模拟的 info 和 tab 对象
    const info: BookmarkInfo = { linkUrl: url };
    const tab: TabInfo = { title };
    
    addBookmarkToStorage(info, tab, expectedViewTime);
    sendResponse({ success: true });
  }
});

// 监听书签变化事件
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('Bookmark created:', bookmark);
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log('Bookmark removed:', removeInfo);
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log('Bookmark changed:', changeInfo);
});

// 导出空对象以支持ES模块
export {}; 