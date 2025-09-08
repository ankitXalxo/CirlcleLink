import React, { useEffect, useMemo, useState } from "react";
import { useStateValue } from "./StateProvider";
import SidebarChat from "./SidebarChat";
import db from "./firebase";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
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
    setShowProfileModal(false);
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="ds-sidebar">
      <div className="ds-sidebar-header">
        <h1>
          <i className="fas fa-comments"></i> Chat Rooms
        </h1>
        <div className="ds-header-actions">
          <div className="ds-user-profile" onClick={openProfileModal}>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="ds-profile-avatar"
              />
            ) : (
              <div className="ds-profile-avatar">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal Overlay */}
      {showProfileModal && (
        <div className="ds-profile-modal-overlay" onClick={closeProfileModal}>
          <div
            className="ds-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ds-modal-close" onClick={closeProfileModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="ds-modal-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} />
              ) : (
                <div className="ds-modal-avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>

            <div className="ds-modal-user-info">
              <h3 className="ds-modal-name">{user?.displayName || "User"}</h3>
              <p className="ds-modal-email">{user?.email || ""}</p>
            </div>

            <div className="ds-modal-divider"></div>

            <button className="ds-modal-logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

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
