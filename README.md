# Forom

An interactive category-based navigation interface built with React, TypeScript, and Framer Motion.

## Features

- 🎯 **Interactive Grid Navigation** - Navigate through content with a responsive 3x3 video grid
- 🎨 **Category Wheel** - Unique wheel-based sidebar for category selection
- ✨ **Smooth Animations** - Fluid transitions powered by Framer Motion
- 🎡 **Scroll Navigation** - Mouse wheel support for effortless browsing
- 📱 **Responsive Design** - Scales beautifully across screen sizes

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion 12** - Animation library

## Project Structure

```
src/
├── components/
│   ├── CarouselGrid.tsx   # Main 3x3 video grid with navigation
│   ├── Header.tsx         # Animated FOROM logo header
│   └── Sidebar.tsx        # Wheel-based category selector
├── App.tsx                # Main application component
├── index.css              # Global styles and fonts
└── main.tsx               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

## Categories

The app includes five color-coded categories:

| Category    | Color   |
|-------------|---------|
| Partenaires | Green   |
| Culture     | Purple  |
| Clubs       | Red     |
| Trésorie    | Orange  |
| Atelier     | Blue    |

## Navigation

- **Sidebar Wheel**: Click categories or scroll to navigate vertically
- **Grid Arrows**: Use `<` `>` buttons for horizontal video navigation
- **Vertical Arrows**: Use `^` `v` buttons for category navigation

## License

MIT
