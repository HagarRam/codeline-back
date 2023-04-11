import express from 'express';
import {
	getAllCodeBlock,
	updateCode,
} from '../../controllers/codeBlock.controllers';
const codeBlockRouter = express.Router();

codeBlockRouter.get('/', getAllCodeBlock);
codeBlockRouter.put('/', updateCode);
export default codeBlockRouter;
//
