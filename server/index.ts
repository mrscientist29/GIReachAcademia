// Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { networkInterfaces } from "os";

const app = express();

// Add CORS headers for mobile device access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Add client IP for debugging mobile access
      const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      if (clientIP && clientIP !== '127.0.0.1' && clientIP !== '::1') {
        logLine = `[${clientIP}] ${logLine}`;
      }
      
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add a simple test endpoint for mobile debugging
app.get('/api/test', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    clientIP: clientIP,
    userAgent: req.get('User-Agent')
  });
});

// Simple logo endpoint for debugging
app.get('/api/logo-simple', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const logoSettings = await storage.getWebsiteSettings('logo');
    
    if (logoSettings) {
      res.json({
        success: true,
        logo: logoSettings.settingValue,
        source: 'database'
      });
    } else {
      const defaultLogo = {
        type: 'icon',
        iconName: 'Stethoscope',
        iconColor: 'text-white',
        iconBackground: 'bg-blue-600',
        primaryText: 'GI REACH',
        secondaryText: 'Academic Excellence',
        primaryTextColor: 'text-gray-900',
        secondaryTextColor: 'text-gray-600',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        borderRadius: 'rounded-xl',
        showSecondaryText: true,
        imageWidth: 48,
        imageHeight: 48
      };
      
      res.json({
        success: true,
        logo: defaultLogo,
        source: 'default'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Settings sync endpoint for mobile debugging
app.get('/api/settings-sync', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const allSettings = await storage.getAllWebsiteSettings();
    
    const settingsMap = {};
    allSettings.forEach(setting => {
      settingsMap[setting.settingKey] = setting.settingValue;
    });
    
    res.json({
      success: true,
      settings: settingsMap,
      count: allSettings.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Content sync endpoint for mobile debugging
app.get('/api/content-sync', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const allContent = await storage.getAllPageContents();
    
    const contentMap = {};
    allContent.forEach(page => {
      contentMap[page.pageId] = {
        name: page.pageName,
        sections: page.sections,
        updatedAt: page.updatedAt
      };
    });
    
    res.json({
      success: true,
      content: contentMap,
      count: allContent.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve debug page
app.get('/debug-logo', (req, res) => {
  const path = require('path');
  res.sendFile(path.join(process.cwd(), 'debug-logo.html'));
});

// Serve settings test page
app.get('/settings-test', (req, res) => {
  const path = require('path');
  res.sendFile(path.join(process.cwd(), 'settings-test.html'));
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV?.trim() === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5001', 10);
  
  // Get network IP address
  const getNetworkIP = () => {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  };

  const networkIP = getNetworkIP();
  
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
    log(`Local: http://localhost:${port}`);
    log(`Network: http://${networkIP}:${port}`);
    log(`Mobile devices can access via: http://${networkIP}:${port}`);
    log(`\n📱 For mobile access:`);
    log(`1. Make sure your mobile device is on the same WiFi network`);
    log(`2. Open browser and go to: http://${networkIP}:${port}`);
    log(`3. If connection fails, run 'allow-network-access.bat' as administrator`);
  });
})();
