---
name: Heritage Hospitality System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#43474e'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#476083'
  primary: '#000613'
  on-primary: '#ffffff'
  primary-container: '#001f3f'
  on-primary-container: '#6f88ad'
  inverse-primary: '#afc8f0'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#040607'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1f20'
  on-tertiary-container: '#848688'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#afc8f0'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2f486a'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system is built upon the concept of "Refined Discovery." It balances the prestige of Thai heritage with the efficiency of modern e-commerce. The target audience includes discerning travelers seeking authentic, high-quality local experiences. 

The aesthetic style is **Corporate / Modern** with **Minimalist** sensibilities, punctuated by editorial flourishes. It utilizes a vast amount of white space to convey premium positioning, while employing subtle elevation and high-quality serif typography to evoke a sense of trust and institutional reliability. The emotional response should be one of "calm confidence"—the user feels they are in expert hands.

## Colors

The palette is anchored by **Deep Navy**, representing stability and professionalism, primarily used for global navigation, footers, and primary text. 

**Warm Gold** serves as the primary call-to-action (CTA) and highlight color, symbolizing the "Land of Smiles" and premium service. This color is reserved for high-intent actions (Book Now, Find a Guide) and subtle decorative accents.

**Neutrals** consist of clean whites for backgrounds and a scale of cool greys for borders and secondary metadata. Interactive states for the gold CTA should lean towards a slightly deeper amber to maintain legibility.

## Typography

The typography strategy employs a high-contrast pairing. **Libre Caslon Text** is used for all major headings to project an editorial, authoritative, and classic Thai hospitality feel. 

**Be Vietnam Pro** is selected for body copy and UI labels due to its contemporary Thai-centric design origins and exceptional readability in functional contexts. 

Use `display-lg` for hero sections with tight letter spacing. `label-lg` should be used for section headers (e.g., "GUIDE TYPE") with increased letter spacing to enhance the professional, organized feel of the sidebar and filters.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for desktop, centered within the viewport. The layout relies on generous vertical "breathing room" to maintain a premium feel.

- **Desktop (1200px+):** 12 columns, 24px gutters, 40px minimum side margins.
- **Tablet (768px - 1199px):** 8 columns, 16px gutters, 24px side margins.
- **Mobile (Up to 767px):** 4 columns, 16px gutters, 16px side margins.

Grid containers should use a standard 8px-based spacing scale for internal padding. Vertical sections are separated by `section-gap` to clearly demarcate content blocks like "Why Travel with a Local Guide?" from the search results.

## Elevation & Depth

Visual hierarchy is primarily established through **Tonal Layers** and **Ambient Shadows**. 

1. **Base:** Pure white (#FFFFFF) background for the primary canvas.
2. **Surface Low:** Very light grey (#F8F9FA) for filter sidebars and secondary input backgrounds.
3. **Floating:** Cards and the main Search Bar use a subtle, highly diffused shadow: `0px 4px 20px rgba(0, 0, 0, 0.05)`.
4. **Interactive:** On hover, card elevation increases slightly with a more pronounced shadow to indicate clickability. 

Avoid heavy borders; use 1px strokes in a light grey (#E0E0E0) only when necessary to define boundaries on white backgrounds, such as input fields or table rows.

## Shapes

The shape language is "Softly Structured." 

A `roundedness` level of **2** is the standard. This translates to **8px** for standard components like buttons and input fields, and **16px** (rounded-lg) for larger containers like guide cards and the "Why Travel" feature cards. 

The hero search bar uses a slightly larger radius (rounded-xl / 24px) to distinguish it as the primary functional entry point of the platform. Interactive chips (tags) utilize a pill-shape (radius-full) to contrast against the more architectural grid.

## Components

### Buttons
- **Primary:** Warm Gold (#FFD700) background with Navy (#001F3F) text. Bold, 8px corner radius.
- **Secondary/Ghost:** 1px Navy stroke or transparent background with Navy text. Used for "View Profile" or "Load More."
- **Tertiary/Icon:** Navy background with White icon, used for the global header "Book Now" and search actions.

### Cards
- **Guide Cards:** 16px corner radius, subtle shadow, image at top with a 2:3 aspect ratio. Content includes a header in Serif and metadata in Sans-serif.
- **Feature Cards:** Centered icons within a light-colored circular or soft-square background, followed by a serif title and sans-serif body text.

### Input Fields & Search
- Inputs use a soft grey background (#F4F4F4) with no border until focused.
- Icons (calendar, guests) are essential for visual scanning.
- Active states use a 1px Navy or Gold border.

### Chips & Filters
- **Selection Chips:** Pill-shaped, light grey background, changing to Gold or Navy when active.
- **Checkboxes:** Square with 4px radius, Navy fill when checked.