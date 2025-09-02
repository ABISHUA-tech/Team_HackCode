// === Configuration ===
// Default coordinates for Parul University (used as map center & default report location)
const DEFAULT_COORDS = { lat: 22.3018, lng: 73.1862 };

// Keys to store reports
const STORAGE_KEY = "action7_reports_v1";

// In-memory reports array
let reports = [];

// Leaflet map and temporary pin
let map, tempMarker, markers = [];

// Utility: format time difference
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return sec + " sec" + (sec>1?"s":"") + " ago";
  const min = Math.floor(sec / 60);
  if (min < 60) return min + " min" + (min>1?"s":"") + " ago";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + " hour" + (hr>1?"s":"") + " ago";
  const days = Math.floor(hr / 24);
  return days + " day" + (days>1?"s":"") + " ago";
}

// === Initialization ===
document.addEventListener("DOMContentLoaded", () => {
  // init map
  initMap();

  // load existing reports from localStorage
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      reports = JSON.parse(raw);
      reports.forEach(r => addMarkerForReport(r));
      renderReports();
    } catch (e) {
      console.warn("Failed to parse stored reports", e);
    }
  }

  // wire up UI
  document.getElementById("submitBtn").addEventListener("click", submitReport);
  document.getElementById("resetBtn").addEventListener("click", resetForm);
  document.getElementById("chatInput").addEventListener("keypress", chatKeypress);
  document.getElementById("btnSearch").addEventListener("click", onSearch);
});

// === Map setup using Leaflet + OSM ===
function initMap() {
  map = L.map("map", { zoomControl: true }).setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // default marker for university
  const defaultMarker = L.marker([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng]).addTo(map);
  defaultMarker.bindPopup("<b>Parul University</b>").openPopup();
  markers.push(defaultMarker);

  // map click to set temporary pin and fill location input with coords
  map.on("click", (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    // remove previous temp marker
    if (tempMarker) map.removeLayer(tempMarker);
    tempMarker = L.marker([lat, lng], { opacity: 0.9 }).addTo(map);
    tempMarker.bindPopup("Selected location for new report").openPopup();

    // update location input with lat,lng (user can replace with text if they want)
    const locInput = document.getElementById("locationInput");
    locInput.value = lat.toFixed(5) + ", " + lng.toFixed(5);
    // store coords in input dataset for later use
    locInput.dataset.lat = lat;
    locInput.dataset.lng = lng;
  });
}

// === Submit report ===
function submitReport() {
  const name = (document.getElementById("reporterName").value || "Anonymous").trim();
  const locationText = (document.getElementById("locationInput").value || "").trim();
  const desc = (document.getElementById("issueDesc").value || "").trim();
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

  // Determine coords: if user clicked map (dataset present) use that, otherwise use default coords
  const locInput = document.getElementById("locationInput");
  let lat = locInput.dataset.lat ? parseFloat(locInput.dataset.lat) : DEFAULT_COORDS.lat;
  let lng = locInput.dataset.lng ? parseFloat(locInput.dataset.lng) : DEFAULT_COORDS.lng;

  const id = "R" + Date.now().toString().slice(-7);
  const ts = Date.now();

  // Build file metadata and URL (object URL for demo)
  let fileMeta = null;
  if (file) {
    const url = URL.createObjectURL(file);
    fileMeta = { name: file.name, type: file.type, size: file.size, url };
  }

  const report = {
    id, name, locationText: locationText || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    desc: desc || "(no description)", lat, lng, fileMeta, ts
  };

  // store and render
  reports.unshift(report);
  persistReports();
  renderReports();
  addMarkerForReport(report);

  // reset form but keep map selection cleared
  resetForm();

  alert("Report submitted (demo). ID: " + id);
}

// add marker on map for a report
function addMarkerForReport(r) {
  try {
    const m = L.marker([r.lat, r.lng]).addTo(map);
    markers.push(m);

    let popupHtml = `<strong>${escapeHtml(r.name)}</strong><br>${escapeHtml(r.desc)}<br><small>${escapeHtml(r.locationText)}</small>`;
    if (r.fileMeta) {
      if (r.fileMeta.type && r.fileMeta.type.startsWith("image/")) {
        popupHtml += `<br><img src="${r.fileMeta.url}" style="max-width:180px;display:block;margin-top:6px;border-radius:6px" />`;
      } else if (r.fileMeta.type && r.fileMeta.type.startsWith("video/")) {
        popupHtml += `<br><video controls style="width:200px;margin-top:6px;border-radius:6px"><source src="${r.fileMeta.url}"/></video>`;
      } else {
        popupHtml += `<br><a href="${r.fileMeta.url}" target="_blank" rel="noopener">Download: ${escapeHtml(r.fileMeta.name)}</a>`;
      }
    }
    m.bindPopup(popupHtml);
  } catch (e) {
    console.warn("Failed to add marker", e);
  }
}

