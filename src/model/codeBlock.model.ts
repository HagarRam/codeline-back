import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
export interface ICodeBlock {
	title: string;
	code: string;
}

export const codeBlockSchema = new Schema<ICodeBlock>({
	title: { type: String, required: true },
	code: { type: String, required: true },
});

export const CodeBlockModal = mongoose.model<ICodeBlock>(
	'codeblocks',
	codeBlockSchema
);
