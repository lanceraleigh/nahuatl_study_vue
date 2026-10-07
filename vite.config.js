import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // Change this to "/repository-name/" before deploying to a GitHub Pages project site.
  base: "/",
});
