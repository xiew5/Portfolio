import React, { useState, useEffect } from 'react';
import { addTask, getZookeepers, getAnimals } from '../services/api';

function AddTaskForm() {
  const [formData, setFormData] = useState({
    zookeeper: '',
    animal: '',
    task_type: '',
    description: '',
    scheduled_time: ''
  });

  const [availableZookeepers, setAvailableZookeepers] = useState([]);
  const [availableAnimals, setAvailableAnimals] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zookeepers = await getZookeepers();
        const animals = await getAnimals();
        setAvailableZookeepers(zookeepers);
        setAvailableAnimals(animals);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await addTask(formData);
      setMessage(response.message);
      setFormData({
        zookeeper: '',
        animal: '',
        task_type: '',
        description: '',
        scheduled_time: ''
      });
    } catch (err) {
      setError(err.error || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <p>Loading zookeepers and animals...</p>;

  return (
    <div className="form-container">
      <h2>Add New Task</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="zookeeper">Zookeeper:</label>
          <select
            id="zookeeper"
            name="zookeeper"
            value={formData.zookeeper}
            onChange={handleChange}
            required
          >
            <option value="">Select a zookeeper</option>
            {availableZookeepers.map(zookeeper => (
              <option key={zookeeper.id} value={zookeeper.name}>
                {zookeeper.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="animal">Animal:</label>
          <select
            id="animal"
            name="animal"
            value={formData.animal}
            onChange={handleChange}
            required
          >
            <option value="">Select an animal</option>
            {availableAnimals.map(animal => (
              <option key={animal.id} value={animal.species}>
                {animal.species}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task_type">Task Type:</label>
          <select
            id="task_type"
            name="task_type"
            value={formData.task_type}
            onChange={handleChange}
            required
          >
            <option value="">Select a task type</option>
            <option value="FEEDING">Feeding</option>
            <option value="MEDICAL">Medical</option>
            <option value="CLEANING">Cleaning</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Task Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheduled_time">Scheduled Time:</label>
          <input
            type="datetime-local"
            id="scheduled_time"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

export default AddTaskForm;


