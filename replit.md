# VoxCraft - Advanced Voice Processing Platform

## Overview

VoxCraft is a modern full-stack web application for advanced voice processing and audio content creation. The platform enables users to transform voices with AI-powered emotions, age adjustment, accent conversion, 3D spatial audio positioning, and voice harmonization. Built with React/TypeScript frontend, Express.js backend, and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system featuring cinematic dark theme
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript using TSX for development
- **Framework**: Express.js with REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build System**: esbuild for production bundling
- **Development**: Hot reloading with Vite middleware integration

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: 
  - `users` - User authentication and profiles
  - `voice_profiles` - Custom voice configurations and settings
  - `audio_projects` - User projects with content and audio URLs
  - `audio_scenes` - 3D spatial audio scene configurations
- **Data Types**: JSONB columns for flexible voice settings and spatial configurations

### Authentication & Session Management
- **Session Storage**: PostgreSQL sessions using connect-pg-simple
- **User Management**: Custom user system with username/password authentication
- **Authorization**: JWT-based authentication with Supabase integration planned

### API Architecture
- **Speech Generation**: `/api/generate-speech` - Text-to-speech with emotion/age/voice controls
- **AI Content**: `/api/ai-content-generator` - AI-powered script and content generation
- **CRUD Operations**: RESTful endpoints for voice profiles, projects, and scenes
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## External Dependencies

### Core Services
- **ElevenLabs API**: Text-to-speech generation with advanced voice controls (requires API key)
- **OpenAI API**: AI content generation for scripts and dialogue (requires API key)
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling

### Development Tools
- **Replit Integration**: Custom plugins for development environment and error handling
- **WebGL/Three.js**: 3D spatial audio visualization (with 2D fallback for compatibility)

### UI Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

### Deployment & Production
- **Vite**: Build tool for frontend optimization and hot module replacement
- **Node.js**: Production runtime with Express server
- **WebSocket Support**: Neon WebSocket constructor for real-time database connections

### Optional Integrations
- **Supabase**: Backend-as-a-Service for additional authentication and real-time features
- **Performance Monitoring**: Built-in performance monitoring components
- **Error Reporting**: Error boundary components for graceful error handling