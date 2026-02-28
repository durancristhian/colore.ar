# colore.ar

AI-powered coloring book page generator. Users describe a scene or upload a photo and the app generates a printable coloring page. Built with Next.js, uses Clerk for auth, Turso for storage, Cloudinary for images, and OpenRouter/Pollinations for AI generation.

## Getting Started

```bash
git clone git@github.com:<your-user>/colore.ar.git
cd colore.ar
nvm install
npm install
cp .env.template .env.local  # fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `npm run dev`          | Start dev server         |
| `npm run build`        | Production build         |
| `npm start`            | Start production server  |
| `npm run lint`         | Run ESLint               |
| `npm run lint:fix`     | Run ESLint with auto-fix |
| `npm run format`       | Format with Prettier     |
| `npm run format:check` | Check formatting         |
| `npm run typecheck`    | Run TypeScript checks    |

## Editor

We recommend [VS Code](https://code.visualstudio.com) or [Cursor](https://cursor.com). The repo ships with:

- `.vscode/settings.json` -- Prettier as default formatter, format on save, ESLint auto-fix on save
- `.vscode/extensions.json` -- Recommended extensions (Prettier, ESLint, EditorConfig)
- `.editorconfig` -- Consistent indentation, line endings, and trimming

## Tech Stack

### Services

| Name                                    | Role                      | Key concepts to learn                                                  |
| --------------------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| [Clerk](https://clerk.com)              | Authentication            | `clerkMiddleware`, server/client auth, protected routes, localizations |
| [Turso](https://turso.tech)             | Database                  | libSQL client, raw SQL queries, singleton connection pattern           |
| [Cloudinary](https://cloudinary.com)    | Image hosting             | Upload presets, image transformations, `next-cloudinary` component     |
| [OpenRouter](https://openrouter.ai)     | AI generation             | Vercel AI SDK provider, text-to-image, image-to-image                  |
| [Pollinations](https://pollinations.ai) | AI generation (free tier) | REST API image generation                                              |
| [Umami](https://umami.is)               | Analytics                 | Proxy rewrite pattern in `next.config.ts`                              |
| [Vercel](https://vercel.com)            | Deployment                | Next.js hosting, environment variables                                 |

### Framework and Language

| Name                                       | Role            | Key concepts to learn                                                                                                      |
| ------------------------------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [Next.js](https://nextjs.org) 16           | React framework | App Router, Server Components, Server Actions, Middleware, Parallel & Intercepting Routes, `next/font`, Image Optimization |
| [React](https://react.dev) 19              | UI library      | Hooks, Suspense, Transitions, Server Components                                                                            |
| [TypeScript](https://typescriptlang.org) 5 | Type safety     | Strict mode, `noUncheckedIndexedAccess`, path aliases (`@/*`)                                                              |

### Styling and UI

| Name                                                      | Role                | Key concepts to learn                                             |
| --------------------------------------------------------- | ------------------- | ----------------------------------------------------------------- |
| [Tailwind CSS](https://tailwindcss.com) 4                 | Utility-first CSS   | PostCSS plugin, `tailwind-merge`, `clsx`                          |
| [shadcn/ui](https://ui.shadcn.com)                        | Component library   | Radix UI primitives, `class-variance-authority`, "new-york" style |
| [Phosphor Icons](https://phosphoricons.com)               | Icon set            | Tree-shakeable React icon components                              |
| [Motion](https://motion.dev)                              | Animations          | Layout animations, variants, transitions                          |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode           | Theme provider, system preference detection                       |
| [Sonner](https://sonner.emilkowal.ski)                    | Toast notifications | `toast()` API                                                     |

### Data and State

| [Vercel AI SDK](https://sdk.vercel.ai) | AI integration | `@openrouter/ai-sdk-provider`, `generateImage` |

### Utilities

| Name                                                                   | Role             | Key concepts to learn                |
| ---------------------------------------------------------------------- | ---------------- | ------------------------------------ |
| [canvas-confetti](https://github.com/catdad/canvas-confetti)           | Confetti effects | Trigger on image creation            |
| [heic2any](https://github.com/nicolo-ribaudo/heic2any)                 | Image conversion | HEIC/HEIF to JPEG/PNG in the browser |
| [relative-time](https://github.com/yairEO/relative-time)               | Date formatting  | Human-readable relative dates        |
| [sanitize-filename](https://github.com/parshap/node-sanitize-filename) | File safety      | Sanitize user input for downloads    |

### Dev Tooling

| Name                                                  | Role       | Key concepts to learn                                       |
| ----------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| [ESLint](https://eslint.org) 9                        | Linting    | Flat config, `eslint-config-next`, `eslint-config-prettier` |
| [Prettier](https://prettier.io) 3                     | Formatting | Tailwind CSS plugin, `.prettierrc`                          |
| [Husky](https://typicode.github.io/husky/)            | Git hooks  | Pre-commit formatting and lint-staged                       |
| [GitHub Actions](https://github.com/features/actions) | CI         | Format check, lint, and typecheck jobs                      |
