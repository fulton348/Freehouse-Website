# Freehouse Brewery — Website Project Context

## Tech Stack
- **Squarespace** — hosts the main website (Basic plan, limited code injection)
- **GitHub** — `fulton348/Freehouse-Website` — stores all custom code files
- **Netlify** — `prismatic-truffle-86e42c.netlify.app` — hosts and deploys the beer list page, auto-deploys on every GitHub push
- **Square POS** — source of truth for the draft beer list
- **Claude** — makes code changes and pushes directly to GitHub via personal access token

## How It Works
1. Beers are managed in Square POS under **Freehouse Brewery Charleston Menu > Draft** category
2. A Netlify serverless function (`netlify/functions/beers.js`) calls Square's API, paginates through all catalog pages, filters to the Charleston Draft category (`NFR6NOCY26EV6UUYIUPGXFLP`), and returns a JSON list of beer names and descriptions
3. `CurrentlyPouring.html` loads in the browser, fetches from `/.netlify/functions/beers`, matches names to descriptions, and renders the full styled list
4. The page is embedded in Squarespace via an Embed block using an iframe
5. Beer names and descriptions update automatically from Square — no code changes needed for routine tap changes

## Key IDs & Config
- **North Charleston Location ID:** `LJZJT95434WWE`
- **Walhalla Location ID:** `LFT0T6HP8DKXZ`
- **Charleston Draft Menu ID:** `FNLVGCAXYEYOPAUJQSUHA5FV`
- **Charleston Draft Category ID:** `NFR6NOCY26EV6UUYIUPGXFLP`
- **Netlify URL:** `https://prismatic-truffle-86e42c.netlify.app`
- **Beer list page:** `https://prismatic-truffle-86e42c.netlify.app/CurrentlyPouring.html`
- **Beers function:** `https://prismatic-truffle-86e42c.netlify.app/.netlify/functions/beers`
- **Square Access Token:** stored as `SQUARE_ACCESS_TOKEN` environment variable in Netlify (never in code)

## GitHub Access
- **Repo:** `fulton348/Freehouse-Website`
- **Personal Access Token:** share at the start of each new chat session so Claude can push directly to GitHub
- Token scope needed: `repo`

## Squarespace Embed Code
Paste this into the Embed block on the beer list page:
```html
<iframe id="beer-iframe" src="https://prismatic-truffle-86e42c.netlify.app/CurrentlyPouring.html" width="100%" height="3200" frameborder="0" scrolling="no" style="border:none; overflow:hidden;"></iframe>
```
Note: height is fixed at 3200px because Squarespace Basic plan blocks the script needed for auto-resizing. Adjust if the list grows significantly.

## Repo File Structure
```
Freehouse-Website/
├── CurrentlyPouring.html       — beer list page (transparent bg, inherits Squarespace styles)
├── netlify.toml                — tells Netlify where to find the functions folder
├── netlify/
│   └── functions/
│       └── beers.js           — serverless function that calls Square API and returns draft list
└── README.md
```

## What Updates Automatically (No Code Changes Needed)
- Adding a beer to the Charleston Draft category in Square → appears on website
- Removing/archiving a beer in Square → disappears from website
- Updating a beer's description in Square → updates on website

## What Requires Coming Back to Claude
- Adding a description for a new beer (can be done in Square directly or via Claude)
- Updating Guest Taps section (Potter's Imperial Dry Cider)
- Updating Non-Alcoholic section (Island Time Kombucha, Organic Lemonade)
- Any visual/layout changes to the page
- Adjusting iframe height in Squarespace embed if list grows significantly

## Excluded Items (Filtered Out of Beer List)
These are in Square but excluded from the website display:
- Beer Flight of Four
- Burpees Promo Draft Beer
- Oktoberfest Mug Deal
- Potter's Imperial Dry Cider (lives in Guest Taps section instead)

## Current Draft List (as of June 2026)
All 21 beers have descriptions stored in Square's catalog description field.

| Beer | Has Description |
|---|---|
| Agave Rose Seltzer | ✅ |
| Ashley Farmhouse | ✅ |
| BA Blueberry Sour | ✅ |
| Barrel Aged HooDoo Imperial Stout | ✅ |
| Battery Brown Ale | ✅ |
| Brasstown Porter | ✅ |
| Celestial Daze | ✅ |
| Color of Energy | ✅ |
| Folly's Pride Blonde | ✅ |
| Fore Y'all Muni Lager | ✅ |
| Frosty Boi White Lager | ✅ |
| Green Door IPA | ✅ |
| HooDoo Imperial Stout | ✅ |
| Jocassee Cold IPA | ✅ |
| Olde Country Irish Stout | ✅ |
| Premium Lager | ✅ |
| Sourlina Peche | ✅ |
| Spottail Amber Ale | ✅ |
| SummerFest Lager | ✅ |
| Tropical Falls | ✅ |
| Twin Falls West Coast Hazy IPA | ✅ |

## Guest Taps (Static — Update in CurrentlyPouring.html)
- **Potter's Imperial Dry Cider** — A crisp, dry apple cider with a clean finish. Refreshing and sessionable with just the right amount of apple character.

## Non-Alcoholic (Static — Update in CurrentlyPouring.html)
- **Island Time Kombucha** — Brewed low and slow right here in Charleston, SC. Island Time brings the island escapism in every sip — live cultures, natural ingredients, and good vibes on tap.
- **Organic Lemonade** — Tart, sweet, and ice cold. Everything you need on a hot Lowcountry day.

## Notes
- Square catalog is paginated (100 items per page, 3+ pages). The `beers.js` function loops through all pages using Square's cursor. This was a bug fix applied after new beers (Celestial Daze, HooDoo Imperial Stout, Tropical Falls) were not showing up because they fell past page 1.
- Squarespace Basic plan does not support Code Injection or script tags in Embed blocks, which prevents iframe auto-resizing.
- The `beers.js` function description field priority: Square catalog description field first, then description_html. Falls back to nothing if both are empty (beer name still shows).
