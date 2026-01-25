Use this file to provide workspace-specific custom instructions to Copilot.

## Project: Forom

An interactive category-based navigation interface with a unique wheel sidebar and 3x3 content grid.

### Tech Stack
- React 19, TypeScript, Vite 7
- Tailwind CSS 4 with @tailwindcss/postcss
- Framer Motion 12
- PostCSS with Autoprefixer

### Key Features
- 3x3 responsive video grid with category-colored borders
- Wheel-based sidebar for category navigation
- Horizontal and vertical slider controls
- Mouse wheel scrolling support
- Smooth spring-based animations

### Quick Start
1. Press Ctrl+Shift+B to run dev server
2. Open http://localhost:5173
3. Run `npm run build` for production build

### Project Structure
```
src/
├── components/
│   ├── CarouselGrid.tsx   # 3x3 grid with navigation controls
│   ├── Header.tsx         # Animated FOROM logo
│   └── Sidebar.tsx        # Wheel category selector
├── App.tsx                # Main app with state management
├── index.css              # Global styles and custom fonts
└── main.tsx               # Entry point
```

### Categories
- Partenaires (Green #86B89E)
- Culture (Purple #C084FC)
- Clubs (Red #E85C5C)
- Trésorie (Orange #F4C98E)
- Atelier (Blue #60A5FA)
