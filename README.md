# CTRL Build website

Static site for CTRL Build, the one-day commerce hackathon hosted by RCEO, RCIG and RCVC at Rotman Commerce (Toronto, March 2027).

Plain HTML, CSS and JavaScript. No build step, no dependencies.

- `index.html` - the page
- `styles.css` - all styles (colour tokens at the top)
- `app.js` - scroll scenes, popups and forms
- `assets/` - logos, favicon, link-preview image

## Run it locally

Open `index.html` in a browser, or run `npx serve .` in this folder.

## Deploy

Vercel: import this repo at vercel.com/new, framework preset "Other", no build command, output directory `.`.
Netlify: drag this folder onto app.netlify.com/drop.

## Before launch

- Forms are previews: they validate and confirm but send nothing. Connect them to Formspree, Basin or a Google Sheet.
- Replace placeholders: sponsor names, prize amounts, judge names, sample briefs, contact email.
- Once the domain is final, make `og:image` in `index.html` an absolute URL (for example `https://ctrlbuild.ca/assets/og.jpg`) so link previews show the image everywhere.
