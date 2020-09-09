const http = require('http');
const app = require('./app');
//const socketIO = require('socket.io');

const server = http.createServer(app);

//const io = socketIO(server);

//io.on('connection', (socket) => {
//  console.log('I am connected');
//  socket.on('join', ({ username }) => {
//    console.log(username);
//  });
//  socket.on('disconnect', () => {
//    console.log('disconnected');
//  });
//});

server.listen(process.env.PORT || 4000, () => {
  console.log('Listening to requests');
});

//module.exports = server;
