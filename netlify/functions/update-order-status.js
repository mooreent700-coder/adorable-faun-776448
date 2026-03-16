const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ ok:false, error:'Method not allowed' }) };
    }
    const body = JSON.parse(event.body || '{}');
    if (!body.slug || !body.orderId || !body.status) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing slug, orderId, or status' }) };
    }

    const store = getStore('orders');
    const key = 'orders_' + body.slug;
    const raw = await store.get(key, { type: 'text' });
    const orders = raw ? JSON.parse(raw) : [];
    const order = orders.find(o => o.id === body.orderId);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ ok:false, error:'Order not found' }) };
    }

    order.status = body.status;
    const es = order.language === 'es';
    const messages = {
      New: es ? 'MenuFlow: Recibimos tu pedido y lo estamos revisando.' : 'MenuFlow: We received your order and we are reviewing it.',
      Preparing: es ? 'MenuFlow: Tu pedido se está preparando ahora.' : 'MenuFlow: Your order is being prepared now.',
      Ready: es ? 'MenuFlow: Tu pedido está listo para recoger.' : 'MenuFlow: Your order is ready for pickup.',
      Completed: es ? 'MenuFlow: Tu pedido fue completado. Gracias.' : 'MenuFlow: Your order was completed. Thank you.',
      Cancelled: es ? 'MenuFlow: Tu pedido fue cancelado.' : 'MenuFlow: Your order was cancelled.'
    };
    if (!Array.isArray(order.updates)) order.updates = [];
    order.updates.unshift({ at: new Date().toISOString(), message: messages[body.status] || body.status });

    await store.set(key, JSON.stringify(orders));
    return { statusCode: 200, body: JSON.stringify({ ok:true, order }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
