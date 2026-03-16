window.MenuFlowDemo = (() => {
  const KEY = 'menuflow_phase4_root_fixed_v1';

  function initial(){
    return {
      users:[{id:'u_demo',fullName:'Demo Owner',email:'owner@demo.com',password:'password123',businessId:'b_demo'}],
      businesses:[{
        id:'b_demo',
        name:'Demo Kitchen',
        slug:'demo-kitchen',
        ownerEmail:'owner@demo.com',
        heroTitle:'Fresh comfort food made to order',
        heroSubtitle:'Premium ordering for food businesses powered by MenuFlow.',
        heroImage:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
        menuItems:[{
          id:'m1',category:'Bowls',name:'Jerk Chicken Bowl',description:'Grilled chicken, jasmine rice, greens, mango salsa.',price:14,
          image:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',available:true
        }],
        orders:[]
      }],
      session:null
    };
  }
  function load(){try{const raw=localStorage.getItem(KEY); if(raw) return JSON.parse(raw);}catch(e){} const s=initial(); localStorage.setItem(KEY, JSON.stringify(s)); return s;}
  function save(db){localStorage.setItem(KEY, JSON.stringify(db)); return db;}
  function uid(prefix='id'){return prefix+'_'+Math.random().toString(36).slice(2,9);}
  function slugify(v){return (v||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
  function siteLink(b){return `${location.origin}/storefront/index.html?slug=${encodeURIComponent(b.slug)}`;}
  function signup(payload){
    const db=load(); const email=(payload.email||'').trim().toLowerCase(); const slug=slugify(payload.slug||payload.businessName||'');
    if(!payload.fullName||!email||!payload.password||!payload.businessName||!slug) throw new Error('Fill out all fields');
    if(db.users.some(u=>u.email.toLowerCase()===email)) throw new Error('Email already exists');
    if(db.businesses.some(b=>b.slug===slug)) throw new Error('Slug already exists');
    const businessId=uid('b'), userId=uid('u');
    db.businesses.push({id:businessId,name:payload.businessName.trim(),slug,ownerEmail:email,heroTitle:payload.businessName.trim(),heroSubtitle:'Welcome to your MenuFlow storefront.',heroImage:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',menuItems:[],orders:[]});
    db.users.push({id:userId,fullName:payload.fullName.trim(),email,password:payload.password,businessId});
    db.session=userId; save(db); return {ok:true,userId,businessId,slug};
  }
  function login(payload){
    const db=load(); const email=(payload.email||'').trim().toLowerCase(); const user=db.users.find(u=>u.email.toLowerCase()===email && u.password===payload.password);
    if(!user) throw new Error('Invalid email or password');
    db.session=user.id; save(db); return {ok:true,userId:user.id,businessId:user.businessId};
  }
  function logout(){const db=load(); db.session=null; save(db);}
  function currentUser(){const db=load(); return db.users.find(u=>u.id===db.session)||null;}
  function currentBusiness(){const db=load(); const user=currentUser(); return user ? db.businesses.find(b=>b.id===user.businessId)||null : null;}
  function businessBySlug(slug){const db=load(); return db.businesses.find(b=>b.slug===slug)||null;}
  function updateBusiness(patch){const db=load(); const user=currentUser(); const i=db.businesses.findIndex(b=>b.id===user.businessId); db.businesses[i]={...db.businesses[i],...patch}; save(db); return db.businesses[i];}
  function addMenuItem(item){const db=load(); const user=currentUser(); const b=db.businesses.find(x=>x.id===user.businessId); b.menuItems.unshift({id:uid('m'),available:true,...item}); save(db); return b.menuItems[0];}
  function toggleMenuItem(id){const db=load(); const user=currentUser(); const b=db.businesses.find(x=>x.id===user.businessId); const item=b.menuItems.find(m=>m.id===id); if(item) item.available=!item.available; save(db);}
  function deleteMenuItem(id){const db=load(); const user=currentUser(); const b=db.businesses.find(x=>x.id===user.businessId); b.menuItems=b.menuItems.filter(m=>m.id!==id); save(db);}
  function createOrder(slug,payload){
    const db=load();
    const business=db.businesses.find(b=>b.slug===slug);
    if(!business) return null;
    const order={
      id:uid('o'),
      customerName:payload.customerName||'',
      customerPhone:payload.customerPhone||'',
      items:payload.items||[],
      total:Number(payload.total||0),
      status:'New',
      language:payload.language||'en',
      createdAt:new Date().toISOString(),
      updates:[{
        at:new Date().toISOString(),
        message:(payload.language==='es'?'MenuFlow: Recibimos tu pedido.':'MenuFlow: We received your order.')
      }]
    };
    business.orders.unshift(order);
    save(db);
    return order;
  }
  function findOrder(id){
    const db=load();
    for(const business of db.businesses){
      const found=(business.orders||[]).find(o=>o.id===id);
      if(found) return found;
    }
    return null;
  }
  function updateOrderStatus(orderId,status){
    const db=load();
    const user=currentUser();
    if(!user) return null;
    const business=db.businesses.find(b=>b.id===user.businessId);
    const order=(business.orders||[]).find(o=>o.id===orderId);
    if(!order) return null;
    order.status=status;
    const es=order.language==='es';
    const map={
      New: es ? 'MenuFlow: Recibimos tu pedido y lo estamos revisando.' : 'MenuFlow: We received your order and we are reviewing it.',
      Preparing: es ? 'MenuFlow: Tu pedido se está preparando ahora.' : 'MenuFlow: Your order is being prepared now.',
      Ready: es ? 'MenuFlow: Tu pedido está listo para recoger.' : 'MenuFlow: Your order is ready for pickup.',
      Completed: es ? 'MenuFlow: Tu pedido fue completado. Gracias.' : 'MenuFlow: Your order was completed. Thank you.',
      Cancelled: es ? 'MenuFlow: Tu pedido fue cancelado.' : 'MenuFlow: Your order was cancelled.'
    };
    if(!Array.isArray(order.updates)) order.updates=[];
    order.updates.unshift({at:new Date().toISOString(), message: map[status] || status});
    save(db);
    return order;
  }
  async function fileToDataUrl(file,maxW=1400,quality=.82){
    return await new Promise((resolve,reject)=>{const r=new FileReader(); r.onload=()=>{const img=new Image(); img.onload=()=>{const scale=Math.min(1,maxW/(img.width||maxW)); const w=Math.round(img.width*scale), h=Math.round(img.height*scale); const c=document.createElement('canvas'); c.width=w; c.height=h; c.getContext('2d').drawImage(img,0,0,w,h); resolve(c.toDataURL('image/jpeg',quality));}; img.onerror=reject; img.src=r.result;}; r.onerror=reject; r.readAsDataURL(file);});
  }
  return {load,save,signup,login,logout,currentUser,currentBusiness,businessBySlug,updateBusiness,addMenuItem,toggleMenuItem,deleteMenuItem,createOrder,findOrder,updateOrderStatus,fileToDataUrl,slugify,siteLink};
})();
