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

function onSocketClose() {
  console.log("❌ Disconnected to Browser 🕋");
}

function onSocketMessage(message) {
  console.log(message.toString());
}

wss.on("connection", (socket) => {
  console.log("✅ Connected to Browser 🖥");
  socket.on("close", onSocketClose);
  socket.on("message", onSocketMessage);
  socket.send("hello from the Server!");
});

server.listen(3000, handleListening);
