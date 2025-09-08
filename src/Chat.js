import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import db from "./firebase";
import firebase from "firebase/compat/app";

function Chat({ onLogout }) {
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
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
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
