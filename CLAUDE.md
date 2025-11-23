# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.2.2 application using the App Router architecture, TypeScript, React 19, and Tailwind CSS v4.

## Development Commands

- `npm run dev` - Start development server with Turbopack (default port: 3000)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Project Structure

- `src/app/` - Next.js App Router directory containing routes and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives
- Path aliases: `@/*` maps to `./src/*`

### Key Technologies

- **Next.js 15.2.2** with App Router (file-based routing)
- **React 19** with TypeScript strict mode
- **Tailwind CSS v4** with PostCSS
- **Turbopack** enabled for development
- **Geist fonts** (Sans and Mono) from next/font/google

### TypeScript Configuration

- Strict mode enabled
- Target: ES2017
- Module resolution: bundler
- Path alias `@/*` configured for `./src/*`

## Frontend Architecture Guide

### Design System & Component Library

- **UI Components**: shadcn/ui (configured)
- **Styling System**: Tailwind CSS v4 with custom configuration
- **Component Structure**:
  - `/src/components/` - Reusable components
  - `/src/components/share-templates/` - Share template variants
  - `/src/app/(app)/` - App Router pages and layouts
  - `/src/hooks/` - Custom React hooks

### Core Features & Components

**Article Reading & Sharing System**:
- `ArticleContent.tsx` - Article content container with text selection support
- `HighlightedText.tsx` - Text highlighting functionality
- `SelectionPopover.tsx` - Popover for text selection actions
- `ShareDialog.tsx` - Share dialog with template selection
- `share-templates/` - Configurable share templates:
  - `IllustrationShareTemplate.tsx` - Illustration-based template
  - `MinimalistShareTemplate.tsx` - Minimalist template
  - `decorations/` - Decorative elements for templates
- **Hooks**: `useTextSelection.ts` - Manages text selection state and behavior

### Backend Integration

- **Database**: Supabase (requires `.env.local` configuration)
- **Environment Variables**: Ensure Supabase URL and keys are properly configured
- **API Routes**: Located in `/src/app/api/`

### Development Conventions

- **Branch Naming**: Chinese feature branches (e.g., `feat-二期优化`)
- **Commit Messages**: Chinese with type prefix (fix, feat, chore, etc.)
- **Styling Priority**: Tailwind CSS first, custom CSS only when necessary
- **Component Patterns**: Server Components by default, Client Components with `"use client"` directive
- **File Organization**: Co-locate related files (components, hooks, types)

### Architecture Decisions

- **App Router over Pages Router**: Leveraging Next.js 15 App Router for better performance and DX
- **Turbopack**: Enabled for faster development builds
- **Geist Fonts**: Optimized typography with next/font/google
- **Strict TypeScript**: Type safety enforced across the codebase
- **Environment-specific Clients**: Separate Supabase clients for server/client contexts

### Common Pitfalls & Solutions

- **Supabase Client**: Always use server-side client for server components, browser client for client components
- **Environment Variables**: Must be prefixed with `NEXT_PUBLIC_` for client-side access
- **Text Selection**: Use `useTextSelection` hook to avoid duplicate selection logic
- **Styling**: Prefer Tailwind utilities over inline styles for consistency
