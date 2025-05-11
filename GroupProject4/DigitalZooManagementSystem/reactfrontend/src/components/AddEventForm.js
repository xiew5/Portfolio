import React, { useState, useEffect } from 'react';
import { addEvent, getMemberships } from '../services/api';

function AddEventForm() {
  const [formData, setFormData] = useState({
    memberships: [],
    name: '',
    time: ''
  });

  const [availableMemberships, setAvailableMemberships] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberships = await getMemberships();
        setAvailableMemberships(memberships);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMembershipChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({
        ...formData,
        memberships: selectedValues
      });
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await addEvent(formData);
      setMessage(response.message);
      setFormData({
        memberships: '',
        name: '',
        time: ''
      });
    } catch (err) {
      setError(err.error || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <p>Loading memberships...</p>;

  return (
    <div className="form-container">
      <h2>Add New Event</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="name">Event Name:</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Scheduled Time:</label>
          <input
            type="datetime-local"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="memberships">Memberships:</label>
          <select
            id="memberships"
            name="memberships"
            multiple
            value={formData.memberships}
            onChange={handleMembershipChange}
          >
            {availableMemberships.map(membership => (
              <option key={membership.id} value={membership.role}>
                {membership.role}
              </option>
            ))}
          </select>
          <small>Hold Ctrl (or Cmd on Mac) to select multiple memberships</small>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}

export default AddEventForm;