

# Further Code Simplification

## Overview
Clean up repeated inline styles, remove dead CSS, and extract shared patterns — without changing any visuals or logic.

## Changes

### 1. Clean up `index.css` — remove dead CSS variables and unused utilities
The `:root` block still has the old Glossier design system (cream backgrounds, peach gradients, sage green, rose mauve, sidebar vars, dark mode). None of these are used — the app uses hardcoded Y2K colors everywhere. Remove:
- All CSS custom properties except `--radius`, `--border`, `--background`, `--foreground` (needed by shadcn toast/button)
- The entire `.dark` block
- Unused utility classes: `.glass-effect`, `.glow-soft`, `.glow-strong`, `.gradient-dreamy`, `.gradient-peach`, `.gradient-sage`
- Unused animations: `float-slow`, `float-slower`, `twinkle`, `breathing`, `blink` (none of these class names appear in the current codebase)

Keep: `y2k-*` classes, `shake`, `attack-*`, `damage-float` animations, base `@tailwind` directives, body font.

### 2. Extract shared Y2K button style into a helper in each game
Many games repeat the exact same inline style pattern for "Play Again" and "Back" buttons (rounded-[14px], Bungee font, colored bg, 4px shadow, hover lift). Create a small `y2k-btn` CSS class in `index.css` to replace the repeated inline styles. Games just add `className="y2k-btn"` plus a `style={{ backgroundColor, boxShadow }}` for color.

### 3. Extract shared game-over overlay pattern
Every game has a nearly identical game-over modal: fixed overlay → centered white card → title → message → two buttons. Create a small `GameOverModal` component (~30 lines) in a new file `src/components/GameOverModal.tsx` that accepts `title`, `message`, `onPlayAgain`, `onClose`, `color`, and optional `icon`. This replaces ~20 lines of duplicated JSX in each of the 6 games.

### 4. Extract shared game header pattern
Every game has a header with a title, optional stats badges, and a close (X) button. Create a `GameHeader` component (~20 lines) in `src/components/GameHeader.tsx` that accepts `title`, `badges` (array of {label, color}), and `onClose`. Replaces ~10 lines per game.

### 5. Simplify BattleGame damage calculation
The player action handler and opponent turn handler have heavily duplicated damage logic (calculate damage → check defending → set message → show number → update HP → add log). Extract a `dealDamage` helper function within the component to reduce ~80 lines of repetition to ~30.

### 6. Remove unused imports
- `Home` from Match3Game (only used in button text, can use inline text)
- `React` default import from BattleGame (only needed for `React.createElement` — switch to direct JSX)

### Files modified
- `src/index.css` — remove dead CSS (~80 lines removed)
- `src/components/GameOverModal.tsx` — new shared component (~30 lines)
- `src/components/GameHeader.tsx` — new shared component (~20 lines)
- `src/components/games/SnakeGame.tsx` — use GameOverModal + GameHeader
- `src/components/games/WordleGame.tsx` — use GameOverModal + GameHeader
- `src/components/games/MemoryGame.tsx` — use GameOverModal + GameHeader
- `src/components/games/GemMatchGame.tsx` — use GameOverModal + GameHeader
- `src/components/games/Match3Game.tsx` — use GameOverModal + GameHeader, remove `Home` import
- `src/components/games/BattleGame.tsx` — use GameOverModal + GameHeader, extract `dealDamage`, remove `React` import

### What's NOT changing
- All game logic, visuals, colors, fonts, animations — identical output
- Overworld, DifficultySelector, App.tsx — untouched
- File structure stays flat

