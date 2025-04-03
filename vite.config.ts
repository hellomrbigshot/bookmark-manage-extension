import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import webExtension from '@samrum/vite-plugin-web-extension';
import { resolve } from 'path';
import manifest from './manifest.json';
import fs from 'fs';
import path from 'path';

// 将 public/deadline-picker.html 复制到构建目录的插件
const copyDeadlinePickerPlugin = () => {
  return {
    name: 'copy-deadline-picker-plugin',
    writeBundle() {
      // 复制 HTML 文件
      const htmlSource = path.resolve(__dirname, 'deadline-picker.html');
      const htmlTarget = path.resolve(__dirname, 'dist/deadline-picker.html');
      if (fs.existsSync(htmlSource)) {
        fs.copyFileSync(htmlSource, htmlTarget);
        console.log('已将 deadline-picker.html 复制到构建目录');
      }

      // 复制 JS 文件
      const jsSource = path.resolve(__dirname, 'deadline-picker.js');
      const jsTarget = path.resolve(__dirname, 'dist/deadline-picker.js');
      if (fs.existsSync(jsSource)) {
        fs.copyFileSync(jsSource, jsTarget);
        console.log('已将 deadline-picker.js 复制到构建目录');
      }
    }
  };
};

// @ts-ignore - 忽略插件类型错误
export default defineConfig({
  plugins: [
    vue(),
    webExtension({
      manifest: manifest as any,
      useDynamicUrlWebAccessibleResources: true,
      browser: 'chrome',
      webExtConfig: {
        startUrl: ['chrome://newtab/'],
        chromiumProfile: '.chromium-profile'
      }
    }),
    copyDeadlinePickerPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    sourcemap: true,
    // 避免混淆代码，方便调试
    minify: false
  }
}); 