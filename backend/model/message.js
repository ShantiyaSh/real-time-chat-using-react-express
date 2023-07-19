import db from "../db/db.js";
import { getUserByUsername } from "./user.js";

async function getUserAsReciverMessages(userId) {
    return db.table("messages").where("reciverId", userId);
}
async function getUserAsSenderMessages(userId) {
    return db.table("messages").where("senderId", userId);
}
async function createMessage(payload) {
    const {senderId , reciver , text} = payload;
    const reciverId = await getUserByUsername(reciver);
    const created_at = Date.now();
    const newMessage = {
        senderId : senderId,
        reciverId : reciverId.userId,
        text: text,
        created_at: created_at
    }
    return db.table("messages").insert(newMessage , "*");
  }
export {
    getUserAsReciverMessages,
    getUserAsSenderMessages,
    createMessage
}