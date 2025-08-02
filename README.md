
# VoxCraft - Advanced Voice Processing Platform

[![Replit](https://img.shields.io/badge/Deployed%20on-Replit-667881?logo=replit&logoColor=white)](https://replit.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## Overview

VoxCraft is a modern full-stack web application for advanced voice processing and audio content creation. The platform enables users to transform voices with AI-powered emotions, age adjustment, accent conversion, 3D spatial audio positioning, and voice harmonization.

## 🚀 Features

- **Voice Transformation**: AI-powered emotion, age, and accent modification
- **3D Spatial Audio**: Immersive audio positioning with environmental effects
- **Voice Harmonization**: Multi-voice layering and harmonization
- **AI Content Generation**: Automated script and dialogue creation
- **Project Management**: Save and manage voice processing projects
- **Real-time Processing**: Live audio processing with WebSocket support

## 🏗️ System Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui component library
- **React Query** for server state management
- **Wouter** for lightweight client-side routing

### Backend Stack
- **Node.js** runtime with TypeScript
- **Express.js** REST API framework
- **PostgreSQL** database with Neon serverless driver
- **Drizzle ORM** for type-safe database operations
- **Passport.js** for authentication

### External Services
- **ElevenLabs API** for text-to-speech generation
- **OpenAI API** for AI content generation
- **Supabase** for additional backend services

## 📋 Technical Requirements

### Development Environment
- **Node.js**: Version 20.x (LTS recommended)
- **npm**: Version 9.x or higher
- **PostgreSQL**: Version 16.x
- **Git**: Version 2.x

### System Dependencies
- **OS**: Linux, macOS, or Windows with WSL2
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/voxcraft
DIRECT_URL=postgresql://username:password@localhost:5432/voxcraft

# API Keys (Required for full functionality)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here

# Development Configuration
NODE_ENV=development
VITE_API_URL=http://localhost:5000
```

## 🔧 Installation Guide

### 1. Clone the Repository
```bash
git clone <repository-url>
cd voxcraft
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Push database schema
npm run db:push

# Verify database connection
npm run check
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Common Installation Issues

**Issue**: `npm install` fails with permission errors
**Solution**: Use `sudo npm install` or configure npm to use a different directory

**Issue**: Database connection fails
**Solution**: Verify PostgreSQL is running and environment variables are correct

**Issue**: Port 5000 already in use
**Solution**: Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

## 💻 Development Guidelines

### Code Style Conventions
- **TypeScript**: Strict mode enabled, explicit types preferred
- **React**: Functional components with hooks, proper prop typing
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Files**: Use descriptive names, group related functionality
- **Comments**: JSDoc for functions, inline comments for complex logic

### Git Workflow
```bash
# Branch naming convention
[type]/[ticket-number]-[description]

# Examples
feature/VOX-123-spatial-audio-controls
bugfix/VOX-456-fix-voice-processing
hotfix/VOX-789-critical-auth-issue
```

### Pull Request Template
```markdown
## Changes Made
- [ ] Brief description of changes
- [ ] List of modified files/components

## Testing Steps
1. Steps to test the changes
2. Expected behavior
3. Edge cases covered

## Screenshots/Videos
[Attach relevant screenshots or screen recordings]

## Review Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Breaking changes documented
```

### Code Review Criteria
- **Functionality**: Code works as intended
- **Performance**: No unnecessary re-renders or memory leaks
- **Security**: Input validation, no exposed secrets
- **Maintainability**: Clear, readable, well-documented code
- **Testing**: Adequate test coverage for new features

## 🚀 Deployment Process

### Replit Deployment (Recommended)
1. **Prepare for Deployment**
   ```bash
   npm run build
   npm run check
   ```

2. **Configure Environment Variables**
   - Navigate to Replit Secrets tab
   - Add all required environment variables
   - Ensure API keys are properly configured

3. **Deploy to Replit**
   - Click the "Deploy" button in Replit
   - Select "Autoscale" deployment type
   - Monitor deployment logs for any issues

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
npm run dev
```

#### Production
```bash
NODE_ENV=production
npm run build
npm start
```

### Rollback Procedures
1. **Identify Issue**: Check deployment logs and error reports
2. **Quick Rollback**: Use Replit's deployment history to revert
3. **Emergency Protocol**: Contact team lead if critical issues persist

## 📊 Scripts Reference

See [scripts.md](./scripts.md) for detailed script documentation.

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use secure methods for sensitive data
- **Authentication**: Implement proper session management
- **Input Validation**: Validate all user inputs on both client and server
- **HTTPS**: Always use HTTPS in production environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch following naming conventions
3. Make your changes with proper tests
4. Submit a pull request with detailed description
5. Ensure all checks pass before requesting review

## 📚 Additional Documentation

- [Architecture Overview](./architecture.md)
- [API Documentation](./api-docs.md)
- [Database Schema](./database-schema.md)
- [Troubleshooting Guide](./troubleshooting.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create GitHub issues for bugs and feature requests  
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: contact@voxcraft.com for urgent matters

---

Made with ❤️ by the VoxCraft Team
