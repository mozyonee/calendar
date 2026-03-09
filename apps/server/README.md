# Server

The server is a NestJS 11 application providing:

- CRUD for tasks (MongoDB + Mongoose)
- Reordering tasks atomically (updates `order` field)
- Holiday proxy API (caches calls to `https://date.nager.at`)

## 🚀 Running Locally

From the repo root:

```bash
npm --workspace apps/server run dev
```

Or from inside `apps/server`:

```bash
npm install
npm run dev
```

The server defaults to `http://localhost:3001`.

## 🔧 Environment Variables

Create a `.env.local` in `apps/server` (already present as `.env.example`).

| Variable | Default | Description |
|---------|---------|-------------|
| `MONGODB_URI` | (required) | MongoDB connection string |
| `CLIENT_URL` | (required) | Client URL for CORS |
| `PORT` | `3001` | Server port |

## ✅ Build

```bash
npm --workspace apps/server run build
```

## 🧪 Tests

```bash
npm --workspace apps/server run test
npm --workspace apps/server run test:e2e
npm --workspace apps/server run test:cov
```

## 🧠 Notes

- Task schema is in `src/tasks/task.schema.ts`.
- Reorder endpoint accepts `ReorderTaskDto` and updates sibling `order` values atomically.
- Holiday proxy caches results in-memory per year+country.
