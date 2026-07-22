# Cloudflare Workers Fullstack Demo

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xoderx/way-back)

A production-ready fullstack demo application showcasing Cloudflare Workers with Durable Objects for persistent entity storage (Users, Chats, Messages), paired with a modern React frontend. Features real-time chat boards, CRUD operations, pagination, and responsive UI with dark mode support.

## Features

- **Backend**: Hono-based API routing with Cloudflare Durable Objects for scalable, multi-tenant storage (one DO per entity)
- **Entities**: Users, ChatBoards (with embedded messages), indexed for efficient listing/pagination
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui components, TanStack Query for data fetching/mutations
- **API**: RESTful endpoints for users/chats/messages (list, create, delete, pagination)
- **UI/UX**: Responsive design, dark/light theme toggle, sidebar layout, toast notifications, error boundaries
- **Storage**: SQLite-backed Durable Objects with optimistic concurrency (CAS), prefix indexes
- **Development**: Hot reload, TypeScript end-to-end, linting, auto-type generation from Workers
- **Deployment**: One-command deploy to Cloudflare Workers/Pages

## Tech Stack

- **Runtime**: Cloudflare Workers, Durable Objects (SQLite)
- **Backend**: Hono, TypeScript
- **Frontend**: React 18, Vite, React Router, TanStack Query, Zod
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI primitives), Tailwind Animate
- **UI Components**: Lucide icons, Sonner toasts, Framer Motion, Recharts
- **Utilities**: Immer, clsx, tw-merge, react-hook-form
- **Dev Tools**: Bun, ESLint, TypeScript 5, Wrangler

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler` works)

### Installation

```bash
bun install
bun cf-typegen  # Generate Worker types
```

### Development

```bash
bun dev  # Starts dev server at http://localhost:3000 (or $PORT)
```

- Frontend: Vite dev server with HMR
- Backend: Workers dev mode with hot reload
- Access API at `/api/*` (e.g., `/api/users`, `/api/health`)

### Build for Production

```bash
bun build  # Builds static assets to dist/
```

## Usage

### API Endpoints

All responses follow `{ success: boolean, data?: T, error?: string }` format.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (supports `?cursor` & `?limit`) |
| POST | `/api/users` | Create user `{ name: string }` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Delete multiple `{ ids: string[] }` |
| GET | `/api/chats` | List chats (supports `?cursor` & `?limit`) |
| POST | `/api/chats` | Create chat `{ title: string }` |
| GET | `/api/chats/:chatId/messages` | List messages |
| POST | `/api/chats/:chatId/messages` | Send message `{ userId: string, text: string }` |
| DELETE | `/api/chats/:id` | Delete chat |
| POST | `/api/chats/deleteMany` | Delete multiple `{ ids: string[] }` |
| POST | `/api/client-errors` | Report client errors |
| GET | `/api/health` | Health check |
| GET | `/api/test` | Test endpoint |

Example with `fetch`:

```ts
// List users
const users = await fetch('/api/users?limit=10').then(r => r.json());

// Create user
await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John Doe' })
});
```

Frontend uses `api-client.ts` wrapper with TanStack Query integration.

## Customization

- **Add routes**: Edit `worker/user-routes.ts`, routes auto-reload
- **New entities**: Extend `IndexedEntity` in `worker/entities.ts` (see `UserEntity`, `ChatBoardEntity`)
- **Frontend pages**: Update `src/main.tsx` router, replace `src/pages/HomePage.tsx`
- **UI**: Use shadcn components (`src/components/ui/*`), add via `bunx shadcn-ui@latest add <component>`
- **Sidebar**: Customize `src/components/app-sidebar.tsx` or remove from `AppLayout`
- **API client**: Extend `src/lib/api-client.ts`

**Do not modify**: `worker/index.ts`, `worker/core-utils.ts` (core infrastructure).

## Deployment

Deploy to Cloudflare Workers with Pages for static assets:

```bash
bun build  # Optional: pre-build assets
wrangler deploy  # Deploys worker + assets
```

- Config: `wrangler.jsonc` (customize `name`, bindings)
- Durable Objects: Auto-migrated via `migrations`
- Assets: SPA fallback (`not_found_handling: "single-page-application"`)
- Observability: Enabled by default

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xoderx/way-back)

### Custom Domain / Secrets

```bash
wrangler secret put MY_SECRET  # Add runtime secrets
wrangler pages deploy dist/    # Deploy Pages separately if needed
```

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Development server |
| `bun build` | Build for production |
| `bun lint` | Lint codebase |
| `bun preview` | Local production preview |
| `bun deploy` | Build + deploy |
| `bun cf-typegen` | Generate Worker types |

## License

MIT License. See [LICENSE](LICENSE) for details.