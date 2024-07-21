import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        { username, password },
        { withCredentials: true }
      );

      console.log('Login successful:', response.data);

      navigate('/search'); 
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="containerr-fluid">
      <div className="login-page">
        <div className="login-container">
          <h2 className="login-title">Login to Your Account</h2>
          <p className="login-description">Please enter your credentials to access the application. If you don’t have an account, please sign up.</p>
          {error && <p className="login-error">{error}</p>}
          <div className="login-form">
            <div className="login-input-group">
              <i className="fas fa-user login-icon"></i>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="login-input"
              />
            </div>
            <div className="login-input-group">
              <i className="fas fa-lock login-icon"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="login-input"
              />
            </div>
            <button onClick={handleLogin} className="login-btn">
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
            <p className="login-footer">
              Don't have an account? <a href="/signup">Sign up here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
