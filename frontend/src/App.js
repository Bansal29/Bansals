import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import UploadMediaForm from "./components/UploadMediaForm";
import MediaList from "./components/MediaList";
import { AuthProvider } from "./context/AuthContext";
import "./styles/App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MediaList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/upload" element={<UploadMediaForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
