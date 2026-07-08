# Mabior Agau — Portfolio

> **Cybersecurity Expert & Penetration Tester** operating from Juba, South Sudan.

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://mabioragau.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Modern portfolio built with React, TypeScript, and Tailwind CSS — featuring a reactive cyber-topographic map, blog with rich editor, admin dashboard, and AI chatbot.

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 (SWC) |
| **Styling** | Tailwind CSS 3 + shadcn/ui |
| **Backend** | Supabase (auth, database, edge functions, storage) |
| **Deploy** | Vercel (static SPA) |
| **CMS** | TipTap editor + Supabase blog backend |
| **State** | TanStack Query (React Query) |

## Features

- ⚡ Lazy-loaded routes with manual chunk splitting
- 🌗 Dark/light theme with smooth transition
- 🗺️ Interactive SVG map of South Sudan with network nodes
- 📝 Full-featured blog editor (TipTap + image upload)
- 🤖 AI-powered assistant chatbot
- 📊 Admin dashboard with blog analytics
- 📬 Newsletter + contact form (Supabase edge functions)
- 🔒 Security: CSP, HSTS, DOMPurify, Zod validation
- 🕷️ OG image generation for social share previews

## Development

```sh
npm install
npm run dev     # http://localhost:5173
npm run build   # production build → dist/
npm run preview # preview built output
```

### Environment

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
├── components/    # UI components (shadcn + custom)
│   ├── soc/       # South Sudan map, scramble text
│   └── ui/        # shadcn/ui primitives
├── hooks/         # Custom React hooks
├── integrations/  # Supabase client + types
├── pages/         # Route-level pages (lazy loaded)
├── lib/           # Utilities
└── assets/        # Static images (WebP)
```

## License

MIT — feel free to use as a reference for your own portfolio.
