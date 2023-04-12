import { Server, Socket } from 'socket.io';
import http from 'http';
import { CodeBlockModal } from '../model/codeBlock.model';
import express from 'express';
import cors from 'cors';
import { server } from '../app';
// const app = express();
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});
