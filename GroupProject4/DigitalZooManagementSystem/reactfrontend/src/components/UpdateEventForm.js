import React, { useState, useEffect } from 'react';
import { updateEvent, getEvents, getMemberships } from '../services/api';

export default function UpdateEventForm() {
  const [formData, setFormData] = useState({
    eventId: '',
    name: '',
    time: '',
    memberships: []
  });

  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventList = await getEvents();
        setEvents(eventList);
      } catch (err) {
        setError('Failed to load events');
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
      [name]: value,
    });
  };

  const handleEventSelection = (e) => {
    const eventId = e.target.value;
    const selectedEvent = events.find((event) => event.id === parseInt(eventId));

    if (selectedEvent) {

      let formattedTime = '';
      if (selectedEvent.time) {
        const date = new Date(selectedEvent.time);
        formattedTime = date.toISOString().slice(0, 16)
      }

      setFormData({
        eventId,
        name: selectedEvent.name || '',
        time: formattedTime,
        memberships: selectedEvent.memberships || []
      });
    }
  };

  const handleUpdate = async () => {
    if (!formData.eventId) {
      setError('Please select an event to update.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const eventData = {
        name: formData.name,
        time: formData.time,
        memberships: formData.memberships
      };

      console.log('Updating event with data:', eventData);
      const response = await updateEvent(formData.eventId, eventData);

      setMessage('Event updated successfully!');
      console.log('Update response:', response);
    } catch (err) {
      console.error('Full error:', err);

      
    }
  }

  if (dataLoading) return <p>Loading events...</p>;

  return (
    <div className="form-container">
      <h2>Update Event</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="eventId">Select Event to Update:</label>
        <select
          id="eventId"
          name="eventId"
          value={formData.eventId}
          onChange={handleEventSelection}
          required
        >
          <option value="">Choose an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} - {new Date(event.time).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="name">Event Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter event name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Event Time:</label>
        <input
          type="datetime-local"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Updating...' : 'Update Event'}
      </button>
    </div>
  );
}