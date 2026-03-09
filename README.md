# Calendar Monorepo

A full-stack **calendar + tasks** app built as an **npm workspaces monorepo**.

It includes:

- **`apps/client`** — Next.js 16 + React 19 frontend (calendar UI, tasks, drag & drop, search)
- **`apps/server`** — NestJS 11 backend (MongoDB task storage, holidays proxy)
- **`packages/types`** — Shared TypeScript interfaces used by both apps

---

## 📚 Docs

- [Client app documentation](apps/client)
- [Server app documentation](apps/server)
- [Types package documentation](packages/types)

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run apps in development

```bash
npm run dev:client   # Start the Next.js frontend (http://localhost:3000)
npm run dev:server   # Start the NestJS backend (http://localhost:3001)
```

> The client expects the server at `http://localhost:3001` by default. Use `NEXT_PUBLIC_SERVER_URL` to override.

### 3) Build / test

```bash
npm run build
npm run test
npm run lint
npm run tsc
```

---

## 🧱 Workspace Structure

```
/apps
  /client   - Frontend (Next.js)
  /server   - Backend (NestJS)
/packages
  /types    - Shared TypeScript definitions
```

---

## 🧩 Notes

- `packages/types` must be built before `apps/client` or `apps/server` can successfully typecheck.
- The server caches holiday data in-memory per year+country.
- Tasks are stored per-day with an `order` field to support drag & drop reordering.
