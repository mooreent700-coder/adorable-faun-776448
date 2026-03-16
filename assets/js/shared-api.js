window.MenuFlowSharedAPI = {
  async publishStorefront(business){
    const res = await fetch('/.netlify/functions/publish-storefront', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ business })
    });
    if (!res.ok) throw new Error('Publish failed');
    return await res.json();
  },

  async getStorefront(slug){
    const res = await fetch('/.netlify/functions/get-storefront?slug=' + encodeURIComponent(slug));
    if (!res.ok) throw new Error('Storefront fetch failed');
    return await res.json();
  },

  async createOrder(payload){
    const res = await fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Create order failed');
    return await res.json();
  },

  async getOrders(slug){
    const res = await fetch('/.netlify/functions/get-orders?slug=' + encodeURIComponent(slug));
    if (!res.ok) throw new Error('Get orders failed');
    return await res.json();
  },

  async updateOrderStatus(payload){
    const res = await fetch('/.netlify/functions/update-order-status', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Update order failed');
    return await res.json();
  },

  async getOrder(slug, orderId){
    const res = await fetch('/.netlify/functions/get-order?slug=' + encodeURIComponent(slug) + '&orderId=' + encodeURIComponent(orderId));
    if (!res.ok) throw new Error('Get order failed');
    return await res.json();
  }
};
