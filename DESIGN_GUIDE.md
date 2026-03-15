# Universal Modern SaaS Design System
**Theme Name:** "Soft Surface & Magic Pop"
**Description:** A high-contrast, modern design system characterized by "surface" layering (gray containers holding white cards), heavy rounded corners, soft generous shadows, and a vibrant primary accent color (Orange) used for "magical" interactions.

## 1. Core Design Tokens

### 1.1 Color Palette (Tailwind Variables)

**Primary Colors**
- **Primary Accent (`brand-orange`):** `#FF4D00`
  - *Usage:* Primary CTAs, active states, progress bars, "magic" effects, icon backgrounds.
- **Primary Dark (`brand-black`):** `#111111`
  - *Usage:* Dark mode backgrounds, primary headings, dark cards, footer, primary buttons.
- **Secondary Dark (`brand-dark`):** `#1A1A1A`
  - *Usage:* Subtle variation for dark mode elements.

**Surface & Background Colors**
- **Page Background (`brand-bg`):** `#F2F2F0` (Off-white/Light Gray)
  - *Usage:* The main `<body>` background color.
- **Surface Container (`brand-surface`):** `#E6E6E6`
  - *Usage:* The background color for "Surface" containers that hold white cards.
- **Inner Surface (`brand-gray`):** `#EBEBE9`
  - *Usage:* Secondary backgrounds within cards.

### 1.2 Typography

**Font Stack**
- **Primary (Headings & Body):** `Manrope` (Sans-serif).
  - *Characteristics:* Modern, geometric but friendly.
- **Secondary (Accents):** `Patrick Hand` (Cursive/Handwritten).
  - *Usage:* Annotations, arrows, "human" touches.

**Scale & Weights**
- **Display Headings:** `text-[3.5rem] md:text-[5rem]`, `leading-[0.95]`, `tracking-tighter`, `font-[850]`.
- **Section Headings:** `text-5xl lg:text-7xl`, `leading-[0.95]`, `font-extrabold`, `tracking-tight`.
- **Card Titles:** `text-2xl`, `font-[850]`, `tracking-tight`.
- **Body Text:** `text-lg` or `text-xl`, `font-medium`, `leading-relaxed`, `text-gray-600`.
- **Labels/Badges:** `uppercase`, `tracking-wider`, `text-xs`, `font-bold`.

### 1.3 Shapes & Depth

**Border Radius (The "Super-Round" Aesthetic)**
- **Outer "Surface" Container:** `rounded-[1.8rem]` or `rounded-[2.5rem]`.
- **Inner Content Card:** `rounded-[1.5rem]` or `rounded-[2rem]`.
- **Interactive Elements (Buttons/Inputs):** `rounded-full`.

**Shadows**
- **Soft Ambient:** `0 20px 40px -15px rgba(0, 0, 0, 0.1)`.
- **Crisp Card:** `0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)`.
- **Glow (Accent):** `shadow-[0_0_15px_#FF4D00]` (Use sparingly on active elements).
- **Button Depth:** `shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)]`.

---

## 2. Component Library Specifications

### 2.1 Buttons (Pill Shape)

