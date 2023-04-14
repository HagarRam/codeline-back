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

const initialize = async () => {
	await getAllData();
	io.on('connection', (socket: any) => {
		socket.on('join_Subject', (data: ICodeBlock) => {
			socket.join(data._id);
			console.log('User Joined Room: ' + data._id);
			const currentData: ICodeBlock | undefined = codeBlocksData.find(
				(subject: ICodeBlock) => {
					return subject._id?.toString() === String(data._id);
				}
			);
			socket.on('new_code', (data: ICodeBlock) => {
				console.log(data, 'emit');
				io.to(data._id).emit('receive_code', data.code);
			});
			console.log(currentData, 'current');
			socket.emit('connected', currentData?.connect);
			if (currentData) {
				currentData.connect = currentData.connect + 1;
				io.to(socket.id).emit('connected', currentData?.connect);
				console.log(currentData, 'with-conntect');
				socket.emit('isMentor', currentData?.readOnly);
				if (currentData?.connect === 1) {
					currentData.readOnly = false;
					io.to(socket.id).emit('isMentor', false);
				}
			}
			console.log(currentData, 'read-only');
		});

		socket.on('user_disconnect', (data: ICodeBlock) => {
			const currentData: ICodeBlock | undefined = codeBlocksData.find(
				(subject: ICodeBlock) => {
					return subject._id?.toString() === String(data._id);
				}
			);
			console.log('disconnectData', data);
			console.log('USER DISCONNECTED');
			if (currentData) {
				if (currentData.connect > 0)
					currentData.connect = currentData.connect - 1;
				io.to(socket.id).emit('connected', currentData?.connect);
				if (currentData.connect === 0) {
					currentData.readOnly = true;
					io.to(currentData._id).emit('isMentor', currentData.readOnly);
				}
			}
		});
	});
};
initialize();
