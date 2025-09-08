// import React, { useEffect, useState } from "react";
// import "./App.js";
// import { Avatar, IconButton } from "@mui/material";
// import MoreVert from "@mui/icons-material/MoreVert";
// import AttachFile from "@mui/icons-material/AttachFile";
// import SearchOutlined from "@mui/icons-material/SearchOutlined";
// import { useParams } from "react-router-dom";
// import { useStateValue } from "./StateProvider";
// import db from "./firebase";
// import firebase from "firebase/compat/app";
// // import MicIcon from "@mui/icons-material/MicIcon";
// // import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticonIcon";

// import "./Chat.css";

// function Chat() {
//   const [input, setInput] = useState("");
//   const [seed, setSeed] = useState("");
//   const { roomId } = useParams();
//   const [roomName, setRoomName] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [{ user }] = useStateValue();

//   useEffect(() => {
//     if (roomId) {
//       db.collection("rooms")
//         .doc(roomId)
//         .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

//       db.collection("rooms")
//         .doc(roomId)
//         .collection("messages")
//         .orderBy("timestamp", "asc")
//         .onSnapshot((snapshot) =>
//           setMessages(snapshot.docs.map((doc) => doc.data()))
//         );
//     }
//   }, [roomId]);

//   useEffect(() => {
//     setSeed(Math.floor(Math.random() * 5000));
//   }, [roomId]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     console.log("You typed >>> ", input);

//     db.collection("rooms").doc(roomId).collection("messages").add({
//       message: input,
//       name: user.displayName,
//       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//     });

//     setInput("");
//   };

//   return (
//     <div className="chat">
//       <div className="chat__header">
//         <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
//         <div className="chat__headerInfo">
//           <h3>{roomName}</h3>
//           <p>
//             last seen {""}
//             {new Date(
//               messages[messages.length - 1]?.timestamp?.toDate()
//             ).toUTCString()}
//           </p>
//         </div>

//         <div className="chat__headerRight">
//           <IconButton>
//             <SearchOutlined />
//           </IconButton>
//           <IconButton>
//             <AttachFile />
//           </IconButton>
//           <IconButton>
//             <MoreVert />
//           </IconButton>
//         </div>
//       </div>

//       <div className="chat__body">
//         {messages.map((message) => (
//           <p
//             className={`chat__message ${
//               message.name === user.displayName && "chat__reciever"
//             }`}
//           >
//             <span className="chat__name">{message.name}</span>
//             {message.message}
//             <span className="chat__timestamp">
//               {new Date(message.timestamp?.toDate()).toUTCString()}
//             </span>
//           </p>
//         ))}
//       </div>

//       <div className="chat__footer">
//         <form>
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             type="text"
//             placeholder="Type a message"
//           />
//           <button onClick={sendMessage} type="submit">
//             Send a message
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Chat;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import db from "./firebase";
import firebase from "firebase/compat/app";

function Chat() {
  const { roomId } = useParams();
  const [{ user }] = useStateValue();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    const unsubRoom = db
      .collection("rooms")
      .doc(roomId)
      .onSnapshot((snap) => {
        setRoomName(snap.data()?.name || "Select a room");
      });
    const unsubMsgs = db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
    return () => {
      unsubRoom();
      unsubMsgs();
    };
  }, [roomId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastSeen = useMemo(() => {
    const ts = messages[messages.length - 1]?.timestamp;
    const date = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    return date ? date.toUTCString() : "—";
  }, [messages]);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim() || !roomId) return;
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        message: input,
        name: user?.displayName || "You",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setInput("");
  };

  return (
    <div className="ds-chat-area">
      {/* Header */}
      <div className="ds-chat-header">
        <div>
          <div className="ds-chat-title">{roomName}</div>
          <div className="ds-chat-status">last seen {lastSeen}</div>
        </div>
        <div className="ds-chat-actions">
          <i className="fas fa-user-friends"></i>
          <i className="fas fa-search"></i>
          <i className="fas fa-ellipsis-v"></i>
        </div>
      </div>

      {/* Messages */}
      <div className="ds-chat-messages">
        {messages.map((msg) => {
          const mine = msg.name === (user?.displayName || "You");
          const time = msg.timestamp?.toDate
            ? msg.timestamp.toDate()
            : new Date();
          return (
            <div
              key={msg.id}
              className={`ds-message ${mine ? "self" : "other"}`}
            >
              {!mine && msg.name && (
                <div className="ds-message-sender">{msg.name}</div>
              )}
              <div className="ds-message-bubble">{msg.message}</div>
              <div className="ds-message-time">{time.toUTCString()}</div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="ds-chat-input">
        <div className="ds-input-actions">
          <i className="far fa-smile"></i>
          <i className="fas fa-paperclip"></i>
        </div>
        <input
          type="text"
          className="ds-message-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
        />
        <button className="ds-send-button" onClick={sendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default Chat;
