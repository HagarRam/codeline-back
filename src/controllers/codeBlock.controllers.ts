import { getData, updateCodeData } from '../service/codeBlock.service';
import express, { Request, Response } from 'express';

export const getAllCodeBlock = async (req: Request, res: Response) => {
	try {
		const hats = await getData();
		return res.status(200).json(hats);
	} catch (err) {
		throw err;
	}
};
export const updateCode = async (req: Request, res: Response) => {
	try {
		const tipLike = await updateCodeData(req.body._id, req.body.data);
		res.status(201).json(tipLike);
	} catch (err) {
		throw err;
	}
};
