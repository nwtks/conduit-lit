import { defineConfig } from "vite";
import minifyHTML from "rollup-plugin-minify-html-literals";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
    },
    rollupOptions: { plugins: [minifyHTML.default()] },
  },
});
