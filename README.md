# Personal Budgeting App

A personal budgeting web app built with React, Vite, TypeScript, Tailwind CSS, Dexie/IndexedDB, and Recharts. It is fully client-side and stores data in the browser.

## System updates

- Dark blue, gradient-rich UI with glow accents and compact widgets.
- Dummy login screen with persisted profile and per-user data scoping.
- Budget assistant widget with warnings and quick actions.
- Clear-month action that resets budgets and removes all transactions for the selected month.

## Core functionality

- Add, edit, and delete income or expense transactions.
- Filter transactions by category or date.
- Monthly category budgets with progress tracking.
- Spending breakdown chart and recent activity list.
- Quick actions for common transaction entries.
- Local-only storage (no backend).

## Run locally

```bash
npm create vite@latest budgeting-app -- --template react-ts
cd budgeting-app
npm install
npm install recharts dexie
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

This repository already includes the finished files, so from this folder you can simply run:

```bash
npm install
npm run dev
```

## Deploy

Build with:

```bash
npm run build
```

Deploy the generated `dist` folder to Netlify, or push the project to GitHub and point GitHub Pages at the Vite build output. For GitHub Pages under a repo subpath, set Vite's `base` option to `"/your-repo-name/"` in `vite.config.ts`.
