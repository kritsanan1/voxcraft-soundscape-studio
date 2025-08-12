# VoxCraft - AI Voice Processing Platform

## Overview

VoxCraft is a comprehensive AI voice processing platform that enables users to transform, enhance, and create immersive audio experiences. The application provides advanced voice manipulation capabilities including emotion control, age transformation, accent conversion, 3D spatial audio, voice harmonization, and intelligent content generation. Built as a modern full-stack web application, it integrates cutting-edge AI voice technology with an intuitive user interface for both casual users and audio professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development patterns
- **Styling**: Tailwind CSS with a custom design system featuring a dark cinematic theme optimized for audio applications
- **UI Components**: Comprehensive component library using Radix UI primitives with custom styling through shadcn/ui
- **State Management**: TanStack React Query for server state management and caching
- **3D Graphics**: React Three Fiber (@react-three/fiber) and Drei (@react-three/drei) for 3D spatial audio visualization
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript using ESM modules
- **Framework**: Express.js for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database for serverless PostgreSQL hosting
- **Session Storage**: PostgreSQL-backed session storage using connect-pg-simple
- **Development**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon Database for user data, voice profiles, audio projects, and scene configurations
- **Schema Management**: Drizzle ORM with migration support for database schema evolution
- **Session Management**: Database-backed sessions for user authentication state
- **File Storage**: Integration ready for audio file storage (likely cloud-based solutions)

### Authentication and Authorization
- **Authentication Provider**: Supabase Auth for user management and authentication flows
- **Session Handling**: Server-side session management with database persistence
- **Authorization**: Route-level and component-level access control based on user authentication state

### Core Application Features
- **Voice Studio**: Real-time voice transformation with emotion, age, accent, and vocal characteristics control
- **3D Spatial Audio**: Interactive 3D audio scene builder with WebGL-based visualization
- **Voice Harmonization**: Multi-voice harmony creation with pitch offsetting and mixing capabilities
- **Smart Content Generator**: AI-powered content creation for scripts, dialogues, and narration
- **Project Management**: Full CRUD operations for audio projects with version control
- **Performance Monitoring**: Real-time system performance tracking and optimization

## External Dependencies

### Primary Services
- **ElevenLabs API**: Core text-to-speech and voice synthesis functionality
- **Supabase**: Authentication, real-time features, and edge functions for AI processing
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Static type checking across the entire application
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Backend bundling for production deployment

### UI and Interaction Libraries
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management with validation support

### Audio and 3D Graphics
- **Three.js**: 3D graphics library for spatial audio visualization
- **Web Audio API**: Native browser audio processing capabilities (implicit dependency)
- **WebGL**: Hardware-accelerated 3D rendering for audio scene visualization

### AI and Content Processing
- **OpenAI API**: Advanced content generation capabilities (referenced in ElevenLabs examples)
- **Custom Edge Functions**: Supabase Functions for AI content generation and speech processing
- **WebSocket Support**: Real-time communication for live audio processing

### Performance and Monitoring
- **TanStack React Query**: Intelligent caching and synchronization for API calls
- **Connection Pooling**: Neon Database connection management for optimal performance
- **Error Boundary**: Comprehensive error handling and recovery mechanisms