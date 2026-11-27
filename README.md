# CTRL Build website

Live at https://ctrlbuild.vercel.app

Static site for CTRL Build, the one-day commerce hackathon hosted by RCEO, RCIG and RCVC at Rotman Commerce (Toronto, March 2027).

Plain HTML, CSS and JavaScript. No build step, no dependencies.

- `index.html` - the page
- `styles.css` - all styles (colour tokens at the top)
- `app.js` - Build mode, navigation and preview forms
- `faq.js` - FAQ search and category filtering
- `assets/` - logos, favicon, link-preview image

## Run it locally

Open `index.html` in a browser, or run `npx serve .` in this folder.

## Deploy

Vercel: this repo is connected to the Vercel project `ctrl-build`. Every push to `main` deploys to production.
Netlify: drag this folder onto app.netlify.com/drop.

## Before launch

- Forms are previews: they validate and confirm but send nothing. Connect them to Formspree, Basin or a Google Sheet.
- Replace placeholders: sponsor names, prize amounts, judge names and unresolved FAQ details, and confirm the contact email.
- Set `og:image` to the absolute URL of the Terminal preview image when the deployment address is confirmed. Update `og:url` and the canonical link if the site moves.
