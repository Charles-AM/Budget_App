# Personal Budgeting App

A one-day personal budgeting web app built with React, Vite, TypeScript, Tailwind CSS, Dexie/IndexedDB, and Recharts. It is fully client-side and stores data in the browser.

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
