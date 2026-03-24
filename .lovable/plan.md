

# Codebase Cleanup & Simplification

## What's being removed

**Dead component files** (not imported anywhere):
- `src/components/Character.tsx` — old overworld blob character, no longer used
- `src/components/FloatingParticles.tsx` — old overworld particles, no longer used
- `src/components/GameStation.tsx` — old overworld game stations, no longer used
- `src/components/NavLink.tsx` — custom nav link wrapper, never used
- `src/components/games/BattleGame.tsx` — replaced by `BattleGameEnhanced.tsx`
- `src/components/games/Match3Game.tsx` — replaced by `Match3GameEnhanced.tsx`
- `src/App.css` — default Vite boilerplate CSS, not used by the app

**Unused UI components** — the `src/components/ui/` folder has ~47 shadcn components but only a handful are actually used. Components to **keep**: `button`, `toast`, `toaster`, `sonner`, `tooltip`, `use-toast`. The rest (~40+ files like accordion, calendar, carousel, dialog, drawer, etc.) will be deleted.

**Unused hooks file**: `src/components/ui/use-toast.ts` is a re-export shim — can be removed if imports point directly to `src/hooks/use-toast.ts`.

## What's being renamed/simplified

- `BattleGameEnhanced.tsx` → `BattleGame.tsx` (it's the only battle game now)
- `Match3GameEnhanced.tsx` → `Match3Game.tsx` (same reason)
- Update imports in `Overworld.tsx` accordingly

## What's being commented

Add short plain-English comments to these files:
- `App.tsx` — what each provider/wrapper does
- `Overworld.tsx` — the game list, header, grid, footer sections
- `DifficultySelector.tsx` — what props control, what each button does
- Each game file — top-level comment explaining the game, and section comments for state, game logic, rendering

## What's NOT changing

- All game logic, visuals, and functionality stays identical
- `index.css` stays as-is (has the Y2K styles)
- `DifficultySelector.tsx` stays as its own file (shared by multiple games)
- `Overworld.tsx` stays as-is (it's the hub)

## Unused import cleanup

- Remove `Button` import from `DifficultySelector.tsx` (uses custom styled buttons, not the shadcn Button)
- Remove any other unused imports found in game files

## Final file structure

```text
src/
  App.tsx              — app shell with providers and routing
  main.tsx             — React entry point
  index.css            — all styles including Y2K theme
  vite-env.d.ts        — Vite type declarations
  lib/utils.ts         — cn() utility
  hooks/
    use-mobile.tsx     — mobile breakpoint hook
    use-toast.ts       — toast state management
  pages/
    Index.tsx          — renders Overworld
    NotFound.tsx       — 404 page
  components/
    Overworld.tsx      — game hub / selection screen
    DifficultySelector.tsx — shared difficulty picker
    ui/
      button.tsx       — shadcn button (used by toast)
      toast.tsx        — toast primitives
      toaster.tsx      — toast renderer
      sonner.tsx       — sonner toast
      tooltip.tsx      — tooltip (used by App)
    games/
      SnakeGame.tsx
      Match3Game.tsx   — (renamed from Enhanced)
      WordleGame.tsx
      MemoryGame.tsx
      GemMatchGame.tsx
      BattleGame.tsx   — (renamed from Enhanced)
```

~45 files removed, 2 renamed, comments added to all remaining custom files.

