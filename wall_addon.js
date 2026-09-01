// ENCUENTRO Wall - Add-on for existing index.html
(function(){
  const SEED = [
    {name:"Sofia", destination:"Ubud", from:"2025-11-10", to:"2025-12-15", vibes:["Yoga","Chill"], bio:"Building a mindful community hub in Ubud.", avatar:"🧘‍♀️", likes:24, verified:true},
    {name:"Kenji", destination:"Tokyo", from:"2025-11-01", to:"2025-11-20", vibes:["Photo","Foodie"], bio:"Shibuya nights, film photos, ramen hunts.", avatar:"📸", likes:18, verified:true},
    {name:"Lucia", destination:"Medellín", from:"2025-12-01", to:"2026-01-10", vibes:["Music","Dance"], bio:"Salsa, coffee tours, making new friends.", avatar:"💃", likes:31, verified:true},
  ];
  const style = document.createElement('style');
  style.textContent = `
    #encuentro-wall{max-width:1120px;margin:40px auto 120px;padding:0 20px;font-family:"Optimistic",system-ui,sans-serif}
    #encuentro-wall h2{font-size:28px;font-weight:800;letter-spacing:-0.02em;color:#fff}
    .ew-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:20px}
    @media(min-width:768px){.ew-grid{grid-template-columns:1fr 1fr}}
    .ew-card{border:1px solid #2a2a30;background:#15151a;border-radius:22px;padding:16px}
    .ew-btn{height:44px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;border:0}
    .ew-gradient{background:linear-gradient(90deg,#FF4D8D,#7AF5B1);color:#000}
    .ew-bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(21,21,26,.92);backdrop-filter:blur(16px);border-top:1px solid #2a2a30;padding-bottom:max(12px,env(safe-area-inset-bottom))}
    .ew-modal{position:fixed;inset:0;z-index:70;display:none}
    .ew-modal.open{display:flex;align-items:flex-end}
    @media(min-width:768px){.ew-modal.open{align-items:center;justify-content:center}}
    .ew-modal-bg{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px)}
    .ew-modal-box{position:relative;width:100%;max-width:520px;background:#15151a;border:1px solid #2a2a30;border-radius:28px 28px 0 0;max-height:90vh;display:flex;flex-direction:column}
    @media(min-width:768px){.ew-modal-box{border-radius:28px}}
    .ew-toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#fff;color:#000;padding:10px 16px;border-radius:999px;font-weight:700;font-size:13px;display:none;z-index:80}
    .ew-toast.show{display:block}
  `;
  document.head.appendChild(style);
  const wallSection = document.createElement('section');
  wallSection.id = 'encuentro-wall';
  wallSection.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h2>Encuentro Wall</h2>
      <div style="font-size:12px;color:#888"><span id="ew-count">0</span> travelers</div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;overflow-x:auto;padding-bottom:8px" id="ew-filters">
      <button data-f="All" class="ew-filter ew-btn" style="padding:0 16px;background:#fff;color:#000">All</button>
      <button data-f="Ubud" class="ew-filter ew-btn" style="padding:0 16px;background:#15151a;border:1px solid #2a2a30;color:#fff">Ubud</button>
      <button data-f="Medellín" class="ew-filter ew-btn" style="padding:0 16px;background:#15151a;border:1px solid #2a2a30;color:#fff">Medellín</button>
      <button data-f="Lisbon" class="ew-filter ew-btn" style="padding:0 16px;background:#15151a;border:1px solid #2a2a30;color:#fff">Lisbon</button>
      <button data-f="Tokyo" class="ew-filter ew-btn" style="padding:0 16px;background:#15151a;border:1px solid #2a2a30;color:#fff">Tokyo</button>
    </div>
    <div class="ew-grid" id="ew-grid"></div>
    <div id="ew-empty" style="display:none;text-align:center;padding:40px;background:#15151a;border:1px solid #2a2a30;border-radius:22px;margin-top:20px">
      <div style="font-size:32px">🌍</div><div style="font-weight:700;margin-top:8px;color:#fff">No travelers here yet</div><div style="font-size:13px;color:#888">Be the first for this destination</div>
      <button onclick="window.EW.openCreate()" class="ew-btn ew-gradient" style="margin-top:16px;padding:0 20px">Create profile</button>
    </div>
  `;
  document.body.appendChild(wallSection);
  const nav = document.createElement('div');
  nav.className = 'ew-bottom-nav';
  nav.innerHTML = `
    <div style="max-width:520px;margin:0 auto;height:72px;display:flex;align-items:center;justify-content:space-around;padding:0 16px;color:#fff">
      <button onclick="window.scrollTo({top:0,behavior:'smooth'})" style="background:0;border:0;color:#fff;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">⌂<span>HOME</span></button>
      <button onclick="document.getElementById('encuentro-wall').scrollIntoView({behavior:'smooth'})" style="background:0;border:0;color:#fff;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">◫<span>WALL</span></button>
      <button onclick="window.EW.openCreate()" style="width:48px;height:48px;border-radius:50%;background:linear-gradient(90deg,#FF4D8D,#7AF5B1);color:#000;font-size:22px;font-weight:900;border:0">+</button>
      <button onclick="window.EW.openCreate()" style="background:0;border:0;color:#fff;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">✦<span>CREATE</span></button>
      <button onclick="window.EW.openHow()" style="background:0;border:0;color:#fff;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">?<span>HOW</span></button>
    </div>`;
  document.body.appendChild(nav);
  const modal=document.createElement('div');modal.id='ew-createModal';modal.className='ew-modal';
  modal.innerHTML=`<div class="ew-modal-bg" onclick="window.EW.closeCreate()"></div><div class="ew-modal-box"><div style="padding:20px;border-bottom:1px solid #2a2a30;display:flex;justify-content:space-between;align-items:center"><div style="font-weight:900;color:#fff">Create your traveler profile</div><button onclick="window.EW.closeCreate()" style="width:32px;height:32px;border-radius:50%;background:#0a0a0b;border:1px solid #2a2a30;color:#fff">✕</button></div><div style="padding:20px;display:flex;flex-direction:column;gap:16px"><div><label style="font-size:11px;font-weight:800;color:#888">DISPLAY NAME</label><input id="ew-name" placeholder="Sofia" style="margin-top:8px;width:100%;height:44px;padding:0 16px;border-radius:14px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff"></div><div><label style="font-size:11px;font-weight:800;color:#888">DESTINATION</label><select id="ew-dest" style="margin-top:8px;width:100%;height:44px;padding:0 16px;border-radius:14px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff"><option>Ubud</option><option>Medellín</option><option>Lisbon</option><option>Tokyo</option></select></div><div><label style="font-size:11px;font-weight:800;color:#888">BIO</label><textarea id="ew-bio" placeholder="What are you working on there?" style="margin-top:8px;width:100%;min-height:80px;padding:16px;border-radius:18px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff"></textarea></div></div><div style="padding:16px;border-top:1px solid #2a2a30"><button onclick="window.EW.handleCreate()" class="ew-btn ew-gradient" style="width:100%">Create & Go Live on Wall</button></div></div>`;
  document.body.appendChild(modal);
  const toast=document.createElement('div');toast.id='ew-toast';toast.className='ew-toast';document.body.appendChild(toast);
  let travelers=JSON.parse(localStorage.getItem('encuentro_wall_v2')||'null')||SEED;
  let filter='All';
  function save(){localStorage.setItem('encuentro_wall_v2',JSON.stringify(travelers));}
  function render(){
    const grid=document.getElementById('ew-grid');
    const filtered=filter==='All'?travelers:travelers.filter(t=>t.destination===filter);
    document.getElementById('ew-count').textContent=travelers.length;
    const empty=document.getElementById('ew-empty');
    grid.innerHTML='';
    if(filtered.length===0){empty.style.display='block';return;} else {empty.style.display='none';}
    filtered.forEach(t=>{
      const d=document.createElement('div');d.className='ew-card';
      d.innerHTML=`<div style="display:flex;justify-content:space-between"><div style="display:flex;gap:12px"><div style="width:44px;height:44px;border-radius:50%;background:#0a0a0b;border:1px solid #2a2a30;display:flex;align-items:center;justify-content:center;font-size:20px">${t.avatar}</div><div><div style="font-weight:800;font-size:14px;color:#fff">${t.name} ${t.verified?'✓':''}</div><div style="font-size:12px;color:#888">📍 ${t.destination}</div></div></div><button onclick="window.EW.like('${t.name}')" style="width:56px;height:32px;border-radius:999px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff">♡ ${t.likes||0}</button></div><div style="margin-top:12px;font-size:13px;color:#ccc">${t.bio}</div>`;
      grid.appendChild(d);
    });
  }
  window.EW={
    openCreate:()=>document.getElementById('ew-createModal').classList.add('open'),
    closeCreate:()=>document.getElementById('ew-createModal').classList.remove('open'),
    openHow:()=>{const t=document.getElementById('ew-toast');t.textContent='Encuentro = meet travelers going same place';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);},
    like:(n)=>{travelers=travelers.map(t=>t.name===n?{...t,likes:(t.likes||0)+1}:t);save();render();},
    handleCreate:()=>{
      const name=document.getElementById('ew-name').value.trim();
      const dest=document.getElementById('ew-dest').value;
      const bio=document.getElementById('ew-bio').value.trim();
      if(name.length<2){const t=document.getElementById('ew-toast');t.textContent='Add your name';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);return;}
      travelers.unshift({name,destination:dest,avatar:"✈️",bio:bio||'Heading to '+dest,likes:0});
      save();render();window.EW.closeCreate();
      const tt=document.getElementById('ew-toast');tt.textContent='Profile live on Wall! ✦';tt.classList.add('show');setTimeout(()=>tt.classList.remove('show'),2500);
      document.getElementById('ew-name').value='';document.getElementById('ew-bio').value='';
    }
  };
  document.querySelectorAll('.ew-filter').forEach(b=>b.addEventListener('click',e=>{
    filter=e.target.dataset.f;
    document.querySelectorAll('.ew-filter').forEach(x=>{x.style.background='#15151a';x.style.color='#fff';});
    e.target.style.background='#fff';e.target.style.color='#000';
    render();
  }));
  render();
})();
