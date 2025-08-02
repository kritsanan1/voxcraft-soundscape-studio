# AI Rules for VoxCraft Development

This document outlines the technical guidelines and preferred library usage for developing the VoxCraft application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

VoxCraft is built using a modern full-stack architecture. Here's a summary of the core technologies:

*   **Frontend Framework**: React 18 with TypeScript for building dynamic user interfaces.
*   **Build Tool**: Vite for a fast development experience and optimized production builds.
*   **Styling**: Tailwind CSS for utility-first styling, ensuring responsive and consistent designs.
*   **UI Components**: shadcn/ui, built on Radix UI primitives, for accessible and pre-styled UI components.
*   **Client-Side Routing**: Wouter for lightweight and efficient navigation within the single-page application.
*   **Server State Management**: React Query (TanStack Query) for managing data fetching, caching, and synchronization with the backend.
*   **Backend Framework**: Node.js with Express.js for building robust RESTful APIs.
*   **Database**: PostgreSQL, a powerful relational database, with Neon serverless driver for scalability.
*   **ORM**: Drizzle ORM for type-safe and efficient database interactions.
*   **External APIs**: Integration with ElevenLabs for advanced text-to-speech and OpenAI for AI content generation.
*   **Icons**: Lucide React for a comprehensive set of customizable SVG icons.

## Library Usage Rules

To maintain a clean and efficient codebase, please follow these specific guidelines for library usage:

*   **React**: Always use functional components with Hooks.
*   **TypeScript**: All new code must be written in TypeScript, ensuring strong typing and improved code quality.
*   **Tailwind CSS**: Use Tailwind CSS classes for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for global styles.
*   **shadcn/ui & Radix UI**: Prioritize using components from shadcn/ui. If a specific component needs customization beyond what shadcn/ui offers, create a new component that wraps or extends the shadcn/ui/Radix primitive, rather than modifying the original shadcn/ui files.
*   **React Router (Wouter)**: Use Wouter for all client-side routing. Keep main application routes defined in `client/src/App.tsx`.
*   **Form Handling**: Use `react-hook-form` for form management and `zod` for schema validation.
*   **Icons**: Use `lucide-react` for all icons.
*   **Backend API**: All server-side logic should be implemented using Express.js.
*   **Database Interactions**: Use Drizzle ORM for all database queries and schema definitions.
*   **External API Calls**: When interacting with ElevenLabs or OpenAI, ensure API keys are loaded securely from environment variables and not hardcoded.
*   **New Components/Hooks**: Always create new files for new components or hooks, even if they are small. Do not add new components to existing files.
*   **Error Handling**: Implement `ErrorBoundary` components for graceful error handling in the UI. Avoid `try/catch` blocks for React component rendering errors, allowing them to bubble up to the error boundary.
*   **Supabase**: If authentication or real-time database features are required, use the provided Supabase client integration.