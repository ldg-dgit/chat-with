const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
  console.log("✅ Connected to Server 🕋");
}

socket.addEventListener("open", handleOpen);
socket.addEventListener("message", (message) => {
  console.log(message.data);
});

socket.addEventListener("close", () => {
  console.log("❌ Disconnected to Server 🕋");
});

setTimeout(() => {
  socket.send("hello from the Browser!");
}, 10000);
