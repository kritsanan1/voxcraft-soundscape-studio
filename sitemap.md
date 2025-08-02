
# VoxCraft Application Sitemap

## Overview
This document provides a comprehensive map of all routes, pages, and user journeys within the VoxCraft voice processing platform.

## Public Routes

### Landing Pages
```
/ (Home/Index)
├── Hero Section
├── Features Overview
├── Voice Studio Demo
├── Spatial Audio Showcase
├── AI Content Generator
├── Project Management Preview
└── Call-to-Action Signup

/features
├── /features/voice-processing
├── /features/spatial-audio
├── /features/ai-content-generation
├── /features/project-management
└── /features/voice-harmonization

/pricing
├── Free Tier Details
├── Pro Plan Features
├── Enterprise Solutions
└── FAQ Section

/about
├── Company Information
├── Team Profiles
├── Technology Stack
└── Contact Information
```

## Application Routes

### Authentication Flow
```
/auth
├── /auth/login
│   ├── Username/Password Form
│   ├── Social Login Options
│   └── Forgot Password Link
├── /auth/register
│   ├── Account Creation Form
│   ├── Email Verification
│   └── Profile Setup
├── /auth/forgot-password
│   ├── Email Input Form
│   └── Reset Instructions
└── /auth/reset-password/:token
    ├── New Password Form
    └── Confirmation
```

### Main Application
```
/app (Protected Routes)
├── /app/dashboard
│   ├── Recent Projects
│   ├── Quick Actions
│   ├── Usage Statistics
│   └── Activity Feed
│
├── /app/voice-studio
│   ├── Voice Processing Interface
│   │   ├── Text Input
│   │   ├── Voice Selection
│   │   ├── Emotion Controls
│   │   ├── Age Adjustment
│   │   ├── Accent Selection
│   │   └── Real-time Preview
│   └── Voice Library
│       ├── Preset Voices
│       ├── Custom Voice Profiles
│       └── Voice Cloning
│
├── /app/spatial-audio
│   ├── 3D Audio Positioning
│   │   ├── 3D Scene Editor
│   │   ├── Audio Source Placement
│   │   ├── Listener Position
│   │   └── Environmental Effects
│   └── Audio Scene Builder
│       ├── Scene Templates
│       ├── Custom Environments
│       └── Export Options
│
├── /app/ai-content
│   ├── Content Generation
│   │   ├── Script Generator
│   │   ├── Dialogue Creator
│   │   ├── Character Development
│   │   └── Content Enhancement
│   └── Content Library
│       ├── Generated Scripts
│       ├── Templates
│       └── Collaboration Tools
│
├── /app/projects
│   ├── Project Manager
│   │   ├── Project List
│   │   ├── Recent Projects
│   │   ├── Shared Projects
│   │   └── Project Templates
│   ├── /app/projects/:id
│   │   ├── Project Overview
│   │   ├── Audio Files
│   │   ├── Project Settings
│   │   ├── Collaboration
│   │   └── Export Options
│   └── /app/projects/new
│       ├── Project Creation Wizard
│       ├── Template Selection
│       └── Initial Configuration
│
├── /app/harmonization
│   ├── Voice Harmonization Studio
│   │   ├── Multi-voice Layering
│   │   ├── Harmony Generation
│   │   ├── Pitch Control
│   │   └── Timing Adjustment
│   └── Harmony Presets
│       ├── Musical Styles
│       ├── Vocal Arrangements
│       └── Custom Harmonies
│
├── /app/settings
│   ├── /app/settings/profile
│   │   ├── Personal Information
│   │   ├── Avatar Upload
│   │   └── Preferences
│   ├── /app/settings/account
│   │   ├── Password Change
│   │   ├── Email Settings
│   │   └── Account Deletion
│   ├── /app/settings/api-keys
│   │   ├── ElevenLabs Configuration
│   │   ├── OpenAI Configuration
│   │   └── Other Integrations
│   ├── /app/settings/billing
│   │   ├── Current Plan
│   │   ├── Usage Statistics
│   │   ├── Payment Methods
│   │   └── Billing History
│   └── /app/settings/notifications
│       ├── Email Preferences
│       ├── Push Notifications
│       └── Activity Alerts
│
└── /app/help
    ├── /app/help/documentation
    │   ├── Getting Started Guide
    │   ├── Feature Tutorials
    │   ├── API Documentation
    │   └── Best Practices
    ├── /app/help/support
    │   ├── Contact Support
    │   ├── Bug Reporting
    │   └── Feature Requests
    └── /app/help/community
        ├── User Forums
        ├── Community Projects
        └── Tips & Tricks
```

## API Endpoints

### Authentication API
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Voice Processing API
```
POST /api/voice/generate-speech
GET  /api/voice/profiles
POST /api/voice/profiles
PUT  /api/voice/profiles/:id
DELETE /api/voice/profiles/:id
POST /api/voice/clone
GET  /api/voice/presets
```

### Spatial Audio API
```
POST /api/audio/create-scene
GET  /api/audio/scenes
GET  /api/audio/scenes/:id
PUT  /api/audio/scenes/:id
DELETE /api/audio/scenes/:id
POST /api/audio/render-3d
GET  /api/audio/environments
```

