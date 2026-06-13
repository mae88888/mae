const http = require('http');

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Savanah KTV Chatbot</title>
  <style>
    body { font-family: Arial, sans-serif; background:#111; color:white; text-align:center; padding:40px; }
    .box { max-width:600px; margin:auto; background:#222; padding:25px; border-radius:12px; }
    input { width:75%; padding:12px; border-radius:8px; border:0; }
    button { padding:12px 18px; border:0; border-radius:8px; cursor:pointer; }
    #chat { text-align:left; min-height:250px; background:#000; padding:15px; border-radius:8px; margin-bottom:15px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Savanah KTV Chatbot</h1>
    <div id="chat">Bot: Hi! Welcome to Savanah KTV. How can I help?</div>
    <input id="msg" placeholder="Type your message..." />
    <button onclick="send()">Send</button>
  </div>

  <script>
    function send() {
      const input = document.getElementById('msg');
      const chat = document.getElementById('chat');
      const text = input.value.trim();
      if (!text) return;

      chat.innerHTML += '<br><br>You: ' + text;

      let reply = "Thanks for your message! Someone from Savanah KTV will help you soon.";

      if (text.toLowerCase().includes("price")) reply = "Please contact us for current pricing and package details.";
      if (text.toLowerCase().includes("hours")) reply = "Our hours may vary. Please contact us to confirm today’s schedule.";
      if (text.toLowerCase().includes("booking")) reply = "You can request a booking by sending your name, date, time, and group size.";

      chat.innerHTML += '<br>Bot: ' + reply;
      input.value = '';
    }
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
