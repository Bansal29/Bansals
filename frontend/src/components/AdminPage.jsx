import React, { useEffect, useState, useContext } from "react";
import { getAllUsers } from "../api/api"; // Import your API call
import "../styles/AdminPage.css";
import { AuthContext } from "../context/AuthContext";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const { loggedinuser } = useContext(AuthContext); // Currently logged-in user

  useEffect(() => {
    // Fetch all users on component mount
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers(); // Get all users from the backend
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {users.map((currentUser) => (
            <tr key={currentUser.id}>
              <td>{currentUser.username}</td>
              <td>{currentUser.email}</td>
              <td>
                {showPasswords[currentUser.id] ? (
                  <span>{currentUser.password}</span>
                ) : (
                  <span>
                    ****************************************************************************************
                  </span>
                )}
                <button
                  onClick={() => togglePasswordVisibility(currentUser.id)}
                  className="eye-icon"
                >
                  👁️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
