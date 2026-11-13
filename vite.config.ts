import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { content } from './src/config/content.ts'

/** Fills %APP_TITLE% / %APP_DESCRIPTION% in index.html from the global content file. */
function injectContent(): Plugin {
  return {
    name: 'inject-content',
    transformIndexHtml(html) {
      return html
        .replaceAll('%APP_TITLE%', content.meta.title)
        .replaceAll('%APP_DESCRIPTION%', content.meta.description)
    },
  }
}

export default defineConfig({
  plugins: [react(), injectContent()],
})
