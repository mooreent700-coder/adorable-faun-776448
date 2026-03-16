const { getBlobsStore } = require('./_store');

exports.handler = async (event) => {
  try {
    const slug = event.queryStringParameters && event.queryStringParameters.slug;
    if (!slug) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing slug' }) };
    }
    const store = getBlobsStore('orders');
    const raw = await store.get('orders_' + slug, { type: 'text' });
    const orders = raw ? JSON.parse(raw) : [];
    return { statusCode: 200, body: JSON.stringify({ ok:true, orders }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
