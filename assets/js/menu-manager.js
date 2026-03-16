document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('menuForm');
  const list = document.getElementById('menuList');
  const menuPublishStatus = document.getElementById('menuPublishStatus');

  function liveLink(slug) {
    return location.origin + '/shop/' + slug;
  }

  async function autoPublish() {
    const business = MenuFlowDemo.currentBusiness();
    menuPublishStatus.textContent = 'Auto publishing website...';
    try {
      await MenuFlowSharedAPI.publishStorefront(business);
      localStorage.setItem('mf_published_' + business.slug, 'true');
      menuPublishStatus.textContent = 'Website live. Share this business link: ' + liveLink(business.slug);
      document.querySelectorAll('[data-site-link]').forEach(el => el.textContent = liveLink(business.slug));
      document.querySelectorAll('[data-site-href]').forEach(el => el.href = liveLink(business.slug));
    } catch (err) {
      localStorage.setItem('mf_published_' + business.slug, 'false');
      menuPublishStatus.textContent = 'Website is not live yet. This deploy needs Netlify Functions built from Git or CLI.';
    }
  }

  function render() {
    const b = MenuFlowDemo.currentBusiness();
    list.innerHTML = (b.menuItems || []).length ? b.menuItems.map(i => `
      <div class="item">
        <div class="row">
          <div>
            <strong>${i.name}</strong>
            <div class="muted">${i.category || ''} • $${Number(i.price || 0).toFixed(2)}</div>
          </div>
          <div class="row">
            <button class="btn secondary" data-toggle="${i.id}" type="button">${i.available ? 'Mark Sold Out' : 'Make Available'}</button>
            <button class="btn secondary" data-del="${i.id}" type="button">Delete</button>
          </div>
        </div>
        ${i.image ? `<img src="${i.image}" style="margin-top:12px;width:100%;max-width:320px;height:220px;object-fit:cover;border-radius:14px">` : ''}
        <div class="muted" style="margin-top:10px">${i.description || ''}</div>
      </div>
    `).join('') : '<div class="empty">No items uploaded yet.</div>';

    list.querySelectorAll('[data-toggle]').forEach(btn => btn.onclick = async () => {
      MenuFlowDemo.toggleMenuItem(btn.dataset.toggle);
      render();
      await autoPublish();
    });
    list.querySelectorAll('[data-del]').forEach(btn => btn.onclick = async () => {
      MenuFlowDemo.deleteMenuItem(btn.dataset.del);
      render();
      await autoPublish();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = form.image.files[0];
    let image = '';
    if (file) image = await MenuFlowDemo.fileToDataUrl(file);
    MenuFlowDemo.addMenuItem({
      category: form.category.value.trim(),
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: Number(form.price.value || 0),
      image
    });
    form.reset();
    render();
    await autoPublish();
  });

  const publishBtn = document.getElementById('publishMenuBtn');
  if (publishBtn) {
    publishBtn.textContent = 'Publish Now';
    publishBtn.onclick = autoPublish;
  }

  render();
});
