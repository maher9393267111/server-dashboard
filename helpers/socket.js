





function socketOrder(io) {


  io.on('connection', (socket) => {
        socket.emit('order', 'order');
    });


    // io.on('order', async (socket) => {
    //   console.log('a user connected');


    //   socket.on('disconnect', () => {
    //       console.log('user disconnected');
    //   })




    //   io.emit('start', "MAHERRRRR");
    


     



    // });


  }
  
  module.exports ={socketOrder}