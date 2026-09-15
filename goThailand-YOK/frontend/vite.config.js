import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The API server's port (see backend/.env, default 5050). Override by
// exporting API_PORT in the shell before running `npm run dev` if needed.
const API_PORT = process.env.API_PORT || 5050;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${API_PORT}`,
    },
  },
});
