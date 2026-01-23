# SSR and Hydration

This project runs with SSR enabled and hydration turned on by default.
The app is designed to demonstrate Angular v21 capabilities, including
hybrid rendering and hydration-safe patterns.

## Render modes (current)

- `/` uses SSG (prerender)
- `/pokedex` uses SSR
- `/pokedex/:nameOrId` uses SSR
- `/labs/**` uses CSR

## Development commands

Run the SSR dev server:

```bash
npm run start
```

Build and run a production-like SSR server:

```bash
npm run build
npm run serve:ssr:features-21
```

## Hydration notes

Hydration is enabled in `src/app/app.config.ts` using:

```
provideClientHydration(withEventReplay())
```

This reuses the HTML generated on the server and reattaches event listeners
on the client.

### SSR without hydration (reference)

To compare behavior without hydration, remove the hydration provider:

```
// In src/app/app.config.ts
// provideClientHydration(withEventReplay())
```

Without hydration, the client will re-render the app from scratch after SSR.

## Pitfalls and guidelines

- Avoid direct access to `window` or `document` in SSR paths.
- When needed, guard browser-only code with `isPlatformBrowser`.
- Ensure deterministic output between server and client renders.
- Do not generate random values during render without stabilization.

## Troubleshooting

- If you see hydration mismatches, confirm data is available on the server.
- Verify DOM shape and conditional rendering are identical between SSR/CSR.
- Check that dynamic content does not rely on browser-only APIs.
