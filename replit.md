# Overview

FiscAI is an enterprise AI suite designed for financial institutions, featuring seven specialized tools for tax advisory, fraud detection, and financial intelligence. The application serves banks, fintechs, and accounting firms with AI-powered solutions including Tax Counsel for multi-jurisdiction tax guidance, Factoring Guardian for document fraud detection, and Query Architect for natural language to SQL conversion.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript, using Vite as the build tool and development server. The UI framework leverages Radix UI components with Tailwind CSS for styling, implementing a modern glass-morphism design system with custom color variables. The application uses Wouter for client-side routing and TanStack Query for state management and API communication.

The component structure follows a modular approach with:
- **Pages**: Route-specific components for different application sections
- **Sections**: Reusable page sections like hero, testimonials, and product showcases
- **Demos**: Interactive demonstration components for each AI tool
- **UI Components**: Reusable design system components based on shadcn/ui

## Backend Architecture
The server is built with Express.js and TypeScript, implementing a REST API architecture. The application uses a modular storage interface pattern that currently supports in-memory storage but can be extended to database implementations. The server includes middleware for request logging, JSON parsing, and error handling.

Key architectural decisions include:
- **Development/Production Split**: Vite integration for development with static file serving for production
- **Type Safety**: Shared TypeScript schemas between client and server
- **Validation**: Zod schemas for runtime type validation of API requests
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Database Design
The application uses Drizzle ORM with PostgreSQL, configured for Neon Database hosting. The schema includes tables for:
- **User Management**: Basic user authentication with username/password
- **Demo Requests**: Capturing trial requests with company and tool information
- **Contact Submissions**: General contact form submissions
- **Tax Queries**: Storing tax advisory requests and responses with jurisdiction data
- **SQL Queries**: Logging natural language to SQL conversions and vice versa
- **Document Analysis**: Results from fraud detection and document processing

All tables use UUID primary keys with automatic generation and include timestamp tracking for audit purposes.

## API Structure
The REST API follows RESTful conventions with endpoints for:
- **POST /api/demo-requests**: Demo trial submissions
- **POST /api/contact**: General contact inquiries
- **POST /api/tax-queries**: Tax advisory requests
- **POST /api/sql-queries**: SQL generation/explanation requests
- **POST /api/document-analysis**: Document fraud detection

Each endpoint includes comprehensive validation using Zod schemas and proper error handling with detailed error messages.

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: PostgreSQL session storage

## UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

## Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the application
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and submission
- **Wouter**: Lightweight client-side routing

## Authentication & Validation
- **Zod**: Runtime schema validation
- **drizzle-zod**: Integration between Drizzle and Zod for type safety

## Styling & Animation
- **class-variance-authority**: Component variant management
- **clsx**: Conditional CSS class composition
- **Embla Carousel**: Touch-friendly carousel component

The application is designed for deployment on Replit with development tooling integrated for the platform, including runtime error overlays and cartographer integration for enhanced debugging capabilities.