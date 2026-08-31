---
name: Government Scheme Portal
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#694100'
  on-tertiary: '#ffffff'
  tertiary-container: '#895600'
  on-tertiary-container: '#ffd6a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  status-badge:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style

This design system is built to establish trust, transparency, and accessibility for a government scheme platform. The aesthetic is **Corporate Modern** with a refined **Glassmorphic** layer, balancing institutional authority with contemporary digital expectations. 

The personality is reliable and professional, utilizing high-quality typography and a structured layout to guide users through complex information without friction. Visual interest is achieved through subtle depth, soft translucency in modals, and purposeful motion that provides immediate feedback to citizen interactions.

## Colors

The color palette is anchored in an authoritative deep blue. The primary brand identity is expressed through a sophisticated gradient that evokes stability and security.

- **Primary & Secondary:** Use the blue gradient for high-priority actions, navigation headers, and primary branding. Use Slate for secondary actions and text to maintain a professional, low-fatigue reading experience.
- **Semantic Colors:** Success (Green), Error (Red), and Warning (Gold) are reserved strictly for status communication—such as application tracking or form validation.
- **Background Tones:** The system defaults to a clean light gray (#F8FAFC) to reduce glare, with a high-contrast dark mode (#0F172A) that preserves legibility and accessible contrast ratios.

## Typography

The system utilizes a dual-font strategy. **Poppins** is used for all headlines to provide a modern, bold geometric character that feels inviting yet sturdy. **Inter** is the workhorse for body text and data-heavy interfaces, chosen for its exceptional legibility and neutral tone.

Maintain a clear hierarchy by using bold weights for section headers and regular weights for long-form instructional content. For application status labels, use the `label-bold` or `status-badge` styles to ensure critical information is distinguishable from standard body copy.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Vertical Rhythm:** Use an 8px-based spacing system (8, 16, 24, 32, 48, 64) to maintain consistent white space.
- **Margins & Gutters:** Desktop layouts should maintain 48px outer margins with 24px gutters to allow the content "breathability" essential for trust. Mobile layouts should compress to 16px margins.
- **Alignment:** All forms and data tables should be left-aligned to accommodate Western reading patterns, while dashboard cards should be grouped in flexible containers that reflow based on screen width.

## Elevation & Depth

This design system uses depth to signify interactivity and priority. 

- **Glassmorphism:** Use for Hero sections and Modals. The background should be `rgba(255, 255, 255, 0.7)` with a `backdrop-blur: 20px`. In dark mode, shift the background to `rgba(15, 23, 42, 0.7)`.
- **Shadows:** Use soft, multi-layered ambient shadows for cards. Hovering over a card should trigger a transition to a more pronounced shadow with a subtle blue-tinted glow (`0 10px 25px -5px rgba(26, 86, 219, 0.15)`).
- **Transitions:** Interactions should be fluid. Interactive elements (buttons, cards) must use a `150ms ease-out` scale transition (1.02x to 1.05x) to provide tactile feedback without feeling sluggish.

## Shapes

The visual language uses "Rounded" corners to soften the institutional feel of a government portal, making it more approachable.

- **Standard Components:** Buttons and input fields use a `0.5rem` (8px) radius.
- **Container Elements:** Dashboard cards, modals, and scheme preview cards use `rounded-lg` (16px) or `rounded-xl` (24px) for a modern, mobile-app-inspired aesthetic.
- **Buttons:** Avoid sharp corners entirely; use the primary roundedness or full pill-shapes for floating action buttons.

## Components

### Buttons & Controls
- **Primary:** Gradient fill (#1A56DB to #1E3A5F) with white text. Apply a 1.05x scale on hover.
- **Secondary:** Slate #475569 outline or ghost style for less critical actions.
- **Inputs:** High-contrast borders in light mode; subtle inner glow in dark mode. Focused states should use the primary blue as a 2px ring.

### Cards & Tables
- **Dashboard Cards:** White background (or #1E293B in dark mode) with 16px radius and soft shadows. Use the glassmorphic effect for top-level summary cards.
- **Tables:** Minimalist design with no vertical borders. Use #F8FAFC for alternate row striping and bold Inter for header labels.

### Feedback & Status
- **Status Badges:** 
  - *Approved:* Green background, dark green text, pill-shaped.
  - *Pending:* Gold background, dark gold text, pill-shaped.
  - *Rejected:* Red background, dark red text, pill-shaped.
- **Modals:** Must feature the 20px backdrop blur to isolate the user's focus on the task at hand.

### Additional Elements
- **Progress Indicators:** Linear bars for multi-step scheme applications using the primary blue.
- **Search Bar:** Prominent, centered search with a soft shadow to encourage users to find schemes quickly.