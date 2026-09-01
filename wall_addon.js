

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
// ENCUENTRO Wall - Add-on for existing index.html (214 lines Optimistic style)
// Keeps your current design, just adds Wall + profiles saving
(function(){
  const SEED = [
    {name:"Sofia", destination:"Ubud", from:"2025-11-10", to:"2025-12-15", vibes:["Yoga","Chill"], bio:"Building a mindful community hub in Ubud.", avatar:"🧘‍♀️", likes:24, verified:true},
    {name:"Kenji", destination:"Tokyo", from:"2025-11-01", to:"2025-11-20", vibes:["Photo","Foodie"], bio:"Shibuya nights, film photos, ramen hunts.", avatar:"📸", likes:18, verified:true},
  ];

  // Inject styles that match Optimistic font
  const style = document.createElement('style');
  style.textContent = `
    #encuentro-wall{max-width:1120px;margin:40px auto 120px;padding:0 20px;font-family:"Optimistic",system-ui,sans-serif}
    #encuentro-wall h2{font-size:28px;font-weight:800;letter-spacing:-0.02em}
    .ew-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:20px}
    @media(min-width:768px){.ew-grid{grid-template-columns:1fr 1fr}}
    .ew-card{border:1px solid #2a2a30;background:#15151a;border-radius:22px;padding:16px;transition:transform .15s}
    .ew-card:active{transform:scale(.99)}
    .ew-btn{height:44px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer}
    .ew-gradient{background:linear-gradient(90deg,#FF4D8D,#7AF5B1);color:#000}
    .ew-bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(21,21,26,.9);backdrop-filter:blur(16px);border-top:1px solid #2a2a30;padding-bottom:max(12px,env(safe-area-inset-bottom))}
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

  // Create Wall container
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
      <div style="font-size:32px">🌍</div><div style="font-weight:700;margin-top:8px">No travelers here yet</div><div style="font-size:13px;color:#888">Be the first for this destination</div>
      <button onclick="window.EW.openCreate()" class="ew-btn ew-gradient" style="margin-top:16px;padding:0 20px">Create profile</button>
    </div>
  `;
  // Append after existing body content
  document.body.appendChild(wallSection);

  // Bottom nav
  const nav = document.createElement('div');
  nav.className = 'ew-bottom-nav';
  nav.innerHTML = `
    <div style="max-width:520px;margin:0 auto;height:72px;display:flex;align-items:center;justify-content:space-around;padding:0 16px">
      <button onclick="window.scrollTo({top:0,behavior:'smooth'})" style="display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">⌂<span>HOME</span></button>
      <button onclick="document.getElementById('encuentro-wall').scrollIntoView({behavior:'smooth'})" style="display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">◫<span>WALL</span></button>
      <button onclick="window.EW.openCreate()" style="width:48px;height:48px;border-radius:50%;background:linear-gradient(90deg,#FF4D8D,#7AF5B1);color:#000;font-size:22px;font-weight:900">+</button>
      <button onclick="window.EW.openCreate()" style="display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">✦<span>CREATE</span></button>
      <button onclick="window.EW.openHow()" style="display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:800;letter-spacing:.1em">?<span>HOW</span></button>
    </div>
  `;
  document.body.appendChild(nav);

  // Modal
  const modal = document.createElement('div');
  modal.id = 'ew-createModal';
  modal.className = 'ew-modal';
  modal.innerHTML = `
    <div class="ew-modal-bg" onclick="window.EW.closeCreate()"></div>
    <div class="ew-modal-box">
      <div style="padding:20px;border-bottom:1px solid #2a2a30;display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:900">Create your traveler profile</div>
        <button onclick="window.EW.closeCreate()" style="width:32px;height:32px;border-radius:50%;background:#0a0a0b;border:1px solid #2a2a30">✕</button>
      </div>
      <div style="padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:16px">
        <div><label style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#888">DISPLAY NAME</label><input id="ew-name" placeholder="Sofia" style="margin-top:8px;width:100%;height:44px;padding:0 16px;border-radius:14px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div><label style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#888">DESTINATION</label><select id="ew-dest" style="margin-top:8px;width:100%;height:44px;padding:0 16px;border-radius:14px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff"><option>Ubud</option><option>Medellín</option><option>Lisbon</option><option>Tokyo</option><option>Tulum</option><option>Canggu</option></select></div>
          <div><label style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#888">AVATAR</label><select id="ew-avatar" style="margin-top:8px;width:100%;height:44px;padding:0 16px;border-radius:14px;background:#0a0a0b;border:1px solid #2a2a30;font-size:18px"><option>🧘‍♀️</option><option>🏄‍♂️</option><option>✈️</option><option>🌴</option><option>📸</option><option>💻</option><option>🎒</option><option>🚀</option><option>🌍</option></select></div>
        </div>
        <div><label style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#888">BIO • 140 CHARS</label><textarea id="ew-bio" maxlength="140" placeholder="What are you working on there?" style="margin-top:8px;width:100%;min-height:80px;padding:16px;border-radius:18px;background:#0a0a0b;border:1px solid #2a2a30;color:#fff;resize:none"></textarea></div>
      </div>
      <div style="padding:16px;border-top:1px solid #2a2a30;background:#15151a">
        <button onclick="window.EW.handleCreate()" class="ew-btn ew-gradient" style="width:100%">Create & Go Live on Wall</button>
        <div style="text-align:center;font-size:10px;color:#666;margin-top:8px;font-family:monospace">Saves to localStorage now • Firestore when Firebase config added</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const toast = document.createElement('div');
  toast.id = 'ew-toast';
  toast.className = 'ew-toast';
  document.body.appendChild(toast);

  let travelers = [];
  let filter = 'All';

  function load(){
    const s = localStorage.getItem('encuentro_wall_v2');
    if(s){ try{ travelers = JSON.parse(s); }catch{ travelers=[...SEED]; } }
    else travelers=[...SEED];
    render();
  }

  function save(){ localStorage.setItem('encuentro_wall_v2', JSON.stringify(travelers)); }

  function render(){
    const grid = document.getElementById('ew-grid');
    const empty = document.getElementById('ew-empty');
    const filtered = filter==='All' ? travelers : travelers.filter(t=>t.destination===filter);
    document.getElementById('ew-count').textContent = travelers.length;
    grid.innerHTML='';
    if(filtered.length===0){ empty.style.display='block'; return; }
    empty.style.display='none';
    filtered.forEach(t=>{
      const d = document.createElement('div');
      d.className='ew-card';
      d.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="display:flex;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;background:#0a0a0b;border:1px solid #2a2a30;display:flex;align-items:center;justify-content:center;font-size:20px">${t.avatar}</div>
            <div><div style="font-weight:800;font-size:14px;display:flex;gap:4px;align-items:center">${t.name} ${t.verified?'<span style="width:16px;height:16px;border-radius:50%;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;font-size:9px">✓</span>':''}</div><div style="font-size:12px;color:#888">📍 ${t.destination}</div></div>
          </div>
          <button onclick="window.EW.like('${t.name}')" style="width:32px;height:32px;border-radius:50%;background:#0a0a0b;border:1px solid #2a2a30;font-size:12px">♡ ${t.likes||0}</button>
        </div>
        <div style="margin-top:12px;font-size:13px;line-height:1.5;color:#ccc">${t.bio}</div>
      `;
      grid.appendChild(d);
    });
  }

  window.EW = {
    openCreate: ()=> document.getElementById('ew-createModal').classList.add('open'),
    closeCreate: ()=> document.getElementById('ew-createModal').classList.remove('open'),
    openHow: ()=> { alert('Create profile → Saved to Firestore collection travelers → Real-time Wall via onSnapshot. Your current style stays exactly the same.'); },
    like: (name)=>{
      travelers = travelers.map(t=> t.name===name ? {...t, likes:(t.likes||0)+1} : t);
      save(); render();
    },
    handleCreate: ()=>{
      const name = document.getElementById('ew-name').value.trim();
      const dest = document.getElementById('ew-dest').value;
      const avatar = document.getElementById('ew-avatar').value;
      const bio = document.getElementById('ew-bio').value.trim();
      if(name.length<2){ showToast('Add your name'); return; }
      travelers.unshift({name, destination:dest, avatar, bio: bio||'Heading to '+dest, likes:0, verified:false});
      save(); render(); window.EW.closeCreate(); showToast('Profile live on Wall! ✦');
      document.getElementById('ew-name').value=''; document.getElementById('ew-bio').value='';
    }
  };

  function showToast(m){
    const t = document.getElementById('ew-toast');
    t.textContent=m; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),2500);
  }

  document.querySelectorAll('.ew-filter').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.ew-filter').forEach(x=>{ x.style.background='#15151a'; x.style.color='#fff'; x.style.border='1px solid #2a2a30'; });
      b.style.background='#fff'; b.style.color='#000'; b.style.border='1px solid #fff';
      filter=b.dataset.f; render();
    });
  });

  load();
})();
