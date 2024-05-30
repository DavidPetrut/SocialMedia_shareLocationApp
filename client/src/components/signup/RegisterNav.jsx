import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import "../../App.css"

function RegisterNav() {
    return (
      <nav className="flex justify-between items-center p-4 bg-transparent mr-10">
        <div className="flex flex-col"> {/* Adjust layout for all sizes */}
          <img src={logo} alt="Logo" className="h-20 w-auto mb-4" /> {/* Logo with bottom margin */}
          <div>
            <Link to="/signup" className="register-btn mb-2">Sign Up</Link> {/* Buttons directly beneath logo */}
            <Link to="/login" className="register-btn">Login</Link>
          </div>
        </div>
      </nav>
    );
}


export default RegisterNav;
