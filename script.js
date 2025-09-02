let reports = [];
let map, markers = [];

// AI Bot demo messages
const botMessages = [
  "Hi! 👋 I'm CivicBot, your smart city guide.",
  "Feature 1: One-click reporting with GPS 📍",
  "Feature 2: Real-time map with live issues 🗺️",
  "Feature 3: Automated routing to departments ⚡",
  "Feature 4: Analytics & heatmaps for admins 📊",
  "Together, we make cities cleaner & smarter 🌱"
];
let botIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([22.3018, 73.1862], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);
  renderReports();
  botNext();
});

function handleSubmit(e){
  e.preventDefault();
  const type = document.getElementById("issueType").value;
  const title = document.getElementById("title").value;

  const report = {
    id: Date.now(),
    type, title,
    location: {lat:22.3018, lon:73.1862},
    ts: new Date()
  };
  reports.unshift(report);
  renderReports();
  e.target.reset();
}

function renderReports(){
  document.getElementById("kpi-count").textContent = reports.length;
  const list = document.getElementById("reportList");
  list.innerHTML = "";
  reports.forEach(r => {
    const div = document.createElement("div");
    div.className = "report-item";
    div.innerHTML = `<strong>${r.title}</strong><br>
      <span style="font-size:12px;color:#9aa4b2">${r.type} • ${r.ts.toLocaleString()}</span>`;
    list.appendChild(div);
  });
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  reports.forEach(r => {
    const m = L.marker([r.location.lat, r.location.lon]).addTo(map)
      .bindPopup(`<b>${r.title}</b><br>${r.type}`);
    markers.push(m);
  });
}

// AI Bot function
function botNext(){
  const box = document.getElementById("chatbox");
  if(botIndex < botMessages.length){
    const p = document.createElement("p");
    p.textContent = botMessages[botIndex];
    box.appendChild(p);
    botIndex++;
  } else {
    const p = document.createElement("p");
    p.textContent = "✅ End of demo. Thanks for listening!";
    box.appendChild(p);
  }
}
