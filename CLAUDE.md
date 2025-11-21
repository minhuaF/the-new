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
