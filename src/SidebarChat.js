import React, { useEffect, useState } from "react";
import db from "./firebase";
import { NavLink } from "react-router-dom";

function SidebarChat({ id, name, addNewChat }) {
  const [lastMessage, setLastMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [roomName, setRoomName] = useState("");

  // Load last message
  useEffect(() => {
    if (id) {
      const unsub = db
        .collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setLastMessage(data[0]?.message || "");
        });
      return () => unsub();
    }
  }, [id]);

  // Create room in Firebase
  const handleCreateChat = () => {
    if (roomName.trim()) {
      db.collection("rooms").add({ name: roomName.trim() });
      setRoomName("");
      setShowPopup(false);
    }
  };

  // For "Add new chat" button
  if (addNewChat) {
    return (
      <>
        <div onClick={() => setShowPopup(true)} className="ds-room-item">
          <div className="ds-room-icon">
            <i className="fas fa-plus"></i>
          </div>
          <div className="ds-room-info">
            <div className="ds-room-name">Add new chat</div>
            <div className="ds-room-desc">Create a new room</div>
          </div>
        </div>

        {showPopup && (
          <div className="chat-popup-overlay">
            <div className="chat-popup">
              <div className="popup-header">
                <h2>Create a new chat room</h2>
                <p>Connect with your team or community</p>
              </div>

              <div className="popup-content">
                <div className="input-group">
                  <label htmlFor="roomName">Room Name</label>
                  <input
                    type="text"
                    id="roomName"
                    className="room-input"
                    placeholder="Enter a room name"
                    maxLength="30"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    autoFocus
                  />
                  <i className="fas fa-hashtag input-icon"></i>
                  <div className="character-count">{roomName.length}/30</div>
                </div>
              </div>

              <div className="popup-actions">
                <button
                  className="btn btn-cancel"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-create"
                  onClick={handleCreateChat}
                  disabled={!roomName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Normal room item
  return (
    <NavLink
      to={`/rooms/${id}`}
      className={({ isActive }) =>
        isActive ? "ds-room-item active" : "ds-room-item"
      }
    >
      <div className="ds-room-icon">
        <i className="fas fa-hashtag"></i>
      </div>
      <div className="ds-room-info">
        <div className="ds-room-name">{name}</div>
        <div className="ds-room-desc">{lastMessage || "Say hello 👋"}</div>
      </div>
    </NavLink>
  );
}

export default SidebarChat;
