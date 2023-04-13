import express from 'express';
import routes from '../src/routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDB } from './connection';
import dotenv from 'dotenv';
import http from 'http';
import { CodeBlockModal, ICodeBlock } from './model/codeBlock.model';
import { ObjectId } from 'mongoose';
const socket = require('socket.io');
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded());
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
const AllTheData = async () => {
	const subjects: ICodeBlock[] = await CodeBlockModal.find();
	codeBlocksData = subjects;
	console.log(codeBlocksData);
};
AllTheData();

io.on('connection', (socket) => {
	socket.on('join_Subject', (data: ICodeBlock) => {
		socket.join(data._id);
		console.log('User Joined Room: ' + data._id);
		const currentData: ICodeBlock | undefined = codeBlocksData.find(
			(subject: ICodeBlock) => {
				return subject._id?.toString() === String(data._id);
			}
		);
		console.log(currentData, 'current');
		if (currentData) {
			currentData.connected = currentData.connected + 1;
		}
		socket.emit('isMentor', currentData?.readOnly);
		if (currentData?.connected === 1) {
			currentData.readOnly = false;
			currentData.firstClient = socket.id;
		}
	});
	socket.on('new_code', (data: ICodeBlock) => {
		console.log(data, 'emit');
		io.to(data._id).emit('receive_message', data.code);
	});

	socket.on('user_disconnect', (data: ICodeBlock) => {
		const currentData: ICodeBlock | undefined = codeBlocksData.find(
			(subject: ICodeBlock) => {
				return subject._id?.toString() === String(data._id);
			}
		);
		if (currentData) {
			if (currentData.connected > 0)
				currentData.connected = currentData.connected - 1;
			if (currentData.connected === 0) {
				currentData.readOnly = true;
				io.to(currentData._id).emit('readOnly', currentData.readOnly);
			}
		}
		console.log('USER DISCONNECTED');
	});
});
