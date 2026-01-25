<div align="center">

# FRM

### The Infinite Feed Grid

**A scalable, category-based navigation system built for modern content platforms**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

[Demo](#demo) · [Features](#features) · [Quick Start](#quick-start) · [Architecture](#architecture) · [Contributing](#contributing)

---

</div>

## Overview

**FRM** is an innovative infinite feed grid system that reimagines content navigation. Built with performance and scalability in mind, it provides a seamless 2D navigation experience across categories and content items.

Originally developed by **Forom** as an experimental UI concept, FRM has evolved into a production-ready component system that can be adapted for video platforms, content galleries, portfolio sites, and more.

## Features

| Feature | Description |
|---------|-------------|
| 🎯 **5×5 Infinite Grid** | Navigate through a dynamic grid with infinite horizontal looping per category |
| 🎡 **Wheel Sidebar** | Unique curved category selector with smooth spring animations |
| ⚡ **Gesture Navigation** | Full mouse wheel support with resistance-based scrolling |
| 🎨 **Category Theming** | Color-coded categories with automatic border inheritance |
| ✨ **Spring Animations** | Fluid, physics-based transitions via Framer Motion |
| 📐 **Responsive Scaling** | vw/vh-based sizing that adapts to any viewport |
| 🔄 **Bi-directional Control** | Slider tracks + arrow buttons for both axes |

## Demo

```bash
npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see FRM in action.

## Quick Start

### Prerequisites

- **Node.js** 18.0+
- **npm** 9.0+ (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/frm.git
cd frm

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:5173` |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |

## Architecture

```
src/
├── components/
│   ├── CarouselGrid.tsx   # Core grid engine with navigation logic
│   ├── Header.tsx         # Branding header with action icons
│   └── Sidebar.tsx        # Wheel-based category navigation
├── assets/
│   ├── fonts/             # Custom typography (Jersey 15)
│   └── icons/             # UI icons (PNG)
├── App.tsx                # Root component & state management
├── index.css              # Global styles & CSS variables
└── main.tsx               # React entry point
```

### Core Components

#### `CarouselGrid`
The heart of FRM. Manages a 5×5 visible viewport into a larger virtual grid:
- **20 items per category** (horizontal axis)
- **Infinite loop** on horizontal navigation
- **Category boundaries** on vertical navigation
- **Click-to-focus** on any visible cell

#### `Sidebar`
A curved wheel selector for category navigation:
- Spring-animated item positioning
- Mouse wheel capture with cooldown
- Automatic active state management

#### `Header`
Modular header with:
- Animated logo letterforms
- Configurable action icons
- Modal trigger system

### Configuration

Categories and colors are defined in [App.tsx](src/App.tsx):

```typescript
const CATEGORIES = ['Partenaires', 'Culture', 'Clubs', 'Trésorie', 'Atelier']

const CATEGORY_COLORS: Record<string, string> = {
  Partenaires: '#86B89E',  // Green
  Culture: '#C084FC',      // Purple
  Clubs: '#E85C5C',        // Red
  Trésorie: '#F4C98E',     // Orange
  Atelier: '#60A5FA',      // Blue
}
```

## Extending FRM

### Adding Categories

1. Add the category name to `CATEGORIES` array in `App.tsx`
2. Add the color mapping in `CATEGORY_COLORS` in `CarouselGrid.tsx`
3. The grid automatically expands to accommodate new categories

### Custom Content

Replace the numbered placeholders in `renderVideoBox()` with your content:

```typescript
// In CarouselGrid.tsx - renderVideoBox()
// Replace the placeholder span with your content component
<YourContentComponent id={num} category={category} />
```

### Theming

Global styles live in [index.css](src/index.css). Key customization points:
- `:root` CSS variables for colors
- Font-face declarations for typography
- Tailwind theme extensions in `tailwind.config.ts`

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev) | 19.x | UI framework |
| [TypeScript](https://typescriptlang.org) | 5.9 | Type safety |
| [Vite](https://vitejs.dev) | 7.x | Build tooling |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Styling |
| [Framer Motion](https://framer.com/motion) | 12.x | Animations |
| [PostCSS](https://postcss.org) | 8.x | CSS processing |

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style (ESLint enforced)
- Use TypeScript strict mode
- Write meaningful commit messages
- Update documentation for new features

### Ideas for Contribution

- [ ] Touch/swipe gesture support
- [ ] Keyboard navigation (arrow keys)
- [ ] Virtual scrolling for large datasets
- [ ] Content lazy loading
- [ ] Accessibility improvements (ARIA)
- [ ] Mobile responsive breakpoints
- [ ] Custom animation presets
- [ ] Plugin system for content types

## License

MIT © [Forom](https://github.com/forom)

---

<div align="center">

**Built with ❤️ by Forom**

*The future of content navigation is infinite.*

</div>
