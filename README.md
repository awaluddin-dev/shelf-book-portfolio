# Awaluddin | Backend Engineer Portfolio

A highly interactive, modern developer portfolio built with **Next.js 15**, **Tailwind CSS v4**, and **Motion (Framer Motion)**. This portfolio is designed to showcase backend engineering expertise through a premium, dynamic frontend experience featuring a custom neumorphic/glassmorphic aesthetic, an admin CMS panel, and AI-powered assistants.

## 🌟 Key Features

- **Interactive UI & Animations:** Fluid page transitions, animated scroll progress bars, and a dynamic sliding "Learning Roadmap" powered by Motion.
- **Dynamic Theme Playground:** A built-in admin playground to customize themes (colors, shadows, glassmorphism) in real-time and export custom CSS variables.
- **Architecture Flipbook Viewer:** Interactive presentation of system architecture diagrams (Mermaid + SVG) with native support for dark-mode inversion.
- **AI Assistants (SSE streaming):**
  - **Portfolio Chat Widget** — RAG-backed chat that answers questions about Awaluddin's experience, skills, and projects.
  - **Project Explainer** — Generates a plain-English, 3-paragraph explanation of any project for recruiters.
  - **Cover Letter Generator** — Builds a tailored cover letter from a job description + portfolio data.
  - **Draft Inquiry Email** — Drafts a recruiter response email to a cover letter.
- **Admin CMS Panel:** Full CRUD management for hero, work experience, projects, skills, proficiency, roadmap, testimonials, architecture, lifecycle, and technical imagery — with JWT auth (access + refresh token rotation) and a route-guarded dashboard.
- **Public Testimonial Submission:** Rate-limited public page (`/testimoni/[token]`) for visitors to leave endorsements.
- **Comprehensive SEO:** Optimized with rich OpenGraph metadata, Twitter Cards, dynamic `robots.ts`, and `sitemap.xml`.
- **State Management:** Centralized data fetching and UI state management using Zustand (`portfolioStore`), with retry-based fetching to handle backend cold starts.
- **Generative Backgrounds:** Interactive P5.js visualizations and a mascot with speech bubbles.
- **GitHub Integration:** Live contribution heatmap, repo stats, and language breakdown via backend GraphQL proxy.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, `output: 'standalone'`)
- **Styling:** Tailwind CSS v4, Custom CSS Variables (neumorphic theme)
- **Animation:** Motion (`motion`)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Visuals:** P5.js, Mermaid (architecture diagrams), Recharts (contribution charts)
- **Forms / Security:** Cloudflare Turnstile (contact form), DOMPurify (sanitization)
- **Diagrams:** react-zoom-pan-pinch (architecture flipbook)
- **Quality:** ESLint, Stylelint, SonarQube, Jest + Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/awaluddin-dev/shelf-book-portofolio.git
cd shelf-book-portofolio

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values (see below)

# 4. Run the development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Note: API calls are proxied through Next.js rewrites (`/api/:path*` → `NEXT_PUBLIC_API_URL`), so the frontend fetches relative `/api/...` URLs for content data — except the AI endpoints, which call `NEXT_PUBLIC_API_URL` directly for SSE streaming.

### Environment Variables

```env
# Site URL (SEO, metadataBase, canonicals)
NEXT_PUBLIC_SITE_URL=https://awaluddin.dev

# Backend API base URL (content fetching + AI SSE streaming)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Cloudflare Turnstile site key (contact form captcha)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# GitHub personal access token (fetched server-side for contribution stats)
GITHUB_TOKEN=ghp_your_github_token_here

# SonarQube token (CI/CD scanning)
SONAR_TOKEN=your_sonar_token_here
```

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router (pages, layouts, SEO)
│   ├── admin/              #   Admin CMS (login + authenticated CRUD pages)
│   └── testimoni/[token]/  #   Public testimonial submission page
├── entities/               # Core domain entities (Project, Skill) with UI
├── features/               # Domain features (Contact form)
├── hooks/                  # AI streaming hooks (useChat, useCoverLetter, useProjectExplainer, useDraftInquiry)
├── shared/                 # Lib (fetch utils, auth, helpers), Zustand store, types, UI primitives
├── views/                  # High-level page views (Home, Admin*, Testimoni)
└── widgets/                # Reusable sections (Hero, ProjectsList, Proficiency, ChatWidget, ...)
__tests__/                  # Jest + Testing Library tests
```

## 🔧 Customization

- **Theming:** Use the built-in _Theme Playground_ (accessible via the Dock Navigation) to tweak the UI variables and generate a new neumorphic configuration for `globals.css`.
- **Data Source:** Most portfolio content (Roadmap, Projects, Work Experience, Hero, Testimonials) is pulled dynamically from the backend APIs (e.g., `/api/projects`, `/api/learning`) and managed through the `/admin` CMS.

## 🧪 Testing & Quality

```bash
pnpm test          # unit tests (Jest)
pnpm test:cov      # coverage report
pnpm lint          # ESLint
pnpm lint:css      # Stylelint
pnpm sonar         # SonarQube scanner
```

## 🚢 Deployment

The app builds as a **standalone** Next.js output (`output: 'standalone'`) and runs via `node .next/standalone/server.js` (see `start:prod`). Production environment values are loaded from `.env.prod.local` via `dotenv-cli`.

## 📄 License

© Awaluddin. All rights reserved.
