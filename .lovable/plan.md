

# Final Cleanup — Strip Remaining Scaffolding

## What I found

The code itself is clean, but there's a massive layer of unused infrastructure surrounding it:

### 1. `package.json` has ~35 unused dependencies
The app only uses `react`, `react-dom`, `react-router-dom`, and `lucide-react`. Everything else is dead weight from the original shadcn scaffold:
- All `@radix-ui/*` packages (accordion, dialog, toast, tooltip, etc.)
- `@tanstack/react-query`, `@hookform/resolvers`, `react-hook-form`, `zod`
- `class-variance-authority`, `clsx`, `tailwind-merge` (the `cn()` utility stack)
- `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `recharts`
- `next-themes`, `sonner`, `vaul`, `react-day-picker`, `react-resizable-panels`

### 2. `tailwind.config.ts` is full of dead config
- All the shadcn color tokens (`border`, `input`, `ring`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `rose-mauve`, `popover`, `card`, `sidebar`) — none are used
- `darkMode: ["class"]` — no dark mode
- `container` config — never used
- All keyframes (`accordion-down/up`, `float`, `bounce-subtle`, `glow-pulse`, `shimmer`, `blob`) — none of these class names appear in any component
- `borderRadius` lg/md/sm with `--radius` var — never used
- `tailwindcss-animate` plugin — the actual animations used are defined in `index.css`, not via this plugin

The config should only define `background`/`foreground` colors (used by body via CSS vars) and the `sans` font family.

### 3. `index.css` — CSS vars can be replaced with direct values
The `--background` and `--foreground` vars only exist to serve the Tailwind `bg-background text-foreground` classes on `body`. Replace with direct CSS: `background: #fff; color: hsl(260, 40%, 13%)`. Then remove the vars entirely.

### 4. `NotFound.tsx` — inline the `useEffect` console.error
The `useEffect` logging a 404 to console is unnecessary noise — users won't see it, and it doesn't serve a purpose. Remove it, simplifying the component to pure JSX with no hooks.

### 5. `pages/` folder — unnecessary nesting
`NotFound.tsx` is the only file in `pages/`. Move it to `src/components/NotFound.tsx` and delete the folder, making the structure truly flat.

## Changes

### 1. Gut `package.json` dependencies
Remove all unused packages. Keep only: `react`, `react-dom`, `react-router-dom`, `lucide-react`.

### 2. Simplify `tailwind.config.ts`
Strip down to just the font family override. Remove all shadcn color tokens, dead keyframes, dark mode, container, border radius, and the `tailwindcss-animate` plugin.

### 3. Replace CSS vars with direct styles in `index.css`
Remove the `:root` block. Set body background and color directly. The rest of the file (Y2K classes, battle animations) stays.

### 4. Simplify `NotFound.tsx`
Remove `useEffect` and `useLocation` — just render the 404 UI. Move from `src/pages/` to `src/components/`.

### 5. Update `App.tsx` import path
Point to new `NotFound` location.

### 6. Remove `components.json`
This is shadcn CLI config — no longer relevant since all shadcn components are deleted.

## Final structure (unchanged from before, just flatter)
```text
src/
  App.tsx
  main.tsx
  index.css
  vite-env.d.ts
  components/
    Overworld.tsx
    NotFound.tsx
    DifficultySelector.tsx
    GameHeader.tsx
    GameOverModal.tsx
    games/
      SnakeGame.tsx
      Match3Game.tsx
      WordleGame.tsx
      MemoryGame.tsx
      GemMatchGame.tsx
      BattleGame.tsx
```

