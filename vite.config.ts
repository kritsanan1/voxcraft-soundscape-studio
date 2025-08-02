import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server: undefined, // This will be set by the Express server
    },
    allowedHosts: ['*'], // Changed to array of strings
  };

  return {
    plugins: [
      react(),
      ...(command === "serve"
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client/src"),
      },
    },
    server: serverOptions,
    appType: "custom",
  };
});