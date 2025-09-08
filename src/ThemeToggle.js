import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";

function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [{ user }] = useStateValue();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setIsDarkTheme(isDark);
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("light-theme", !isDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkTheme;
    setIsDarkTheme(newIsDark);
    document.body.classList.toggle("dark-theme", newIsDark);
    document.body.classList.toggle("light-theme", !newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  // Different positioning for homepage vs app
  const toggleClass = user
    ? "ds-theme-toggle"
    : "ds-theme-toggle homepage-toggle";

  return (
    <button className={toggleClass} onClick={toggleTheme}>
      <div className={`ds-toggle-thumb ${isDarkTheme ? "dark" : ""}`}>
        <i className={`fas ${isDarkTheme ? "fa-moon" : "fa-sun"}`}></i>
      </div>
      <i className="ds-toggle-icon ds-toggle-sun fas fa-sun"></i>
      <i className="ds-toggle-icon ds-toggle-moon fas fa-moon"></i>
    </button>
  );
}

export default ThemeToggle;
