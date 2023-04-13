import express from 'express';
import routes from '../src/routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDB } from './connection';
import dotenv from 'dotenv';
import http from 'http';
import { ICodeBlock } from './model/codeBlock.model';
const socket = require('socket.io');
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
import $ from 'jquery';

const corsOptions = {
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	// add this line to include the Access-Control-Allow-Origin header
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

// const io = socket(server);

io.on('connection', (socket: any) => {
	socket.on('join_Subject', (data: ICodeBlock) => {
		socket.join(data._id);
		console.log('User Joined Room: ' + data._id);
	});
	socket.on('new_code', (data: ICodeBlock) => {
		console.log(data, 'emit');
		io.to(data._id).emit('receive_message', data.code);
	});

	// Receive messages from the client
	socket.on('receive_message', (code: string) => {
		console.log(code, 'code received');
		// Do something with the code received from the client
	});

	socket.on('disconnect', () => {
		console.log('USER DISCONNECTED');
	});
});

// socket.on('send_message', (data: { _id: string, code: string }) => {
//     console.log(data);
//     newSocket.to(data._id).emit('receive_message', data.code);
//   });
// const codeTextArea = $('#code-textarea');

// io.on('receive_message', (code) => {
//   // update the value of the text area with the received code
//   codeTextArea.val(code);
// });
