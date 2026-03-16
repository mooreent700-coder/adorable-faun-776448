document.addEventListener('DOMContentLoaded', async () => {
  const p = new URLSearchParams(location.search);
  const current = MenuFlowDemo.currentBusiness();
  const slug = p.get('slug') || (current ? current.slug : 'demo-kitchen');

  let cart = [];
  let biz = null;

  function money(n){ return '$' + Number(n || 0).toFixed(2); }

  function syncCartButton() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartBtn').textContent = `View Order (${count})`;
    document.getElementById('cartTotal').textContent = money(cart.reduce((sum, item) => sum + item.qty * Number(item.price), 0));
  }

  function renderCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cart.length) {
      cartItems.innerHTML = '<div class="empty">No items in your order yet.</div>';
      syncCartButton();
      return;
    }

    cartItems.innerHTML = cart.map((item, idx) => `
      <div class="item">
        <div class="row">
          <div>
            <strong>${item.name}</strong>
            <div class="muted">${money(item.price)} each</div>
          </div>
          <strong>${money(item.qty * item.price)}</strong>
        </div>
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" data-minus="${idx}" type="button">−</button>
          <span>${item.qty}</span>
          <button class="btn secondary" data-plus="${idx}" type="button">+</button>
        </div>
      </div>
    `).join('');

    cartItems.querySelectorAll('[data-minus]').forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.minus);
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        renderCart();
      };
    });

    cartItems.querySelectorAll('[data-plus]').forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.plus);
        cart[idx].qty += 1;
        renderCart();
      };
    });

    syncCartButton();
  }

  function addToOrder(item) {
    const found = cart.find(x => x.id === item.id);
    if (found) found.qty += 1;
    else cart.push({ id:item.id, name:item.name, price:Number(item.price || 0), qty:1 });
    syncCartButton();
  }

  function renderBusiness(b) {
    document.getElementById('heroImage').src = b.heroImage || '';
    document.getElementById('heroTitle').textContent = b.heroTitle || b.name;
    document.getElementById('heroSubtitle').textContent = b.heroSubtitle || '';
    document.getElementById('slugPill').textContent = b.slug;
    document.title = b.name + ' Storefront';

    const menuGrid = document.getElementById('menuGrid');
    const items = b.menuItems || [];
    menuGrid.innerHTML = items.length ? items.map(i => `
      <div class="card stack">
        ${i.image ? `<img src="${i.image}" style="width:100%;height:220px;object-fit:cover;border-radius:14px">` : ''}
        <div class="row"><strong>${i.name}</strong><strong>${money(i.price)}</strong></div>
        <div class="muted">${i.category || ''}</div>
        <div class="muted">${i.description || ''}</div>
        <div class="row">
          <div class="badge">${i.available ? 'Ready to order' : 'Sold Out'}</div>
          <button class="btn" data-add="${i.id}" type="button" ${!i.available ? 'disabled' : ''}>Add to Order</button>
        </div>
      </div>
    `).join('') : '<div class="empty">No menu items uploaded yet.</div>';

    menuGrid.querySelectorAll('[data-add]').forEach(btn => {
      btn.onclick = () => {
        const item = items.find(x => x.id === btn.dataset.add);
        if (!item || !item.available) return;
        addToOrder(item);
      };
    });
  }

  // 1) shared published storefront from Netlify functions
  try {
    const res = await MenuFlowSharedAPI.getStorefront(slug);
    if (res && res.ok && res.business) biz = res.business;
  } catch (e) {}

  // 2) local fallback for owner's own device
  if (!biz) {
    biz = MenuFlowDemo.businessBySlug(slug);
  }

  // 3) old published file fallback
  if (!biz) {
    try {
      const res = await fetch('../assets/data/published-businesses.json');
      const data = await res.json();
      biz = (data.businesses || []).find(b => b.slug === slug) || null;
    } catch (e) {}
  }

  if (!biz) {
    document.getElementById('heroTitle').textContent = 'Storefront not found';
    document.getElementById('heroSubtitle').textContent = 'This shared link does not match a published storefront yet.';
    document.getElementById('menuGrid').innerHTML = '<div class="empty">No published storefront found for this slug.</div>';
    return;
  }

  renderBusiness(biz);

  document.getElementById('cartBtn').onclick = () => {
    renderCart();
    document.getElementById('cartModal').classList.add('show');
  };

  document.getElementById('closeCart').onclick = () => {
    document.getElementById('cartModal').classList.remove('show');
  };

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const orderMsg = document.getElementById('orderMsg');
    if (!cart.length) {
      orderMsg.textContent = 'Add items to your order first.';
      return;
    }
    const form = e.currentTarget;
    const customerName = form.customerName.value.trim();
    const customerPhone = form.customerPhone.value.trim();
    if (!customerName || !customerPhone) {
      orderMsg.textContent = 'Enter your name and phone.';
      return;
    }

    try {
      const res = await MenuFlowSharedAPI.createOrder({
        slug,
        customerName,
        customerPhone,
        items: cart.map(i => ({ name:i.name, qty:i.qty, price:i.price })),
        total: cart.reduce((sum, i) => sum + i.qty * i.price, 0),
        language: 'en'
      });
      cart = [];
      form.reset();
      renderCart();
      syncCartButton();
      document.getElementById('cartModal').classList.remove('show');
      location.href = `track.html?slug=${encodeURIComponent(slug)}&order=${encodeURIComponent(res.order.id)}&lang=en`;
    } catch (err) {
      orderMsg.textContent = 'Order failed on this device. Deploy on Netlify with functions enabled.';
    }
  });

  syncCartButton();
});
