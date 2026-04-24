# Le Quiz

A deployable Vite + React version of the quiz app.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files will be created in the `dist` folder.

## Deploy free on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Use these settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

## Deploy free on Netlify

1. Push this folder to GitHub, or drag-and-drop the built `dist` folder into Netlify.
2. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Deployment fix

This version pins Tailwind CSS to v3 so the existing PostCSS config works on Vercel.
