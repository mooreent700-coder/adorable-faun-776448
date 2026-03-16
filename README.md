# MenuFlow — GitHub to Netlify Ready Build

This package is prepared for a **real GitHub → Netlify deployment** so Netlify can:
- install dependencies
- build functions
- enable cross-device storefront publishing
- enable shared customer orders
- enable owner/kitchen/tracking pages across devices

## What this fixes
If you were uploading ZIPs manually in Netlify, the frontend files could appear, but the **function-backed publish system would not work correctly**.

This version is meant to be pushed to **GitHub** and connected to **Netlify**.

## Included systems
- Owner dashboard
- Menu manager
- Hero image upload
- Auto publish / Publish Now
- Shared storefront by slug
- Customer ordering
- Owner orders screen
- Kitchen screen
- Customer tracking
- Netlify Functions
- Netlify redirects

## Important
This version depends on:
- Netlify Functions
- Netlify build/install step
- package.json dependency install

## Deploy the right way

### 1. Create a GitHub repo
Create a new GitHub repository, for example:

`menuflow`

### 2. Upload these files to GitHub
Upload the full contents of this ZIP into the repo root.

### 3. Connect GitHub repo to Netlify
In Netlify:
- Add new site
- Import an existing project
- Choose GitHub
- Select your repo

### 4. Build settings
Use:
- Build command: leave blank
- Publish directory: `.`
- Functions directory: `netlify/functions`

Netlify should detect `netlify.toml`.

### 5. Deploy
Click deploy.

### 6. Test the function system
After deploy, test:

`/.netlify/functions/get-storefront?slug=demo-kitchen`

If the function is live, the publish system can work.

### 7. Use the owner dashboard
- log in
- upload hero
- add menu
- save
- auto publish or click Publish Now

Then test the storefront on another device.

## Clean business link
This build includes a cleaner link format:

`/shop/<slug>`

Example:

`https://your-site.netlify.app/shop/demo-kitchen`

## Notes
- If publish succeeds, other devices can load the real hero and real menu
- If publish fails, the deploy method is wrong or the functions are not built
