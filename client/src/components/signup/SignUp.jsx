import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../App.css";
import RegisterNav from './RegisterNav';

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');  // Renamed state from user to username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertColor, setAlertColor] = useState('text-red-500');
  const [errors, setErrors] = useState({});  // Initialize errors as an empty object

  const validateForm = () => {
    let tempErrors = {};  // Temporarily store errors
    let formIsValid = true;

    if (!username || username.length < 8 || !/\d/.test(username)) {
      tempErrors['username'] = "Username must be at least 8 characters long and include a number.";
      formIsValid = false;
    }
    if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      tempErrors['email'] = "Invalid email format.";
      formIsValid = false;
    }
    if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      tempErrors['password'] = "Password must be at least 8 characters, include a number, and a special character.";
      formIsValid = false;
    }
    if (password !== repeatPassword) {
      tempErrors['repeatPassword'] = "Passwords do not match.";
      formIsValid = false;
    }

    setErrors(tempErrors);  // Update the state with the errors
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlertColor('text-red-500');
      return;
    }

    try {
      const response = await axios.post('/users/signup', {
        username,  
        email,
        password,
        repeatPassword
      });
      navigate('/home'); // Navigate on successful signup
    } catch (error) {
      if (error.response) {
        // Handling errors returned from the server
        setAlertMsg(error.response.data.message || "Signup failed");
        setAlertColor('text-red-500');
      } else {
        // Something happened in setting up the request that triggered an Error
        setAlertMsg("Error sending data to the server");
        setAlertColor('text-red-500');
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#b4f4de]">
      <RegisterNav />
      <div className="p-8 shadow-lg rounded border-2 border-[#374151] bg-[#d0f9eb#c7f9e8] max-w-sm w-full custom-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-center text-2xl font-extrabold text-gray-700">Welcome to Advice</h2>
          {errors.form && <p className="text-red-500 text-center">{errors.form}</p>}
          <div>
            <label className="input-label">Username:</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="input-field input-focus"/>
            {errors.username && <p className="input-error">{errors.username}</p>}
          </div>
          <div>
            <label className="input-label">Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field input-focus"/>
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>
          <div>
            <label className="input-label">Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field input-focus"/>
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>
          <div>
            <label className="input-label">Repeat Password:</label>
            <input type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required className="input-field input-focus"/>
            {errors.repeatPassword && <p className="input-error">{errors.repeatPassword}</p>}
          </div>
          <button type="submit" className="w-full bg-[#374151] hover:bg-[#0faa71] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
