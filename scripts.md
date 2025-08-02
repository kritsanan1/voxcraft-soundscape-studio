
# Scripts Documentation

## Overview
This document provides comprehensive information about all available npm scripts in the VoxCraft project.

## Available Scripts

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Starts development server with hot reloading | None | `npm run dev` | Ensure port 5000 is available, check environment variables |
| `build` | Builds application for production | None | `npm run build` | Clear node_modules if build fails, check TypeScript errors |
| `start` | Starts production server | None | `npm start` | Run `npm run build` first, verify environment variables |
| `check` | TypeScript type checking | None | `npm run check` | Fix TypeScript errors before proceeding |
| `db:push` | Pushes database schema changes | None | `npm run db:push` | Ensure database connection, check schema validity |

## Detailed Script Information

### Development Script: `dev`
**Purpose**: Launches the development environment with hot module replacement and TypeScript compilation.

**Command**: `NODE_ENV=development tsx server/index.ts`

**Features**:
- Hot reloading for both client and server code
- TypeScript compilation on-the-fly
- Vite development middleware integration
- Real-time error reporting

**Expected Output**:
```bash
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

7:25:31 AM [express] serving on port 5000
[vite] ready in 1234ms
```

**Common Issues**:
- **Port 5000 in use**: Kill existing process with `lsof -ti:5000 | xargs kill -9`
- **TypeScript errors**: Run `npm run check` to identify issues
- **Module not found**: Clear cache with `rm -rf node_modules package-lock.json && npm install`

### Build Script: `build`
**Purpose**: Creates optimized production build for both client and server.

**Command**: `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`

**Process**:
1. Vite builds and optimizes client-side code
2. esbuild bundles server code for Node.js
3. Output generated in `dist/` directory

**Expected Output**:
```bash
vite v5.0.0 building for production...
✓ 1234 modules transformed.
dist/assets/index-abc123.js  123.45 kB │ gzip: 45.67 kB
dist/assets/index-def456.css  12.34 kB │ gzip: 5.67 kB
✓ built in 5.67s

[esbuild] Build succeeded
```

**Troubleshooting**:
- **Build fails**: Clear build cache and retry
- **Large bundle size**: Analyze with `npm run analyze` (if available)
- **Missing dependencies**: Check all imports are correctly specified

### Start Script: `start`
**Purpose**: Runs the production server using built assets.

**Command**: `NODE_ENV=production node dist/index.js`

**Prerequisites**:
- Must run `npm run build` first
- Production environment variables configured
- Database accessible in production environment

**Expected Output**:
```bash
> rest-express@1.0.0 start
> NODE_ENV=production node dist/index.js

[express] serving on port 5000
Production server started successfully
```

**Common Issues**:
- **Module not found**: Ensure build completed successfully
- **Environment variables**: Verify all production variables are set
- **Database connection**: Check production database connectivity

### Type Check Script: `check`
**Purpose**: Performs TypeScript type checking without compilation.

**Command**: `tsc`

**Benefits**:
- Catches type errors early
- Validates TypeScript configuration
- Ensures code quality standards

**Expected Output** (Success):
```bash
> rest-express@1.0.0 check
> tsc

# No output indicates success
```

**Expected Output** (Errors):
```bash
> rest-express@1.0.0 check
> tsc

src/components/VoiceStudio.tsx:45:12 - error TS2339: Property 'invalidProp' does not exist on type 'Props'.

45     return invalidProp;
              ~~~~~~~~~~~

Found 1 error in src/components/VoiceStudio.tsx:45
```

**Troubleshooting**:
- **Type errors**: Fix reported TypeScript issues
- **Configuration issues**: Verify `tsconfig.json` is valid
- **Import errors**: Check all import paths are correct

### Database Push Script: `db:push`
**Purpose**: Synchronizes database schema with Drizzle ORM definitions.

**Command**: `drizzle-kit push`

**Features**:
- Applies schema changes to database
- Creates tables and relationships
- Handles migrations automatically

**Expected Output**:
```bash
> rest-express@1.0.0 db:push
> drizzle-kit push

📄 Reading config file...
🚀 Pushing schema changes...
✅ Schema synchronized successfully
```

**Prerequisites**:
- Database connection configured
- `DATABASE_URL` environment variable set
- Drizzle configuration file present

**Troubleshooting**:
- **Connection failed**: Verify database URL and credentials
- **Schema errors**: Check schema definitions in `shared/schema.ts`
- **Migration conflicts**: Review database state and schema changes

## Script Dependencies

### Required Environment Variables
```bash
# Development
NODE_ENV=development
DATABASE_URL=postgresql://...

# Production  
NODE_ENV=production
DATABASE_URL=postgresql://...
ELEVENLABS_API_KEY=...
OPENAI_API_KEY=...
```

### Development Dependencies
- `tsx`: TypeScript execution for development
- `esbuild`: Fast JavaScript bundler
- `vite`: Frontend build tool
- `drizzle-kit`: Database schema management

## Performance Optimization

### Build Optimization Tips
1. **Code Splitting**: Use dynamic imports for large components
2. **Tree Shaking**: Ensure imports are properly structured
3. **Bundle Analysis**: Regularly check bundle sizes
4. **Dependency Auditing**: Remove unused dependencies

### Development Speed Tips
1. **Incremental Builds**: Use TypeScript incremental compilation
2. **Hot Reloading**: Leverage Vite's fast refresh
3. **Type Checking**: Run `check` script regularly
4. **Database Caching**: Use connection pooling in development

## Custom Script Examples

### Running with Debug Mode
```bash
DEBUG=express:* npm run dev
```

### Building with Verbose Output
```bash
npm run build -- --verbose
```

### Type Checking Specific Files
```bash
npx tsc --noEmit src/components/VoiceStudio.tsx
```

### Database Schema Inspection
```bash
npx drizzle-kit introspect:pg
```

## CI/CD Integration

### Pre-commit Hooks
```json
{
  "pre-commit": "npm run check && npm run build"
}
```

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: npm ci

- name: Type check
  run: npm run check

- name: Build application
  run: npm run build
```

## Monitoring and Logging

### Development Logging
- Server requests logged to console
- Client errors displayed in browser
- TypeScript errors shown in terminal

### Production Monitoring
- Error tracking via structured logging
- Performance metrics collection
- Database query monitoring

---

For additional script customization or issues not covered here, please refer to the main [README.md](./README.md) or create an issue in the project repository.
