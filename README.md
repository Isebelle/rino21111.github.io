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
