# Synthwave Portfolio Project Guidelines

## Build Commands
- `pnpm dev` - Run development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Code Style Guidelines
- Use TypeScript with strict mode
- Follow Next.js core-web-vitals and TypeScript ESLint rules
- Component naming: PascalCase (e.g., `IntroScreen`)
- Variables/functions: camelCase (e.g., `handleClick`)
- Client-side components: prefix with `'use client';`
- Props: Define TypeScript interfaces (e.g., `interface ComponentProps`)
- Use functional components with React.FC<Props> type
- CSS: Use CSS modules for component-specific styles
- Path aliases: Import from @/* (maps to ./src/*)
- Use the soundEffects utility for interactive audio

## Project Structure
- Components: src/components/
- Data: src/data/
- Utils: src/utils/
- API routes: src/app/api/
- Public assets: public/

## Error Handling
- Use try/catch for async operations
- Handle loading states appropriately
- Provide meaningful error messages to users