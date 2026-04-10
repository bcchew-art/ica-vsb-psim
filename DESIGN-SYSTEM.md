# DESIGN SYSTEM — MANDATORY RULES FOR ALL AGENTS

> **READ THIS BEFORE BUILDING ANY PAGE OR COMPONENT.**
>
> This file is the source of truth for the ICA VSB PSIM Controller demo. Every agent building pages must follow these rules. Deviations cause inconsistency across pages — which is the exact problem this design system exists to prevent.

---

## Hard Rules

1. **DO NOT** create custom components. Use `components/ui/` (shadcn) and `components/psim/` only. If you need a new building block, stop and ask — don't freelance.
2. **DO NOT** use raw color values like `#2F5FD0` or `bg-blue-500`. Use design tokens: `bg-ica-navy`, `text-status-secured`, `bg-surface-elevated`, etc.
3. **DO NOT** use arbitrary spacing like `p-[13px]`. Use tokens: `p-space-1` through `p-space-8`.
4. **DO NOT** use arbitrary font sizes. Use tokens: `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-body-sm`, `text-label`.
5. **DO NOT** create new animations. Use: `animate-pulse-amber`, `animate-red-glow`, `animate-blink-fault`.
6. **DO NOT** introduce new libraries without asking. The stack is locked: Next.js 16, Tailwind v4, shadcn/ui, Zustand, Framer Motion, lucide-react, sonner.
7. **DO NOT** modify `globals.css`, `layout.tsx`, or `tailwind.config.*` without explicit instruction.

---

## Tech Stack (Locked)

| What | Version | Notes |
|------|---------|-------|
| Next.js | 16 | App Router. **Read `node_modules/next/dist/docs/` before using unfamiliar APIs** — this is NOT Next.js 14/15 |
| Tailwind CSS | v4 | CSS-based config via `@theme` in `globals.css`. No `tailwind.config.ts` |
| shadcn/ui | latest | Components in `src/components/ui/` |
| Zustand | latest | State management (see `src/stores/theme-store.ts`) |
| Framer Motion | latest | Animations for equipment state transitions |
| lucide-react | latest | Icon library |
| sonner | latest | Toast notifications |

---

## Design Tokens

### Brand Colors (from ICA eAppt system)

| Token | Hex | Tailwind Utility | Usage |
|-------|-----|------------------|-------|
| ICA Navy | `#141B4D` | `bg-ica-navy`, `text-ica-navy` | Primary headers, sidebar, nav |
| ICA Red | `#D3283E` | `bg-ica-red`, `text-ica-red` | Accent stripe, alerts, EFO/emergency |
| ICA Blue | `#2F5FD0` | `bg-ica-blue`, `text-ica-blue` | Primary buttons, links, active states |
| ICA Blue Dark | `#326295` | `bg-ica-blue-dark` | Secondary buttons, hover states |

### Semantic Status Colors (same in light & dark)

| Token | Hex | Tailwind Utility | Usage |
|-------|-----|------------------|-------|
| Secured | `#DC2626` | `bg-status-secured`, `text-status-secured` | Barrier UP / lane blocked |
| Open | `#16A34A` | `bg-status-open`, `text-status-open` | Barrier DOWN / lane open |
| Transit | `#F59E0B` | `bg-status-transit`, `text-status-transit` | In motion / transitioning |
| Fault | `#9333EA` | `bg-status-fault`, `text-status-fault` | Equipment fault |
| Offline | `#6B7280` | `bg-status-offline`, `text-status-offline` | Offline / disconnected |

### Surface Colors (theme-aware)

| Token | Light Mode | Dark Mode | Tailwind Utility |
|-------|-----------|-----------|------------------|
| Background | `#FFFFFF` | `#0F1629` | `bg-background` |
| Surface | `#F4FAFF` | `#1A2338` | `bg-surface` |
| Surface Elevated | `#FFFFFF` | `#1E293B` | `bg-surface-elevated` |
| Border | `#E2E8F0` | `#334155` | `border-border` |
| Text Primary | `#141B4D` | `#F1F5F9` | `text-text-primary` |
| Text Secondary | `#64748B` | `#94A3B8` | `text-text-secondary` |

### Typography

