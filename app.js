// ── Nav scroll ──────────────────────────────────────────────────
const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>80);
  parallaxHero();
});
// ── Parallax ────────────────────────────────────────────────────
function parallaxHero(){const s=window.scrollY;const bg=document.getElementById('heroBg');if(bg)bg.style.transform=`scale(1.1) translateY(${s*0.3}px)`}
// ── Scroll reveal ───────────────────────────────────────────────
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// ── Hero slideshow ──────────────────────────────────────────────
const slides=['assets/hero_villa.png','assets/property_villa.png','assets/property_mansion.png'];
let si=0;
const heroBg=document.getElementById('heroBg');
setInterval(()=>{si=(si+1)%slides.length;heroBg.style.opacity='0';setTimeout(()=>{heroBg.style.backgroundImage=`url('${slides[si]}')`;heroBg.style.opacity='1'},600)},5000);
heroBg.style.transition='opacity .6s ease, transform .1s linear';
// ── Format price ────────────────────────────────────────────────
function fmtPrice(p){
  if(p>=10000000) return '₹'+(p/10000000).toFixed(1).replace(/\.0$/,'')+' Cr';
  if(p>=100000) return '₹'+(p/100000).toFixed(1).replace(/\.0$/,'')+' L';
  return '₹'+p.toLocaleString('en-IN');
}
// ── Render properties ───────────────────────────────────────────
let activeFilter='All';
function renderCards(filter='All'){
  activeFilter=filter;
  const grid=document.getElementById('propertyGrid');
  const filtered=filter==='All'?PROPERTIES:PROPERTIES.filter(p=>p.type===filter||p.city===filter);
  grid.innerHTML='';
  filtered.forEach((p,i)=>{
    const card=document.createElement('a');
    card.className='property-card reveal';
    card.href='#';
    card.setAttribute('data-id',p.id);
    card.style.animationDelay=(-i*1.3)+'s';
    card.innerHTML=`
      <div class="card-img">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="card-badge">${p.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-type">${p.type}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-loc"><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" onclick="event.stopPropagation()"><img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Map" style="width:16px;height:16px;vertical-align:middle;margin-right:4px">${p.location}</a></div>
        <div class="card-price">${fmtPrice(p.price)}</div>
        <div class="card-specs">
          <div class="spec"><svg viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"/></svg>${p.bedrooms} Beds</div>
          <div class="spec"><svg viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33"/></svg>${p.bathrooms} Baths</div>
          <div class="spec"><svg viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>${p.sqft.toLocaleString()} sqft</div>
        </div>
      </div>`;
    card.addEventListener('click',e=>{e.preventDefault();openModal(p)});
    grid.appendChild(card);
    setTimeout(()=>io.observe(card),10);
  });
}
renderCards();
// ── Filters ─────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.filter);
  });
});
// ── Search ──────────────────────────────────────────────────────
document.getElementById('searchBtn').addEventListener('click',()=>{
  const loc=document.getElementById('sLoc').value;
  const type=document.getElementById('sType').value;
  const price=parseInt(document.getElementById('sPrice').value)||Infinity;
  const beds=parseInt(document.getElementById('sBeds').value)||0;
  const results=PROPERTIES.filter(p=>{
    const locOk=!loc||p.city===loc||p.location.toLowerCase().includes(loc.toLowerCase());
    const typeOk=!type||p.type===type;
    const priceOk=p.price<=price;
    const bedsOk=p.bedrooms>=beds;
    return locOk&&typeOk&&priceOk&&bedsOk;
  });
  const grid=document.getElementById('propertyGrid');grid.innerHTML='';
  results.forEach(p=>{
    const card=document.createElement('a');card.className='property-card reveal';card.href='#';
    card.innerHTML=`<div class="card-img"><img src="${p.image}" alt="${p.title}"><span class="card-badge">${p.badge}</span></div><div class="card-body"><div class="card-type">${p.type}</div><div class="card-title">${p.title}</div><div class="card-loc"><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" onclick="event.stopPropagation()"><img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Map" style="width:14px;height:14px;vertical-align:middle;margin-right:4px">${p.location}</a></div><div class="card-price">${fmtPrice(p.price)}</div></div>`;
    card.addEventListener('click',e=>{e.preventDefault();openModal(p)});
    grid.appendChild(card);
    setTimeout(()=>io.observe(card),10);
  });
  if(!results.length)grid.innerHTML='<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:60px">No properties found. Try adjusting your filters.</p>';
  document.getElementById('listings').scrollIntoView({behavior:'smooth'});
});
// ── Modal ───────────────────────────────────────────────────────
const backdrop=document.getElementById('modalBackdrop');
function openModal(p){
  document.getElementById('mImg').src=p.image;
  document.getElementById('mImg').alt=p.title;
  document.getElementById('mBadge').textContent=p.badge;
  document.getElementById('mType').textContent=p.type;
  document.getElementById('mYear').textContent='Built '+p.yearBuilt;
  document.getElementById('mTitle').textContent=p.title;
  document.getElementById('mLoc').textContent=p.location;
  document.getElementById('mPrice').textContent=fmtPrice(p.price);
  document.getElementById('mBeds').textContent=p.bedrooms+' Beds';
  document.getElementById('mBaths').textContent=p.bathrooms+' Baths';
  document.getElementById('mSqft').textContent=p.sqft.toLocaleString()+' sqft';
  document.getElementById('mGarage').textContent=p.garage+' Garage';
  document.getElementById('mDesc').textContent=p.description;
  document.getElementById('mFeatures').innerHTML=p.features.map(f=>`<div class="feature-tag">${f}</div>`).join('');
  backdrop.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){backdrop.classList.remove('open');document.body.style.overflow='';}
