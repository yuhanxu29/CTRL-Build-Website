# CTRL Build website

Live at https://ctrlbuild.vercel.app

Static site for CTRL Build, the one-day commerce hackathon hosted by RCEO, RCIG and RCVC at Rotman Commerce (Toronto, March 2027).

Plain HTML, CSS and JavaScript. No build step, no dependencies.

- `index.html` - the page
- `styles.css` - all styles (colour tokens at the top)
- `app.js` - scroll scenes, popups and forms
- `assets/` - logos, favicon, link-preview image

## Run it locally

Open `index.html` in a browser, or run `npx serve .` in this folder.

## Deploy

Vercel: this repo is connected to the Vercel project `ctrl-build`. Every push to `main` deploys to production.
Netlify: drag this folder onto app.netlify.com/drop.

## Before launch

- Forms are previews: they validate and confirm but send nothing. Connect them to Formspree, Basin or a Google Sheet.
- Replace placeholders: search for `TBA` (sponsor names on the board and in `BRIEFS` in `app.js`, prize amounts), the unlit investor panel in Judges, sample briefs, contact email.
- If the site moves to a paid domain, update `og:url`, `og:image` and the canonical link in `index.html` to the new address.
