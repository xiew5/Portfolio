import React, { useState, useEffect } from 'react';
import { updateAnimal, getHabitats } from '../services/api';

export default function UpdateAnimalForm() {
  const [formData, setFormData] = useState({
    species: "",
    new_species: "",
    diet: "",
    lifespan: "",
    behaviour: "",
    habitats: []
  });
  const [availableHabitats, setAvailableHabitats] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHabitats = async () => {
      try {
        const habitats = await getHabitats();
        setAvailableHabitats(habitats);
      } catch (err) {
        setError('Failed to load habitats');
      }
    };

    fetchHabitats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleHabitatChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setFormData({
      ...formData,
      habitats: selectedValues
    });
  };

  const handleUpdate = async () => {
    if (!formData.species) {
      setError("Animal species is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await updateAnimal(formData);
      setMessage(response.message || "Animal updated successfully.");
      
      setFormData({
        ...formData,
        new_species: "",
        diet: formData.diet,
        lifespan: formData.lifespan,
        behaviour: formData.behaviour,
        habitats: formData.habitats
      });
    } catch (err) {
      setError(err.error || "Error updating animal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Animal</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="species">Current Species Name:</label>
        <input
          type="text"
          id="species"
          name="species"
          value={formData.species}
          onChange={handleChange}
          required
          placeholder="Enter current species name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="new_species">New Species Name (optional):</label>
        <input
          type="text"
          id="new_species"
          name="new_species"
          value={formData.new_species}
          onChange={handleChange}
          placeholder="Enter new species name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="diet">Diet (optional):</label>
        <input
          type="text"
          id="diet"
          name="diet"
          value={formData.diet}
          onChange={handleChange}
          placeholder="Enter diet"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="lifespan">Lifespan (optional):</label>
        <input
          type="number"
          id="lifespan"
          name="lifespan"
          value={formData.lifespan}
          onChange={handleChange}
          min="1"
          placeholder="Enter lifespan in years"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="behaviour">Behaviour (optional):</label>
        <textarea
          id="behaviour"
          name="behaviour"
          value={formData.behaviour}
          onChange={handleChange}
          placeholder="Enter behaviour description"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="habitats">Habitats (optional):</label>
        <select
          id="habitats"
          name="habitats"
          multiple
          value={formData.habitats}
          onChange={handleHabitatChange}
        >
          {availableHabitats.map(habitat => (
            <option key={habitat.id} value={habitat.name}>
              {habitat.name}
            </option>
          ))}
        </select>
        <small>Hold Ctrl (or Cmd on Mac) to select multiple habitats</small>
      </div>
      
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="submit-button"
      >
        {loading ? "Updating..." : "Update Animal"}
      </button>
    </div>
  );
}


