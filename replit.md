# Animal Rescue Blacklist Generator Application

## Overview

This is a full-stack TypeScript application built with React and Express that serves as a blacklist generator for documenting issues with animal rescue organizations and individuals. The application allows users to create, manage, and format warning posts with detailed information about problematic rescue organizations, individuals, violations, and animal welfare concerns. It features a modern UI built with shadcn/ui components and supports template functionality for reusable alert formats.

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
1. **Blacklist Alert Generator**: Main form interface for creating warning alerts about problematic rescue organizations
2. **Template Management**: Save, load, and manage reusable blacklist alert templates
3. **Individual Tracking**: Detailed forms for flagged individuals (names, aliases, roles, licensing info)
4. **Organization Monitoring**: Track problematic rescue organizations with operating status and violations
5. **Violation Documentation**: Record specific violations (neglect, abuse, fraud, unlicensed operations, poor conditions)
6. **Severity & Status Levels**: Categorize alerts by risk level (low, medium, high, critical) and investigation status
7. **Evidence Management**: Link to supporting evidence for documented violations
8. **Export Functionality**: Format and copy blacklist alerts for community sharing

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
1. User interacts with form components (flagged individuals, organizations, violations, alert details)
2. React Hook Form manages form state with Zod validation
3. Data is stored locally using localStorage hooks for persistence
4. Templates can be saved/loaded for reusable blacklist alert formats
5. Final blacklist alert is formatted and copied to clipboard for community sharing

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
- July 05, 2025. Refactored back to blacklisting animal rescue organizations - includes violation tracking, individual/organization monitoring, evidence management, and severity-based alerts
- July 05, 2025. **MAJOR UPDATE**: Enhanced Documentation & Evidence System
  - Added comprehensive incident management with PostgreSQL backend
  - Implemented evidence file upload system with type categorization and verification
  - Built timeline builder for chronological incident tracking
  - Created cross-reference system to link related incidents and identify patterns
  - Enhanced database schema with evidence files, timelines, and cross-reference tables
  - Added REST API endpoints for all enhanced documentation features
  - Created responsive UI with tabbed interface for managing complex incident data
  - Implemented file upload with multer for photos, videos, documents, and audio
  - Added verification system for evidence credibility tracking

## User Preferences

Preferred communication style: Simple, everyday language.