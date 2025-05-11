import React, { useState, useEffect } from 'react';
import { updateTask, getTasks, getZookeepers, getAnimals } from '../services/api';

export default function UpdateTaskForm() {
  const [formData, setFormData] = useState({
    taskId: '',
    zookeeper: '',
    animal: '',
    task_type: '',
    description: '',
    scheduled_time: ''
  });

  const [tasks, setTasks] = useState([]);
  const [availableZookeepers, setAvailableZookeepers] = useState([]);
  const [availableAnimals, setAvailableAnimals] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskList = await getTasks();
        const zookeepers = await getZookeepers();
        const animals = await getAnimals();
        setTasks(taskList);
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

  const handleTaskSelection = (e) => {
    const taskId = e.target.value;
    const selectedTask = tasks.find(task => task.id === parseInt(taskId));

    if (selectedTask) {
      setFormData({
        taskId,
        zookeeper: selectedTask.zookeeper?.name || '',
        animal: selectedTask.animal?.species || '',
        task_type: selectedTask.task_type || '',
        description: selectedTask.description || '',
        scheduled_time: selectedTask.scheduled_time || ''
      });
    }
  };

  const handleUpdate = async () => {
    if (!formData.taskId) {
      setError('Please select a task to update.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await updateTask(formData.taskId, formData);
      setMessage(response.message || 'Task updated successfully.');
    } catch (err) {
      setError(err.error || 'Error updating task: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <p>Loading tasks, zookeepers, and animals...</p>;

  return (
    <div className="form-container">
      <h2>Update Task</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="taskId">Select Task to Update:</label>
        <select
          id="taskId"
          name="taskId"
          value={formData.taskId}
          onChange={handleTaskSelection}
          required
        >
          <option value="">Choose a task</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.task_type} - {task.animal_species || 'Unknown'} ({task.zookeeper_name || 'Unknown'})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="zookeeper">Zookeeper (optional):</label>
        <select
          id="zookeeper"
          name="zookeeper"
          value={formData.zookeeper}
          onChange={handleChange}
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
        <label htmlFor="animal">Animal (optional):</label>
        <select
          id="animal"
          name="animal"
          value={formData.animal}
          onChange={handleChange}
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
        <label htmlFor="task_type">Task Type (optional):</label>
        <select
          id="task_type"
          name="task_type"
          value={formData.task_type}
          onChange={handleChange}
        >
          <option value="">Select a task type</option>
          <option value="FEEDING">Feeding</option>
          <option value="MEDICAL">Medical</option>
          <option value="CLEANING">Cleaning</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Task Description (optional):</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
        />
      </div>

      <div className="form-group">
        <label htmlFor="scheduled_time">Scheduled Time (optional):</label>
        <input
          type="datetime-local"
          id="scheduled_time"
          name="scheduled_time"
          value={formData.scheduled_time}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Updating...' : 'Update Task'}
      </button>
    </div>
  );
}



