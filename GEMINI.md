# fanza-portfolio

A personal portfolio website showcasing creative works, built with modern web technologies. This project features automated data fetching for portfolio items and is optimized for performance and maintainability.

## 🚀 Tech Stack

- **Framework:** [React](https://react.dev/) (v19)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:**
  - [Tailwind CSS](https://tailwindcss.com/) (v4)
  - [Chakra UI](https://chakra-ui.com/) (Components)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Routing:** [React Router](https://reactrouter.com/) (v7)
- **Deployment:** GitHub Pages

## 📂 Project Structure

```
fanza-portfolio/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Hero.tsx      # Main landing section
│   │   ├── WorkDetail.tsx# Individual work display
│   │   └── ...
│   ├── data/            # Static data sources
│   │   └── works.json   # Portfolio items data
│   ├── types/           # TypeScript type definitions
│   │   └── work.ts      # Work interface definition
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── scripts/             # Utility scripts
│   └── fetch_titles.mjs # Automated title fetcher from external URLs
├── public/              # Static assets (images, icons)
├── dist/                # Production build output
└── ...config files      # Vite, Tailwind, TypeScript configs
```

## 🛠️ Setup & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
Install project dependencies:
```bash
npm install
```

### Local Development
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production
Create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

### Data Management
Update work titles automatically from source URLs (defined in `src/data/works.json`):
```bash
npm run titles
```
*Note: This script uses `fetch` to scrape titles and requires Node.js v18+.*

### Deployment
Deploy the `dist` folder to GitHub Pages:
```bash
npm run deploy
```

## 🤖 Gemini Agent Instructions

These instructions are intended for the AI assistant (Gemini CLI) when working on this repository.

### Coding Standards
- **Component Style:** Use functional components with React Hooks.
- **Styling:** Prioritize Tailwind CSS utility classes. Use Chakra UI components for complex interactive elements if consistent with existing design.
- **Type Safety:** Ensure all props and data structures are typed strictly using TypeScript interfaces (see `src/types/`). Avoid `any` types.
- **File Naming:** PascalCase for React components (e.g., `MyComponent.tsx`), camelCase for utilities and hooks (e.g., `useCustomHook.ts`).

### Data Handling
- **`src/data/works.json`**: This file is the single source of truth for portfolio items.
- **`src/types/work.ts`**: Any changes to the JSON structure must be reflected in the `Work` interface.

### Git Workflow
- **Commit Messages:** Use Conventional Commits format (e.g., `feat: add new gallery component`, `fix: resolve mobile layout issue`, `docs: update setup guide`).
