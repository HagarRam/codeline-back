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
	methods: ['GET', 'POST', 'PUT'],
	// allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	// exposedHeaders: ['Access-Control-Allow-Origin'],
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

const getAllData = async () => {
	let codeBlocksData: ICodeBlock[] = [];
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
		console.log('New user: ' + socket.id);
		socket.join();
		let new_user: IUsers = { socketID: socket.id, isMentor: false };
		if (!connected_users.length) {
			new_user.isMentor = true;
		} else {
			new_user.isMentor = false;
		}

		connected_users.push(new_user);
		socket.emit('isMentor', new_user.isMentor);
		socket.on('new_code', (data: string) => {
			let mentor = connected_users.find((users: IUsers) => {
				return users.isMentor == true;
			});
			console.log(connected_users);
			if (socket.id != mentor?.socketID) {
				io.to(mentor?.socketID).emit('code_update', data);
			}
		});
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
						connected_users[0].isMentor = true;
						socket.emit('isMentor', connected_users[0].isMentor);
					}
				}
			}
		});
	});
};
initialize();
