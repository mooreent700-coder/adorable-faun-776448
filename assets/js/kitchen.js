document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('kitchenList');
  const business = MenuFlowDemo.currentBusiness();

  async function render(){
    let orders = [];
    try {
      const res = await MenuFlowSharedAPI.getOrders(business.slug);
      orders = (res && res.orders) ? res.orders : [];
    } catch (e) {
      orders = (business && business.orders) ? business.orders : [];
    }
    orders = orders.filter(o => !['Completed','Cancelled'].includes(o.status));

    wrap.innerHTML = orders.length ? orders.map(o => `
      <div class="order">
        <strong>${o.status}</strong>
        <div style="margin-top:10px;font-size:20px">${o.customerName || 'Customer'}</div>
        <div class="muted" style="margin-top:8px">${(o.items || []).map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
        <div class="row" style="margin-top:14px">
          <button class="btn secondary" data-status="Preparing" data-id="${o.id}" type="button">Preparing</button>
          <button class="btn" data-status="Ready" data-id="${o.id}" type="button">Ready</button>
          <button class="btn secondary" data-status="Completed" data-id="${o.id}" type="button">Completed</button>
        </div>
      </div>
    `).join('') : '<div class="empty">No active orders.</div>';

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
