import React, { useState, useEffect } from 'react';
import { updateZookeeper } from '../services/api';

export default function UpdateZookeeperForm() {
  const [formData, setFormData] = useState({
    name: "",
    new_name: "",
    role: "",
    email: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdate = async () => {
    if (!formData.name) {
      setError("Zookeeper name is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await updateZookeeper(formData);
      setMessage(response.message || "Zookeeper updated successfully.");

      setFormData({
        ...formData,
        new_name: "",
        role: formData.role,
        email: formData.email
      });
    } catch (err) {
      setError(err.error || "Error updating zookeeper: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Zookeeper</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Current Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter current zookeeper name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="new_name">New Name (optional):</label>
        <input
          type="text"
          id="new_name"
          name="new_name"
          value={formData.new_name}
          onChange={handleChange}
          placeholder="Enter new name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="role">Role (optional):</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Enter role (e.g., L1, L2, Admin)"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email (optional):</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>
      
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="submit-button"
      >
        {loading ? "Updating..." : "Update Zookeeper"}
      </button>
    </div>
  );
}