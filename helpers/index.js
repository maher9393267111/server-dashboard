const { Server } = require('socket.io');

require('dotenv').config();

let io;

function init(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin:"*",
            // origin:"https://www.job-peer.com",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
            transports: ['polling', 'websocket'],
            // 	allowEIO3: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);
        
 

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Must initialize socket.io first");
    }
    return io;
}

module.exports = { init, getIO };