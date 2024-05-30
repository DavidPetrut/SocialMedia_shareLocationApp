import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../App.css";
import RegisterNav from './RegisterNav';
import { useAuth } from './AuthContext'; 

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitting login form...");
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      console.log("Response from server:", data);
      if (response.ok) {
        console.log("Login successful. Navigating to home...");
        login(data.token, { username: data.username, _id: data._id }); // Ensure both username and _id are passed
      } else {
        console.log("Login failed. Error:", data.message || "Login failed");
        setError(data.message || "Login failed");
      }
    };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#b4f4de]">
      <RegisterNav />
      <div className="p-8 shadow-lg rounded border-2 border-[#374151] bg-[#d0f9eb#c7f9e8] max-w-sm w-full custom-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-center text-2xl font-extrabold text-gray-700">Login</h2>
          <div>
            <label className="input-label">Name:</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="input-field input-focus"/>
          </div>
          <div>
            <label className="input-label">Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field input-focus"/>
            {error && <p className="input-error">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-[#374151] hover:bg-[#0faa71] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
