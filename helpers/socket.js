function socketOrder(socket) {
    socket.emit('order', 'order');
    socket.emit('search_customer', Search());
}

function Search(data) {}

module.exports = { socketOrder, Search };
