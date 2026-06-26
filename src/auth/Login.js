import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // const res = await fetch("https://iaryan.vercel.app/api/login", {
      const res = await fetch("https://iaryan.vercel.app/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo-wrap">
          <img src="/icon.png" alt="logo" className="login-logo" />
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h1 className="login-title">Welcome back.</h1>
          {/* <p className="login-subtitle">Your vault is waiting.</p> */}
        </div>

        {/* Fields */}
        <div className="login-fields">
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              className="login-input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;