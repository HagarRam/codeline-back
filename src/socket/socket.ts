import { Server, Socket } from 'socket.io';
import http from 'http';
import { CodeBlockModal } from '../model/codeBlock.model';
const server = http.createServer();
const io = new Server(server);
io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('code_block', (data) => {
		console.log(`Received new code block: ${data}`);
		// const _id = data._id;
		// const newData = data.data;
		// if (down) {
		// 	CodeBlockModal.findByIdAndUpdate(_id, newData, { new: true })
		// 		.then((updatedCodeBlock) => {
		// 			console.log('Updated code block:', updatedCodeBlock);
		// 			io.to('code room').emit('code block', {
		// 				code: updatedCodeBlock?.code,
		// 			});
		// 		})
		// 		.catch((err) => {
		// 			console.error('Error updating code block:', err);
		// 		});
		// }
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});
server.listen(3000, () => {
	console.log('Server listening on port 3000.');
});
