import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginAPI } from "../api/api";
import "../styles/Form.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    try {
      const { data } = await loginAPI({ email, password });
      login(data);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed!");
    } finally {
      setLoading(false); // Set loading to false after the API call completes
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {" "}
        {/* Disable button while loading */}
        {loading ? (
          <div className="spinner"></div> // Show spinner while loading
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
