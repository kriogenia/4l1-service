import { Server, Socket } from "socket.io";

const onSuscribe = (socket: Socket, io: Server) => (data: any) => {
	console.log('subscribe trigged')
	const room_data = JSON.parse(data)
	const userName = room_data.userName;
	const roomName = room_data.roomName;

	socket.join(`${roomName}`)
	console.log(`Username : ${userName} joined Room Name : ${roomName}`)
	
   
	// Let the other user get notification that user got into the room;
	// It can be use to indicate that person has read the messages. (Like turns "unread" into "read")

	//TODO: need to chose
	//io.to : User who has joined can get a event;
	//socket.broadcast.to : all the users except the user who has joined will get the message
	// socket.broadcast.to(`${roomName}`).emit('newUserToChatRoom',userName);
	io.to(`${roomName}`).emit('newUserToChatRoom',userName);
}

export { onSuscribe }