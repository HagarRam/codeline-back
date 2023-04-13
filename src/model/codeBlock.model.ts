import { Schema, model, ObjectId } from 'mongoose';
import mongoose from 'mongoose';
export interface ICodeBlock {
	_id: ObjectId;
	title: string;
	code: string;
}

export const codeBlockSchema = new Schema<ICodeBlock>({
	_id: { type: Schema.Types.ObjectId, required: false },
	title: { type: String, required: true },
	code: { type: String, required: true },
});

export const CodeBlockModal = mongoose.model<ICodeBlock>(
	'codeblocks',
	codeBlockSchema
);
