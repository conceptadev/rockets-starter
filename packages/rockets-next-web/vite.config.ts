import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@concepta/react-material-ui",
      "@concepta/react-navigation",
      "@concepta/react-auth-provider",
      "@concepta/react-data-provider",
    ],
  },
});
