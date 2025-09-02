// Tabs
const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.tabpane');
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));
  t.classList.add('active');
  document.getElementById(t.dataset.tab).classList.add('active');
  document.getElementById('compactResults').innerHTML = '';
}));

// Simple in-memory reports & Leaflet map init
let reports = []; let markers = []; let map;

document.addEventListener('DOMContentLoaded', () => {
  // init map - Parul University coords
  map = L.map('map', {scrollWheelZoom: false}).setView([22.3018, 73.1862], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  }).addTo(map);

  // Add a tiny marker for Parul University default
  L.marker([22.3018,73.1862]).addTo(map).bindPopup('Parul University (Default)').openPopup();

  // start bot
  botNext();
});

// handle report submit
function handleReport(e){
  e.preventDefault();
  const type = document.getElementById('issueType').value;
  const area = document.getElementById('area').value;
  const priority = document.getElementById('priority').value;
  const date = document.getElementById('date').value || '—';

  const id = 'CIV' + Date.now().toString().slice(-6);
  const r = { id, type, area, priority, date, ts: new Date(), loc:{lat:22.3018,lon:73.1862} };
  reports.unshift(r);
  renderCompactResults();
  // marker
  const m = L.marker([r.loc.lat, r.loc.lon]).addTo(map).bindPopup(`<b>${r.type}</b><br>${r.area}<br>ID: ${r.id}`);
  markers.push(m);
  alert('Demo: Report submitted — ID: ' + id);
  e.target.reset();
  return false;
}

// render compact results below form
function renderCompactResults(){
  const out = document.getElementById('compactResults');
  out.innerHTML = '';
  reports.slice(0,4).forEach(r => {
    const div = document.createElement('div');
    div.className = 'result';
    div.innerHTML = `<div>
      <div><strong>${r.type} — ${r.area}</strong></div>
      <div class="meta">${r.date} • Priority: ${r.priority}</div>
    </div>
    <div><small>ID: ${r.id}</small></div>`;
    out.appendChild(div);
  });
}

// track handler
function handleTrack(e){
  e.preventDefault();
  const id = document.getElementById('issueId').value.trim().toUpperCase();
  const phone = document.getElementById('phone').value.trim();
  if(!id || !phone){ alert('Enter Issue ID and phone'); return false; }
  // fake tracking result
  document.getElementById('compactResults').innerHTML =
    `<div class="result"><div><strong>Status for ${id}</strong><div class="meta">Assigned • Technician en-route • ETA 02:30 hrs</div></div><div><small>SLA: 48h</small></div></div>`;
  return false;
}

/* --- CivicBot (simple demo messages) --- */
const botMessages = [
  "Hi — I'm CivicBot. I explain how to use this system.",
  "One-click reporting: choose issue and ward, attach photo (optional).",
  "Auto-routing: system forwards to right department automatically.",
  "Track your issue with the generated ID. SLA timers help transparency.",
  "Impact: faster fixes, cleaner neighborhoods, better civic trust."
];
let botIndex = 0;
function botNext(){
  const box = document.getElementById('chatbox');
  if(botIndex < botMessages.length){
    const p = document.createElement('p'); p.textContent = botMessages[botIndex++];
    box.appendChild(p); box.scrollTop = box.scrollHeight;
  } else {
    const p = document.createElement('p'); p.textContent = 'End of demo.';
    box.appendChild(p);
  }
}
function botReset(){ document.getElementById('chatbox').innerHTML = ''; botIndex = 0; botNext(); }
