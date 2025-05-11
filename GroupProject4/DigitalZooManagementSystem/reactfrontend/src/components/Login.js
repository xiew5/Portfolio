import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginVisitor, getVisitorAndEvents } from '../services/api';

function Login({ setIsAuthenticated, setVisitorData }) {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginVisitor(formData);
      if (response.success) {
        setIsAuthenticated(true);
  
        const visitorEvents = await getVisitorAndEvents(formData.name);
        if (visitorEvents.success) {
          setVisitorData(visitorEvents);
          navigate('/eventlog');
        } else {
          setError(visitorEvents.message);
        }
      } else {
        setError('Invalid name or password');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
