/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AnimatedLogo from '../components/AnimatedLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: 'error' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // prevent double click issues
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (
      email === "2410305056@geetauniversity.edu.in" &&
      password === "Yashjaat2007@"
    ) {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("mentorEmail", email);

      setMessage({
        text: "Login successful. Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      setMessage({
        text: "Invalid credentials",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <AnimatedLogo />

      <h2>Login</h2>

      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 10 }}>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      <div style={{ marginTop: 20 }}>
        <GoogleLogin
          onSuccess={() => {
            setMessage({
              text: "Google login not configured",
              type: "error",
            });
          }}
          onError={() => {
            setMessage({
              text: "Google login failed",
              type: "error",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Login;
