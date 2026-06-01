# pseudodragonswarm.org

Source for the [Pseudodragon Swarm](https://pseudodragonswarm.org) landing page —
a deliberately minimal [Jekyll](https://jekyllrb.com/) site served via GitHub Pages.

## Develop locally

```sh
bundle install
bundle exec jekyll serve     # http://127.0.0.1:4000
```

## Structure

| Path | What |
|------|------|
| `index.md` | the page content |
| `_layouts/default.html` | the only layout |
| `assets/style.css` | styles |
| `_config.yml` | site config (no theme, no plugins) |

The hero is an all-emoji mosaic — dragons over a forest of houses, with snow-capped
mountains and volcanoes behind — built from emoji as "pixels," no image assets by design.

## Publishing

GitHub Pages, served from `main` at the repo root. Push to `main` and enable
Pages (Settings → Pages → Deploy from branch → `main` / root).
