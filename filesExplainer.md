
# File Structure Documentation

## Project Overview
VoxCraft is a full-stack voice processing platform built with React/TypeScript frontend, Express.js backend, and PostgreSQL database using Drizzle ORM.

## Directory Structure Analysis

```
├── 📁 client/                              # Frontend React application
│   ├── 📁 public/                          # Static assets
│   │   ├── 🟢 favicon.ico                  # Browser favicon
│   │   ├── 🟢 placeholder.svg              # Placeholder image asset
│   │   └── 🟢 robots.txt                   # Search engine crawler instructions
│   ├── 📁 src/                             # Frontend source code
│   │   ├── 📁 components/                  # React components
│   │   │   ├── 📁 ui/                      # Shadcn/UI component library
│   │   │   │   ├── 🟢 accordion.tsx       # Collapsible content component
│   │   │   │   ├── 🟢 alert-dialog.tsx    # Modal confirmation dialogs
│   │   │   │   ├── 🟢 alert.tsx           # Notification alert component
│   │   │   │   ├── 🟢 aspect-ratio.tsx    # Responsive aspect ratio container
│   │   │   │   ├── 🟢 avatar.tsx          # User profile picture component
│   │   │   │   ├── 🟢 badge.tsx           # Status/label badge component
│   │   │   │   ├── 🟢 breadcrumb.tsx      # Navigation breadcrumb trail
│   │   │   │   ├── 🟢 button.tsx          # Interactive button component
│   │   │   │   ├── 🟢 calendar.tsx        # Date picker calendar
│   │   │   │   ├── 🟢 card.tsx            # Content container card
│   │   │   │   ├── 🟢 carousel.tsx        # Image/content slider
│   │   │   │   ├── 🟢 chart.tsx           # Data visualization charts
│   │   │   │   ├── 🟢 checkbox.tsx        # Form checkbox input
│   │   │   │   ├── 🟢 collapsible.tsx     # Expandable content section
│   │   │   │   ├── 🟢 command.tsx         # Command palette component
│   │   │   │   ├── 🟢 context-menu.tsx    # Right-click context menu
│   │   │   │   ├── 🟢 dialog.tsx          # Modal dialog component
│   │   │   │   ├── 🟢 drawer.tsx          # Slide-out drawer component
│   │   │   │   ├── 🟢 dropdown-menu.tsx   # Dropdown menu component
│   │   │   │   ├── 🟢 form.tsx            # Form validation wrapper
│   │   │   │   ├── 🟢 hover-card.tsx      # Hover tooltip card
│   │   │   │   ├── 🟢 input-otp.tsx       # One-time password input
│   │   │   │   ├── 🟢 input.tsx           # Text input field
│   │   │   │   ├── 🟢 label.tsx           # Form field label
│   │   │   │   ├── 🟢 menubar.tsx         # Application menu bar
│   │   │   │   ├── 🟢 navigation-menu.tsx # Site navigation menu
│   │   │   │   ├── 🟢 pagination.tsx      # Page navigation component
│   │   │   │   ├── 🟢 popover.tsx         # Floating content popover
│   │   │   │   ├── 🟢 progress.tsx        # Progress bar indicator
│   │   │   │   ├── 🟢 radio-group.tsx     # Radio button group
│   │   │   │   ├── 🟢 resizable.tsx       # Resizable panel component
│   │   │   │   ├── 🟢 scroll-area.tsx     # Custom scrollable area
│   │   │   │   ├── 🟢 select.tsx          # Dropdown select input
│   │   │   │   ├── 🟢 separator.tsx       # Visual content separator
│   │   │   │   ├── 🟢 sheet.tsx           # Side panel sheet
│   │   │   │   ├── 🟢 sidebar.tsx         # Application sidebar
│   │   │   │   ├── 🟢 skeleton.tsx        # Loading placeholder skeleton
│   │   │   │   ├── 🟢 slider.tsx          # Range slider input
│   │   │   │   ├── 🟢 sonner.tsx          # Toast notification system
│   │   │   │   ├── 🟢 switch.tsx          # Toggle switch component
│   │   │   │   ├── 🟢 table.tsx           # Data table component
│   │   │   │   ├── 🟢 tabs.tsx            # Tabbed interface component
│   │   │   │   ├── 🟢 textarea.tsx        # Multi-line text input
│   │   │   │   ├── 🟢 toast.tsx           # Toast notification component
│   │   │   │   ├── 🟢 toaster.tsx         # Toast notification manager
│   │   │   │   ├── 🟢 toggle-group.tsx    # Toggle button group
│   │   │   │   ├── 🟢 toggle.tsx          # Toggle button component
│   │   │   │   ├── 🟢 tooltip.tsx         # Hover tooltip component
│   │   │   │   └── 🟢 use-toast.ts        # Toast notification hook
│   │   │   ├── 🟡 Analytics.tsx           # User analytics and tracking
│   │   │   ├── 🟡 AudioSceneBuilder.tsx   # 3D audio scene configuration
│   │   │   ├── 🟢 ErrorBoundary.tsx       # React error boundary component
│   │   │   ├── 🟡 Features.tsx            # Feature showcase component
│   │   │   ├── 🟢 Footer.tsx              # Site footer component
│   │   │   ├── 🟡 Hero.tsx                # Landing page hero section
│   │   │   ├── 🟢 Navigation.tsx          # Main site navigation
│   │   │   ├── 🟢 PerformanceMonitor.tsx  # Performance monitoring component
│   │   │   ├── 🟡 ProjectManager.tsx      # Voice project management
│   │   │   ├── 🟡 SmartContentGenerator.tsx # AI content generation interface
│   │   │   ├── 🟡 SpatialAudio.tsx        # 3D spatial audio positioning
│   │   │   ├── 🟡 VoiceHarmonization.tsx  # Voice harmonization controls
│   │   │   └── 🟡 VoiceStudio.tsx         # Main voice processing interface
│   │   ├── 📁 hooks/                       # Custom React hooks
│   │   │   ├── 🟢 use-mobile.tsx          # Mobile device detection hook
│   │   │   └── 🟢 use-toast.ts            # Toast notification hook
│   │   ├── 📁 integrations/                # External service integrations
│   │   │   └── 📁 supabase/                # Supabase backend integration
│   │   │       ├── 🟢 client.ts           # Supabase client configuration
│   │   │       └── 🟢 types.ts            # Supabase TypeScript types
│   │   ├── 📁 lib/                         # Utility libraries
│   │   │   └── 🟢 utils.ts                # Common utility functions
│   │   ├── 📁 pages/                       # Application pages/routes
│   │   │   ├── 🟡 Index.tsx               # Home page component
│   │   │   └── 🟢 NotFound.tsx            # 404 error page
│   │   ├── 🟢 App.css                     # Global application styles
│   │   ├── 🟡 App.tsx                     # Root application component
│   │   ├── 🟢 index.css                   # Base CSS styles
│   │   ├── 🟢 main.tsx                    # React application entry point
│   │   └── 🟢 vite-env.d.ts               # Vite environment type definitions
│   └── 🟢 index.html                      # HTML entry point
├── 📁 server/                              # Backend Express.js server
│   ├── 🟢 db.ts                           # Database connection and configuration
│   ├── 🟡 index.ts                        # Express server entry point
│   ├── 🟢 routes.ts                       # API route definitions
│   ├── 🟢 storage.ts                      # File storage utilities
│   └── 🟢 vite.ts                         # Vite development middleware
├── 📁 shared/                              # Shared code between client/server
│   └── 🟢 schema.ts                       # Database schema definitions
├── 📁 supabase/                            # Supabase configuration and functions
│   ├── 📁 functions/                       # Serverless functions
│   │   ├── 📁 ai-content-generator/        # AI content generation service
│   │   │   └── 🟢 index.ts                # AI content generation endpoint
│   │   └── 📁 generate-speech/             # Text-to-speech service
│   │       └── 🟢 index.ts                # Speech generation endpoint
│   ├── 📁 migrations/                      # Database migration files
│   │   └── 🟢 20250802063833_*.sql        # Initial database schema migration
│   └── 🟢 config.toml                     # Supabase project configuration
├── 🟢 .gitignore                          # Git ignore patterns
├── 🟢 .replit                             # Replit IDE configuration
├── 🟢 components.json                     # Shadcn/UI component configuration
├── 🟢 drizzle.config.ts                   # Drizzle ORM configuration
├── 🟢 package-lock.json                   # NPM dependency lock file
├── 🟡 package.json                        # NPM package configuration
├── 🟢 postcss.config.js                   # PostCSS configuration
├── 🟢 replit.md                           # Replit project documentation
├── 🟢 tailwind.config.ts                  # Tailwind CSS configuration
├── 🟢 tsconfig.json                       # TypeScript configuration
└── 🟢 vite.config.ts                      # Vite build tool configuration
```

## Import Complexity Legend
- 🟢 **Simple** (0-3 imports): Basic components with minimal dependencies
- 🟡 **Moderate** (4-7 imports): Components with multiple dependencies
- 🔴 **Complex** (8+ imports): Highly interconnected components

## File Statistics
- **Total Files**: 89
- **Simple Complexity**: 79 files (89%)
- **Moderate Complexity**: 10 files (11%)
- **Complex Complexity**: 0 files (0%)

## Key Architectural Patterns
- **Frontend**: React with TypeScript, component-based architecture
- **Backend**: Express.js REST API with middleware pattern
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Styling**: Tailwind CSS with Shadcn/UI component system
- **Build Tool**: Vite for fast development and optimized production builds
