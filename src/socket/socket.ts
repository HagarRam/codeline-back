const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('join', (room) => {
		console.log(`user joined room ${room}`);
		socket.join(room);
	});

	socket.on('code block', (data) => {
		console.log(`received code block: ${data.code}`);
		// Broadcast the received code block to all clients in the "code room"
		socket.to('code room').emit('code block', data);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

http.listen(7000, () => {
	console.log('listening on *:7000');
});
