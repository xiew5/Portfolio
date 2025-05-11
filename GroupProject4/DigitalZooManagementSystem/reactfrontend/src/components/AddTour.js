import React, { useState, useEffect } from 'react';
import { createTourWithRoute, getHabitats } from '../services/api';

const AddTour = ({ onTourAdded }) => {
  const [tourData, setTourData] = useState({
    name: '',
    description: '',
    duration: '00:00:00',
    available_spots: 20,
    start_time: '',
  });

  const [routeData, setRouteData] = useState([{
    habitat: '',
    order: 1
  }]);

  const [availableHabitats, setAvailableHabitats] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHabitats = async () => {
      try {
        setIsLoading(true);
        const habitats = await getHabitats();
        setAvailableHabitats(habitats);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching habitats:', error);
        setErrorMessage('Failed to load habitats. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabitats();
  }, []);

  const handleTourChange = (e) => {
    const { name, value } = e.target;
    setTourData({
      ...tourData,
      [name]: value,
    });

    if (name === 'start_time') {
      const dateTime = new Date(value);
      const isoDateWithoutTimezone = dateTime.toISOString().slice(0, 16);
      setTourData({ ...tourData, start_time: isoDateWithoutTimezone });
    }
  };

  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRouteData = [...routeData];
    updatedRouteData[index][name] = value;
    setRouteData(updatedRouteData);
  };

  const handleAddRoute = () => {
    setRouteData([...routeData, { habitat: '', order: routeData.length + 1 }]);
  };

  const handleRemoveRoute = (index) => {
    const updatedRouteData = routeData.filter((_, i) => i !== index);
    const reorderedRoute = updatedRouteData.map((item, i) => ({
      ...item,
      order: i + 1
    }));
    setRouteData(reorderedRoute);
  };

  const hasDuplicateHabitats = () => {
    const habitats = routeData.map(route => route.habitat);
    const uniqueHabitats = new Set(habitats.filter(h => h !== ''));
    return habitats.filter(h => h !== '').length !== uniqueHabitats.size;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tourData.start_time) {
      setErrorMessage('Start time is required.');
      return;
    }

    const formattedStartTime = tourData.start_time.replace('T', ' ');

    if (hasDuplicateHabitats()) {
      setErrorMessage('You cannot choose the same habitat more than once.');
      return;
    } else {
      setErrorMessage('');
    }

    try {
      const processedRouteData = routeData.map(route => {
        const selectedHabitat = availableHabitats.find(habitat => habitat.name === route.habitat);
        return {
          habitat: selectedHabitat ? selectedHabitat.id : route.habitat,
          order: route.order
        };
      });

      const tourPayload = {
        ...tourData,
        start_time: formattedStartTime,
        route: processedRouteData,
      };

      const response = await createTourWithRoute(tourPayload);
      console.log('Tour Created:', response);
      
      setTourData({
        name: '',
        description: '',
        duration: '00:00:00',
        available_spots: 20,
        start_time: '',
      });
      setRouteData([{
        habitat: '',
        order: 1
      }]);
      
      if (onTourAdded) {
        onTourAdded();
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      setErrorMessage('There was an error creating the tour: ' + (error.error || error.message || ''));
    }
  };

  if (isLoading) {
    return <div>Loading habitats...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Add a New Tour</h2>
      {errorMessage && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '15px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffebee' }}>
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold' }}>Tour Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={tourData.name}
            onChange={handleTourChange}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label htmlFor="description" style={{ display: 'block', fontWeight: 'bold' }}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={tourData.description}
            onChange={handleTourChange}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
          />
        </div>
        <div>
          <label htmlFor="duration" style={{ display: 'block', fontWeight: 'bold' }}>Duration (HH:mm:ss):</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={tourData.duration}
            onChange={handleTourChange}
            required
            pattern="([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])"
            placeholder="HH:mm:ss"
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label htmlFor="available_spots" style={{ display: 'block', fontWeight: 'bold' }}>Available Spots:</label>
          <input
            type="number"
            id="available_spots"
            name="available_spots"
            value={tourData.available_spots}
            onChange={handleTourChange}
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label htmlFor="start_time" style={{ display: 'block', fontWeight: 'bold' }}>Start Time (YYYY-MM-DD HH:mm):</label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            value={tourData.start_time}
            onChange={handleTourChange}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <h3 style={{ fontWeight: 'bold' }}>Tour Route</h3>
        {routeData.map((route, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <div>
              <label htmlFor={`habitat-${index}`} style={{ display: 'block', fontWeight: 'bold' }}>Habitat {index + 1}:</label>
              <select
                id={`habitat-${index}`}
                name="habitat"
                value={route.habitat}
                onChange={(e) => handleRouteChange(index, e)}
                required
                style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">Select a habitat</option>
                {availableHabitats.map(habitat => (
                  <option 
                    key={habitat.id} 
                    value={habitat.name}
                    disabled={routeData.some(r => r.habitat === habitat.name && r !== route)}
                  >
                    {habitat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`order-${index}`} style={{ display: 'block', fontWeight: 'bold', marginTop: '10px' }}>Order:</label>
              <input
                type="number"
                id={`order-${index}`}
                name="order"
                value={route.order}
                onChange={(e) => handleRouteChange(index, e)}
                required
                style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveRoute(index)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Remove Habitat
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRoute}
          style={{
            padding: '8px 16px',
            width:'120px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Add Habitat
        </button>

        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: 'skyblue',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Create Tour
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTour;