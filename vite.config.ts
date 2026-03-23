import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: /<repo>/
const base =
  process.env.GITHUB_PAGES === 'true' ? '/Agentic-QA-OS/' : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
