// RenewMembership.js
import React, { useState, useEffect } from 'react';

function RenewMembership({ visitorData }) {
  const [role, setRole] = useState('L1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log(visitorData);
  }, [visitorData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !role) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/update-membership/${visitorData?.name}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membership_id: role,
          membership_start_date: startDate,
          membership_end_date: endDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Membership renewed successfully!');
      } else {
        setError(data.error || 'Failed to renew membership');
      }
    } catch (err) {
      setError('Error renewing membership');
    }
  };

  return (
    <div>
      <h3>Renew Membership</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Membership Level:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="L1">Level 1 Member</option>
            <option value="L2">Level 2 Member</option>
            <option value="L3">Level 3 Member</option>
          </select>
        </div>

        <div>
          <label>Membership Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Membership End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Renew Membership</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default RenewMembership;
