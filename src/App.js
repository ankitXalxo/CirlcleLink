import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Homepage from "./Homepage";
import ThemeToggle from "./ThemeToggle";
import "./deepseek.css";

function App() {
  const [{ user }, dispatch] = useStateValue();

  const handleLogout = () => {
    // Clear user from state
    dispatch({
      type: "SET_USER",
      user: null,
    });
    // You might also want to sign out from Firebase auth if you're using it
    // auth.signOut();
  };

  return (
    <div className="app">
      <Router>
        {!user ? (
          <Homepage />
        ) : (
          <div className="ds-container">
            <ThemeToggle />
            <Sidebar />
            <Routes>
              <Route
                path="/rooms/:roomId"
                element={<Chat onLogout={handleLogout} />}
              />
              <Route
                path="/"
                element={
                  <div className="ds-chat-area">
                    <div className="ds-chat-header">
                      <div>
                        <div className="ds-chat-title">
                          Welcome to CircleLink
                        </div>
                        <div className="ds-chat-status">
                          Select a room to start chatting
                        </div>
                      </div>
                      <div className="ds-chat-actions">
                        <button
                          className="logout-btn"
                          onClick={handleLogout}
                          title="Logout"
                        >
                          <i className="fas fa-sign-out-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
