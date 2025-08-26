# Typography System

This document outlines the centralized typography system for the EAFYA Data Tool application.

## 🎯 **Single Source of Truth**

All typography, color, and spacing definitions are now centralized in `src/styles/global.scss`. This eliminates inconsistencies and provides a unified design system.

## 📁 **File Structure**

- **`src/styles/global.scss`** - All typography, color, and spacing definitions
- **`src/styles/dhis2.css`** - Layout-specific styles only
- **`src/styles/typography.md`** - This documentation

## 🎨 **Font Families**

### Primary Font: Poppins

- **Usage**: Main body text, headings, UI elements
- **Characteristics**: Geometric, friendly, modern, highly readable
- **Weights**: 300 (Light), 400 (Normal), 500 (Medium), 600 (Semibold), 700 (Bold)

### Secondary Font: Inter

- **Usage**: Alternative headings, special text elements
- **Characteristics**: Modern, clean, highly readable
- **Weights**: 300 (Light), 400 (Normal), 500 (Medium), 600 (Semibold), 700 (Bold)

### Monospace Font: SF Mono

- **Usage**: Code, technical data, numbers
- **Characteristics**: Fixed-width, technical appearance
- **Fallbacks**: Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New

## 📏 **Font Sizes**

| Class        | Size (rem) | Size (px) | Usage                  |
| ------------ | ---------- | --------- | ---------------------- |
| `.text-xs`   | 0.6875rem  | 11px      | Small labels, captions |
| `.text-sm`   | 0.75rem    | 12px      | Small body text        |
| `.text-base` | 0.75rem    | 12px      | Default body text      |
| `.text-lg`   | 0.75rem    | 12px      | Large body text        |
| `.text-xl`   | 0.75rem    | 12px      | Subheadings            |
| `.text-2xl`  | 0.75rem    | 12px      | Section headings       |
| `.text-3xl`  | 0.75rem    | 12px      | Page headings          |
| `.text-4xl`  | 0.75rem    | 12px      | Large page headings    |

## 🎯 **Font Weights**

| Class            | Weight | Usage                        |
| ---------------- | ------ | ---------------------------- |
| `.font-light`    | 300    | Light text, subtle elements  |
| `.font-normal`   | 400    | Normal body text             |
| `.font-medium`   | 500    | Medium emphasis, buttons     |
| `.font-semibold` | 600    | Strong emphasis, subheadings |
| `.font-bold`     | 700    | Bold emphasis, main headings |

## 📐 **Line Heights**

| Class              | Line Height | Usage                 |
| ------------------ | ----------- | --------------------- |
| `.leading-tight`   | 1.25        | Headings, short text  |
| `.leading-normal`  | 1.5         | Body text, paragraphs |
| `.leading-relaxed` | 1.75        | Long-form content     |

## 🎨 **Font Family Classes**

| Class             | Font Family | Usage                |
| ----------------- | ----------- | -------------------- |
| `.font-primary`   | Poppins     | Primary text         |
| `.font-secondary` | Inter       | Alternative headings |
| `.font-mono`      | SF Mono     | Code, technical data |

## 🎨 **Color System**

### Text Colors

