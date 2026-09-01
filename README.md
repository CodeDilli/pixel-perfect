# Pixel Perfect

**Portfolio of Dilli Ganesh** — video editor learning to code.

A refined, white-themed cinematic single-page experience. Large typography, scroll-driven 3D type, film-style scene structure, and personal stills. Built to feel like a short film you can scroll through.

**Live:** [pixel-perfect-codedilli.vercel.app](https://pixel-perfect-codedilli.vercel.app)

---

## Theme & direction

- **White / light cinematic** — soft paper backgrounds, precise near-black type, single warm accent
- **Photography integrated** — campus, night, machine, and candid frames treated as stills in a sequence
- **Scene-based narrative** — Opening → Transition → Frames → Selected Work → About → Next Chapter → Contact → End of Sequence
- **Motion with restraint** — masked line reveals, fade-rise, demand-driven WebGL only while the 3D section is in view

## Stack

- [TanStack Start](https://tanstack.com/start) + TanStack Router
- React 19
- Tailwind CSS 4
- Vite
- TypeScript
- shadcn/ui primitives
- React Three Fiber + Drei (scroll-driven 3D typography)

## Development

Requires **Node.js 20+** (or Bun).

```bash
# Install
npm install
# or
bun install

# Dev server
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
  components/       # Reveal animations + cinematic 3D canvas + UI
  hooks/
  lib/
  routes/           # File-based routes (index = full experience)
  styles.css        # Design system (oklch light theme) + utilities
  server.ts
  start.ts
  router.tsx

public/
  portraits/        # Personal stills used across scenes
  favicon.ico
```

## Portraits

Stills live in `public/portraits/` and are used as:

- Hero atmospheric portrait
- “Frames” grid (six stills with captions)
- About portrait
- Closing / end-of-sequence still

Replace or add images there and update the `frames` array / image paths in `src/routes/index.tsx` if needed.

## Design notes

- Colors are defined in oklch in `:root` inside `styles.css`
- Display type: Instrument Sans · Editorial: Instrument Serif · Body: Inter · Mono: IBM Plex Mono
- Reduced-motion users get a 2D word rail and no WebGL
- Grain is subtle (multiply) so the white canvas stays clean

## License

Private / personal portfolio.
