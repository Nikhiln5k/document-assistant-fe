# AI Document Assistant — Frontend

Next.js 16 (App Router) frontend for uploading documents and chatting with them using AI.

## Getting started

```bash
cp .env.example .env.local   # then set NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev
```

## Project structure

```
src/
├── app/                    # Pages. Each folder = one URL
│   ├── layout.tsx          # Root layout (wraps every page)
│   ├── page.tsx            # /  -> redirects to /dashboard
│   ├── login/page.tsx      # /login
│   ├── register/page.tsx   # /register
│   ├── dashboard/
│   │   ├── layout.tsx      # Sidebar + header for all dashboard pages
│   │   └── page.tsx        # /dashboard
│   ├── error.tsx           # Shown when something crashes
│   └── not-found.tsx       # Shown for unknown URLs (404)
├── components/
│   ├── ui/                 # Reusable building blocks (Button, Input)
│   ├── auth/               # Login and register forms
│   └── dashboard/          # Sidebar, header
├── services/               # All backend API calls
│   ├── api.ts              # Base get/post helpers
│   ├── auth.service.ts
│   └── dashboard.service.ts
├── types/                  # TypeScript types (auth.ts, dashboard.ts)
├── constants/              # Fixed values (routes, app name)
├── lib/utils.ts            # Small helper functions
└── proxy.ts                # Runs before requests (protects /dashboard)
```

## How the pieces connect

```
page (app/) → component (components/) → service (services/) → api.ts → backend
```

- Pages only arrange components.
- Components handle the UI and user input.
- Services are the only place that calls the backend.
- Import with the `@/` shortcut, e.g. `import { login } from "@/services/auth.service"`.
