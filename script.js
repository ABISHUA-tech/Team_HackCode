let reports = [];
let map, markers = [];

document.addEventListener("DOMContentLoaded", () => {
  // Init map at Parul University, Vadodara
  map = L.map("map").setView([22.3018, 73.1862], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  renderReports();
});

function handleSubmit(e){
  e.preventDefault();
  const type = document.getElementById("issueType").value;
  const title = document.getElementById("title").value;
  const details = document.getElementById("details").value;

  const report = {
    id: Date.now(),
    type, title, details,
    location: {lat:22.3018, lon:73.1862}, // Default: Parul University
    ts: new Date()
  };
  reports.unshift(report);
  renderReports();
  e.target.reset();
}

function renderReports(){
  // Update count
  document.getElementById("kpi-count").textContent = reports.length;

  // Update list
  const list = document.getElementById("reportList");
  list.innerHTML = "";
  reports.forEach(r => {
    const div = document.createElement("div");
    div.className = "report-item";
    div.innerHTML = `<strong>${r.title}</strong><br>
      <span style="font-size:12px;color:#9aa4b2">${r.type} • ${r.ts.toLocaleString()}</span><br>
      <span>${r.details || ""}</span>`;
    list.appendChild(div);
  });

  // Update markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  reports.forEach(r => {
    const m = L.marker([r.location.lat, r.location.lon]).addTo(map)
      .bindPopup(`<b>${r.title}</b><br>${r.type}`);
    markers.push(m);
  });
}
