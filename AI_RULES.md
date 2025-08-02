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

## Directory Structure

*   **Client-side directories**: All client-side directories (e.g., `src/pages`, `src/components`, `src/hooks`) MUST be all lower-case.
*   **File Naming**: File names may use mixed-case (e.g., `MyComponent.tsx`, `useMyHook.ts`).
*   **Logical Grouping**: Organize files into logical, small, and focused directories (e.g., `components`, `pages`, `hooks`, `utils`).

## Coding Guidelines

*   **Responsive Design**: ALWAYS generate responsive designs using Tailwind CSS.
*   **Toast Notifications**: Use toast components (from `shadcn/ui` and `react-hot-toast` if integrated) to inform the user about important events, such as success messages, errors, or loading states.
*   **Error Handling Philosophy**: Do not catch errors with `try/catch` blocks within React components unless specifically requested by the user for a particular logic flow. It's important that errors are thrown so they can bubble up to the `ErrorBoundary` for centralized handling and reporting.
*   **Simplicity and Elegance**: Prioritize simple and elegant solutions. Avoid over-engineering with complex error handling, fallback mechanisms, or unnecessary abstractions unless explicitly required. Focus on the user's request and make the minimum amount of changes needed.
*   **Completeness**: All implemented features must be fully functional with complete code. Avoid placeholders, partial implementations, or `TODO` comments.
*   **Component Size**: Aim for components that are 100 lines of code or less. Be ready to refactor larger files into smaller, more focused components or hooks.