import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Molecular_Bio_Art_Project_2025/', // GitHub Pages 的仓库名称
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
