---
name: Royal Thai Elegance
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#43474f'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#00212c'
  on-tertiary: '#ffffff'
  tertiary-container: '#003848'
  on-tertiary-container: '#5da4c0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#baeaff'
  tertiary-fixed-dim: '#89d0ed'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d62'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-desktop: 80px
  margin-mobile: 24px
  gutter: 32px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system for this premium tourism platform is built on a foundation of **Modern Luxury** and **Sophisticated Serenity**. It targets high-net-worth travelers seeking curated, exclusive experiences in Thailand. The aesthetic balances the heritage of Thai hospitality with a clean, contemporary digital interface.

The style leverages **Minimalism** punctuated by **Tactile accents**. It uses heavy white space to evoke a sense of calm and "room to breathe," mirroring the experience of a luxury resort. High-quality, full-bleed photography is the primary storyteller, while UI elements remain secondary and supportive. The emotional response is one of trust, exclusivity, and effortless travel.

## Colors
The palette is rooted in tradition and prestige. 
- **Primary (Navy Blue):** Used for core branding, navigation backgrounds, and primary headings to establish authority and depth.
- **Secondary (Gold):** Reserved for high-value actions, interactive states, and decorative accents (like thin dividers or icons) to signify luxury.
- **Accent (Sky Blue):** Used sparingly for informational states, secondary highlights, or to soften the transition between navy and white.
- **Neutral/Background:** A crisp white (#FFFFFF) dominates the canvas to maintain a high-end editorial feel, supported by a very light grey (#F8F9FA) for subtle structural sectioning.

## Typography
The typographic hierarchy relies on a high-contrast pairing. **Playfair Display** provides an editorial, authoritative voice for headlines, reflecting Thailand's rich cultural history. **Montserrat** provides a clean, functional counterpoint for body copy and UI elements, ensuring legibility and a modern tech-forward feel.

Large display sizes should use tighter letter spacing to maintain visual impact. Labels and utility text utilize increased letter spacing and uppercase styling to create a distinct "labeling" effect similar to luxury fashion magazines.

## Layout & Spacing
This design system utilizes a **Fixed Grid** for desktop (1280px max-width) to ensure content remains centered and focused, surrounded by generous margins that prevent the UI from feeling cluttered.

- **Desktop:** 12-column grid with 32px gutters and 80px outer margins.
- **Tablet:** 8-column grid with 24px gutters and 40px outer margins.
- **Mobile:** 4-column grid with 16px gutters and 24px outer margins.

The spacing rhythm is intentional: use large `section-gap` units between distinct content blocks to emphasize exclusivity. Avoid cramming information; let the photography and white space do the heavy lifting.

## Elevation & Depth
To maintain a modern luxury feel, the system avoids heavy, dark shadows. Instead, it uses **Ambient Shadows** and **Tonal Layers**.

- **Surfaces:** Cards and modals use a pure white background set against the #F8F9FA neutral background.
- **Shadows:** Use extremely diffused, low-opacity shadows (e.g., `0px 12px 32px rgba(0, 51, 102, 0.05)`). The shadow color is tinted with the Primary Navy to create a more natural, integrated depth.
- **Interactions:** On hover, elevation should subtly increase by deepening the shadow slightly, rather than moving the element, to maintain a "stable" and trustworthy feel.

## Shapes
The shape language is **Soft (Level 1)**. Elements feature a refined 4px (0.25rem) corner radius. This choice avoids the overly playful nature of highly rounded shapes while removing the harshness of sharp corners. 

Buttons and input fields follow this consistent 4px radius. High-quality imagery can occasionally use 0px (Sharp) corners when presented as full-width hero sections to emphasize an architectural, structured look.

## Components
- **Buttons:** Primary buttons are Navy Blue with white text. Secondary buttons use a Gold (#D4AF37) outline with Gold text for an elegant, lighter touch. The "Call to Action" buttons for bookings should utilize a subtle Gold gradient or solid Gold background with Navy text for maximum prominence.
- **Cards:** Used for destination and hotel listings. They feature a top-heavy layout with a large image, minimal padding (24px), and the ambient shadow defined in the Elevation section.
- **Input Fields:** Minimalist design with a bottom-only border in Navy Blue or a very light 1px surrounding border. Labels are always `label-md` (uppercase) positioned above the field.
- **Chips:** Used for "Luxury," "Private," or "All-inclusive" tags. They should have a Sky Blue (#87CEEB) tint background with Navy Blue text, using the same 4px roundedness.
- **Lists:** Reservation summaries and amenity lists use generous vertical padding (16px) with thin, 1px Gold horizontal dividers between items.
- **Photography:** All imagery must have a consistent color grade—warm tones, high clarity, and professional composition.