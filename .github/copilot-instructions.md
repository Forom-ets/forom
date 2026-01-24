Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file

## Project: VideoHub - Interactive Video Grid Navigation

A modern, interactive video grid navigation application built with React, Vite, Tailwind CSS, Framer Motion, and Lucide React.

### Tech Stack
- React 19, TypeScript, Vite 7
- Tailwind CSS 4 with @tailwindcss/postcss
- Framer Motion 12, Lucide React
- PostCSS with Autoprefixer

### Key Features
- Interactive video grid with hover animations
- Real-time search and filtering
- Responsive design (mobile, tablet, desktop)
- Smooth entrance and interaction animations
- Complete header, footer, and navigation
- 12 sample videos with mock data

### Quick Start
1. Press Ctrl+Shift+B to run dev server
2. Open http://localhost:5173
3. Run `npm run build` for production build
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
	<!-- Ask for project type, language, and frameworks if not specified. Skip if already provided. -->

- [x] Scaffold the Project
	<!-- Project scaffolded using manual file creation. -->

- [x] Customize the Project
	- Added Tailwind CSS configuration (tailwind.config.ts, postcss.config.js, @tailwindcss/postcss)
	- Updated index.css with Tailwind directives
	- Created VideoGrid component with Framer Motion animations
	- Created mock video data in data/mockVideos.ts
	- Updated App component with interactive video grid, search, header, and footer
	- Integrated Lucide React icons throughout

- [x] Install Required Extensions
	No extensions specified by Vite project setup.

- [x] Compile the Project
	- Fixed TypeScript Framer Motion variant types
	- Successfully compiled with npm run build
	- Production build: 323KB JS (103KB gzipped), 5.68KB CSS (1.63KB gzipped)

- [x] Create and Run Task
	- Created .vscode/tasks.json with dev server and build tasks
	- Run Dev Server task available (Ctrl+Shift+B)

- [x] Launch the Project
	Use "Run Dev Server" task or: npm run dev
	Open: http://localhost:5173

- [x] Ensure Documentation is Complete
	- README.md updated with comprehensive project documentation
	- This file includes project overview and setup information

- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.