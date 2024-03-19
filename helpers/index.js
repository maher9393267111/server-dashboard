const { Server } = require('socket.io');

require('dotenv').config();

//let io;
let socketio ={url:null} ;

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
        

        socket.emit('start',"start")

       socket.on('search', (data) => {
            console.log("SEARCH🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟" ,data)
            io.emit('search_cust', data);
            io.emit('search_server', {...data ,message:"search from server with data"});
        });






        
    
    });

    return io;
}

// function getIO() {
//     if (!io) {
//         throw new Error("Must initialize socket.io first");
//     }
//     return io;
// }

module.exports = { init  ,socketio };
