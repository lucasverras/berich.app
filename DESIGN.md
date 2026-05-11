# BE.RICH APP - Design System

## Theme
**Dark Mode** - Used in dimly lit offices and home work environments. Professional, reduces eye strain.

## Color System (OKLCH)

### Primary Colors
- **Brand Green**: `#3dba6a` (Accent, active states)
- **Brand Green (Button)**: `#4caf50` (Interactive elements)
- **Light Green**: `#86efac` (Active highlights, gradients)
- **Very Light Green**: `#dcfce7` (Soft backgrounds)

### Semantic Colors
- **Positive**: `#4caf50` (Income, gains)
- **Negative**: `#ef5350` (Expenses, alerts)
- **Neutral Backgrounds**: Darkened tints with minimal chroma
- **Glass Effect**: `rgba(61, 186, 106, 0.08)` to `rgba(61, 186, 106, 0.02)`

### Gradient Strategy
- **Cards**: `linear-gradient(135deg, rgba(61, 186, 106, 0.08) 0%, rgba(61, 186, 106, 0.02) 100%)`
- **Borders**: Subtle 1px gradients for depth
- **NO gradient text** - Solid colors for legibility

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Scale
- **H1**: 32px, weight 700, letter-spacing -0.5px
- **H3**: 13px, weight 600, uppercase, letter-spacing 0.5px
- **Body**: 14px, weight 400
- **Small**: 12px, weight 500
- **Caption**: 11px, weight 600, uppercase

### Hierarchy Ratio
Minimum 1.25 between scale steps. Weight contrast used for emphasis.

## Layout & Spacing

### Grid
- Dashboard container: 240px sidebar + responsive main
- Cards grid: `repeat(auto-fit, minmax(160px, 1fr))` with 16px gap
- Responsive breakpoint: 768px (remove sidebar, stack vertically)

### Spacing Scale
- Gap: 8px, 12px, 16px, 20px, 24px, 32px
- Padding: Cards 12-24px, sections 32px
- Rhythm: Vary spacing to avoid monotony

## Elevation & Depth

### Borders
- **Base**: 1px solid `rgba(61, 186, 106, 0.2)` or `var(--glass-border)`
- **Hover**: `rgba(61, 186, 106, 0.35)` increased opacity
- **Radius**: 8px (buttons), 12-16px (cards)

### Shadows
- **Card hover**: `0 8px 24px rgba(61, 186, 106, 0.1)`
- **Glass shadow**: `0 4px 12px rgba(61, 186, 106, 0.08)`
- **Subtle**: `rgba(0, 0, 0, 0.2)` for depth

### Glass Effect
```css
backdrop-filter: blur(10px);
border: 1px solid rgba(61, 186, 106, 0.2);
background: linear-gradient(135deg, rgba(61, 186, 106, 0.08) 0%, rgba(61, 186, 106, 0.02) 100%);
```

## Motion & Animation

### Easing
- **Smooth**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (NOT bounce)
- **Duration**: 0.2s (quick feedback), 0.3s (standard), 2s (infinite loops)
- **Transform-based**: Use `transform: scaleX()` + `transform-origin: left` instead of `width` changes

### Anti-patterns (REMOVED)
- ✗ Bounce easing `cubic-bezier(0.34, 1.56, 0.64, 1)`
- ✗ Gradient text (use solid colors)
- ✗ Width animations (use transform for GPU acceleration)
- ✗ Border-left indicators (use font-weight instead)

## Components

### Cards
- Container: 16px radius, glassmorphism with border
- Padding: 24px (main cards), 12-16px (grid items)
- Border top: 1px gradient line (`linear-gradient(90deg, transparent, rgba(61, 186, 106, 0.3), transparent)`)
- Hover: Slightly brighter background, enhanced shadow

### Forms
- Select, input: `background-color: rgba(0, 0, 0, 0.3)` with border
- Focus states: Border color change to primary
- Labels: Small, uppercase, secondary text color

### Buttons
- **Primary**: Green background with padding 8px 12px
- **Rounded**: 20px border-radius for pill buttons
- **Active state**: Font-weight 600, adjusted background
- **FAB**: Floating action button with + icon, positioned fixed bottom-right

### Tables
- Row hover: `background-color: rgba(61, 186, 106, 0.05)`
- Striped rows by type: Positive (green tint), Negative (red tint)
- Badge styling: Green for confirmed, yellow/orange for needs review

### Progress Bars
- Container: 6px height, rounded, background `rgba(61, 186, 106, 0.1)`
- Fill: Use `transform: scaleX()` NOT width
- Transform-origin: left (expands from left to right)
- Color: Matches category or status (green positive, red negative)

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
  - Remove sidebar (display: none)
  - Stack containers vertically
  - Adjust grid columns to 1fr
  - Full-width selects and forms

- **Desktop**: ≥ 768px
  - 240px fixed sidebar on left
  - Dashboard margin-left: 240px
  - Multi-column grids

## Accessibility

- **Contrast**: Text on glass background ≥ 4.5:1 WCAG AA
- **Focus states**: Clear border or ring on interactive elements
- **Icons**: Always paired with text labels
- **Color**: Never rely on color alone (add badges, text, icons)

## Brand Voice in UI

- Confirmation messages: Positive, encouraging
- Errors: Clear, actionable ("Categoria indefinida" → "revisar" badge)
- Empty states: Helpful, not empty
- Microcopy: Portuguese, professional tone

---

*Last updated: May 2026*
*Implements: Glassmorphism + Dark Mode strategy*
