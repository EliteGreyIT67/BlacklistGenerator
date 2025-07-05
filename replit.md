# Animal Rescue Post Generator Application

## Overview

This is a full-stack TypeScript application built with React and Express that serves as a post generator for animal rescue organizations. The application allows users to create, manage, and format rescue posts with detailed information about animals needing homes, foster care, or emergency assistance. It features a modern UI built with shadcn/ui components and supports template functionality for reusable post formats.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (via Neon serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **Development**: TSX for TypeScript execution

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Local Storage**: Browser localStorage for templates and draft data
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

## Key Components

### Core Features
1. **Rescue Post Generator**: Main form interface for creating animal rescue posts
2. **Template Management**: Save, load, and manage reusable rescue post templates
3. **Animal Information Management**: Detailed forms for capturing animal details (species, breed, medical needs, etc.)
4. **Contact & Organization Management**: Track rescue contacts and organizations involved
5. **Multi-Post Type Support**: Support for adoption, foster, lost/found, emergency, transport, and volunteer posts
6. **Priority & Urgency Levels**: Categorize posts by urgency (low, medium, high, critical)
7. **Export Functionality**: Format and copy rescue posts for social media sharing

### Frontend Components
- **Form Management**: React Hook Form with Zod schema validation
- **UI Components**: Complete shadcn/ui component library including forms, dialogs, cards, etc.
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Toast Notifications**: User feedback system for actions and errors

### Backend Components
- **Storage Interface**: Abstract storage layer with in-memory implementation
- **Route Registration**: Modular route system with Express
- **Error Handling**: Centralized error handling middleware
- **Development Tools**: Vite integration for development mode

## Data Flow

### Client-Side Data Flow
1. User interacts with form components (animals, contact persons, rescue organizations, post details)
2. React Hook Form manages form state with Zod validation
3. Data is stored locally using localStorage hooks for persistence
4. Templates can be saved/loaded for reusable rescue post formats
5. Final rescue post is formatted and copied to clipboard for social media sharing

### Server-Side Data Flow
1. Express server handles API requests under `/api` prefix
2. Storage interface abstracts database operations
3. Currently uses in-memory storage (MemStorage class)
4. Prepared for PostgreSQL integration via Drizzle ORM
5. Session management ready for user authentication

### Schema Validation
- Shared TypeScript schemas using Zod for validation
- Type-safe data flow between client and server
- Runtime validation on both frontend forms and API endpoints

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod integration for form validation
- **zod**: Schema validation library

### UI Dependencies
- **@radix-ui/***: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle Kit handles schema migrations

### Environment Configuration
- **Development**: Uses Vite dev server with Express backend
- **Production**: Serves static files from Express with built React app
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL

### Deployment Commands
- `npm run dev`: Development mode with hot reloading
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run db:push`: Apply database schema changes

### Database Setup
- PostgreSQL database required (configured for Neon serverless)
- Drizzle migrations in `./migrations` directory
- Schema defined in `./shared/schema.ts`

## Changelog
- July 05, 2025. Initial setup as Blacklist Post Generator
- July 05, 2025. Refactored application for Animal Rescue Organizations with new schema, components, and formatting

## User Preferences

Preferred communication style: Simple, everyday language.