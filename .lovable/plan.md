

# Final Simplification — Remove All Dead Weight

## What I found

The codebase still has significant dead code:

1. **Toast system is never used.** No game or component calls `toast()`. The entire toast infrastructure (`toaster.tsx`, `toast.tsx`, `sonner.tsx`, `use-toast.ts`) exists but does nothing.
2. **Sonner imports `next-themes`** which isn't even installed — it would crash if ever called.
3. **Button component (`button.tsx`)** is imported by nobody.
4. **Tooltip component (`tooltip.tsx`)** is only imported by `App.tsx` to wrap `TooltipProvider` — but nothing inside uses tooltips.
5. **React Query** (`QueryClientProvider`) wraps the app but nothing uses `useQuery`.
6. **`use-mobile.tsx` hook** is never imported.
7. **`lib/utils.ts`** (`cn()`) is only used by the dead UI components above.
8. **`Index.tsx`** is a pointless wrapper — it just renders `<Overworld />`.
9. **`NotFound.tsx`** uses CSS variables from the old design system (`bg-muted`, `text-primary`) but these could be replaced with inline styles for consistency.
10. **CSS variables** — most `:root` vars only exist to serve the dead toast/button components. Only `--background`, `--foreground`, and `border-border` are used by the body/base styles.

## Changes

### 1. Delete dead files
- `src/components/ui/button.tsx` — never imported
- `src/components/ui/toast.tsx` — never used
- `src/components/ui/toaster.tsx` — never used
- `src/components/ui/sonner.tsx` — never used, broken import
- `src/components/ui/tooltip.tsx` — nothing uses tooltips
- `src/hooks/use-toast.ts` — never used
- `src/hooks/use-mobile.tsx` — never imported
- `src/lib/utils.ts` — `cn()` only used by deleted UI files
- `src/pages/Index.tsx` — inline `<Overworld />` directly in App

### 2. Simplify `App.tsx`
Strip out QueryClientProvider, TooltipProvider, Toaster, Sonner. The app becomes just BrowserRouter with two routes. Remove all dead imports.

### 3. Trim `index.css`
Remove all CSS variables except `--background` and `--foreground` (used by `body`). Remove `border-border` base rule (nothing uses borders via Tailwind). Keep only the Y2K utilities and battle animations.

### 4. Style `NotFound.tsx` with inline/Y2K styles
Replace `bg-muted`, `text-muted-foreground`, `text-primary` (which depend on deleted CSS vars) with direct colors matching the Y2K theme.

### 5. Delete empty directories
- `src/components/ui/` — all files removed
- `src/hooks/` — all files removed
- `src/lib/` — all files removed

## Final file structure
```text
src/
  App.tsx                — BrowserRouter + 2 routes
  main.tsx               — React entry point
  index.css              — Y2K styles only
  vite-env.d.ts
  pages/
    NotFound.tsx          — 404 page (Y2K styled)
  components/
    Overworld.tsx         — game hub
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

~10 files deleted, 3 files simplified. Zero functionality or visual changes.

