document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get('url') || '';
  const title = urlParams.get('title') || '';
  
  // 显示书签信息
  document.getElementById('titlePreview').textContent = `标题: ${title}`;
  document.getElementById('urlPreview').textContent = `链接: ${url}`;
  
  // 设置默认时间为当前时间后24小时
  const defaultDate = new Date();
  defaultDate.setHours(defaultDate.getHours() + 24);
  setDatetimeValue(defaultDate);
  
  // 快速选择按钮事件处理
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const hours = this.getAttribute('data-hours');
      const days = this.getAttribute('data-days');
      
      const date = new Date();
      if (hours) date.setHours(date.getHours() + parseInt(hours));
      if (days) date.setDate(date.getDate() + parseInt(days));
      
      setDatetimeValue(date);
    });
  });
  
  // 取消按钮
  document.getElementById('cancelBtn').addEventListener('click', function() {
    window.close();
  });
  
  // 确认按钮
  document.getElementById('confirmBtn').addEventListener('click', function() {
    const deadlineInput = document.getElementById('deadlineDate');
    const expectedViewTime = new Date(deadlineInput.value).getTime();
    
    chrome.runtime.sendMessage({
      action: 'addBookmarkWithDeadline',
      url: url,
      title: title,
      expectedViewTime: expectedViewTime
    }, response => {
      if (response && response.success) {
        window.close();
      } else {
        // 如果消息发送失败，也关闭窗口
        window.close();
      }
    });
  });
});

// 辅助函数 - 设置日期选择器值
function setDatetimeValue(date) {
  const datetimeInput = document.getElementById('deadlineDate');
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // 设置时间为当天的开始（00:00）
  datetimeInput.value = `${year}-${month}-${day}T00:00`;
} 