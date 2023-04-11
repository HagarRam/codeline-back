import { ObjectId } from 'mongoose';
import { CodeBlockModal, ICodeBlock } from '../model/codeBlock.model';

export const getData = async () => {
	try {
		const data = await CodeBlockModal.find();
		return data;
	} catch (err) {
		throw err;
	}
};
export const updateCodeData = async (_id: ObjectId, UpdateCode: ICodeBlock) => {
	try {
		const UpdateCodeData = await CodeBlockModal.findByIdAndUpdate(
			_id,
			UpdateCode,
			{ new: true }
		);
		if (UpdateCodeData) {
			return UpdateCodeData;
		}
	} catch (err) {
		throw err;
	}
};
