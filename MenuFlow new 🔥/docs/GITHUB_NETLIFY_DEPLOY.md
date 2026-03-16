# GitHub → Netlify Deploy Checklist

## Before deploy
- push this project to GitHub
- confirm these files exist:
  - package.json
  - netlify.toml
  - netlify/functions/
  - storefront/
  - dashboard/
  - assets/

## In Netlify
- Add new site
- Import from Git
- Pick GitHub repo
- Confirm build settings

### Recommended settings
- Base directory: leave blank
- Build command: leave blank
- Publish directory: `.`
- Functions directory: `netlify/functions`

## After deploy
Open these paths:

### Homepage
`/`

### Owner dashboard
`/dashboard/index.html`

### Storefront
`/shop/demo-kitchen`

### Function health check
`/.netlify/functions/get-storefront?slug=demo-kitchen`

## Success signs
- Save Storefront does not show function error
- Publish Now succeeds
- Shared storefront on another device loads real hero/menu
- Customer orders appear on owner orders page
- Kitchen page shows active orders
