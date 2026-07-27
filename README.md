# Awaluddin | Backend Engineer Portfolio

A highly interactive, modern developer portfolio built with **Next.js 15**, **Tailwind CSS v4**, and **Framer Motion**. This portfolio is designed to showcase backend engineering expertise through a premium, dynamic frontend experience featuring a custom neumorphic/glassmorphic aesthetic.

## 🌟 Key Features

- **Interactive UI & Animations:** Fluid page transitions, animated scroll progress bars, and a dynamic sliding "Learning Roadmap" powered by Framer Motion.
- **Dynamic Theme Playground:** A built-in admin playground to customize themes (colors, shadows, glassmorphism) in real-time and export custom CSS variables.
- **Architecture Flipbook Viewer:** Interactive presentation of system architecture diagrams with native support for SVG dark-mode inversion (`invert` & `hue-rotate`).
- **Comprehensive SEO:** Optimized with rich OpenGraph metadata, Twitter Cards, dynamic `robots.ts`, and `sitemap.xml` for maximum search engine visibility.
- **State Management:** Centralized data fetching and UI state management using Zustand (`portfolioStore`), dynamically pulling data (projects, experiences, testimonials, roadmap) from a backend API.
- **Generative Backgrounds:** Interactive P5.js visualizations for an immersive user experience.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS v4, Custom CSS Variables
- **Animation:** Framer Motion (`motion/react`)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Visuals:** P5.js

## 🚀 Getting Started

1. **Install Dependencies**
   This project uses `pnpm` (based on lockfile v9):
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Ensure you have a `.env.local` configured with the necessary API URLs:
   ```env
   NEXT_PUBLIC_SITE_URL=https://awaluddin.dev
   # Add backend API URLs here if needed
   ```

3. **Run the Development Server**
   ```bash
   pnpm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `src/app/` - Next.js App Router setup, global styles, and SEO configurations (`layout.tsx`, `robots.ts`).
- `src/shared/store/` - Zustand stores for global state (`portfolioStore.ts`).
- `src/views/` - High-level page components and major views (e.g., `Home.tsx`, `AdminPlayground.tsx`).
- `src/widgets/` - Reusable domain-specific UI sections (e.g., `Hero`, `ProjectsList`, `Proficiency`).
- `src/entities/` & `src/features/` - Core domain entities and interactive features.

## 🔧 Customization

- **Theming:** Use the built-in *Theme Playground* (accessible via the Dock Navigation) to tweak the UI variables and generate a new neumorphic configuration for `globals.css`.
- **Data Source:** Most portfolio content (Roadmap, Projects, Work Experience) is pulled dynamically from the backend APIs (e.g., `/api/projects`, `/api/learning`).

## 📄 License
© Awaluddin. All rights reserved.
