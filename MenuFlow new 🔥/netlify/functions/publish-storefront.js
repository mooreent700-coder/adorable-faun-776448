const { getBlobsStore } = require('./_store');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ ok:false, error:'Method not allowed' }) };
    }
    const body = JSON.parse(event.body || '{}');
    const business = body.business;
    if (!business || !business.slug) {
      return { statusCode: 400, body: JSON.stringify({ ok:false, error:'Missing business or slug' }) };
    }
    const store = getBlobsStore('published-storefronts');
    await store.set(business.slug, JSON.stringify(business));
    return { statusCode: 200, body: JSON.stringify({ ok:true, slug: business.slug }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
