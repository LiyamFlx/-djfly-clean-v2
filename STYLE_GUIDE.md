# DJfly Platform: Style Guide & Design System

This document is the single source of truth for the visual language, components, and design patterns used in the DJfly application.

## 1. Color Palette

The color palette is designed to be modern, energetic, and accessible. It is built around the core brand colors and a consistent grayscale for UI elements.

### Primary Brand Colors

| Color              | Hex       | Usage                                   |
| ------------------ | --------- | --------------------------------------- |
| `electric-blue`    | `#00D4FF` | Primary actions, highlights, gradients. |
| `bright-turquoise` | `#00FFCC` | Secondary accents, gradients.           |
| `laser-pink`       | `#FF0080` | Tertiary accents, special highlights.   |
| `rich-black`       | `#0D0D0D` | Deep backgrounds, base text color.      |

### Grayscale & UI Colors

We will use a custom, consistent grayscale palette instead of the default Tailwind `gray` to ensure a unified look.

| Name          | Hex       | Usage                                            |
| ------------- | --------- | ------------------------------------------------ |
| `ui-bg-deep`  | `#0D0D0D` | Main application background (`rich-black`).      |
| `ui-bg`       | `#1A1A2E` | Primary surface color for cards and panels.      |
| `ui-bg-hover` | `#2A2A4E` | Hover state for surfaces.                        |
| `ui-border`   | `#3A3A6E` | Borders and dividers.                            |
| `ui-text`     | `#FFFFFF` | Primary text color.                              |
| `ui-text-dim` | `#A0A0C0` | Secondary text, placeholders, and disabled text. |

### Semantic Colors

| Name      | Hex       | Usage                                |
| --------- | --------- | ------------------------------------ |
| `success` | `#00FF80` | Success states, confirmations.       |
| `warning` | `#FFD700` | Warnings, non-critical alerts.       |
| `error`   | `#FF4D4D` | Error messages, destructive actions. |

## 2. Typography

- **Font Family:** `Inter` is the primary font for all UI text, served via a web font. `system-ui` is used as a fallback.
- **Hierarchy:**
  - **h1 (`text-4xl font-bold`):** Main page titles.
  - **h2 (`text-2xl font-bold`):** Section titles.
  - **h3 (`text-xl font-semibold`):** Sub-section titles.
  - **Body (`text-base`):** Default body text.
  - **Small (`text-sm`):** Helper text, labels.

## 3. Spacing & Sizing

The application uses Tailwind's default 4px grid system. All padding, margins, and gaps should use the standard Tailwind spacing scale (`p-1`, `m-2`, `gap-4`, etc.) to ensure consistency.

## 4. Component System

### Buttons

Buttons should be standardized to ensure a consistent user experience.

**Primary Action Button**

- **Description:** Used for the main call-to-action on a page.
- **Background:** `bg-gradient-to-r from-electric-blue to-bright-turquoise`
- **Text Color:** `text-rich-black`
- **Font Weight:** `font-semibold`
- **Hover State:** `hover:scale-105`
- **Disabled State:** `disabled:bg-gray-600`, `disabled:cursor-not-allowed`

**Secondary Action Button**

- **Description:** Used for secondary actions or less important buttons.
- **Background:** `bg-gray-700` (from the new grayscale)
- **Text Color:** `text-white`
- **Hover State:** `hover:bg-gray-600`
- **Disabled State:** `disabled:bg-gray-800`, `disabled:text-gray-500`

**Destructive Action Button**

- **Description:** Used for actions that cause data loss (e.g., Delete, End Session).
- **Background:** `bg-error` (from the new semantic colors)
- **Text Color:** `text-white`
- **Hover State:** `hover:bg-red-700`
- **Disabled State:** `disabled:bg-red-900`, `disabled:opacity-50`
