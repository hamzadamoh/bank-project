import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Create a single Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith('/api')) {
      console.log(`${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Initialize routes (this is async but we handle it in the handler)
let routesInitialized = false;
let serverInstance: any = null;

async function initializeApp() {
  if (routesInitialized) return;
  
  try {
    // Register routes (returns a server but we don't need to use it in serverless)
    const { registerRoutes } = await import('../server/routes.js');
    serverInstance = await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      res.status(status).json({ message });
    });

    // Serve static files in production - handle path resolution for Vercel
    const possiblePaths = [
      path.resolve(process.cwd(), 'dist', 'public'),
      path.resolve(process.cwd(), '.vercel', 'output', 'static'),
      path.resolve(__dirname || process.cwd(), '..', 'dist', 'public'),
    ];

    let distPath: string | null = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        distPath = possiblePath;
        break;
      }
    }

    if (distPath) {
      console.log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
      app.use('*', (req, res) => {
        const indexPath = path.resolve(distPath!, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ error: 'index.html not found' });
        }
      });
    } else {
      console.warn('Static files directory not found, only API routes will work');
      app.use('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.status(404).json({ error: 'Static files not found. Build may have failed.' });
        }
      });
    }
    
    routesInitialized = true;
  } catch (error) {
    console.error('Error initializing app:', error);
    throw error;
  }
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

