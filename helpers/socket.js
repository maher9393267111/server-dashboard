function socketOrder(io) {
    io.on('connection', (socket) => {
        socket.emit('order', 'order');

        socket.on('signal', require('./ScocketFunctions/Search')(io, socket));




        
    });
}

module.exports = { socketOrder };