| Token | Size | Weight | Tailwind Utility | Usage |
|-------|------|--------|------------------|-------|
| `text-h1` | 32px / 2rem | 700 | `text-h1` | Page titles |
| `text-h2` | 24px / 1.5rem | 600 | `text-h2` | Section headers |
| `text-h3` | 16px / 1rem | 600 | `text-h3` | Card titles, panel headers |
| `text-body` | 16px / 1rem | 400 | `text-body` | Default body text |
| `text-body-sm` | 12px / 0.75rem | 400 | `text-body-sm` | Secondary info, timestamps |
| `text-label` | 12px / 0.75rem | 500 | `text-label` | Status badges, tags, form labels |

**Fonts:** `font-sans` (Inter), `font-mono` (JetBrains Mono — for equipment IDs, codes, timestamps).

### Spacing (8px grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Compact spacing |
| `space-3` | 12px | Small card padding |
| `space-4` | 16px | Default gap |
| `space-5` | 24px | Section/card padding |
| `space-6` | 32px | Major gaps |
| `space-8` | 48px | Page-level spacing |

Usage: `p-space-5`, `gap-space-4`, `mx-space-3`, `py-space-2`, etc.

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, tags |
| `rounded-md` | 8px | Buttons, inputs, cards |
| `rounded-lg` | 12px | Panels, modals |
| `rounded-full` | 9999px | Dots, avatars, pills |

### Layout Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `w-sidebar` | 260px | Expanded sidebar |
| `w-sidebar-collapsed` | 64px | Collapsed sidebar |
| `w-control-panel` | 360px | Right-side equipment control panel |
| `h-header` | 64px | Top header |

### Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Hover, button press |
| `duration-normal` | 300ms | Panel open/close, status change |
| `duration-slow` | 500ms | Page transitions, map zoom |

### Custom Animations (from globals.css)

- `animate-pulse-amber` — Gentle amber pulse for equipment in-transit
- `animate-red-glow` — Red pulsing glow for EFO-active equipment
- `animate-blink-fault` — Border blink for equipment fault

---

## Available Components

### From `components/ui/` (shadcn — pre-themed to ICA palette)

| Component | Path | Variants / Notes |
|-----------|------|------------------|
| `Button` | `@/components/ui/button` | variants: `default`, `destructive`, `secondary`, `ghost`, `outline`. sizes: `sm`, `default`, `lg`, `icon` |
| `Badge` | `@/components/ui/badge` | For labels and counts (use `StatusBadge` from psim/ for equipment status) |
| `Card` | `@/components/ui/card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `Dialog` | `@/components/ui/dialog` | For confirmation modals (EFO, bulk actions) |
| `Alert` | `@/components/ui/alert` | For inline alerts (use `AlertBanner` from psim/ for stacking alerts) |
| `Tooltip` | `@/components/ui/tooltip` | Hover info on icons. **Requires `<TooltipProvider>` in layout** |
| `Table` | `@/components/ui/table` | For reports and equipment lists |
| `Sonner` | `@/components/ui/sonner` | Toast notifications — bottom-right, 4s auto-dismiss |

### From `components/psim/` (custom — ICA-specific)

| Component | Path | Props |
|-----------|------|-------|
| `StatusBadge` | `@/components/psim/status-badge` | `status: EquipmentStatus` |
| `EquipmentCard` | `@/components/psim/equipment-card` | `equipment: Equipment`, `onRaise`, `onLower`, `onEfo` |
| `AlertBanner` | `@/components/psim/alert-banner` | `alert: Alert`, `onDismiss: (id: string) => void` |
| `EquipmentIcon` | `@/components/psim/equipment-icon` | `type`, `status`, `efoActive`, `selected`, `onClick` |

### From `components/layout/`

| Component | Path | Notes |
|-----------|------|-------|
| `AppShell` | `@/components/layout/app-shell` | Wraps page content with Sidebar + Header |
| `Sidebar` | `@/components/layout/sidebar` | Collapsible navy sidebar |
| `Header` | `@/components/layout/header` | 64px header with ICA red stripe + theme toggle |
| `ThemeProvider` | `@/components/layout/theme-provider` | Already wired in root layout |

### State Stores

| Store | Path | Purpose |
|-------|------|---------|
| `useThemeStore` | `@/stores/theme-store` | `theme`, `toggleTheme`, `setTheme` |

### Types

All shared types live in `@/lib/types`. Import equipment, alert, and status types from there.

---

## Gotchas (Learned During Implementation)

### 1. `fill-status-*` / `stroke-status-*` utilities don't work in Tailwind v4

Tailwind v4's `fill-*` and `stroke-*` utilities target named colors (like `fill-red-600`), not custom CSS variables. For SVG fill/stroke with status colors, use inline attributes:

```tsx
// ❌ DOES NOT WORK
<svg className="fill-status-secured" />

