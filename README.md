# 收藏箱 - 智能书签管理器

一个功能强大的 Chrome 扩展，用于管理书签并提供预期查看时间功能。

## 功能特点

- 书签的增删改查
- 预期查看时间设置
- 过期书签高亮显示
- 简洁美观的用户界面
- 响应式设计
- 跨设备同步

## 技术栈

- Vue 3
- TypeScript
- Tailwind CSS
- Vite
- Chrome Extension API

## 安装说明

### 从 Chrome 应用商店安装
1. 访问 Chrome 应用商店
2. 搜索"收藏箱 - 智能书签管理器"
3. 点击"添加到 Chrome"

### 开发者安装
1. 克隆项目到本地
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
pnpm install
```

3. 构建项目
```bash
pnpm build
```

4. 在 Chrome 中加载扩展
- 打开 Chrome 扩展管理页面 (chrome://extensions/)
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择项目中的 `dist` 目录

## 使用说明

1. 点击扩展图标打开书签管理器
2. 使用"添加书签"按钮创建新书签
3. 设置预期查看时间
4. 查看和管理您的书签列表
5. 过期书签会以红色高亮显示

## 开发指南

1. 开发模式
```bash
pnpm dev
```

2. 构建生产版本
```bash
pnpm build
```

3. 类型检查
```bash
pnpm type-check
```

## 发布到 Chrome 应用商店

1. 准备发布包
```bash
pnpm build
```

2. 创建 ZIP 文件
```bash
cd dist && zip -r ../bookmark-manager.zip .
```

3. 访问 [Chrome 开发者控制台](https://chrome.google.com/webstore/devconsole)
4. 创建新项目
5. 上传 ZIP 文件
6. 填写应用信息：
   - 名称：收藏箱 - 智能书签管理器
   - 描述：一个智能的书签管理器，支持设置预期查看时间，帮助您更好地管理收藏内容
   - 分类：生产力工具
   - 语言：中文
   - 隐私政策：可选
7. 提交审核

## 许可证

MIT 