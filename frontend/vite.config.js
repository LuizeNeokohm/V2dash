import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api-bubble": {
        target: "https://siskohm.bubbleapps.io/version-test/api/1.1/obj",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-bubble/, ""), 
      },
    },
  },
})
