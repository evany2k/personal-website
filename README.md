# Evan Yatrou — Personal Website

Source code for my personal portfolio website and AI chat assistant, hosted at [evanyatrou.dev](https://evanyatrou.dev).

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

---

## Overview

The site serves as my software development portfolio, highlighting my academic background (B.Sc. Environmental Science at McGill, Graduate Diploma in Computer Science at Concordia) and project work.

Key sections:
- **Projects (`/projects`)**: Case studies with modal previews for web apps, systems programming in Java, and environmental data research.
- **Resume (`/resume`)**: Education, work experience, coursework, and technical skills with PDF download.
- **About (`/about`)**: Background on my transition from environmental science to software development.
- **AI Assistant (`/chat`)**: An interactive chat interface powered by Google Gemini via the Vercel AI SDK, grounded on my background and projects, with fallback models and in-memory rate limiting.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **AI / LLM**: Vercel AI SDK, Google Gemini API, OpenRouter
- **Database**: Supabase (PostgreSQL) for asynchronous chat logs
- **Deployment**: Vercel

---

## Project Structure

```
src/
├── app/                  # App Router pages and API routes
│   ├── about/            # About page
│   ├── api/chat/         # AI streaming route with model fallbacks & rate limiting
│   ├── chat/             # Chat UI and system prompt viewer
│   ├── projects/         # Projects gallery and preview modals
│   ├── resume/           # Resume and skills breakdown
│   ├── layout.tsx        # Root layout, metadata, and OpenGraph tags
│   └── not-found.tsx     # Custom 404 page
├── components/           # Reusable UI components (Navbar, Footer, Connect, etc.)
├── data/                 # Static data for projects, resume, and site configuration
└── lib/                  # Utilities (AI persona prompt, rate limiting, DB logger)
```

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/evany2k/personal-website.git
cd personal-website
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

---

## Contact

- **Website**: [evanyatrou.dev](https://evanyatrou.dev)
- **LinkedIn**: [linkedin.com/in/evan-yatrou-1896b8267](https://linkedin.com/in/evan-yatrou-1896b8267)
- **GitHub**: [github.com/evany2k](https://github.com/evany2k)
- **Email**: evany2k@gmail.com
