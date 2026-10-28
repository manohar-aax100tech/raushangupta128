# Raushan Gupta — Creator Portfolio

An animated, colorful, professional Indian comedy-creator portfolio. Made with **HTML5, CSS3, vanilla JavaScript, and one editable JSON source**. No React, build tools, or server required for viewing.

## Open directly

1. Extract the ZIP fully to a folder.
2. Double-click **`index.html`** in the folder. The site is designed to work with `file://` URLs.
3. To change content, edit **`data/influencer.json`**, then double-click **`update-offline.bat`** (Windows) and refresh the page. The batch helper uses PowerShell. On Mac/Linux use `python3 update-offline.py`.

The generator updates `data/offline-data.js` from your editable JSON file. This is necessary because browsers usually block `fetch()` from a local JSON file when using `file://`. On hosted sites, JSON updates are loaded directly without running the updater.

## Portfolio features

- Bold desi-comedy hero with a portrait from an account-linked Instagram post
- Personal bio, niches, creative strengths and visual brand identity
- Six featured clickable Reel cards
- Special showcase of a Lenskart-themed Reel **from the user's HTML** (not an independently confirmed paid partnership)
- Curated statistics representing only the 24 supplied post links, **not the creator's full social statistics**
- Filterable 24-post gallery with preview/lightbox and original-post links
- Collaboration/contact section using Instagram DM (email blank until supplied)
- Mobile menu, smooth scroll, accessible focus, reduced-motion support, image fallback graphics, SEO metadata
- Optional AA100X TECH attribution **off by default** until approved

## Images and videos

The portfolio includes **24 local Instagram preview images** in `assets/images/`, covering 22 Reels and 2 photo posts. The hero, About, featured cards, brand showcase, gallery and lightbox use these local files, including when opened directly or offline. The original Instagram thumbnail URLs remain in JSON as backup sources if a local image is missing; those remote URLs may expire or be blocked by Instagram.

To replace an image, save the new copy in `assets/images/` and edit for example:

```json
"imageLocal": "assets/images/my-reel-cover.jpg"
```

For large hero and about images set `images.heroLocal` and `images.aboutLocal`. Local images load first, with a retry using the Instagram URL if the local file fails. A branded fallback remains visible until an image loads successfully. Run `update-offline.bat` after changing the JSON to keep direct-open viewing in sync.

Reel thumbnails are **not actual video files**; click a Reel to view it on Instagram. For offline video playback, add authorized MP4 files and extend the website with a local video player.

## Edit content

Edit only `data/influencer.json` for profile name, captions, sources, niche, personal bio, email, social links, colors, post order, gallery, featured content, brand section, and section visibility. Run `update-offline.bat` after editing when opening directly.

Avoid publishing unverified follower totals, paid partnership claims, or creator personal details. Images belong to their respective creators/rightsholders; get authorization to republish them commercially.

## Folder structure

- `index.html`: main HTML page
- `css/style.css`: responsive layout, effects, animations, theme
- `js/script.js`: JSON rendering, filters, navigation, previews
- `data/influencer.json`: source of truth for creator data
- `data/offline-data.js`: generated for direct opening
- `assets/images/`: copy approved photos here
- `INSTAGRAM_SOURCES.md`: exact source post links and CDN image URLs
- `update-offline.bat`, `.ps1`, `.py`: JSON-to-offline sync helpers

## Hosting

Upload the folder to any static hosting service including Vercel, Netlify or Cloudflare Pages. No backend required.
