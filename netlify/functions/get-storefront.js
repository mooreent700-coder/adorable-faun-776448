const { getBlobsStore } = require('./_store');

exports.handler = async (event) => {
  try {
    const slug = event.queryStringParameters && event.queryStringParameters.slug;
    if (!slug) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing slug' }) };
    }
    const store = getBlobsStore('published-storefronts');
    const raw = await store.get(slug, { type: 'text' });
    if (!raw) {
      return { statusCode: 404, body: JSON.stringify({ ok:false, error:'Storefront not found' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok:true, business: JSON.parse(raw) }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
