"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !username) {
      toast.error("Please fill out all fields.", { position: "top-right" });
      return;
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        toast.success("Logged in successfully!", { position: "top-right" });
        // Force a hard navigation to ensure server-side cookie is picked up
        window.location.href = '/admin-panel';
      } else {
        console.error('Login failed:', data.error);
        toast.error(data.error || "Login failed", { position: "top-right" });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login", { position: "top-right" });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="row">
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <button type="submit" className="common_btn">
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
