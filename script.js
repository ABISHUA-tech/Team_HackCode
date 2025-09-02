function sendMessage(event) {
  if (event.key === "Enter") {
    let input = document.getElementById("chatInput");
    let chatbox = document.getElementById("chatbox");

    let userText = input.value.trim();
    if (userText === "") return;

    // Show user message
    let userMsg = document.createElement("p");
    userMsg.innerHTML = "<b>You:</b> " + userText;
    chatbox.appendChild(userMsg);

    // Simple bot response
    let botMsg = document.createElement("p");
    if (userText.toLowerCase().includes("report")) {
      botMsg.innerHTML = "<b>Bot:</b> You can submit a report using the form on the left.";
    } else if (userText.toLowerCase().includes("status")) {
      botMsg.innerHTML = "<b>Bot:</b> Check recent reports below the form.";
    } else {
      botMsg.innerHTML = "<b>Bot:</b> I can help you with reporting issues, checking status, or guidance.";
    }
    chatbox.appendChild(botMsg);

    // Auto-scroll
    chatbox.scrollTop = chatbox.scrollHeight;
    input.value = "";
  }
}
