document.addEventListener('DOMContentLoaded', () => {
  const p = new URLSearchParams(location.search);
  const orderId = p.get('order') || '';
  const slug = p.get('slug') || 'demo-kitchen';
  let lang = p.get('lang') || 'en';

  const dict = {
    en: { title:'Order tracking', status:'Status', updates:'MenuFlow updates', back:'Back to storefront', waiting:'Waiting for updates', notFound:'Order not found' },
    es: { title:'Seguimiento del pedido', status:'Estado', updates:'Actualizaciones de MenuFlow', back:'Volver al sitio', waiting:'Esperando actualizaciones', notFound:'Pedido no encontrado' }
  };
  const t = k => dict[lang][k];

  async function paint() {
    try {
      const res = await MenuFlowSharedAPI.getOrder(slug, orderId);
      const order = res.order;
      document.getElementById('title').textContent = t('title');
      document.getElementById('statusLabel').textContent = t('status');
      document.getElementById('statusValue').textContent = order.status;
      document.getElementById('updatesTitle').textContent = t('updates');
      document.getElementById('backBtn').textContent = t('back');
      document.getElementById('backBtn').href = 'index.html?slug=' + encodeURIComponent(slug);
      document.getElementById('updates').innerHTML = (order.updates || []).length ? order.updates.map(u => `
        <div class="item">
          <strong>${new Date(u.at).toLocaleString()}</strong>
          <div class="muted" style="margin-top:6px">${u.message}</div>
        </div>
      `).join('') : `<div class="empty">${t('waiting')}</div>`;
    } catch (err) {
      document.getElementById('title').textContent = t('notFound');
      document.getElementById('updates').innerHTML = `<div class="empty">${t('notFound')}</div>`;
    }
  }

  document.getElementById('langEn').onclick = () => { lang = 'en'; paint(); };
  document.getElementById('langEs').onclick = () => { lang = 'es'; paint(); };
  paint();
  setInterval(paint, 2500);
});
