# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Commands

### Root (run from `/`)

```bash
npm run dev:client       # Start Next.js client (port 3000)
npm run dev:server       # Start NestJS server (port 3001)
npm run build            # Build all workspaces
npm run lint             # Lint all workspaces
npm run tsc              # Typecheck all workspaces
npm run test             # Run all tests
npm run format           # Prettier format all files
```

### Client (`apps/client`)

```bash
npm run dev              # Next.js dev + TypeScript watch in parallel
npm run test             # Jest (passWithNoTests)
npm run typecheck        # tsc --noEmit
```

### Server (`apps/server`)

```bash
npm run dev              # NestJS watch mode
npm run test             # Jest (spec files)
npm run test:e2e         # Jest e2e config
npm run test:cov         # Jest with coverage
```

### Types package (`packages/types`)

```bash
npm run build            # tsc -b (must build before client/server can use it)
```

## Architecture

This is an npm workspaces monorepo with three packages:

- `packages/types` — shared TypeScript interfaces (`Task`, `CreateTaskDto`, `UpdateTaskDto`, `ReorderTaskDto`, `PublicHoliday`). Must be built before dependent apps can resolve types.
- `apps/client` — Next.js 16 + React 19 frontend
- `apps/server` — NestJS 11 backend

### Server

NestJS app with two feature modules:

- **`tasks/`** — CRUD + reorder for tasks, backed by MongoDB (Mongoose). Tasks are stored with a `date: "YYYY-MM-DD"` field and an `order: number` for per-day ordering. Reorder endpoint updates sibling orders atomically and returns all affected tasks.
- **`holidays/`** — Proxies `https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}`, caches in-memory per year+country.

Environment variables: `MONGODB_URI`, `CLIENT_URL`, `PORT` (default 3001). Loaded from `.env` or `.env.local`.

### Client

Feature-based structure under `src/`:

- `features/calendar/` — calendar navigation UI, CalendarGrid/Cell/Header components, DnD wiring
- `features/tasks/` — task components (TaskCard, TaskForm, TaskList), hooks (`useCalendarDnd`), API calls (`taskApi`, `holidayApi`)
- `store/` — Redux store with three slices: `calendar` (month/year nav, search query), `tasks` (byDate map, async thunks), `holidays`
- `lib/api.ts` — axios instance pointing to `NEXT_PUBLIC_SERVER_URL` (default `http://localhost:3001`)
- `app/(pages)/page.tsx` — single page route rendering `CalendarPage`

### State & DnD

Tasks in Redux are normalized as `byDate: Record<string, Task[]>` sorted by `order`. Drag-and-drop uses `@dnd-kit/core` with optimistic updates: `moveTaskOptimistic` updates Redux immediately, then `reorderTask` thunk syncs with the server and reconciles on success.

Search filtering is done client-side via a `createSelector` that filters `byDate` by `searchQuery`.
