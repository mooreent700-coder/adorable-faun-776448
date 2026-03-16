document.addEventListener('DOMContentLoaded', () => {
  const business = MenuFlowDemo.currentBusiness();
  if (!business) return;

  const bizName = document.getElementById('bizName');
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroPreview = document.getElementById('heroPreview');
  const heroPreviewTitle = document.getElementById('heroPreviewTitle');
  const heroPreviewSubtitle = document.getElementById('heroPreviewSubtitle');
  const publishStatus = document.getElementById('publishStatus');

  function liveLink(slug) {
    return location.origin + '/shop/' + slug;
  }

  function markPublished(slug, ok) {
    localStorage.setItem('mf_published_' + slug, ok ? 'true' : 'false');
    document.querySelectorAll('[data-site-link]').forEach(el => {
      el.textContent = ok ? liveLink(slug) : 'Website not live yet. Save/publish first.';
    });
    document.querySelectorAll('[data-site-href]').forEach(el => {
      el.href = ok ? liveLink(slug) : '#';
    });
  }

  function paint() {
    const b = MenuFlowDemo.currentBusiness();
    bizName.value = b.name || '';
    heroTitle.value = b.heroTitle || '';
    heroSubtitle.value = b.heroSubtitle || '';
    heroPreview.src = b.heroImage || '';
    heroPreviewTitle.textContent = b.heroTitle || b.name || '';
    heroPreviewSubtitle.textContent = b.heroSubtitle || '';
    document.querySelectorAll('[data-biz-name]').forEach(el => el.textContent = b.name || '');
    document.querySelectorAll('[data-biz-slug]').forEach(el => el.textContent = b.slug || '');
    const published = localStorage.getItem('mf_published_' + b.slug) === 'true';
    markPublished(b.slug, published);
  }

  async function autoPublish() {
    const b = MenuFlowDemo.currentBusiness();
    publishStatus.textContent = 'Auto publishing website...';
    try {
      await MenuFlowSharedAPI.publishStorefront(b);
      markPublished(b.slug, true);
      publishStatus.textContent = 'Website live. Share this business link: ' + liveLink(b.slug);
    } catch (err) {
      markPublished(b.slug, false);
      publishStatus.textContent = 'Website is not live yet. This deploy needs Netlify Functions built from Git or CLI.';
    }
  }

  document.getElementById('saveBiz').onclick = async () => {
    const file = document.getElementById('heroFile').files[0];
    const patch = {
      name: bizName.value.trim(),
      heroTitle: heroTitle.value.trim(),
      heroSubtitle: heroSubtitle.value.trim()
    };
    if (file) patch.heroImage = await MenuFlowDemo.fileToDataUrl(file);
    MenuFlowDemo.updateBusiness(patch);
    paint();
    await autoPublish();
  };

  const publishBtn = document.getElementById('publishWebsiteBtn');
  if (publishBtn) {
    publishBtn.textContent = 'Publish Now';
    publishBtn.onclick = autoPublish;
  }

  paint();
});
