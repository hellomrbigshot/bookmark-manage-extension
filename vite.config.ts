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

// 复制 src/icons 文件夹到构建目录的插件
const copyIconsPlugin = () => {
  return {
    name: 'copy-icons-plugin',
    writeBundle() {
      const iconsSource = path.resolve(__dirname, 'src/icons');
      const iconsTarget = path.resolve(__dirname, 'dist/icons');
      
      // 确保目标目录存在
      if (!fs.existsSync(iconsTarget)) {
        fs.mkdirSync(iconsTarget, { recursive: true });
      }

      // 复制所有图标文件
      if (fs.existsSync(iconsSource)) {
        const files = fs.readdirSync(iconsSource);
        files.forEach(file => {
          const sourceFile = path.join(iconsSource, file);
          const targetFile = path.join(iconsTarget, file);
          fs.copyFileSync(sourceFile, targetFile);
        });
        console.log('已将 icons 文件夹复制到构建目录');
      }
    }
  };
};

// 复制 src/assets 文件夹到构建目录的插件
const copyAssetsPlugin = () => {
  return {
    name: 'copy-assets-plugin',
    writeBundle() {
      const assetsSource = path.resolve(__dirname, 'src/assets');
      const assetsTarget = path.resolve(__dirname, 'dist/assets');
      
      // 确保目标目录存在
      if (!fs.existsSync(assetsTarget)) {
        fs.mkdirSync(assetsTarget, { recursive: true });
      }

      // 复制所有资源文件
      if (fs.existsSync(assetsSource)) {
        const files = fs.readdirSync(assetsSource);
        files.forEach(file => {
          const sourceFile = path.join(assetsSource, file);
          const targetFile = path.join(assetsTarget, file);
          fs.copyFileSync(sourceFile, targetFile);
        });
        console.log('已将 assets 文件夹复制到构建目录');
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
      useDynamicUrlWebAccessibleResources: true
    }),
    copyDeadlinePickerPlugin(),
    copyIconsPlugin(),
    copyAssetsPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'es'
      }
    }
  }
}); 