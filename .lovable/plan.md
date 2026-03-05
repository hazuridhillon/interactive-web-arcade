

# Retro 2002 Arcade Hub Redesign

## Overview
Complete visual overhaul of the Overworld hub from dreamy Glossier aesthetic to loud, flat, pixelated early-2000s web style (Miniclip/Newgrounds/Neopets era). The game logic and routing stays identical -- only the hub visuals change.

## Changes

### 1. Add "Press Start 2P" font (`index.html`)
Add Google Fonts link for the pixelated retro font.

### 2. Redesign Overworld (`Overworld.tsx`)
Replace the current dreamy floating-card overworld with a full-page retro arcade hub:

- **Background:** CSS tiled repeating star pattern on deep navy (`#0a0a2e`), no gradients
- **Layout:** Drop the 800x600 character-walking container. Replace with a static page layout:
  - Giant "GAME ZONE" heading with neon cyan text-shadow glow, `Press Start 2P` font
  - Scrolling marquee-style subtitle ("Welcome to the ultimate arcade!")
  - 3x2 CSS grid of chunky beveled game buttons
  - Thin `2px solid #00ffff` border around the game grid area
- **Game buttons:** Each is a chunky raised XP-style button with:
  - Hard solid colors: lime `#00ff00`, hot pink `#ff00ff`, electric blue `#00bfff`, orange `#ff6600`, red `#ff0000`, yellow `#ffff00`
  - Beveled 3D border effect (`border-style: outset` + `border-width: 4px`)
  - Hard drop shadow (`4px 4px 0px #000`)
  - `Press Start 2P` font for game names
  - Click to launch game (replaces space-bar proximity system for the hub)
  - Custom crosshair/pointer cursor on hover
- **Decorations:**
  - Blinking "NEW!" badge (red bg, white text, CSS blink animation) on one game
  - Animated pixel stars scattered around (simple CSS `@keyframes` scale/opacity toggle)
  - "⚡" lightning bolt icons with blink animation
  - Visitor counter spoof: "You are visitor #00048271"
- **Pixel Mascot:** Simple CSS pixel-art character (div-based grid of colored squares), 2-frame bounce animation displayed near the title
- **Footer:** "© 2003 GAME ZONE | Best viewed in 800x600 | Internet Explorer 6"

### 3. Remove/bypass movement system
The overworld no longer uses WASD/arrow movement or proximity detection. Games launch on button click. The `Character`, `GameStation`, and `FloatingParticles` components are no longer rendered in the hub (but kept for potential in-game use).

### 4. Update CSS (`index.css`)
Add retro-specific styles:
- `.retro-btn` class with outset borders, hard shadows, no border-radius
- `.neon-glow` text-shadow effect (layered cyan/white shadows)
- `.blink-badge` animation (visibility toggle)
- `.pixel-bounce` 2-frame step animation
- Tiled star background pattern using CSS `radial-gradient` repeating
- Custom cursor styles for hover states

### 5. Files modified
- `index.html` — add Press Start 2P font
- `src/components/Overworld.tsx` — complete rewrite of the hub UI
- `src/index.css` — add retro utility classes and animations

No changes to any game components — they keep their existing aesthetics.

