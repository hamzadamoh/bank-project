import serverless from 'serverless-http';
import express, { type Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  
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
    const { registerRoutes } = await import('../../server/routes.js');
    serverInstance = await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      res.status(status).json({ message });
    });

    // Serve static files in production - handle path resolution for Netlify
    const possiblePaths = [
      path.resolve(process.cwd(), 'dist', 'public'),
      path.resolve(process.cwd(), 'netlify', 'output', 'static'),
      path.resolve(__dirname, '..', '..', 'dist', 'public'),
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

// Initialize app before creating handler
let handlerPromise: Promise<any> | null = null;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = initializeApp().then(() => {
      return serverless(app, {
        binary: ['image/*', 'application/pdf', 'application/octet-stream'],
        request: (request: any, event: any, context: any) => {
          // Preserve original path for Express routing
          request.path = event.path || request.path;
          request.url = event.path || request.url;
        },
      });
    });
  }
  return handlerPromise;
}

// Netlify Function handler (AWS Lambda format)
export const handler = async (event: any, context: any) => {
  // Set timeout to match Netlify's limits (26 seconds for free tier, 10 seconds default)
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const serverlessHandler = await getHandler();
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      }),
    };
  }
};
