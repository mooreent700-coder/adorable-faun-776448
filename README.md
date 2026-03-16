# MenuFlow Complete Netlify Build Ready

This ZIP is the complete GitHub -> Netlify build-ready package.

## Included
- owner dashboard
- hero upload
- menu upload
- shared storefront publishing
- customer ordering
- owner orders
- kitchen page
- customer tracking
- clean shop links
- Netlify Functions
- Netlify Blobs helper
- build config

## Netlify environment variables
Add:
- NETLIFY_BLOBS_SITE_ID
- NETLIFY_BLOBS_TOKEN

## Netlify build settings
Already included in netlify.toml:
- Build command: npm install
- Publish directory: .
- Functions directory: netlify/functions

## After deploy
1. add the two variables
2. trigger a fresh deploy
3. log in as owner
4. save storefront
5. publish website
6. test /shop/demo-kitchen
