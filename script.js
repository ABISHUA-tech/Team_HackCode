// Initialize map with Parul University location
function initMap() {
  const parulUni = [22.2966, 73.3639];
  const map = L.map("map").setView(parulUni, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker(parulUni).addTo(map).bindPopup("Parul University").openPopup();

  window.leafletMap = map;
}
initMap();

// Handle report submission
function submitReport() {
  const location = document.getElementById("locationInput").value.trim();
  const desc = document.getElementById("descInput").value.trim();
  const file = document.getElementById("fileUpload").files[0];
  const user = document.getElementById("userInput").value.trim() || "Anonymous";

  if (!location || !desc) {
    alert("Please fill location and description.");
    return;
  }

  const now = new Date();
  const timeAgo = "Just now";

  const reportText = `${user} reported: ${desc} (${location})`;

  const newReport = document.createElement("div");
  newReport.className = "result";
  newReport.innerHTML = `<span>${reportText}</span><span class="meta">${timeAgo}</span>`;

  const recentReports = document.getElementById("recentReports");
  if (recentReports.firstChild && recentReports.firstChild.textContent === "No reports yet") {
    recentReports.innerHTML = "";
  }
  recentReports.prepend(newReport);

  // Add marker to map
  if (window.leafletMap) {
    L.marker([22.2966, 73.3639])
      .addTo(window.leafletMap)
      .bindPopup(`${desc} - ${location}`)
      .openPopup();
  }

  // Reset form
  document.getElementById("locationInput").value = "";
  document.getElementById("descInput").value = "";
  document.getElementById("fileUpload").value = "";
  document.getElementById("userInput").value = "";
}

// AI Assistant
function sendMessage(event) {
  if (event.key === "Enter") {
    const input = document.getElementById("chatInput");
    const chatbox = document.getElementById("chatbox");
    const msg = input.value.trim();
    if (msg) {
      chatbox.innerHTML += `<p><b>You:</b> ${msg}</p>`;
      if (msg.toLowerCase().includes("report")) {
        chatbox.innerHTML += `<p><b>Bot:</b> Use the form on the left to submit your issue.</p>`;
      } else if (msg.toLowerCase().includes("update")) {
        chatbox.innerHTML += `<p><b>Bot:</b> Check the 'Recent Reports' section for latest updates.</p>`;
      } else {
        chatbox.innerHTML += `<p><b>Bot:</b> I can help you with reporting or checking updates.</p>`;
      }
      chatbox.scrollTop = chatbox.scrollHeight;
      input.value = "";
    }
  }
}

// Search reports
function searchReports() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const reports = document.querySelectorAll("#recentReports .result");
  reports.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
}