### AI Content API
```
POST /api/ai/generate-content
POST /api/ai/enhance-script
POST /api/ai/create-dialogue
GET  /api/ai/content/:id
PUT  /api/ai/content/:id
DELETE /api/ai/content/:id
```

### Project Management API
```
GET  /api/projects
POST /api/projects
GET  /api/projects/:id
PUT  /api/projects/:id
DELETE /api/projects/:id
POST /api/projects/:id/share
GET  /api/projects/:id/collaborators
POST /api/projects/:id/export
```

### User Management API
```
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/settings
PUT  /api/users/settings
GET  /api/users/usage
POST /api/users/upload-avatar
```

## User Journey Flows

### New User Onboarding
```
1. Landing Page Visit
   ↓
2. Feature Exploration
   ↓
3. Account Registration
   ↓
4. Email Verification
   ↓
5. Profile Setup
   ↓
6. Interactive Tutorial
   ↓
7. First Project Creation
   ↓
8. Voice Processing Demo
   ↓
9. Project Save & Share
```

### Voice Processing Workflow
```
1. Voice Studio Access
   ↓
2. Text Input or Script Import
   ↓
3. Voice Selection (Preset/Custom)
   ↓
4. Emotion & Style Configuration
   ↓
5. Age & Accent Adjustment
   ↓
6. Real-time Preview
   ↓
7. Fine-tuning Controls
   ↓
8. Final Generation
   ↓
9. Save to Project
   ↓
10. Export or Share
```

### 3D Spatial Audio Creation
```
1. Spatial Audio Studio
   ↓
2. Scene Template Selection
   ↓
3. Audio Source Upload/Import
   ↓
4. 3D Position Placement
   ↓
5. Environment Configuration
   ↓
6. Listener Position Setup
   ↓
7. Real-time 3D Preview
   ↓
8. Effect Adjustments
   ↓
9. Scene Rendering
   ↓
10. Export Spatial Audio
```

### AI Content Generation Flow
```
1. Content Generator Access
   ↓
2. Content Type Selection
   ↓
3. Parameters & Context Input
   ↓
4. AI Generation Process
   ↓
5. Content Review & Edit
   ↓
6. Voice Assignment
   ↓
7. Integration with Voice Studio
   ↓
8. Final Audio Production
   ↓
9. Project Integration
```

### Project Collaboration Flow
```
1. Project Creation/Access
   ↓
2. Collaborator Invitation
   ↓
3. Permission Configuration
   ↓
4. Real-time Collaboration
   ↓
5. Version Control
   ↓
6. Comment & Feedback System
   ↓
7. Review & Approval Process
   ↓
8. Final Export & Distribution
```

## Error Pages

### Client-Side Errors
```
/404 - Page Not Found
├── Navigation Back to App
├── Search Functionality
└── Popular Pages Links

/403 - Access Forbidden
├── Authentication Status
├── Permission Requirements
└── Contact Support

/500 - Server Error
├── Error Details (Dev Mode)
├── Retry Options
└── Status Page Link
```

### Application Error States
```
/app/error
├── Error Boundary Fallback
├── Error Reporting
├── Safe Recovery Options
└── Contact Support

/app/maintenance
├── Maintenance Notice
├── Expected Downtime
├── Status Updates
└── Alternative Resources
```

## Mobile-Specific Routes

### Responsive Adaptations
```
All routes are responsive with mobile-first design:

- Collapsible navigation
- Touch-optimized controls
- Simplified interfaces for small screens
- Progressive enhancement for larger screens
- Offline capability for core features
```

## Navigation Structure

### Primary Navigation
```
Header Navigation:
├── Logo (→ /)
├── Features Dropdown
├── Pricing (→ /pricing)
├── About (→ /about)
└── Login/Dashboard

App Navigation:
├── Dashboard (→ /app/dashboard)
├── Voice Studio (→ /app/voice-studio)
├── Spatial Audio (→ /app/spatial-audio)
├── AI Content (→ /app/ai-content)
├── Projects (→ /app/projects)
├── Harmonization (→ /app/harmonization)
└── Settings (→ /app/settings)
```

### Footer Navigation
```
Footer Links:
├── Company
│   ├── About Us
│   ├── Careers
│   └── Contact
├── Product
│   ├── Features
│   ├── Pricing
│   └── Documentation
├── Resources
│   ├── Help Center
│   ├── Community
│   └── API Docs
└── Legal
    ├── Privacy Policy
    ├── Terms of Service
    └── Cookie Policy
```

## SEO Considerations

### Meta Information
- Dynamic page titles based on content
- Descriptive meta descriptions for each route
- Open Graph tags for social sharing
- Structured data markup for rich snippets
- Canonical URLs to prevent duplicate content

### URL Structure
- Clean, descriptive URLs
- Consistent naming conventions
- Proper use of hyphens for word separation
- Logical hierarchy for nested routes
- SEO-friendly parameter handling

---

This sitemap serves as the definitive guide to VoxCraft's application structure and user navigation patterns.
