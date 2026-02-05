import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      path.resolve(__dirname, '..', 'dist', 'public'),
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
      // Track if response was sent
      let responseSent = false;
      
      // Wrap res.end to detect when response completes
      const originalEnd = res.end.bind(res);
      res.end = function(...args: any[]) {
        if (!responseSent) {
          responseSent = true;
          originalEnd(...args);
          resolve();
        }
      };
      
      // Handle the request through Express
      // Convert Vercel request/response to Express-compatible format
      const expressReq = {
        ...req,
        method: req.method || 'GET',
        url: req.url || '/',
        path: req.url?.split('?')[0] || '/',
        query: req.query || {},
        body: req.body,
        headers: req.headers || {},
        get: (name: string) => req.headers[name.toLowerCase()],
      } as any;
      
      const expressRes = {
        ...res,
        status: (code: number) => {
          res.statusCode = code;
          return expressRes;
        },
        json: (body: any) => {
          if (!responseSent) {
            responseSent = true;
            res.setHeader('Content-Type', 'application/json');
            res.status(res.statusCode || 200);
            res.end(JSON.stringify(body));
          }
          return expressRes;
        },
        send: (body: any) => {
          if (!responseSent) {
            responseSent = true;
            res.end(body);
          }
          return expressRes;
        },
        setHeader: (name: string, value: string) => {
          res.setHeader(name, value);
          return expressRes;
        },
        headersSent: res.headersSent,
      } as any;
      
      // Handle the request
      app(expressReq, expressRes, (err?: any) => {
        if (err) {
          console.error('Express error:', err);
          if (!responseSent && !res.headersSent) {
            res.status(500).json({ 
              success: false,
              error: err.message || 'Internal Server Error',
              stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
          } else if (!responseSent) {
            resolve();
          }
        } else if (!responseSent && !res.headersSent) {
          res.status(404).json({ 
            success: false,
            error: 'Not Found' 
          });
        } else if (!responseSent) {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      });
    }
  }
}

