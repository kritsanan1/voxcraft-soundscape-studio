import { createServer } from "vite";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { Request, Response, NextFunction } from 'express'; // Import types

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  console.log(`[${formattedTime}] [${source}] ${message}`);
}

export async function createViteServer(app: any) {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template = readFileSync(
        path.resolve(__dirname, "../client/index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/client/src/main.tsx"`
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

export function serveViteBuild(app: any) {
  const distPath = path.resolve(__dirname, "../client/dist");
  if (!existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    require("express").static(distPath, {
      index: false, // Disable directory index
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}