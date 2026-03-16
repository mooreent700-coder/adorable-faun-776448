# Netlify setup

Environment variables:
- NETLIFY_BLOBS_SITE_ID = your Netlify Project ID
- NETLIFY_BLOBS_TOKEN = your Netlify Personal Access Token

Build settings:
- Build command: npm install
- Publish directory: .
- Functions directory: netlify/functions

Redeploy:
- Trigger deploy
- Clear cache and deploy site
