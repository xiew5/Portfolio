import React, { useState, useEffect } from 'react';
import { addVisitor, getMemberships } from '../services/api';

function AddVisitorForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membership: '',
    membership_start: '',
    membership_end: ''
  });
  
  const [memberships, setMemberships] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const data = await getMemberships();
        setMemberships(data);
        
        if (data.length > 0) {
          const firstMembership = data[0];
          const today = new Date();
          const endDate = new Date(today);
          endDate.setMonth(endDate.getMonth() + firstMembership.duration);
          
          setFormData({
            name: '',
            email: '',
            password: '',
            membership: firstMembership.id,
            membership_start: today.toISOString().split('T')[0],
            membership_end: endDate.toISOString().split('T')[0]
          });
        }
      } catch (err) {
        setError('error');
      }
    };
    initializeForm();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'membership' && value) {
        const selected = memberships.find(m => m.id === value);
        if (selected) {
          const today = new Date();
          const endDate = new Date(today);
          endDate.setMonth(endDate.getMonth() + selected.duration);
          
          newData.membership_start = today.toISOString().split('T')[0];
          newData.membership_end = endDate.toISOString().split('T')[0];
        }
      }
      return newData;
    });
  };
  console.log("Submitting data:", formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!formData.membership) {
        throw new Error('Please choose membership');
      }

      const response = await addVisitor(formData);
      setMessage('Register successful!');
      
      setFormData(prev => ({
        name: '',
        email: '',
        password: '',
        membership: prev.membership,
        membership_start: prev.membership_start,
        membership_end: prev.membership_end
      }));
      
    } catch (err) {
      setError(err.message || 'Register fail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Please enter name"
          />
        </div>
        <div className="form-group">
          <label>email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@domain.com"
          />
        </div>

        <div className="form-group">
          <label>password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label>membership:</label>
          <select
            name="membership"
            value={formData.membership}
            onChange={handleChange}
            required
          >
            {memberships.map(m => (
              <option key={m.id} value={m.id}>
                {m.role} ({m.duration} mouth)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>start date:</label>
          <input
            type="date"
            name="membership_start"
            value={formData.membership_start}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>end date:</label>
          <input
            type="date"
            name="membership_end"
            value={formData.membership_end}
            readOnly
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? 'loading-button' : ''}
        >
          {loading ? 'Registering' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default AddVisitorForm;