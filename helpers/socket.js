

// module.exports.sendNotification = (req, notification) => {
//   const io = req.app.get('socketio');
//   io.sockets.in(notification.receiver).emit('newNotification', notification);
// };

// module.exports.sendPost = (req, post, receiver) => {
//   const io = req.app.get('socketio');
//   io.sockets.in(receiver).emit('newPost', post);
// };

// module.exports.deletePost = (req, postId, receiver) => {
//   const io = req.app.get('socketio');
//   io.sockets.in(receiver).emit('deletePost', postId);
// };

















function socketOrder(io) {
    io.on('connection', async (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
          console.log('user disconnected');
      })


      io.emit('start', "hello_maher");
    


      // socket.on('message', (msg) => {
      //     console.log("message: ", msg);
      //     io.emit('message', msg);
      // })
      // socket.on('updateOrderStatus', async(data) => {
      //   console.log('data', data);
      //   const { order_id, status, date } = data;
      //   let changedOrder = await Order.findById(order_id);
      //   changedOrder.status = status;
      //   if (status === 'cancel') {
      //     changedOrder.tracking = {}
      //   }
      //   else {
      //     changedOrder.tracking[status] = date;
      //   }
      //   await changedOrder.save();
      //   io.emit('updateOrderStatus', data);
      // })
      // socket.on('deleteOrder', async(data) => {
      //   const { order_id } = data;
      //   await Order.findByIdAndDelete(order_id)
      //   io.emit('deleteOrder', data);
      // })




    });
  }
  
  module.exports ={socketOrder}