import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local development: base '/'. For GitHub Pages, change to '/repository-name/'.
export default defineConfig({
  plugins: [react()],
  base: './',
})
