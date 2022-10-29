import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {},
});

io.on("connection", (socket) => {
  console.log(`a user connected with id: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(4000, () => {
  console.log("listening on :4000");
});
