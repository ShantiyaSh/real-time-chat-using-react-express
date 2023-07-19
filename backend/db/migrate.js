import db from "./db.js";

const userTableExists = await db.schema.hasTable('users');
if (!userTableExists) {
  await db.schema.createTable("users", (table) => {
    table.increments("userId");
    table.string("userName");
    table.string("password");
    table.string("socketId").nullable();
    table.timestamps();
  });
}
const massageTableExists = await db.schema.hasTable('messages');
if (!massageTableExists) { 
  await db.schema.createTable("messages", (table) => {
    table.increments("id");
    table.bigInteger("senderId").unsigned().index().references('userId').inTable('users');
    table.bigInteger("reciverId").unsigned().index().references('userId').inTable('users');
    table.string("text");
    table.timestamps();
  });
}
db.destroy( () => {
    console.log('migration is finished')
})
