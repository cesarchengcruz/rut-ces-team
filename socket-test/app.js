var express = require('express')
var http = require('http');
var app = express();
// Socket server side

var socket = require('socket.io')
// Establish the local server
var server = app.listen(process.env.PORT || 3000)

var io = socket(server)

const path = require('path')

console.log("My socket server is running")

app.use(express.static('src'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
  });

var name;

// io.on('connection', (socket) => {

// });



// Event. To handle a socket created on the client's side
io.sockets.on('connection', (socket)=>{
  console.log('new connection' +socket.id)

  socket.on('New Box', (newbox)=>{
      // When recieve 'New Box' message from the client, log the message and send 'Draw new box' message to the client
      console.log('New cube appeared')
      socket.broadcast.emit('Draw new box', newbox)
      

  })

  //Receiving data1
  socket.on('Get positions', (data)=>{ //If recieved a message 'Get positions' from the client, trigger the function below
      socket.broadcast.emit('Redraw figure', data) // Send the ' Redraw figure' message to all the clients except the original one
      // io.sockets.emit('mouse', data) // send the message also back to the original client
      console.log(data)
  }) 



  console.log('new user connected ' + socket.id);

socket.on('joining msg', (username) => {
  name = username;
  io.emit('chat message', `${name} joined`);
});

socket.on('disconnect', () => {
  console.log('user disconnected');
  io.emit('chat message', `${name} left`);
  
});
socket.on('chat message', (msg) => {
  socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
});

}) // Activates a function when a connection is established