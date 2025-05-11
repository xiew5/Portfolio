import React, { useState, useEffect } from 'react';
import { deleteTour, getTours } from '../services/api';

const DeleteTourForm = () => {
  const [tourId, setTourId] = useState('');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(data);
      } catch (err) {
        setError('Failed to load tours');
      } finally {
        setDataLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const response = await deleteTour(tourId);
      setMessage(response.message);
      setTourId('');
      
      const updatedTours = await getTours();
      setTours(updatedTours);
    } catch (err) {
      setError(err.error || 'Failed to delete tour');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <p>Loading tours...</p>;

  return (
    <div className="delete-form">
      <h2>Delete Tour</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tourId">Select Tour to Delete:</label>
          <select
            id="tourId"
            value={tourId}
            onChange={(e) => setTourId(e.target.value)}
            required
          >
            <option value="">Choose a tour</option>
            {tours.map(tour => (
              <option key={tour.id} value={tour.id}>
                {tour.name} - {tour.is_scheduled ? 'Scheduled' : 'Not Scheduled'}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !tourId} 
          className="submit-button"
        >
          {loading ? 'Deleting...' : 'Delete Tour'}
        </button>
      </form>
    </div>
  );
};

export default DeleteTourForm;