- `.text-primary` - Primary blue (#2c6693)
- `.text-success` - Success green (#2ecc71)
- `.text-danger` - Danger red (#e74c3c)
- `.text-warning` - Warning yellow (#f1c40f)
- `.text-info` - Info blue (#3498db)
- `.text-muted` - Muted gray (#666)
- `.text-light` - Light gray (#999)

### Background Colors

- `.bg-primary` - Primary blue background
- `.bg-success` - Success green background
- `.bg-danger` - Danger red background
- `.bg-warning` - Warning yellow background
- `.bg-info` - Info blue background

### Background Colors with Opacity

#### Primary Color Opacity

- `.bg-primary-opacity-10` - 10% opacity
- `.bg-primary-opacity-25` - 25% opacity
- `.bg-primary-opacity-50` - 50% opacity
- `.bg-primary-opacity-75` - 75% opacity

#### Success Color Opacity

- `.bg-success-opacity-10` - 10% opacity
- `.bg-success-opacity-25` - 25% opacity
- `.bg-success-opacity-50` - 50% opacity
- `.bg-success-opacity-75` - 75% opacity

#### Danger Color Opacity

- `.bg-danger-opacity-10` - 10% opacity
- `.bg-danger-opacity-25` - 25% opacity
- `.bg-danger-opacity-50` - 50% opacity
- `.bg-danger-opacity-75` - 75% opacity

#### Warning Color Opacity

- `.bg-warning-opacity-10` - 10% opacity
- `.bg-warning-opacity-25` - 25% opacity
- `.bg-warning-opacity-50` - 50% opacity
- `.bg-warning-opacity-75` - 75% opacity

#### Info Color Opacity

- `.bg-info-opacity-10` - 10% opacity
- `.bg-info-opacity-25` - 25% opacity
- `.bg-info-opacity-50` - 50% opacity
- `.bg-info-opacity-75` - 75% opacity

## 📋 **Heading Hierarchy**

### H1 / .h1

- **Size**: 0.75rem (12px)
- **Weight**: Bold (700)
- **Line Height**: Tight (1.25)
- **Usage**: Main page titles

### H2 / .h2

- **Size**: 0.75rem (12px)
- **Weight**: Semibold (600)
- **Line Height**: Tight (1.25)
- **Usage**: Section headings

### H3 / .h3

- **Size**: 0.75rem (12px)
- **Weight**: Medium (500)
- **Line Height**: Tight (1.25)
- **Usage**: Subsection headings

### H4 / .h4

- **Size**: 0.75rem (12px)
- **Weight**: Medium (500)
- **Line Height**: Normal (1.5)
- **Usage**: Card titles, form sections

### H5 / .h5

- **Size**: 0.75rem (12px)
- **Weight**: Medium (500)
- **Line Height**: Normal (1.5)
- **Usage**: Small headings, labels

### H6 / .h6

- **Size**: 0.75rem (12px)
- **Weight**: Medium (500)
- **Line Height**: Normal (1.5)
- **Usage**: Captions, small labels

## 💡 **Usage Examples**

### Basic Text

```html
<p class="text-base font-normal leading-normal">
  This is standard body text using the primary font family.
</p>
```

### Heading

```html
<h1 class="text-3xl font-bold leading-tight">Main Page Title</h1>
```

### Form Label

```html
<label class="text-sm font-medium"> Email Address </label>
```

### Button Text

```html
<button class="btn text-sm font-medium">Submit Form</button>
```

### Code/Technical Data

```html
<code class="font-mono text-sm"> SELECT * FROM users WHERE id = 1; </code>
```

### Card Title

```html
<h4 class="text-lg font-medium">Dashboard Overview</h4>
```

### Small Caption

```html
<p class="text-xs font-light">Last updated: 2024-01-15</p>
```

### Colored Text

```html
<p class="text-primary">Primary colored text</p>
<p class="text-success">Success colored text</p>
<p class="text-muted">Muted text</p>
```

### Background with Opacity

```html
<!-- Primary color with 10% opacity -->
<div class="bg-primary-opacity-10 text-primary">Light primary background</div>

<!-- Success color with 25% opacity -->
<div class="bg-success-opacity-25 text-success">Light success background</div>

<!-- Active state with primary opacity -->
<button class="bg-primary-opacity-10 text-primary">Active button</button>
```

## 🧩 **Component-Specific Typography**

### Tables

- **Headers**: `.font-semibold .text-sm`
- **Body**: `.text-sm`
- **Font Family**: Primary (Poppins)

### Forms

- **Labels**: `.font-medium .text-sm`
- **Inputs**: `.text-sm`
- **Buttons**: `.font-medium .text-sm`

### Navigation

- **Menu Items**: `.text-sm`
- **Active Items**: `.font-medium`

### Cards

- **Title**: `.text-lg .font-medium`
- **Body**: `.text-sm`

### Alerts

- **Text**: `.text-sm`

### Badges

- **Text**: `.text-xs .font-medium`

## 🔧 **CSS Custom Properties**

All typography settings are defined as CSS custom properties in `global.scss`:

```scss
:root {
  /* Font Families */
  --font-family-primary: "Poppins", sans-serif;
  --font-family-secondary: "Inter", sans-serif;
  --font-family-mono: "SF Mono", monospace;

  /* Font Sizes */
  --font-size-xs: 0.6875rem; /* 11px */
  --font-size-sm: 0.75rem; /* 12px */
  --font-size-base: 0.75rem; /* 12px */

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Colors */
  --primary-blue: #2c6693;
  --text-color: #333;
  --text-muted: #666;
  --text-light: #999;
  --success-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f1c40f;
  --info-color: #3498db;
}
```

## 📱 **Responsive Typography**

The font system uses relative units (rem) which scale with the root font size. This ensures consistent typography across different screen sizes and user preferences.

## ♿ **Accessibility**

- **Minimum contrast ratio**: 4.5:1 for normal text, 3:1 for large text
- **Font sizes**: Maximum 12px for compact layout
- **Line heights**: Adequate spacing for readability
- **Font weights**: Clear hierarchy without relying solely on color

## 🔄 **Migration Benefits**

### Before (Inconsistent)

- Font definitions scattered across multiple files
- Manual font-size declarations everywhere
- Inconsistent color usage
- Hard to maintain and update

### After (Centralized)

- Single source of truth in `global.scss`
- CSS custom properties for easy updates
- Consistent typography across all components
- Easy to maintain and modify

## 🛠️ **Customization**

To modify the typography system, update the CSS custom properties in `src/styles/global.scss`:

```scss
:root {
  --font-family-primary: "Your-Font", sans-serif;
  --font-size-base: 0.75rem; /* 12px */
  --font-weight-medium: 600;
  --primary-blue: #your-color;
}
```

## ✅ **Best Practices**

1. **Always use CSS custom properties** instead of hardcoded values
2. **Use utility classes** for quick styling
3. **Maintain consistency** across all components
4. **Test accessibility** with different font sizes
5. **Document changes** in this file when updating the system
