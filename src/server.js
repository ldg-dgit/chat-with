import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const PORT = 3000;

const handleListening = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

const httpServer = http.createServer(app);
const socketioServer = SocketIO(httpServer);

socketioServer.on("connection", (socket) => {
  console.log(socket);
});

/*
const sockets = [];

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
*/

httpServer.listen(3000, handleListening);
