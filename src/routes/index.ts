import express from 'express';
import codeblock from '../routes/codeBlockRoutes/codeBlock.routes';
const router = express.Router();

router.use('/codeblock', codeblock);

export default router;
