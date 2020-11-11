var static = require('node-static');
const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

var io = require('socket.io')(http);
io.sockets.on('connection', function (socket){
    socket.on('message', function (message) {
        console.log('S --> Got message: ', message);
        socket.broadcast.to(message.channel).emit('message', message);
    });
    socket.on('create or join', function (channel) {
        io.of('/').in(channel).clients(function(error,clients){
            var numClients=clients.length;
            console.log('numclients = ' + numClients);
            if (numClients == 0){
                socket.join(channel);
                socket.emit('created', channel);
            } else if (numClients == 1) {
                io.sockets.in(channel).emit('remotePeerJoining', channel);
                socket.join(channel);
                socket.broadcast.to(channel).emit('broadcast: joined', 'S--> broadcast(): client ' + socket.id + ' joined channel' + channel);
            } else { console.log("Channel full!");
                socket.emit('full', channel);
            }
        });    
    });
    socket.on('response', function (response) {
        console.log('S --> Got response: ', response);
        socket.broadcast.to(response.channel).emit('response',
        response.message);
    });
    socket.on('Bye', function(channel){
        socket.broadcast.to(channel).emit('Bye');
        socket.disconnect();
    });
    socket.on('Ack', function () {
        console.log('Got an Ack!');
        socket.disconnect();
    });
    function log(){
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
        array.push(arguments[i]);
        }
        socket.emit('log', array);
    }
});
const PORT = process.env.PORT || 8181
http.listen(PORT, ()=>{
    console.log('Server is running on port', PORT)
})