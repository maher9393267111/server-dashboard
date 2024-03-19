const socket = require("socket.io");

let io;

const initializeSocketIO = (server) => {
  io = socket(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected (socket)");


 io.emit('start', 'added new customerssssss');
    socket.on("disconnect", () => {
      console.log("user Disconnected (d socket)");
    });
  });
};

const getIO = () => io;

module.exports = { initializeSocketIO, getIO };