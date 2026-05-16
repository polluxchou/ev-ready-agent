# TopSC EV Readiness Agent Demo

Interactive Vite/React demo for a four-agent imported EV ownership workflow:

- Parking & delivery readiness
- Charging and local compliance
- Service network matching
- Warranty and insurance case handling

## Local Development

```sh
npm install
npm run dev
```

Google Maps features require a browser-safe Maps JavaScript API key:

```sh
cp .env.example .env.local
```

Then set `VITE_GOOGLE_MAPS_API_KEY` in `.env.local`.

## Build

```sh
npm run build
```

## GitHub Pages

The repository includes a GitHub Actions workflow that builds and deploys `dist/` to GitHub Pages on every push to `main`.

The hosted preview intentionally does not inject `VITE_GOOGLE_MAPS_API_KEY`. Vite exposes `VITE_` variables to browser JavaScript, so keep the Maps key local unless it is a browser-restricted public key that you are comfortable exposing.
