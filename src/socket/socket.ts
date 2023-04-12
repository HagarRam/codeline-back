// import { Server, Socket } from 'socket.io';
// import http from 'http';
// import { CodeBlockModal } from '../model/codeBlock.model';
// import express from 'express';
// const app = express();
// const server = http.createServer();
// const io = new Server(server);

// interface ICodeOnline {
// 	code: string;
// 	readOnly: boolean;
// 	mentor: string | null;
// 	connectedPeople: number;
// }
// const codeBlock: ICodeOnline[] = [];
// import { Server, Namespace } from "socket.io";
// import { getAllRooms } from "../services/room.service";

// interface Room {
//   id: string;
//   code: string;
//   connected: number;
//   readOnly: boolean;
//   firstClient: string | null;
// }

// let rooms: Room[] = [];

// async function initRooms() {
//   const allRooms = await getAllRooms();
//   rooms = allRooms.map((r) => ({
//     id: r["roomId"].toString(),
//     code: r["roomCode"],
//     connected: 0,
//     readOnly: true,
//     firstClient: null,
//   }));
// }

// export function startSocketServer(server: any) {
//   const io = new Server(server, {
//     cors: {
//       // origin: "http://localhost:3000",
//       origin: "https://mhomeassigment-front.onrender.com",
//       methods: ["GET", "POST"],
//     },
//   });

//   initRooms();
// // handling with adding multiple users to the same room and giving them permission to view or edit
//   io.on("connection", (socket) => {

//     socket.on("joinRoom", (roomId) => {
//       const room = rooms[Number(roomId) - 1];
//       socket.join(room.id);
//       room.connected = room.connected + 1;

//       socket.emit("codeUpdate", room.code);
//       socket.emit("readOnly", room.readOnly);
//       if (room.connected === 1) {
//         room.readOnly = true;
//         room.firstClient = socket.id;
//       } else {
//         room.readOnly = false;
//       }

//       if (room.connected > 1 && socket.id !== room.firstClient) {
//         io.to(socket.id).emit("readOnly", false);
//       }
//     });

//     socket.on("codeUpdate", (newCode) => {
//       const room = rooms.find((r) => socket.rooms.has(r.id));
//       if (room) {
//         room.code = newCode;
//         socket.to(room.id).emit("codeUpdate", newCode);
//       }
//     });

//     socket.on("disconnect", () => {
//       const room = rooms.find((r) => r.id == socket.handshake.query.roomId);
//       if (room) {
//         if (room.connected > 0) {
//           room.connected--;
//         }

//         if (room.connected === 0) {
//           room.readOnly = true;
//           io.to(room.id).emit("readOnly", room.readOnly);
//         }
//       }
//     });
//   });
// }

//My!!!!
// io.on('connection', (socket) => {
// 	console.log('a user connected');
// 	socket.on('code_block', (data) => {
// 		console.log(`Received new code block: ${data}`);
// 	});
// 	socket.on('disconnect', () => {
// 		console.log('user disconnected');
// 	});
// });
// server.listen(3000, () => {
// 	console.log('Server listening on port 3000.');
// });

// const _id = data._id;
// const newData = data.data;
// if (down) {
// 	CodeBlockModal.findByIdAndUpdate(_id, newData, { new: true })
// 		.then((updatedCodeBlock) => {
// 			console.log('Updated code block:', updatedCodeBlock);
// 			io.to('code room').emit('code block', {
// 				code: updatedCodeBlock?.code,
// 			});
// 		})
// 		.catch((err) => {
// 			console.error('Error updating code block:', err);
// 		});
// }
// const server = http.createServer(app);
// const io = new Server(server, {
// 	cors: {
// 		origin: 'http://localhost:3000',
// 		methods: ['GET', 'POST'],
// 	},
// });
