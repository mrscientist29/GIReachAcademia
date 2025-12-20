import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { loginSchema, registerSchema, type User } from "../shared/schema";

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Define authenticated request type
export interface AuthenticatedRequest extends Express.Request {
  user?: {
    claims: {
      sub: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

// JWT authentication middleware
export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = {
      claims: {
        sub: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      }
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Setup authentication routes
export function setupAuth(app: Express) {
  // Registration route
  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log('Registration attempt:', { email: req.body.email, firstName: req.body.firstName });
      
      // Validate input
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
      
      // Create user
      const userData = {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        institution: validatedData.institution || null,
        yearOfStudy: validatedData.yearOfStudy || null,
        role: 'mentee' as const,
        isActive: true
      };
      
      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      
      console.log('User registered successfully:', user.email);
      
      res.status(201).json({
        message: "Registration successful",
        user: userWithoutPassword,
        token
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log('Login attempt:', { email: req.body.email });
      
      // Validate input
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      
      console.log('User logged in successfully:', user.email);
      
      res.json({
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get current user (protected route)
  app.get("/api/auth/me", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUserById(req.user!.claims.sub);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  // Logout (client-side will remove token)
  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logout successful" });
  });

  // Legacy routes for compatibility
  app.get("/api/login", (req, res) => {
    res.redirect("/login");
  });

  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });
}