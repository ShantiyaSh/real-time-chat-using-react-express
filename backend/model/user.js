import db from "../db/db.js";
async function getAllUser() {
  return db.table("users").select('userName' , 'userId');
}
async function createUser(payload) {
  return db.table("users").insert(payload).returning("*");
}
async function getUserByUsername(username) {
  return db.table("users").where("userName", username).first();
}
async function getUserByID(id) {
  return db.table("users").where("userId", id).first();
}
async function updateUser(id , payload){
  return db.table("users").where('userId',id).first().update(payload).returning("*");
}
async function setUserSocketId(userId , socketId){
  return db.table("users").where('userId', userId).update({'socketId':socketId});
}
async function getUserSocketId(userId){
  return db.table("users").where('userId', userId).select('socketId');
}


export { getUserByUsername , createUser , getUserByID , updateUser , setUserSocketId , getUserSocketId , getAllUser};