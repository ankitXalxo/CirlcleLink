import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Homepage from "./Homepage";
import ThemeToggle from "./ThemeToggle";
import "./deepseek.css";

function App() {
  const [{ user }] = useStateValue();

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
              <Route path="/rooms/:roomId" element={<Chat />} />
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
