import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib.tsx"),
      name: "bicep-viz",
      // the proper extensions will be added
      fileName: "bicep-viz",
    },
  },
});
