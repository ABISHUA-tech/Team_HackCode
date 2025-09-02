// Tabs (Report / Track) — IRCTC-like switcher
const tabs = document.querySelectorAll(".tab");
const panes = document.querySelectorAll(".tabpane");
tabs.forEach(t => {
  t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    panes.forEach(p => p.classList.remove("active"));
    t.classList.add("active");
    const id = t.dataset.tab;
    document.getElementById(id + "Tab").classList.add("active");
    // clear results on tab switch
    document.getElementById("results").innerHTML = "";
  });
});

// Handle "Report Issue" submission
function handleReport(e){
  e.preventDefault();
  const type = document.getElementById("issueType").value;
  const area = document.getElementById("area").value;
  const date = document.getElementById("date").value || "—";
  const priority = document.getElementById("priority").value;

  // Mocked results list (like IRCTC train list below the card)
  const results = document.getElementById("results");
  results.innerHTML = `
    <div class="result-row">
      <div>
        <div class="result-title">${type} — ${area}</div>
        <div class="result-sub" style="color:#6b7586;font-size:13px">Visit date: ${date}</div>
      </div>
      <div><span class="badge">Priority: ${priority}</span></div>
      <div class="cta">
        <button class="btn btn-outline" onclick="alert('Demo: queued for assessment')">Queue</button>
        <button class="btn btn-primary" onclick="alert('Demo: booked city team')">Assign Team</button>
      </div>
    </div>
    <div class="result-row">
      <div>
        <div class="result-title">Nearest Sanitation Team</div>
        <div class="result-sub" style="color:#6b7586;font-size:13px">ETA 4–6 hrs • Ward Office 5</div>
      </div>
      <div><span class="badge" style="background:#eef2ff;color:#233a87">Availability: High</span></div>
      <div class="cta">
        <button class="btn btn-outline" onclick="alert('Demo: view team details')">View</button>
        <button class="btn btn-primary" onclick="alert('Demo: request dispatch')">Request</button>
      </div>
    </div>
  `;
  return false;
}

// Handle "Track Issue"
function handleTrack(e){
  e.preventDefault();
  const id = document.getElementById("issueId").value.trim().toUpperCase();
  const phone = document.getElementById("phone").value.trim();
  if(!id || !phone){ return false; }
  const results = document.getElementById("results");
  results.innerHTML = `
    <div class="result-row">
      <div>
        <div class="result-title">Status for ${id}</div>
        <div class="result-sub" style="color:#6b7586;font-size:13px">Assigned • Technician en-route • ETA 02:30 hrs</div>
      </div>
      <div><span class="badge">SLA: 48h</span></div>
      <div class="cta">
        <button class="btn btn-outline" onclick="alert('Demo: contact team')">Contact</button>
        <button class="btn btn-primary" onclick="alert('Demo: receive SMS updates')">Notify Me</button>
      </div>
    </div>
  `;
  return false;
}
