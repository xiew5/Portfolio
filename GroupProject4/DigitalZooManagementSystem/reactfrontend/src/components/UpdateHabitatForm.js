import React, { useState } from 'react';
import { updateHabitat } from '../services/api';

export default function UpdateHabitatForm() {
  const [formData, setFormData] = useState({
    name: "",
    new_name: "",
    size: "",
    climate: ""
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
      setError("Current habitat name is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await updateHabitat(formData);
      setMessage(response.message || "Habitat updated successfully.");
      
      if (formData.new_name) {
        setFormData({
          name: formData.new_name,
          new_name: "",
          size: formData.size,
          climate: formData.climate
        });
      }
    } catch (err) {
      setError(err.error || "Error updating habitat: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Habitat</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Current Habitat Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter current habitat name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="new_name">New Habitat Name (optional):</label>
        <input
          type="text"
          id="new_name"
          name="new_name"
          value={formData.new_name}
          onChange={handleChange}
          placeholder="Enter new habitat name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="size">Size (optional):</label>
        <input
          type="text"
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Enter habitat size"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="climate">Climate (optional):</label>
        <input
          type="text"
          id="climate"
          name="climate"
          value={formData.climate}
          onChange={handleChange}
          placeholder="Enter habitat climate"
        />
      </div>
      
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="submit-button"
      >
        {loading ? "Updating..." : "Update Habitat"}
      </button>
    </div>
  );
}


