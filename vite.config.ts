import { defineConfig, Plugin, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Local middleware to run Netlify functions during 'npm run dev'
function netlifyFunctionsDevPlugin(): Plugin {
  return {
    name: "netlify-functions-dev-plugin",
    config(config, env) {
      // Load env variables into process.env so Netlify functions can access them locally
      const envVars = loadEnv(env.mode, process.cwd(), "");
      Object.assign(process.env, envVars);
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith("/.netlify/functions/")) {
          const functionName = req.url.split("/.netlify/functions/")[1].split("?")[0];
          try {
            const modulePath = `./netlify/functions/${functionName}.js`;
            const module = await server.ssrLoadModule(modulePath);

            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });

            req.on("end", async () => {
              const event = {
                httpMethod: req.method,
                body: body,
                headers: req.headers,
              };
              const result = await module.handler(event, {});
              res.statusCode = result.statusCode || 200;
              if (result.headers) {
                Object.entries(result.headers).forEach(([k, v]) =>
                  res.setHeader(k, v as string)
                );
              }
              res.end(result.body);
            });
            return;
          } catch (err: any) {
            console.error("Error executing local Netlify function:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionsDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },

  envDir: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: true, // Listen on all local IPs
  },
});
