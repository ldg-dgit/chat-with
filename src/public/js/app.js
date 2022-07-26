const socket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

function makeInputToObject(type, payload) {
  const message = { type, payload };
  return JSON.stringify(message);
}

function handleOpen() {
  console.log("✅ Connected to Server 🕋");
}

socket.addEventListener("open", handleOpen);
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data.toString();
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("❌ Disconnected to Server 🕋");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeInputToObject("message", input.value));
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.send(makeInputToObject("nickname", input.value));
  input.placeholder = input.value;
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNicknameSubmit);
