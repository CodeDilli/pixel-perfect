# Pixel Perfect

Portfolio of **Dilli Ganesh** — video editor learning to code.

Cinematic single-page experience built with TanStack Start, React, and Tailwind CSS.

## Stack

- [TanStack Start](https://tanstack.com/start) + TanStack Router
- React 19
- Tailwind CSS 4
- Vite 8
- TypeScript
- shadcn/ui components

## Development

Requires Node.js 20+ (or Bun).

```sh
# Install dependencies
npm install
# or
bun install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Production build           |
| `npm run preview` | Preview production build   |
| `npm run lint`    | Run ESLint                 |
| `npm run format`  | Format with Prettier       |

## Project structure

```
src/
  components/   # UI + Reveal animations
  hooks/        # Shared hooks
  lib/          # Utilities + error helpers
  routes/       # File-based routes
  styles.css    # Design system + Tailwind
  server.ts     # SSR entry with error handling
  start.ts      # Start middleware (CSRF + errors)
  router.tsx    # Router factory
```

## License

Private / personal portfolio.
