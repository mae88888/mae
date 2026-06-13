const http = require("http");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const businessInfo = `
Savanah KTV information:
- Price: 150 pesos per hour.
- Location: Tangnan, Loon, Bohol.
- Hours: Open daily from 4:00 PM to 11:00 PM.
- Booking: Only 1 karaoke room for now, so guests should book ahead.
- Good for birthdays.
- Capacity: good for up to 10 pax.
- Features: unlimited songs, airconditioned, sound proof.
`;

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Savanah KTV Chatbot</title>
  <style>
    body { font-family: Arial, sans-serif; background:#111; color:white; text-align:center; padding:20px; }
    .box { max-width:600px; margin:auto; background:#222; padding:25px; border-radius:12px; }
    #chat { text-align:left; min-height:300px; background:#000; padding:15px; border-radius:8px; margin-bottom:15px; overflow-y:auto; }
    input { width:75%; padding:12px; border-radius:8px; border:0; }
    button { padding:12px 18px; border:0; border-radius:8px; cursor:pointer; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Savanah KTV Chatbot</h1>
    <div id="chat">Bot: Hi! Welcome to Savanah KTV. How can I help?</div>
    <input id="msg" placeholder="Type your message..." onkeydown="if(event.key==='Enter')send()" />
    <button onclick="send()">Send</button>
  </div>

  <script>
    async function send() {
      const input = document.getElementById('msg');
      const chat = document.getElementById('chat');
      const message = input.value.trim();
      if (!message) return;

      chat.innerHTML += '<br><br><b>You:</b> ' + message;
      input.value = '';
      chat.innerHTML += '<br><b>Bot:</b> Thinking...';

      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      chat.innerHTML = chat.innerHTML.replace('Thinking...', data.reply);
      chat.scrollTop = chat.scrollHeight;
    }
  </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(html);
  }

  if (req.method === "POST" && req.url === "/chat") {
    let body = "";
    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      try {
        const { message } = JSON.parse(body);

        const response = await client.responses.create({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content:
                "You are a friendly chatbot for Savanah KTV. Answer only using the business information provided. Be warm, short, and helpful. If asked to book, ask for name, date, time, and number of guests. " + businessInfo
            },
            {
              role: "user",
              content: message
            }
          ]
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply: response.output_text }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply: "Sorry, I had trouble answering. Please try again." }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port " + PORT));
