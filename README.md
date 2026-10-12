# beehive

The landing page at https://rino21111.github.io/, linking to each browser app.

It's one static file, `index.html`, served by GitHub Pages from `main`.

## Adding an app

Add an entry to the `APPS` list near the bottom of `index.html`:

```js
{
  name: "My App",
  url: "/my_app/",   // the app's Pages path (or any full URL)
  icon: `<svg viewBox="0 0 40 40" ...>...</svg>`,  // line art in currentColor on a 40x40 box
},
```

Commit and push to `main`; Pages redeploys in about a minute.
