import express from 'express';
import routes from '../src/routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDB } from './connection';
import dotenv from 'dotenv';
import { CodeBlockModal, ICodeBlock } from './model/codeBlock.model';
const socket = require('socket.io');
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	exposedHeaders: ['Access-Control-Allow-Origin'],
};

app.use(cors(corsOptions));
app.use(routes);
connectToDB();

const server = app.listen(port, () =>
	console.log(`Listening on http://localhost:${port}`)
);
const io = socket(server, {
	cors: corsOptions,
});

let codeBlocksData: ICodeBlock[] = [];
const getAllData = async () => {
	const subjects: ICodeBlock[] = await CodeBlockModal.find();
	codeBlocksData = [...subjects];
};

export interface IUsers {
	isMentor?: boolean;
	socketID: any;
}
let connected_users: IUsers[] = [];

const initialize = async () => {
	await getAllData();

	io.on('connection', (socket: any) => {
		console.log('new socket: ' + socket.id);
		socket.join();
		let new_user: IUsers = { socketID: socket.id, isMentor: false };

		console.log(connected_users.length);
		if (!connected_users.length) {
			new_user.isMentor = true;
		} else {
			new_user.isMentor = false;
		}

		connected_users.push(new_user);
		socket.emit('isMentor', new_user.isMentor);

		socket.on('disconnect', function () {
			console.log('Got disconnect!');
			let user: IUsers | undefined = connected_users.find((users: IUsers) => {
				return socket.id == users.socketID;
			});
			if (user) {
				const index = connected_users.indexOf(user);
				connected_users.splice(index, 1);
				if (user?.isMentor === true) {
					if (connected_users.length > 0) {
						console.log(connected_users[0].isMentor);
						connected_users[0].isMentor = true;
						console.log(connected_users[0].isMentor);
						socket.emit('isMentor', connected_users[0].isMentor);
					}
				}
			}
		});
		socket.on('new_code', (data: string) => {
			console.log(data);

			let mentor = connected_users.find((users: IUsers) => {
				return users.isMentor == true;
			});

			console.log(connected_users);
			console.log(mentor);

			if (socket.id != mentor?.socketID) {
				console.log(socket.id);
				console.log(mentor?.socketID);
				console.log(mentor?.isMentor);

				io.to(mentor?.socketID).emit('code_update', data);
			}
		});
		// const currentData: ICodeBlock | undefined = codeBlocksData.find(
		// 	(subject: ICodeBlock) => {
		// 		return subject._id?.toString() === String(data._id);
		// 	}
		// );
		// 		socket.emit('new_code', currentData);
		// 		socket.on('new_code', (data: ICodeBlock) => {
		// 			console.log(data, 'emit');
		// 			if (data) {
		// 				io.to(data?._id).emit('new_code', data.code);
		// 			}
		// 		});
		// 		console.log(currentData, 'current');
		// 		socket.emit('connected', currentData?.connect);
		// 		if (currentData) {
		// 			currentData.connect = currentData.connect + 1;
		// 			io.to(socket.id).emit('connected', currentData?.connect);
		// 			console.log(currentData, 'with-conntect');
		// 			socket.emit('isMentor', currentData?.readOnly);
		// 			if (currentData?.connect === 1) {
		// 				currentData.readOnly = false;
		// 				io.to(socket.id).emit('isMentor', false);
		// 			}
		// 		}
		// 		console.log(currentData, 'read-only');
		// 	});

		// 	socket.on('user_disconnect', (data: ICodeBlock) => {
		// 		console.log('USER DISCONNECTED');
		// 		console.log('USER DISCONNECTED', data);
		// 		if (data) {
		// 			if (data.connect > 0) data.connect = data.connect - 1;
		// 			io.to(socket.id).emit('connected', data?.connect);
		// 			if (data.connect === 0) {
		// 				data.readOnly = true;
		// 				io.to(data._id).emit('isMentor', data.readOnly);
		// 			}
		// 		}
		// 		io.to(socket.id).emit('user_disconnect', data);
	});
};
initialize();

// const initialize = async () => {
// 	await getAllData();
// 	io.on('connection', (socket: any) => {
// 		console.log('new socket');
// 		socket.join(socket._id);

// 		socket.on('join_Subject', (data: ICodeBlock) => {
// 			console.log('join');

// 			socket.join(data._id);
// 			console.log('User Joined Room: ' + data._id);
// 			const currentData: ICodeBlock | undefined = codeBlocksData.find(
// 				(subject: ICodeBlock) => {
// 					return subject._id?.toString() === String(data._id);
// 				}
// 			);
// 			socket.emit('new_code', currentData);
// 			socket.on('new_code', (data: ICodeBlock) => {
// 				console.log(data, 'emit');
// 				if (data) {
// 					io.to(data?._id).emit('new_code', data.code);
// 				}
// 			});
// 			console.log(currentData, 'current');
// 			socket.emit('connected', currentData?.connect);
// 			if (currentData) {
// 				currentData.connect = currentData.connect + 1;
// 				io.to(socket.id).emit('connected', currentData?.connect);
// 				console.log(currentData, 'with-conntect');
// 				socket.emit('isMentor', currentData?.readOnly);
// 				if (currentData?.connect === 1) {
// 					currentData.readOnly = false;
// 					io.to(socket.id).emit('isMentor', false);
// 				}
// 			}
// 			console.log(currentData, 'read-only');
// 		});

// 		socket.on('user_disconnect', (data: ICodeBlock) => {
// 			console.log('USER DISCONNECTED');
// 			console.log('USER DISCONNECTED', data);
// 			if (data) {
// 				if (data.connect > 0) data.connect = data.connect - 1;
// 				io.to(socket.id).emit('connected', data?.connect);
// 				if (data.connect === 0) {
// 					data.readOnly = true;
// 					io.to(data._id).emit('isMentor', data.readOnly);
// 				}
// 			}
// 			io.to(socket.id).emit('user_disconnect', data);
// 		});
// 	});
// };
// initialize();
