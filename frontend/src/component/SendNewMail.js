import { useState } from "react";
import { socket } from "../socket";
const SendNewMail = (props) => {
  const [text, setText] = useState();
  const [reciver, setReciver] = useState();

  const sendMessage = (e) => {
    e.preventDefault();
    const payload = {
      senderId : props.user.userId,
      reciver: reciver,
      text: text
    }
    socket.emit('sendMessage' , payload)
    setText('');
    setReciver('');
  };
  return (
    <div class="send_form">
      <div class="title_form">Send New Mail</div>
      <div class="dis_form">
        <label>To:</label>
        <input type="text" onChange={(e) =>  setReciver(e.target.value)} value={reciver}></input>
      </div>
      <div class="text_form">
        <label>Text:</label>
        <textarea type="text" onChange={(e) => setText(e.target.value)} value={text}></textarea>
      </div>
      <div class="submit_form" onClick={(e) => sendMessage(e)}>submit</div>
    </div>
  );
};
export default SendNewMail;
