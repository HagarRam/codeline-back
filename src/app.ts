import express from 'express';
import routes from '../src/routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDB } from './connection';
import dotenv from 'dotenv';
import http from 'http';
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

app.use(routes);
export const server = http.createServer(app);
connectToDB();
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
server.listen(3001, () => {
	console.log('Server listening on port 3001.');
});
