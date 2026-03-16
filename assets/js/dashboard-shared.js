document.addEventListener('DOMContentLoaded', () => {
  const user = MenuFlowDemo.currentUser();
  const business = MenuFlowDemo.currentBusiness();
  if (!user) {
    location.href = '../login.html';
    return;
  }
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.fullName);
  document.querySelectorAll('[data-biz-name]').forEach(el => el.textContent = business.name);
  document.querySelectorAll('[data-biz-slug]').forEach(el => el.textContent = business.slug);
  document.querySelectorAll('[data-site-link]').forEach(el => el.textContent = MenuFlowDemo.siteLink(business));
  document.querySelectorAll('[data-site-href]').forEach(el => el.href = MenuFlowDemo.siteLink(business));
  const logout = document.getElementById('logoutBtn');
  if (logout) logout.onclick = () => { MenuFlowDemo.logout(); location.href = '../login.html'; };
  const copy = document.getElementById('copyWebsiteBtn');
  if (copy) copy.onclick = async () => {
    try { await navigator.clipboard.writeText(MenuFlowDemo.siteLink(business)); copy.textContent='Copied'; setTimeout(()=>copy.textContent='Copy Website Link',1200);} catch(e){}
  };
});

document.addEventListener('DOMContentLoaded', () => {
  const business = MenuFlowDemo.currentBusiness && MenuFlowDemo.currentBusiness();
  if (!business) return;
  const publishedKey = 'mf_published_' + business.slug;
  const published = localStorage.getItem(publishedKey) === 'true';
  document.querySelectorAll('[data-site-link]').forEach(el => {
    el.textContent = published ? (location.origin + '/shop/' + business.slug) : 'Website not live yet. Save/publish first.';
  });
  document.querySelectorAll('[data-site-href]').forEach(el => {
    el.href = published ? (location.origin + '/shop/' + business.slug) : '#';
    if (!published) el.setAttribute('aria-disabled', 'true');
  });
});
