# Offline PWA changes

This project includes a build-generated, versioned service worker with a complete precache of the production build, a web app manifest, install icons, and an update prompt. No additional npm dependencies were introduced.

## Deploy

Run `npm ci && npm run build` or push to `main` to trigger the existing GitHub Pages workflow. `npm run build` generates `dist/sw.js` after Vite finishes. Keep the configured base path `/nahuatl_study_vue/` unless your repository path changes; if it changes, update `vite.config.js`, `public/manifest.webmanifest`, and `scripts/generate-sw.mjs`.

## Test

Deploy to HTTPS, visit online, wait until the app says `Disponible sin conexión`, add it to the home screen, then switch to airplane mode and relaunch. Visit all routes and verify dictionary searches, notes, and edits. Reconnect, deploy a new build, reopen the app, and use the update prompt.

## Data and limitations

The app's existing localStorage records are unchanged and are not deleted by the service worker. This does not provide cross-device sync or backups. Browser storage can still be cleared or evicted by the operating system. All production assets are precached together; if the device cannot store the full bundle, offline installation will fail rather than falsely report success. External third-party resources and server-only features are not made offline by this worker. App updates are checked on launch, focus, visibility, and online events, not guaranteed while the app is closed. A user must have loaded the app online at least once to cache it.
