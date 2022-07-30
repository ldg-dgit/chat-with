import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const socketioServer = SocketIO(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = socketioServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

socketioServer.on("connection", (socket) => {
  socket["username"] = "Anonymous";

  socket.on("enter_room", (roomName, showRoom) => {
    socket.join(roomName);
    showRoom();
    socket.to(roomName).emit("roomname", socket.username);
    socketioServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.username));
  });
  socket.on("disconnecting", () => {
    socketioServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("message", (message, room, done) => {
    socket.to(room).emit("message", `${socket.username} : ${message}`);
    done();
  });
  socket.on("username", (username, done) => {
    socket["username"] = username;
    done();
  });
});

/*
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});
*/

const handleListen = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

httpServer.listen(PORT, handleListen);
