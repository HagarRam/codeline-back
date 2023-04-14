import { Schema, model, ObjectId } from 'mongoose';
import mongoose from 'mongoose';
export interface ICodeBlock {
	_id?: ObjectId;
	title?: string;
	code?: string;
	correctCode?: string;
	readOnly?: boolean;
}

export const codeBlockSchema = new Schema<ICodeBlock>({
	_id: { type: Schema.Types.ObjectId, required: false },
	title: { type: String, required: false },
	code: { type: String, required: true },
	correctCode: { type: String, required: false },
	readOnly: { type: Boolean, required: false },
});

export const CodeBlockModal = mongoose.model<ICodeBlock>(
	'codeblocks',
	codeBlockSchema
);
