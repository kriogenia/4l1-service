import { Socket } from "socket.io";
import { io } from "../Server";
import { onSuscribe } from "./location/Subscribe";

const ioListener = (socket: Socket) => {
	//The moment one of your client connected to socket.io server it will obtain socket id
    //Let's print this out.
    console.log(`Connection : SocketId = ${socket.id}`)
    
    socket.on('subscribe', onSuscribe(socket, io));

    socket.on('unsubscribe',function(data) {
        console.log('unsubscribe trigged')
        const room_data = JSON.parse(data)
        const userName = room_data.userName;
        const roomName = room_data.roomName;
    
        console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
        socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',userName)
        socket.leave(`${roomName}`)
    });

    socket.on('newMessage',function(data) {
        console.log('newMessage triggered')

        const messageData = JSON.parse(data)
        const messageContent = messageData.messageContent
        const roomName = messageData.roomName
        const userName = messageData.userName;

        console.log(`[Room Number ${roomName}] ${userName} : ${messageContent}`)
        
        // Just pass the data that has been passed from the writer socket
        const chatData = {
            userName : userName,
            messageContent : messageContent,
            roomName : roomName
        }
        socket.broadcast.to(`${roomName}`).emit('updateChat',JSON.stringify(chatData)) // Need to be parsed into Kotlin object in Kotlin
    });

    socket.on('disconnect', function () {
        console.log("One of sockets disconnected from our server.")
    });
}

export { ioListener }