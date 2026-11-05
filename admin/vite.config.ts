import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const APPS_SCRIPT_TARGET =
  "https://script.google.com/macros/s/AKfycbyg_38Pa8ZBj0iRCCYcColssYsOcVLHLmfizVcWiPFMDtVguZUeVqldCnqeS32wZZofjQ/exec";

function appsScriptProxy(): Plugin {
  return {
    name: "apps-script-proxy",
    configureServer(server) {
      server.middlewares.use("/api-proxy", async (req, res) => {
        try {
          const queryPart = req.url && req.url.startsWith("?") ? req.url : (req.url && req.url !== "/" ? req.url : "");
          const targetUrl = APPS_SCRIPT_TARGET + (queryPart.startsWith("?") ? queryPart : (queryPart ? `?${queryPart}` : ""));
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const fetchOptions: RequestInit = {
                method: req.method || "GET",
                redirect: "follow",
              };
              if (req.method !== "GET" && req.method !== "HEAD") {
                fetchOptions.headers = {
                  "Content-Type": "text/plain;charset=utf-8",
                };
                fetchOptions.body = body;
              }
              const response = await fetch(targetUrl, fetchOptions);
              const text = await response.text();
              res.statusCode = response.status;
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.end(text);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } catch (e: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), appsScriptProxy()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
