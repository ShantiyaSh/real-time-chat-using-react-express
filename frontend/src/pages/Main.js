import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import Loading from "../component/Loading";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleRight,
  faList,
  faSearch,
  faEllipsisV,
  faContactBook,
  faGear,
  faClose,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../css/Chat.css";




const SendBox = (props) => {
  const [text, setText] = useState("");
  const [dis, setDis] = useState(true);
  useEffect(() => {
    if (text.length > 0) {
      setDis(false);
    } else {
      setDis(true);
    }
  }, [text]);

  const sendMessage = () => {
    const payload = {
      senderId: props.user.userId,
      reciver: props.reciver,
      text: text,
    };
    socket.emit("sendMessage", payload);
    setText("");
  };
  return (
    <div className="sendbox">
      <input
        placeholder="Write a message..."
        type="text"
        value={text}
        onChange={(e) => {
          e.preventDefault();
          setText(e.target.value);
        }}
      />

      <button
        onClick={() => sendMessage()}
        className="send-button"
        disabled={dis}
      >
        <FontAwesomeIcon icon={faArrowCircleRight} className="send-icon" />
      </button>
    </div>
  );
};

function Main() {
  const [user, setUser] = useState();
  // -----
  const [allUser, setAllUser] = useState();
  const [allUsersBox, toggleUsersBox] = useState(false);
  //  ----
  const [settingBox, setSettingBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [allChats, setAllChats] = useState({});
  const [rawMessageR, setRawMessageR] = useState([]);
  const [rawMessageS, setRawMessageS] = useState([]);
  const [contacts, setContacts] = useState(false);

  const [currentContactView, setCCV] = useState("");

  const fetchLogout = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status === 200) {
      setRedirect(true);
    }
  };

  useEffect(() => {
    const allChat = {};
    rawMessageR.forEach((msg) => {
      const { senderId, text, created_at } = msg;
      allChat[senderId] = allChat[senderId] ?? [];
      allChat[senderId].push({
        position: "reciver",
        text: text,
        date: new Date(created_at),
      });
    });
    rawMessageS.forEach((msg) => {
      const { reciverId, text, created_at } = msg;
      allChat[reciverId] = allChat[reciverId] ?? [];
      allChat[reciverId].push({
        position: "sender",
        text: text,
        date: new Date(created_at),
      });
    });
    setAllChats(allChat);
  }, [rawMessageR, rawMessageS]);

  useEffect(() => {
    let contactInfo = [];
    const contacts = Object.keys(allChats);
    contacts.forEach((contact) => {
      const chats = allChats[contact].sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
      contactInfo.push({
        name: contact,
        lastMessage: chats[0].text,
        lastTime: chats[0].date,
      });
    });
    contactInfo = contactInfo.sort(
      (a, b) => b.lastTime.getTime() - a.lastTime.getTime()
    );
    setContacts(contactInfo);
  }, [allChats]);

  useEffect(() => {
    let userObj;
    const fetchProfile = async () => {
      const response = await fetch("http://localhost:8000/api/profile", {
        credentials: "include",
      });
      if (response.status === 200) {
        userObj = await response.json();
        setUser(userObj);
        setLoading(false);
      } else {
        setRedirect(true);
      }
    };
    const fetchAllUser = async () => {
      const response = await fetch("http://localhost:8000/api/all-user", {
        credentials: "include",
      });
      if (response.status === 200) {
        let allusers = await response.json();
        allusers = allusers.filter((User) => {
          return User.userName !== userObj.userName;
        });
        setAllUser(allusers);
      }
    };
    fetchProfile();
    fetchAllUser();
    socket.on("receiveMessage", (mails) => {
      setRawMessageR(mails);
    });
    socket.on("sentMessage", (mails) => {
      setRawMessageS(mails);
    });
  }, []);
  useEffect(() => {
    if (user) {
      socket.emit("setUser", user.userId);
    }
  }, [user]);

  const ChatBox = () => {
    let chats = [];
    const myRef = useRef();
    useEffect(() => {
      myRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    try {
      const allchatWithCurrentUser = allChats[currentContactView].sort(
        (a, b) => {
          return a.date.getTime() - b.date.getTime();
        }
      );
      allchatWithCurrentUser.forEach((chat, i) => {
        chats.push(
          <div className={chat.position} key={i}>
            <div className="chat-text">{chat.text}</div>
            <div className="chat-date">{chat.date.toLocaleTimeString()}</div>
          </div>
        );
      });
    } catch (error) {
      chats = null;
    }

    return (
      <div className="chat-area">
        {chats ? chats : <p className="new-chat-alarm">"start new chat"</p>}
        <div ref={myRef}></div>
      </div>
    );
  };

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className="container1">
        <div className={settingBox ? "setting-box active" : "setting-box"}>
          <div className="setting-box-profile">
            <div className="icon">
              <FontAwesomeIcon icon={faUser}/>
            </div>
            <div className="username">{user.userName}</div>
          </div>
          <div
            className="setting-box-item"
            onClick={() => toggleUsersBox(true)}
          >
            <FontAwesomeIcon icon={faContactBook} />
            Contacts
          </div>
          <div className="setting-box-item">
            <FontAwesomeIcon icon={faGear} />
            Settings
          </div>
          <div className="setting-box-item" onClick={fetchLogout}>
            <FontAwesomeIcon icon={faSignOut} />
            Logout
          </div>

          <div className="setting-box-version">MYGRAM version 1.0.0</div>
        </div>
        <div className="header-side">
          <FontAwesomeIcon
            icon={faList}
            className="header-list"
            onClick={() => setSettingBox(!settingBox)}
          />
          <div className="app-name">MYGRAM</div>
        </div>
        <div className="header-chat">
          {currentContactView ? (
            <>
              <div>{currentContactView}</div>
              <FontAwesomeIcon icon={faSearch} />
              <FontAwesomeIcon icon={faEllipsisV} />
            </>
          ) : (
            ""
          )}
        </div>

        <div className="sidebar">
          {contacts.length < 1 ? (
            <p className="sidebar-alarm">
              "no contact from sidebar click on contacts to start new chat..."
            </p>
          ) : (
            contacts.map((contact, i) => (
              <div
                className="sidebar_item"
                key={i}
                onClick={() => setCCV(contact.name)}
              >
                <div className="contact-profile"></div>
                <div className="contact-box">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-lastmsg">{contact.lastMessage}</div>
                </div>
                <div className="contact-lasttime">
                  {contact.lastTime.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>

        {currentContactView ? (
          <div className="chat">
            <ChatBox />
            <SendBox user={user} reciver={currentContactView} />
          </div>
        ) : (
          ""
        )}
        {allUsersBox ? (
          <div className="users-box">
            <div className="users-box-title">Contacts</div>
            <button onClick={() => toggleUsersBox(false)}>
              <FontAwesomeIcon icon={faClose} />
            </button>
            <hr></hr>
            {allUser.map((user) => (
              <div
                className="users-item"
                onClick={() => {
                  setCCV(user.userName);
                  toggleUsersBox(false);
                }}
              >
                {user.userName}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default Main;