| Type | Background | Text Color | Icon Style | Interaction |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `brand-orange` (#FF4D00) | White | Right-aligned, inside Black circle | Icon rotates 45° (no lift) |
| **Secondary** | White | `brand-black` | Right-aligned, inside Gray circle | Icon slides right 2px |
| **Dark** | `brand-black` (#111111) | White | Right-aligned, inside Orange circle | Icon slides right 2px |

*Note: All buttons must be `rounded-full` and use bold, tight-tracking text. No layout shifts on hover.*

### 2.2 Badges & Labels

1.  **Section Label:**
    - *Style:* `bg-brand-black` text-white `rounded-full` `uppercase` `text-xs` `font-bold`.
    - *Content Pattern:* `// Section Name //` (Slashes colored in `brand-orange`).
2.  **Floating Tag:**
    - *Style:* `bg-black/50` backdrop-blur, border `white/10`, text-white.

### 2.3 The "Surface" Card Pattern (Crucial)

This is the defining layout pattern of the brand. Do not place white cards directly on the page background.
1.  **Step 1:** Create a **Surface Container** (`bg-brand-surface`, `rounded-[1.8rem]`, `p-3`).
2.  **Step 2:** Place **Content Cards** (`bg-white`, `rounded-[1.5rem]`) *inside* the Surface Container.
3.  **Result:** Creates a "framed" or "app-like" look with a gray border effect.

---

## 3. Universal Layout Topologies

These are the structural primitives to be used for *any* page section. Choose the topology that best fits the content density.

### 3.1 The "Split" Topology (50/50)
*Use for: Hero sections, Feature highlights, FAQ, Text + Visual pairings.*

- **Grid Structure:** `grid-cols-1 lg:grid-cols-12`.
- **Text Column (Span 5-6):**
  - **Hierarchy:** Badge -> Display Heading -> Subtitle -> Actions.
  - **Constraint:** Keep text tight and left-aligned.
- **Visual Column (Span 6-7):**
  - **Pattern:** Use the **Surface Container** pattern here.
  - **Content:** Place interactive demos, videos, or complex graphics inside the gray surface container.
  - **Mobile:** Stacks vertically (Visual usually comes second, unless it's a hero image).

### 3.2 The "Bento Grid" Topology
*Use for: Features lists, Step-by-step processes, Value props, Team members.*

- **Container:** Wrap the entire grid in a **Surface Container** (`bg-brand-surface`).
- **Grid Structure:** `grid-cols-1 lg:grid-cols-3` (or 2/4 depending on count) with `gap-3`.
- **Card Units:**
  - `bg-white` `p-8` `rounded-[1.5rem]`.
  - **Micro-Interaction:** Very subtle scale `hover:scale-[1.01]` or border color shift.
  - **Internal Layout:** Icon/Number (Top) -> Text (Middle) -> Visual/Mini-App (Bottom).

### 3.3 The "Master-Detail" Topology
*Use for: Interactive tabs, Case studies, Before/After comparisons, Pricing toggles.*

- **Layout:** Two distinct zones.
- **Zone A (Navigation/Master):**
  - List of clickable cards/buttons.
  - **Active State:** `bg-brand-black` text-white, accent icon.
  - **Inactive State:** `bg-white` text-black.
- **Zone B (Viewport/Detail):**
  - A large `bg-white` rounded area showing the content.
  - Must use `rounded-[1.5rem]` or larger.
  - Often includes floating badges or controls overlaying the content.

### 3.4 The "Contained" Topology
*Use for: Footers, Call-to-Action (CTA) blocks, Newsletters.*

- **Constraint:** Never use full-width backgrounds for these sections.
- **Pattern:**
  - **Wrapper:** `w-full px-4`.
  - **Card:** `bg-brand-black` (or `brand-orange`) `rounded-[1.8rem]` `text-white`.
  - **Padding:** Heavy internal padding (`p-12`+).
  - **Decoration:** Use large blur orbs (`opacity-10`) in corners to add depth.

---

## 4. Animation Guidelines (Strict Polish)

**Motion Principles**
1.  **Grounded & Stable:** Elements must feel solid. **BAN** all continuous looping animations (floating, bouncing, pulsing).
2.  **Subtle Physics:**
    - **NO** massive "bump up" (`-translate-y-4`).
    - **YES** to nearly imperceptible scale (`hover:scale-[1.005]` or `hover:scale-[1.01]`).
    - **YES** to subtle border shifts (`border-gray-100` -> `border-gray-300`).
3.  **Tight Timing:**
    - Force `transition-all duration-200 ease-out` or `duration-300`.
    - **NO** linear or sluggish (>500ms) transitions for interactions.

**Micro-Interactions**
- **Cards:** Do not lift the card off the page. Instead, brighten the background slightly (`hover:bg-gray-50`) or darken the border.
- **Buttons:** Do not physically shift the button layout.
    - *Action:* Translate the *icon* inside the button (e.g., `group-hover:translate-x-1` or `group-hover:rotate-45`).
    - *Feedback:* Subtle inset shadow or background darkening.

**Entrances (On Load)**
- **Sophisticated Reveals:** Combine opacity fade with a tiny, tight vertical shift.
- *Pattern:* Start at `opacity-0 translate-y-4`, resolve to `opacity-100 translate-y-0`.
- *Timing:* Stagger children elements by 50ms-100ms.

---

## 5. Implementation Config (Tailwind v4)

Copy this into your `app/globals.css` or `tailwind.config.js`:

```css
@theme inline {
  /* Colors */
  --color-brand-bg: #F2F2F0;
  --color-brand-surface: #E6E6E6;
  --color-brand-orange: #FF4D00;
  --color-brand-black: #111111;
  --color-brand-dark: #1A1A1A;
  --color-brand-gray: #EBEBE9;

  /* Typography */
  --font-sans: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  
  /* Radii */
  --radius: 0.625rem;
  
  /* Animations (REMOVED: loops like cursor-drop/shimmer to align with strict polish) */
  /* Only utility classes for transitions are needed now */
}

/* Base Utilities */
@layer base {
  body {
    background-color: var(--color-brand-bg);
    color: var(--color-brand-black);
  }
}

/* Strict Transition Utilities */
@layer utilities {
  .animate-enter {
    animation: enter 0.4s ease-out forwards;
  }
  
  @keyframes enter {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```
