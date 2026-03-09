# Client

The client is a Next.js 16 + React 19 application that provides a calendar UI with drag-and-drop task management and search.

## 📦 What it contains

- Calendar grid + navigation UI
- Task list / task cards
- Drag-and-drop task reordering (`@dnd-kit/core`)
- Search filtering (client-side)
- Fetches tasks + holidays from the server API

## 🚀 Running Locally

From the repo root:

```bash
npm --workspace apps/client run dev
```

Or from inside `apps/client`:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## 🧠 Environment Variables

Create a `.env.local` in `apps/client` (already present as `.env.example`).

| Variable                 | Default                 | Description      |
| ------------------------ | ----------------------- | ---------------- |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3001` | Backend base URL |

## ✅ Build

```bash
npm --workspace apps/client run build
```

## 🧪 Tests

```bash
npm --workspace apps/client run test
```

## 🧩 Notes

- The frontend depends on `packages/types` for shared DTOs/types.
- API calls are encapsulated in `src/features/tasks/lib/taskApi.ts` and `src/features/tasks/lib/holidayApi.ts`.
