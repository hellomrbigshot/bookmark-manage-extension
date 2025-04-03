/// <reference types="chrome"/>

import type { Bookmark } from '../types/bookmark';

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'addToBookmarks',
    title: '添加到收藏箱',
    contexts: ['page', 'link']
  });
  console.log('Bookmark Manager Extension installed');
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener(async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'addToBookmarks' && tab?.id) {
    const url = info.linkUrl || info.pageUrl || '';
    const title = tab.title || url;

    // 打开弹窗让用户设置时间范围
    chrome.windows.create({
      url: chrome.runtime.getURL('src/popup/bookmark-form.html') +
           `?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      type: 'popup',
      width: 400,
      height: 600
    });
  }
});

// 检查提醒
const checkReminders = async () => {
  const { bookmarks = [] } = await chrome.storage.local.get(['bookmarks']) as { bookmarks: Bookmark[] };
  const now = new Date();

  bookmarks.forEach(bookmark => {
    if (bookmark.viewingRange) {
      const startDate = new Date(bookmark.viewingRange.start);
      const endDate = new Date(bookmark.viewingRange.end);

      if (now >= startDate && now <= endDate) {
        // 发送提醒通知
        chrome.notifications.create(`reminder-${bookmark.id}`, {
          type: 'basic',
          iconUrl: '/icons/icon128.png',
          title: '收藏提醒',
          message: `现在是查看"${bookmark.title}"的好时机！`,
          priority: 2
        });
      }
    }
  });
};

// 每小时检查一次提醒
chrome.alarms.create('checkReminders', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === 'checkReminders') {
    checkReminders();
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