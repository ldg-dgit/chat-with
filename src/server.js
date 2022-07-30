import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const socketioServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(socketioServer, {
  auth: false,
});

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

function countUser(roomName) {
  return socketioServer.sockets.adapter.rooms.get(roomName)?.size;
}

socketioServer.on("connection", (socket) => {
  socket["username"] = "Anonymous";
  socket.on("enter_room", (roomName, showRoom) => {
    socket.join(roomName);
    showRoom();
    socket.to(roomName).emit("roomname", socket.username, countUser(roomName));
    socketioServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.username, countUser(room) - 1));
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

const handleListen = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

httpServer.listen(PORT, handleListen);
