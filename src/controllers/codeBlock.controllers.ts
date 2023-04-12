import { getData, updateCodeData } from '../service/codeBlock.service';
import express, { Request, Response } from 'express';
import { io, Socket } from 'socket.io-client';

export const getAllCodeBlock = async (req: Request, res: Response) => {
	try {
		const blocks = await getData();
		return res.status(200).json(blocks);
	} catch (err) {
		throw err;
	}
};
export const updateCode = async (req: Request, res: Response) => {
	try {
		const newCode = await updateCodeData(req.body._id, req.body.data);
		res.status(201).json(newCode);
	} catch (err) {
		throw err;
	}
};

// export const getAllCodeBlock = async (req: Request, res: Response) => {
// 	try {
// 		const blocks = await getData();
// 		io.emit('allCodeBlock', blocks); // emit event to all connected clients
// 		return res.status(200).json(blocks);
// 	} catch (err) {
// 		throw err;
// 	}
// };

// export const updateCode = async (req: Request, res: Response) => {
// 	try {
// 		const newCode = await updateCodeData(req.body._id, req.body.data);
// 		io.emit('updatedCodeBlock', newCode); // emit event to all connected clients
// 		res.status(201).json(newCode);
// 	} catch (err) {
// 		throw err;
// 	}
// };
