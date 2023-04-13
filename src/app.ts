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
		// console.log(data);
	});
	socket.on('new_code', (data: ICodeBlock) => {
		console.log(data, 'emit');
		socket.broadcast.emit('code-update', data);
		socket.to(data._id).emit('receive_message', data.code);
	});

	socket.on('disconnect', () => {
		console.log('USER DISCONNECTED');
	});
});
