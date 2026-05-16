# fanza-portfolio

A personal portfolio website showcasing creative works, built with modern web technologies. This project features automated data fetching for portfolio items and is optimized for performance and maintainability.

## 🚀 Tech Stack

- **Framework:** [React](https://react.dev/) (v19)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:**
  - [Tailwind CSS](https://tailwindcss.com/) (v4)
  - [Chakra UI](https://chakra-ui.com/) (v2)
  - [Framer Motion](https://www.framer.com/motion/) (Animations & Transitions)
- **Routing:** [React Router](https://reactrouter.com/) (v7)
- **Deployment:** GitHub Pages

## ✨ Key Features

- **Automated Sync:** Daily updates from FANZA circle pages with affiliate link conversion.
- **Category Filtering:** Automatic detection of genres (Games, CG, Comics) with a smooth UI filter.
- **Detailed Work Modal:** Rich, in-site previews of work details using Chakra UI Modals.
- **Polished UX:** Staggered animations and smooth layout transitions powered by Framer Motion.

## 📂 Project Structure

```
fanza-portfolio/
├── .github/
│   └── workflows/
│       └── update-works.yml  # Daily automated sync from FANZA
├── src/
│   ├── components/       # Reusable UI components (Modal, Hero, etc.)
│   ├── data/            # Static data sources
│   │   └── works.json   # Portfolio items data (Single Source of Truth)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component (Filtering & Animations)
│   └── main.tsx         # Application entry point
├── scripts/             # Utility scripts
│   ├── fetch_new_works.mjs # Automated work fetcher with category detection
│   └── fetch_titles.mjs    # Title fetcher for existing works
├── public/              # Static assets
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

### Data Management

#### 1. Automated Sync from Circle Page
Fetch new works and automatically convert links to affiliate URLs:
```bash
npm run fetch-works
```
*Note: This script now automatically detects and assigns categories.*

### Deployment
Deploy the `dist` folder to GitHub Pages:
```bash
npm run deploy
```

## 🤖 Gemini Agent Instructions

### Coding Standards
- **Component Style:** Use functional components with React Hooks.
- **Styling:** Prioritize Tailwind CSS utility classes and Chakra UI for complex components.
- **Animations:** Use `framer-motion` for layout transitions and staggered entry effects.
- **Type Safety:** Ensure all props and data structures are typed strictly. Use `import type` for type-only imports.

### Data Handling
- **`src/data/works.json`**: This file is the single source of truth. Each item must have a `category` field.
- **Affiliate Links:** Always use the `affiliateUrl` field if available (`korokke-001`).
- **Sorting:** The web app sorts these items by `id` in descending order.

### Git Workflow
- **Commit Messages:** Use Conventional Commits format (e.g., `feat:`, `fix:`, `docs:`, `chore:`).

---

## 📈 Current Progress (Feb 26, 2026)

Successfully completed a major UI/UX and SEO overhaul:
- ✅ **Integrated Search:** Real-time keyword filtering for titles and descriptions.
- ✅ **Enhanced Filtering:** Category-based filtering with dynamic counts.
- ✅ **Professional UI:** Floating control panel, staggered animations (Framer Motion).
- ✅ **Performance:** Skeleton loading for all work cards.
- ✅ **In-site Previews:** Replaced external redirects with a detailed Work Modal.
- ✅ **PV Growth:** 
    - Dynamic JSON-LD (Structured Data) for better Google Search visibility.
    - X (Twitter) share buttons in Work Modal.
    - Dynamic SEO titles and meta descriptions.
- ✅ **Deployment:** Successfully deployed to GitHub Pages.

## 🚀 Next Steps

Ideas for the next development session:
1. **Image Optimization:** Implement a script to auto-resize/WebP-convert images from FANZA to improve mobile speed.
2. **Infinite Scroll:** Replace "Show More" button with automatic loading as the user scrolls.
3. **PWA Support:** Add a manifest and service worker to make the portfolio installable on mobile.
4. **Click Analytics:** Integration with GA4 to track which works are most popular.
