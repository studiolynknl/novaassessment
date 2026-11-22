# NOVA — Centrum voor Herstel

Homepage for NOVA, built with Next.js (App Router) and GSAP 3.15 + ScrollTrigger. The design and animations are a 1:1 build of the Claude Design prototype `NOVA Homepage.dc.html`.

## Run locally

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy on Vercel

Import this repository in Vercel. It detects Next.js on its own: keep the default build settings, leave Root Directory as the repo root, and add no environment variables. The page is prerendered as static HTML.

## Structure

- `app/page.jsx`: the page markup, server-rendered.
- `app/globals.css`: all design values (colours, spacing, type, hover states). The brand arc is defined once as `.arc`.
- `lib/nova.js`: loader, hero intro, scroll reveals, keuzehulp, service cards, story toggle, mobile menu (below 1080px) and the booking demo.
- `lib/content.js`: copy and data for the lists.
- `components/NovaRuntime.jsx`: client component that starts `lib/nova.js` once the page has loaded.
- `public/assets/`: photos, logo and the arc favicon.

## Notes

- With `prefers-reduced-motion`, the page has no loader and no motion. Add `?motion=on` to the URL to show the animations anyway.
- The booking demo does not send or store any data.
- GSAP is used under the GreenSock Standard License (https://gsap.com/standard-license/).
