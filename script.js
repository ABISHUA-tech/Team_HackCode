function sendMessage(event) {
  if (event.key === "Enter") {
    let input = document.getElementById("chatInput");
    let chatbox = document.getElementById("chatbox");

    let userText = input.value.trim();
    if (userText === "") return;

    // User message
    let userMsg = document.createElement("p");
    userMsg.innerHTML = "<b>You:</b> " + userText;
    chatbox.appendChild(userMsg);

    // Bot reply
    let botMsg = document.createElement("p");
    if (userText.toLowerCase().includes("report")) {
      botMsg.innerHTML = "<b>Bot:</b> You can submit a report using the form on the left.";
    } else if (userText.toLowerCase().includes("status")) {
      botMsg.innerHTML = "<b>Bot:</b> You can check recent reports below the form.";
    } else {
      botMsg.innerHTML = "<b>Bot:</b> I can help you with reporting issues, checking status, or guiding you.";
    }
    chatbox.appendChild(botMsg);

    // Scroll
    chatbox.scrollTop = chatbox.scrollHeight;
    input.value = "";
  }
}