// ✅ WORKS
<svg style={{ fill: "var(--color-status-secured)" }} />

// ✅ ALSO WORKS
<rect fill="var(--color-status-secured)" />
```

### 2. React Server Components — event handlers need `"use client"`

`app/page.tsx` and all `app/*/page.tsx` files are Server Components by default. You **cannot** pass function props like `onClick`, `onDismiss`, `onChange` from a Server Component to a Client Component. Either:

- Mark the page itself as `"use client"` at the top, OR
- Extract the interactive section into a separate client component (preferred for pages that also have server-rendered content)

```tsx
// ❌ BROKEN — page.tsx is a server component
export default function Page() {
  return <AlertBanner alert={sampleAlert} onDismiss={(id) => console.log(id)} />;
}

// ✅ FIXED — extract into client component
// file: components/psim/my-section.tsx
"use client";
export function MySection() {
  return <AlertBanner alert={sampleAlert} onDismiss={(id) => console.log(id)} />;
}
// file: app/page.tsx (server component)
import { MySection } from "@/components/psim/my-section";
export default function Page() { return <MySection />; }
```

### 3. Next.js 16 has breaking changes from training data

**Before writing Next.js code**, consult `node_modules/next/dist/docs/01-app/` for:
- Layouts and pages: `01-getting-started/03-layouts-and-pages.md`
- Fonts: `01-getting-started/13-fonts.md`
- Metadata: `01-getting-started/14-metadata-and-og-images.md`
- API reference: `03-api-reference/`

Common API differences: `params` is now a `Promise` in dynamic layouts/pages.

### 4. Tailwind v4 — no `tailwind.config.ts`

Do not create or expect a `tailwind.config.ts`. All config is in `src/app/globals.css` via `@theme inline { ... }`. If you need a new design token, it goes there — not in a JS config file.

### 5. shadcn component installation

To add more shadcn components:
```bash
npx shadcn@latest add <component-name> --overwrite
```
Do NOT hand-write shadcn components. Always use the CLI.

---

## Building New Pages — Workflow

1. **Read this file first.** Seriously.
2. **Import `AppShell`** — wrap your page content: `<AppShell>{content}</AppShell>`
3. **Use design tokens** — no raw colors, no arbitrary sizes, no custom animations
4. **Compose from existing components** — if you need something new, ask
5. **Test in both themes** — toggle light/dark to verify nothing breaks
6. **Check Next.js 16 docs** before using any unfamiliar API
7. **Handle RSC boundaries** — interactive sections need `"use client"`

---

## Quick Reference: Common Patterns

**Page template:**
```tsx
import { AppShell } from "@/components/layout/app-shell";

export default function MyPage() {
  return (
    <AppShell>
      <div className="space-y-space-5">
        <h1 className="text-h1 text-text-primary">Page Title</h1>
        <p className="text-body text-text-secondary">Subtitle or description</p>
        {/* content */}
      </div>
    </AppShell>
  );
}
```

**Card grid:**
```tsx
<div className="grid grid-cols-3 gap-space-4">
  <div className="bg-surface-elevated rounded-md border border-border p-space-5 shadow-sm">
    {/* card content */}
  </div>
</div>
```

**Status indicator with label:**
```tsx
<StatusBadge status="secured" />
```

**Equipment control panel:**
```tsx
<EquipmentCard
  equipment={equipment}
  onRaise={() => console.log("raise")}
  onLower={() => console.log("lower")}
  onEfo={() => console.log("efo")}
/>
```

---

**Last updated:** 2026-04-10
**Source of truth:** `docs/superpowers/specs/2026-04-10-design-system.md`
