## IELTS Online – React + Vite + Tailwind

Clean, simple structure with Tailwind-based styles and lightweight components.

### Folder structure
```
.
├─ src/
│  ├─ components/          # Reusable UI components
│  │  ├─ Navbar.jsx
│  │  ├─ Hero.jsx
│  │  ├─ Features.jsx
│  │  ├─ LoadingAnimation.jsx
│  │  └─ FloatingActionButton.jsx
│  ├─ styles/              # Tailwind entry + scoped CSS for keyframes
│  │  ├─ index.css         # Tailwind import + @apply layers
│  │  ├─ animations.css    # Complex keyframes/effects (kept CSS)
│  │  ├─ scroll-animations.css
│  │  ├─ fab.css
│  │  └─ features.css
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

### Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build

### Notes
- Tailwind is the main styling system. Some complex animations remain as CSS keyframes.
- Bootstrap has been removed to avoid conflicts.
