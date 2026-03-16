document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('ordersList');
  const business = MenuFlowDemo.currentBusiness();

  function money(n){ return '$' + Number(n || 0).toFixed(2); }

  async function render(){
    let orders = [];
    try {
      const res = await MenuFlowSharedAPI.getOrders(business.slug);
      orders = (res && res.orders) ? res.orders : [];
    } catch (e) {
      orders = (business && business.orders) ? business.orders : [];
    }

    wrap.innerHTML = orders.length ? orders.map(o => `
      <div class="order">
        <div class="row">
          <div>
            <strong>${o.customerName || 'Customer'}</strong>
            <div class="muted">${o.customerPhone || ''}</div>
            <div class="muted">${new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div class="badge">${o.status}</div>
        </div>
        <div class="muted" style="margin-top:12px">${(o.items || []).map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
        <div class="row" style="margin-top:12px">
          <strong>${money(o.total)}</strong>
          <div class="row">
            ${['New','Preparing','Ready','Completed','Cancelled'].map(s => `<button class="btn ${s===o.status ? '' : 'secondary'}" data-status="${s}" data-id="${o.id}" type="button">${s}</button>`).join('')}
            <a class="btn secondary" href="../storefront/track.html?slug=${encodeURIComponent(business.slug)}&order=${encodeURIComponent(o.id)}&lang=${encodeURIComponent(o.language || 'en')}" target="_blank">Tracking</a>
          </div>
        </div>
        <div class="stack" style="margin-top:12px">
          ${(o.updates || []).slice(0,4).map(u => `<div class="item"><strong>${new Date(u.at).toLocaleString()}</strong><div class="muted" style="margin-top:6px">${u.message}</div></div>`).join('')}
        </div>
      </div>
    `).join('') : '<div class="empty">No orders yet. Place an order from the storefront.</div>';

    wrap.querySelectorAll('[data-status]').forEach(btn => {
      btn.onclick = async () => {
        try {
          await MenuFlowSharedAPI.updateOrderStatus({
            slug: business.slug,
            orderId: btn.dataset.id,
            status: btn.dataset.status
          });
          render();
        } catch (e) {}
      };
    });
  }

  render();
  setInterval(render, 2500);
});
