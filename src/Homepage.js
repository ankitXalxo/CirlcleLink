import React, { useEffect } from "react";
import "./homepage.css";
import { auth, provider } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import ThemeToggle from "./ThemeToggle";

function Homepage() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // Restart chat bubble animation
    const interval = setInterval(() => {
      document.querySelectorAll(".message").forEach((msg) => {
        msg.style.animation = "none";
        setTimeout(() => {
          msg.style.animation = "";
        }, 10);
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const signIn = () => {
    auth.signInWithPopup(provider).then((result) => {
      dispatch({
        type: actionTypes.SET_USER,
        user: result.user,
      });
    });
  };

  return (
    <div className="hero-container">
      {/* Theme Toggle Button for Homepage */}
      <ThemeToggle />

      <div className="logo">
        <div className="logo-icon">
          <i className="fas fa-link"></i>
        </div>
        <h1>CircleLink</h1>
        <p>Connect your circles, seamlessly</p>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h2>
            Group messaging <span>reimagined</span> for your social circles
          </h2>
          <p>
            CircleLink helps you stay connected with different groups in your
            life - friends, family, coworkers, and communities - all in one
            beautifully designed app with end-to-end encryption.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={signIn}>
              <i className="fab fa-google"></i> Sign up with Google
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-download"></i> Download App
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="mockup">
            <div className="mockup-content">
              <div className="mockup-header">
                <div className="mockup-avatar">
                  <i className="fas fa-users"></i>
                </div>
                <div className="mockup-header-text">
                  <h3>Family Group</h3>
                  <p>7 participants</p>
                </div>
              </div>

              <div className="mockup-chat">
                <div className="message incoming">
                  Hey everyone! Dinner at our place this Sunday?
                </div>
                <div className="message outgoing">
                  Sounds great! What time should we come?
                </div>
                <div className="message incoming">
                  How does 6 PM work for everyone?
                </div>
              </div>

              <div className="mockup-input">
                <i className="fas fa-paper-plane"></i> Type a message...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-number">500K+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">256-bit</div>
          <div className="stat-label">Encryption</div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
