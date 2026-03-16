const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    const slug = event.queryStringParameters && event.queryStringParameters.slug;
    const orderId = event.queryStringParameters && event.queryStringParameters.orderId;
    if (!slug || !orderId) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing slug or orderId' }) };
    }
    const store = getStore('orders');
    const raw = await store.get('orders_' + slug, { type: 'text' });
    const orders = raw ? JSON.parse(raw) : [];
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ ok:false, error:'Order not found' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok:true, order }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
