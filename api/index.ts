import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerRoutes } from '../server/routes';
import { serveStatic } from '../server/vite';
import express, { type Request, Response, NextFunction } from 'express';

// Create a single Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Initialize routes (this is async but we handle it in the handler)
let routesInitialized = false;
let serverInstance: any = null;

async function initializeApp() {
  if (routesInitialized) return;
  
  // Register routes (returns a server but we don't need to use it in serverless)
  serverInstance = await registerRoutes(app);
  
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  // Serve static files in production
  serveStatic(app);
  
  routesInitialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeApp();
    
    return new Promise<void>((resolve) => {
      // Convert Vercel request/response to Express format
      const expressReq = req as any;
      const expressRes = res as any;
      
      // Handle the request through Express
      app(expressReq, expressRes, (err?: any) => {
        if (err) {
          if (!res.headersSent) {
            res.status(500).json({ error: err.message || 'Internal Server Error' });
          }
        } else if (!res.headersSent) {
          res.status(404).json({ error: 'Not Found' });
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

