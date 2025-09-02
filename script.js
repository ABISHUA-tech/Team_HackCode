// Chatbot simulation
function sendMessage(event) {
  if (event.key === "Enter") {
    const input = document.getElementById("chatInput");
    const chatbox = document.getElementById("chatbox");
    const msg = input.value.trim();
    if (msg) {
      chatbox.innerHTML += `<p><b>You:</b> ${msg}</p>`;
      // Simple bot response
      if (msg.toLowerCase().includes("report")) {
        chatbox.innerHTML += `<p><b>Bot:</b> Click on "Report an Issue" card and fill the form to report.</p>`;
      } else if (msg.toLowerCase().includes("update")) {
        chatbox.innerHTML += `<p><b>Bot:</b> Check "Recent Reports" for the latest updates.</p>`;
      } else {
        chatbox.innerHTML += `<p><b>Bot:</b> I’m here to help you with reporting or tracking issues.</p>`;
      }
      chatbox.scrollTop = chatbox.scrollHeight;
      input.value = "";
    }
  }
}

// File upload handling
const fileInput = document.getElementById("fileUpload");
const recentReports = document.getElementById("recentReports");

// Mock username
const username = "User123";

if (fileInput) {
  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const fileName = this.files[0].name;
      const now = new Date();
      const timeAgo = "Just now";

      const newReport = document.createElement("div");
      newReport.className = "result";
      newReport.innerHTML = `<span>${username} uploaded: ${fileName}</span><span class="meta">${timeAgo}</span>`;

      recentReports.prepend(newReport);
      alert("File uploaded successfully (demo).");
      this.value = ""; // reset input
    }
  });
}

// Google Maps initialization
function initMap() {
  const parulUniversity = { lat: 22.2966, lng: 73.3639 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: parulUniversity,
  });
  new google.maps.Marker({
    position: parulUniversity,
    map: map,
    title: "Parul University",
  });
}
