import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const PORT = 3000;

const handleListening = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

function onSocketClose() {
  console.log("❌ Disconnected to Browser 🕋");
}

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("✅ Connected to Browser 🖥");
  socket.on("close", onSocketClose);
  socket.on("message", (messageEvent) => {
    const message = JSON.parse(messageEvent);
    switch (message.type) {
      case "message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload.toString()}`));
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, handleListening);
