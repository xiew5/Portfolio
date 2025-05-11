import React, { useState } from 'react';
import { deleteTask } from '../services/api';

export const DeleteTaskForm = () => {
  const [taskId, setTaskId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await deleteTask(taskId);
      setMessage(response.message);
      setTaskId('');
    } catch (err) {
      setError(err.error || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-form">
      <h2>Delete Task</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskId">Task ID to Delete:</label>
          <input
            type="number"
            id="taskId"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            required
            placeholder="Enter Task ID"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Deleting...' : 'Delete Task'}
        </button>
      </form>
    </div>
  );
};

export default DeleteTaskForm;



