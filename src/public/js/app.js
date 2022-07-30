const socket = io();

const username = document.querySelector("#username");
const usernameForm = username.querySelector("form");
const roomname = document.querySelector("#roomname");
const room = document.querySelector("#room");

roomname.hidden = true;
room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  const value = input.value;
  socket.emit("message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

function showChat() {
  const h3 = room.querySelector("h3");
  const messageForm = room.querySelector("#message");
  roomname.hidden = true;
  room.hidden = false;
  h3.innerText = `Room : ${roomName}`;
  messageForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomname.querySelector("input");
  socket.emit("enter_room", input.value, showChat);
  roomName = input.value;
  input.value = "";
}

function showRoom() {
  username.hidden = true;
  roomname.hidden = false;
  const form = roomname.querySelector("form");
  form.addEventListener("submit", handleRoomSubmit);
}

function handleNameSubmit(event) {
  event.preventDefault();
  const input = username.querySelector("input");
  const value = input.value;
  socket.emit("username", value, showRoom);
}

usernameForm.addEventListener("submit", handleNameSubmit);

socket.on("roomname", (username, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} (${newCount} users)`;
  addMessage(`${username} joined!`);
});

socket.on("bye", (username, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} (${newCount} users)`;
  addMessage(`${username} left.`);
});

socket.on("message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = roomname.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
