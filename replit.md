# Overview

GI REACH is a modern web application designed for academic research mentorship and collaboration in the medical and scientific community. The platform facilitates research excellence through mentorship programs, publication support, and collaborative research opportunities. It serves as a hub for connecting researchers, sharing publications, collecting testimonials, and managing contact inquiries and join applications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built as a React Single Page Application (SPA) using modern web technologies:
- **React 18** with functional components and hooks for state management
- **TypeScript** for type safety and better developer experience
- **Vite** as the build tool and development server for fast compilation and hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management, caching, and API synchronization
- **Tailwind CSS** with CSS variables for responsive styling and consistent design system
- **Shadcn/ui** component library built on Radix UI primitives for accessible, customizable UI components

The application follows a page-based routing structure with dedicated pages for Home, About, Programs, Publications, Resources, Contact, and Join functionality.

## Backend Architecture
The backend implements a RESTful API using Node.js and Express:
- **Express.js** server with middleware for JSON parsing, logging, and error handling
- **TypeScript** throughout the backend for consistency with frontend
- **Modular routing system** with centralized route registration
- **Storage abstraction layer** with interface-based design for future database flexibility
- **In-memory storage implementation** for development with plans for database integration
- **Request/response logging** with performance monitoring for API endpoints

## Database Layer
The application uses **Drizzle ORM** with PostgreSQL for data persistence:
- **Schema-first approach** with TypeScript types generated from database schema
- **Neon Database** as the PostgreSQL provider configured for serverless deployment
- **Shared schema definitions** between frontend and backend ensuring type consistency
- **Migration support** through Drizzle Kit for schema evolution

### Core Data Models
- **Users**: Authentication and user management
- **Testimonials**: User feedback with approval workflow
- **Publications**: Academic papers with metadata (authors, journal, impact factor, DOI)
- **Contact Submissions**: Inquiry management system
- **Join Applications**: Membership application processing
- **Feedback Submissions**: User experience collection

## Authentication & Security
Currently implements a basic foundation with planned expansion:
- **Session-based authentication** infrastructure prepared
- **Input validation** using Zod schemas for type-safe API endpoints
- **CORS configuration** for cross-origin request handling

## Development & Deployment
- **Monorepo structure** with shared TypeScript definitions
- **Development workflow** with Vite HMR and Express middleware integration
- **Build process** using esbuild for server bundling and Vite for client assets
- **Replit-optimized** configuration with development banners and error overlays

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit and query builder

## UI & Styling
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Web font delivery (Inter, DM Sans, Fira Code, Geist Mono)

## Development Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire stack
- **Replit**: Development environment with specialized plugins for runtime error handling