// render Recent Reports list
function renderReports() {
  const container = document.getElementById("recentReports");
  container.innerHTML = "";
  if (!reports.length) {
    container.innerHTML = "<div class='muted'>No reports yet.</div>";
    return;
  }

  reports.forEach(r => {
    const row = document.createElement("div");
    row.className = "result";

    const left = document.createElement("div");
    left.className = "left";
    left.innerHTML = `<strong>${escapeHtml(r.name)}</strong>
                      <div>${escapeHtml(r.desc)}</div>
                      <div class="muted" style="margin-top:6px">${escapeHtml(r.locationText)}</div>`;

    const right = document.createElement("div");
    right.className = "right";

    // time and file (if any)
    const timeStr = timeAgo(r.ts);
    let fileHtml = "";
    if (r.fileMeta) {
      if (r.fileMeta.type && r.fileMeta.type.startsWith("image/")) {
        fileHtml = `<div style="margin-top:6px"><img src="${r.fileMeta.url}" alt="${escapeHtml(r.fileMeta.name)}" style="width:120px;height:70px;object-fit:cover;border-radius:6px"/></div>`;
      } else if (r.fileMeta.type && r.fileMeta.type.startsWith("video/")) {
        fileHtml = `<div style="margin-top:6px"><video src="${r.fileMeta.url}" controls style="width:140px;height:80px;object-fit:cover;border-radius:6px"></video></div>`;
      } else {
        fileHtml = `<div style="margin-top:6px"><a href="${r.fileMeta.url}" target="_blank" rel="noopener">Download ${escapeHtml(r.fileMeta.name)}</a></div>`;
      }
    }

    right.innerHTML = `<div class="meta">${escapeHtml(timeStr)}</div>${fileHtml}`;

    row.appendChild(left);
    row.appendChild(right);

    // prepend (we show newest first)
    container.appendChild(row);
  });
}

// persist reports in localStorage
function persistReports() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn("Could not persist reports", e);
  }
}

// reset form
function resetForm() {
  document.getElementById("reporterName").value = "";
  document.getElementById("locationInput").value = "";
  delete document.getElementById("locationInput").dataset.lat;
  delete document.getElementById("locationInput").dataset.lng;
  document.getElementById("issueDesc").value = "";
  const f = document.getElementById("fileUpload");
  f.value = "";
  if (tempMarker) { map.removeLayer(tempMarker); tempMarker = null; }
}

// chat input handler
function chatKeypress(e) {
  if (e.key === "Enter") {
    const val = e.target.value.trim();
    if (!val) return;
    const box = document.getElementById("chatbox");
    box.innerHTML += `<p><b>You:</b> ${escapeHtml(val)}</p>`;

    let reply = "I can help with reporting or checking recent updates. Try 'report' or 'status'.";
    if (val.toLowerCase().includes("report")) reply = "Use the 'Report an Issue' form. Click on map to set location.";
    if (val.toLowerCase().includes("status")) reply = "Recent reports are listed in the 'Recent Reports' panel.";

    box.innerHTML += `<p><b>Bot:</b> ${escapeHtml(reply)}</p>`;
    box.scrollTop = box.scrollHeight;
    e.target.value = "";
  }
}

// search handler (very simple - searches description or name)
function onSearch() {
  const q = (document.getElementById("globalSearch").value || "").trim().toLowerCase();
  if (!q) { renderReports(); return; }
  const filtered = reports.filter(r => {
    return (r.name && r.name.toLowerCase().includes(q)) ||
           (r.desc && r.desc.toLowerCase().includes(q)) ||
           (r.locationText && r.locationText.toLowerCase().includes(q));
  });
  // render filtered list
  const container = document.getElementById("recentReports");
  container.innerHTML = "";
  if (!filtered.length) { container.innerHTML = `<div class="muted">No matches for "${escapeHtml(q)}"</div>`; return; }
  filtered.forEach(r => {
    const row = document.createElement("div");
    row.className = "result";
    const left = document.createElement("div");
    left.className = "left";
    left.innerHTML = `<strong>${escapeHtml(r.name)}</strong><div>${escapeHtml(r.desc)}</div><div class="muted" style="margin-top:6px">${escapeHtml(r.locationText)}</div>`;
    const right = document.createElement("div");
    right.className = "right";
    right.innerHTML = `<div class="meta">${escapeHtml(timeAgo(r.ts))}</div>`;
    row.appendChild(left); row.appendChild(right);
    container.appendChild(row);
  });
}

// Basic HTML-escape helper to avoid script injection in the demo
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
