const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ ok:false, error:'Method not allowed' }) };
    }
    const body = JSON.parse(event.body || '{}');
    if (!body.slug) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing slug' }) };
    }
    const store = getStore('orders');
    const key = 'orders_' + body.slug;
    const existing = await store.get(key, { type: 'text' });
    const orders = existing ? JSON.parse(existing) : [];
    const order = {
      id: 'o_' + Math.random().toString(36).slice(2, 9),
      customerName: body.customerName || '',
      customerPhone: body.customerPhone || '',
      items: body.items || [],
      total: Number(body.total || 0),
      status: 'New',
      language: body.language || 'en',
      slug: body.slug,
      createdAt: new Date().toISOString(),
      updates: [{
        at: new Date().toISOString(),
        message: body.language === 'es' ? 'MenuFlow: Recibimos tu pedido.' : 'MenuFlow: We received your order.'
      }]
    };
    orders.unshift(order);
    await store.set(key, JSON.stringify(orders));
    return { statusCode: 200, body: JSON.stringify({ ok:true, order }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
