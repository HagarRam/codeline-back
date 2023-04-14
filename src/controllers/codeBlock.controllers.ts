import { getData, updateCodeData } from '../service/codeBlock.service';
import express, { Request, Response } from 'express';

export const getAllCodeBlock = async (req: Request, res: Response) => {
	try {
		const blocks = await getData();
		return res.status(200).json(blocks);
	} catch (err) {
		throw err;
	}
};
export const updateCode = async (req: Request, res: Response) => {
	console.log(req.body);
	try {
		const newCode = await updateCodeData(req.body._id, req.body.data);
		res.status(201).json(newCode);
	} catch (err) {
		throw err;
	}
};
