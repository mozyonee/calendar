# Types Package

This package contains shared TypeScript interfaces and DTOs used by both the client and server.

## 📦 What it contains

- `Task` / `CreateTaskDto` / `UpdateTaskDto`
- `ReorderTaskDto`
- `PublicHoliday` (holiday API return type)

## ✅ Build

From the repo root:

```bash
npm --workspace packages/types run build
```

> `apps/client` and `apps/server` depend on this package for type safety. Ensure it is built before running their TypeScript builds.

## 🧠 Notes

- Exports live in `packages/types/src/index.ts`.
- `dist/` is generated via `tsc -b`.
