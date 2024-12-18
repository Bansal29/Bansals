import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-name">Bansal's</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          {user ? (
            <div>
              <Link to="/upload" className="navbar-link">
                Upload Media
              </Link>
              <Link to="/signup" className="navbar-link signup-btn">
                New Admin register
              </Link>
              <Link to="/admin" className="navbar-link signup-btn">
                View Admins
              </Link>
              <button onClick={logout} className="navbar-btn logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="navbar-link signup-btn">
                Admin Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
