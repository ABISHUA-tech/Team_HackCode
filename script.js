// Tab toggles
const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.tabpane');
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));
  t.classList.add('active');
  document.getElementById(t.dataset.tab).classList.add('active');
  document.getElementById('compactResults').innerHTML = '';
}));

// In-memory reports + Leaflet init
let reports = []; let markers = []; let map;

document.addEventListener('DOMContentLoaded', () => {
  // init map - Parul University coords
  map = L.map('map', {scrollWheelZoom: false}).setView([22.3018, 73.1862], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  }).addTo(map);

  // default marker for Parul University
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

  const id = 'CIV' + Date.now
