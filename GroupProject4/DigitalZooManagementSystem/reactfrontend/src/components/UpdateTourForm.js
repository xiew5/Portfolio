import React, { useState, useEffect } from 'react';
import { updateTour, getTours, getHabitats, scheduleTour } from '../services/api';

export default function UpdateTourForm({ onTourUpdated }) {
  const [formData, setFormData] = useState({
    tourId: '',
    name: '',
    description: '',
    duration: '',
    available_spots: '',
    start_time: '',
    is_scheduled: false
  });

  const [tours, setTours] = useState([]);
  const [availableHabitats, setAvailableHabitats] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourList = await getTours();
        const habitats = await getHabitats();
        setTours(tourList);
        setAvailableHabitats(habitats);
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

    if (name === 'start_time') {
      const dateTime = new Date(value);
      const formattedDateTime = dateTime.toISOString().slice(0, 16);
      setFormData(prev => ({
        ...prev,
        start_time: formattedDateTime
      }));
    }
  };

  const handleTourSelection = (e) => {
    const tourId = e.target.value;
    const selectedTour = tours.find(tour => tour.id === parseInt(tourId));

    if (selectedTour) {
      let formattedStartTime = '';
      if (selectedTour.start_time) {
        const date = new Date(selectedTour.start_time);
        formattedStartTime = date.toISOString().slice(0, 16);
      }

      setFormData({
        tourId,
        name: selectedTour.name || '',
        description: selectedTour.description || '',
        duration: selectedTour.duration || '',
        available_spots: selectedTour.available_spots || '',
        start_time: formattedStartTime,
        is_scheduled: selectedTour.is_scheduled || false
      });
      
      setError('');
      setMessage('');
    }
  };

  const handleUpdate = async () => {
    if (!formData.tourId) {
      setError('Please select a tour to update.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      let apiData = { ...formData };
      if (apiData.start_time) {
        apiData.start_time = apiData.start_time.replace('T', ' ');
      }

      const response = await updateTour(formData.tourId, apiData);
      setMessage('Tour updated successfully.');
      
      const updatedTours = await getTours();
      setTours(updatedTours);
      
      if (onTourUpdated) {
        onTourUpdated();
      }
    } catch (err) {
      setError(err.error || 'Error updating tour: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!formData.tourId) {
      setError('Please select a tour to schedule.');
      return;
    }

    if (!formData.start_time) {
      setError('Please select a start time for scheduling.');
      return;
    }

    setIsScheduling(true);
    setMessage('');
    setError('');

    try {
      const formattedStartTime = formData.start_time.replace('T', ' ');
      
      const response = await scheduleTour(formData.tourId, formattedStartTime);
      setMessage('Tour scheduled successfully!');
      
      setFormData(prev => ({
        ...prev,
        is_scheduled: true
      }));
      
      const updatedTours = await getTours();
      setTours(updatedTours);
      
      if (onTourUpdated) {
        onTourUpdated();
      }
    } catch (err) {
      if (err && err.error && err.error.includes('already booked')) {
        setError(`Scheduling conflict: ${err.error}`);
      } else {
        setError(err.error || 'Error scheduling tour: ' + (err.message || ''));
      }
    } finally {
      setIsScheduling(false);
    }
  };

  if (dataLoading) return <p>Loading tours and habitats...</p>;

  const selectedTour = formData.tourId 
    ? tours.find(tour => tour.id === parseInt(formData.tourId)) 
    : null;

  const habitatNames = selectedTour?.route_details
    ?.sort((a, b) => a.order - b.order)
    ?.map(stop => stop.habitat_name)
    ?.join(', ');

  return (
    <div className="form-container">
      <h2>Update & Schedule Tour</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="scheduling-info" style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '10px', 
        borderRadius: '4px', 
        marginBottom: '15px',
        border: '1px solid #dee2e6'
      }}>
        <p><strong>Note:</strong> The system automatically prevents scheduling conflicts. Tours cannot be scheduled if any of their habitats are already booked for another tour during the same time period.</p>
      </div>

      <div className="form-group">
        <label htmlFor="tourId">Select Tour:</label>
        <select
          id="tourId"
          name="tourId"
          value={formData.tourId}
          onChange={handleTourSelection}
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

      {selectedTour && (
        <div className="tour-info" style={{ 
          backgroundColor: '#e9f7ef', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          <h3>Tour Route</h3>
          <p><strong>Habitats:</strong> {habitatNames || 'No habitats assigned'}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Tour Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (HH:mm:ss):</label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          pattern="([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])"
          placeholder="HH:mm:ss"
        />
      </div>

      <div className="form-group">
        <label htmlFor="available_spots">Available Spots:</label>
        <input
          type="number"
          id="available_spots"
          name="available_spots"
          value={formData.available_spots}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="start_time">
          {formData.is_scheduled ? 'Scheduled Time:' : 'Schedule Time:'}
        </label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status:</label>
        <div style={{ 
          fontWeight: 'bold', 
          color: formData.is_scheduled ? '#4CAF50' : '#FF9800' 
        }}>
          {formData.is_scheduled ? 'Scheduled' : 'Not Scheduled'}
        </div>
      </div>

      <p>Note: To update the route order, please create a new tour.</p>

      <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="submit-button"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Updating...' : 'Update Tour Details'}
        </button>

        <button
          onClick={handleSchedule}
          disabled={isScheduling || formData.is_scheduled || !formData.start_time}
          className="schedule-button"
          style={{
            padding: '10px 20px',
            backgroundColor: formData.is_scheduled ? '#cccccc' : 
                             !formData.start_time ? '#cccccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (isScheduling || formData.is_scheduled || !formData.start_time) ? 
                    'not-allowed' : 'pointer'
          }}
        >
          {isScheduling ? 'Scheduling...' : 
           formData.is_scheduled ? 'Already Scheduled' : 
           !formData.start_time ? 'Select Time First' : 'Schedule Tour'}
        </button>
      </div>
    </div>
  );
}

