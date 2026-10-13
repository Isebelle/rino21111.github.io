# the beez rooms

The landing page at https://rino21111.github.io/, linking to each browser app.

It's one static file, `index.html`, served by GitHub Pages from `main`.

## Adding an app

Add an entry to the `APPS` list near the bottom of `index.html`:

```js
{ name: "My App", url: "/my_app/", owner: "rino21111" },
```

`url` is the app's Pages path (or any full URL); `owner` shows in the card's corner.

Commit and push to `main`; Pages redeploys in about a minute.

## Room planner

`room-planner/` contains the apartment furniture planner, available at
https://rino21111.github.io/room-planner/ after this change is published.
It runs directly in the browser with no build or server dependencies.

Features include a scaled 3D apartment, movable furniture, WASD camera panning,
a Harrison, NJ sun simulation (plan top = west), and adjustable lamps for night views.
Three.js and OrbitControls are bundled; their license is in
`room-planner/vendor/THREE-LICENSE.txt`. Lighting assumptions are documented in
`room-planner/LIGHTING.md`.

Arrangements are stored in browser local storage. To transfer an arrangement from
the previous hosted planner, use Export there, then Import on this site; browser
storage is separate for each origin. No saved personal layouts are included in
this repository. The prior hosted planner remains available.

To preview locally, run `python3 -m http.server 8000` from the repository root and
open http://localhost:8000/room-planner/. Serve over HTTP rather than opening
`index.html` as a file, because the 3D viewer uses JavaScript modules.
