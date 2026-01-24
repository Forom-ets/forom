# FOROM - Interactive Video Grid Navigation

A modern, interactive video grid navigation application built with React, Vite, Tailwind CSS, Framer Motion, and Lucide React.

## Features

- 🎬 **Interactive Video Grid** - Responsive video grid with hover animations
- 🎨 **Modern UI** - Built with Tailwind CSS for a clean, professional look
- ✨ **Smooth Animations** - Powered by Framer Motion for engaging interactions
- 🔍 **Search Functionality** - Filter videos by title or channel name
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎭 **Rich Icons** - Integrated Lucide React icons throughout the UI
- ⚡ **Fast Development** - Vite for instant HMR and rapid builds

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Animation library
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/
│   └── VideoGrid.tsx        # Main video grid component
├── data/
│   └── mockVideos.ts        # Sample video data
├── App.tsx                  # Main app component with search
├── App.css                  # App styles
├── index.css                # Global styles with Tailwind
├── main.tsx                 # Entry point
└── vite-env.d.ts           # Vite environment types

public/                       # Static assets
.vscode/
└── tasks.json               # VS Code development tasks
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Linting

Check code quality:

```bash
npm run lint
```

## Key Components

### VideoGrid Component

The main component that displays videos in a responsive grid layout with:
- Staggered entrance animations
- Hover effects with play/pause buttons
- Responsive grid (1 col on mobile, 2 on tablet, 3-4 on desktop)
- Action buttons for mute and share functionality
- Duration and view count badges

### App Component

Main application wrapper featuring:
- Header with search functionality
- Video filtering by title or channel
- Responsive navigation with icons
- Footer with links and information
- Empty state handling for no results

## Features in Detail

### Search & Filter
- Real-time search across video titles and channel names
- Live results count
- Responsive search bar with autocomplete styling

### Animations
- Container animations with staggered children
- Item animations with spring physics
- Hover scale effects on video cards
- Button animations with tap feedback
- Smooth transitions on all interactive elements

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interaction areas

## Customization

### Adding More Videos

Edit `src/data/mockVideos.ts` to add or modify video data:

```typescript
{
  id: '13',
  title: 'Your Video Title',
  thumbnail: 'https://your-image-url.jpg',
  duration: '10:30',
  views: '1M',
  channel: 'Channel Name',
}
```

### Styling

Tailwind CSS classes are used throughout. Customize colors and spacing in `tailwind.config.ts`.

### Animation Tweaks

Framer Motion animation configurations are in `src/components/VideoGrid.tsx`. Adjust:
- `damping` - Controls oscillation (lower = more bouncy)
- `stiffness` - Controls responsiveness (higher = snappier)
- `staggerChildren` - Controls grid animation timing

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Production bundle size: ~323KB (gzipped: ~103KB)
- Fast HMR during development
- Optimized animations using GPU acceleration
- Lazy loading ready for images

## VS Code Tasks

Two default tasks are configured in `.vscode/tasks.json`:

1. **Run Dev Server** (Ctrl+Shift+B) - Starts Vite dev server
2. **Build for Production** - Creates optimized production bundle

## Contributing

Feel free to modify and extend this project for your use case. Some ideas:

- Add video categories/tabs
- Implement playlist functionality
- Add user ratings and comments
- Integrate with a real video API
- Add dark mode toggle
- Implement video player

## License

This project is open source and available under the MIT License.
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
