import {
  createMessage,
  getUserAsReciverMessages,
  getUserAsSenderMessages,
} from "./model/message.js";
import { getUserByID, getUserSocketId, setUserSocketId } from "./model/user.js";

function socket(socketServer) {
  socketServer.on("connection", async (socket) => {
    socket.on("setUser", async (userId) => {
      await setUserSocketId(userId, socket.id);
      const userAsReciverMessages = await getUserAsReciverMessages(userId);
      for (let mail of userAsReciverMessages) {
        const Reciver = await getUserByID(mail.reciverId);
          mail.reciverId = Reciver.userName;
          const Sender = await getUserByID(mail.senderId);
          mail.senderId = Sender.userName;
      }
  
      const userAsSenderMessages = await getUserAsSenderMessages(userId);
      for (let mail of userAsSenderMessages) {
        const Reciver = await getUserByID(mail.reciverId);
          mail.reciverId = Reciver.userName;
          const Sender = await getUserByID(mail.senderId);
          mail.senderId = Sender.userName;
      }
      socketServer.to(socket.id).emit("sentMessage", userAsSenderMessages);
      socketServer.to(socket.id).emit("receiveMessage", userAsReciverMessages);
    });
    socket.on("sendMessage", async (msg) => {
      try {
        const message = await createMessage(msg);
        const senderId = message[0].senderId;
        const userAsSenderMessages = await getUserAsSenderMessages(senderId);
        for (let mail of userAsSenderMessages) {
          const Reciver = await getUserByID(mail.reciverId);
          mail.reciverId = Reciver.userName;
          const Sender = await getUserByID(mail.senderId);
          mail.senderId = Sender.userName;
        }
        socketServer.to(socket.id).emit("sentMessage", userAsSenderMessages);
        const reciverId = message[0].reciverId;
        const reciverUserMessages = await getUserAsReciverMessages(reciverId);
        for (let mail of reciverUserMessages) {
          const Reciver = await getUserByID(mail.reciverId);
          mail.reciverId = Reciver.userName;
          const Sender = await getUserByID(mail.senderId);
          mail.senderId = Sender.userName;
        }
        let reciverSocketId = await getUserSocketId(reciverId);
        reciverSocketId = reciverSocketId[0].socketId;
        socketServer
          .to(reciverSocketId)
          .emit("receiveMessage", reciverUserMessages);
      } catch {
        socketServer.to(socket.id).emit("sentMessageError", "user not found");
      }
    });
  });

}

export default socket;
