import React, { useEffect, useMemo, useState } from "react";
import { useStateValue } from "./StateProvider";
import SidebarChat from "./SidebarChat";
import db from "./firebase";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState("");
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .onSnapshot((snapshot) =>
        setRooms(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return rooms;
    const q = query.toLowerCase();
    return rooms.filter((r) => r.data?.name?.toLowerCase().includes(q));
  }, [rooms, query]);

  const handleLogout = () => {
    dispatch({
      type: "SET_USER",
      user: null,
    });
  };

  return (
    <div className="ds-sidebar">
      <div className="ds-sidebar-header">
        <h1>
          <i className="fas fa-comments"></i> Chat Rooms
        </h1>
      </div>

      {/* User Info Section */}
      <div className="ds-user-info">
        <div className="ds-user-avatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} />
          ) : (
            <i className="fas fa-user"></i>
          )}
        </div>
        <div className="ds-user-details">
          <div className="ds-user-name">{user?.displayName || "User"}</div>
          <div className="ds-user-status">Online</div>
        </div>
        <button className="ds-logout-btn" onClick={handleLogout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>

      <div className="ds-search-container">
        <div className="ds-search-box">
          <i className="fas fa-search"></i>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search rooms..."
          />
        </div>
      </div>

      <div className="ds-rooms-list">
        <SidebarChat addNewChat />
        {filtered.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
