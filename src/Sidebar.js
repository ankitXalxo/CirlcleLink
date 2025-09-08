import React, { useEffect, useMemo, useState } from "react";
import { useStateValue } from "./StateProvider";
import SidebarChat from "./SidebarChat";
import db from "./firebase";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState("");
  const [{ user }] = useStateValue();

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

  return (
    <div className="ds-sidebar">
      <div className="ds-sidebar-header">
        <h1>
          <i className="fas fa-comments"></i> Chat Rooms
        </h1>
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