document.getElementById('modalClose').addEventListener('click',closeModal);
backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
// Removed unused button listeners
// ── Mortgage Calculator ──────────────────────────────────────────
const priceIn=document.getElementById('calcPrice'),dpIn=document.getElementById('calcDp'),rateIn=document.getElementById('calcRate'),termIn=document.getElementById('calcTerm');
const priceV=document.getElementById('priceVal'),dpV=document.getElementById('dpVal'),rateV=document.getElementById('rateVal'),termV=document.getElementById('termVal');
const monthly=document.getElementById('monthlyPay'),principal=document.getElementById('principalPay'),interest=document.getElementById('interestPay'),total=document.getElementById('totalPay');
function calcMortgage(){
  const P=parseInt(priceIn.value)||0;const dpPct=parseInt(dpIn.value)||0;const r=parseFloat(rateIn.value)||0;const t=parseInt(termIn.value)||30;
  priceV.textContent=fmtPrice(P);dpV.textContent=dpPct+'%';rateV.textContent=r.toFixed(1)+'%';termV.textContent=t+' yr';
  const loan=P*(1-dpPct/100);const mo=r/100/12;const n=t*12;
  const m=mo>0?loan*(mo*Math.pow(1+mo,n))/(Math.pow(1+mo,n)-1):loan/n;
  const tot=m*n;const int=tot-loan;
  monthly.textContent=fmtPrice(Math.round(m));
  principal.textContent=fmtPrice(loan);
  interest.textContent=fmtPrice(int);
  total.textContent=fmtPrice(tot);
}
[priceIn,dpIn,rateIn,termIn].forEach(el=>el.addEventListener('input',calcMortgage));
calcMortgage();
// ── Map ──────────────────────────────────────────────────────────
function initMap(){
  if(!window.L)return;
  const map=L.map('map',{zoomControl:false}).setView([19.076, 72.877], 5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; CartoDB'}).addTo(map);
  L.control.zoom({position:'bottomright'}).addTo(map);
  const goldIcon=L.divIcon({className:'',html:`<div style="width:14px;height:14px;background:#c9a96e;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 4px rgba(201,169,110,0.3);animation:pulse 2s infinite"></div>`,iconSize:[14,14]});
  PROPERTIES.forEach(p=>{
    const mk=L.marker([p.lat,p.lng],{icon:goldIcon}).addTo(map);
    mk.bindPopup(`<div style="background:#111827;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;min-width:200px;color:#f0ede8;font-family:Inter,sans-serif"><div style="font-size:.7rem;color:#c9a96e;text-transform:uppercase;letter-spacing:1px">${p.type}</div><div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin:4px 0">${p.title}</div><div style="color:#c9a96e;font-size:1rem;margin-top:8px">${fmtPrice(p.price)}</div></div>`,{className:'custom-popup'});
    mk.on('click',()=>openModal(p));
  });
}
// ── Agents ───────────────────────────────────────────────────────
function renderAgents(){
  const grid=document.getElementById('agentsGrid');
  AGENTS.forEach(a=>{
    const card=document.createElement('div');card.className='agent-card reveal';
    card.innerHTML=`<img src="${a.image}" alt="${a.name}" class="agent-img"><div class="agent-name">${a.name}</div><div class="agent-title">${a.title}</div><div style="font-size:.75rem;color:var(--text-muted);margin-bottom:12px">${a.specialization}</div><div class="agent-stats"><div><div class="agent-stat-num">${a.listings}</div><div class="agent-stat-label">Listings</div></div><div><div class="agent-stat-num">${a.sales}</div><div class="agent-stat-label">Total Sales</div></div><div><div class="agent-stat-num">${a.rating}</div><div class="agent-stat-label">Rating</div></div></div><div class="agent-contact"><a href="tel:${a.phone}">📞 ${a.phone}</a><a href="mailto:${a.email}">✉ ${a.email}</a></div>`;
    grid.appendChild(card);io.observe(card);
  });
}
renderAgents();
// ── Contact form ─────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const toast=document.getElementById('toast');toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3500);
  e.target.reset();
});
// ── Smooth scroll links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
  });
});
