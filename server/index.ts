import express, { Request, Response, NextFunction } from "express"; // Import types
import { createViteServer, serveViteBuild, log } from "./vite";
import { registerRoutes } from "./routes";
import http from "http";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(this, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `API ${req.method} ${path} - ${res.statusCode} - ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine, "api");
    }
  });
  next();
});

(async () => {
  if (process.env.NODE_ENV === "development") {
    await createViteServer(app);
  } else {
    serveViteBuild(app);
  }

  await registerRoutes(app);

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    log(`Server listening on port ${port}`, "server");
  });
})();