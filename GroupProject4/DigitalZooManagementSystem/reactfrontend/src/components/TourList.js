import React, { useEffect, useState } from "react";
import { getTours } from "../services/api";

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await getTours();
      console.log("Tour Data from API:", data);
      setTours(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      setError("Failed to load tours. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading tours...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h2>Tour List</h2>
      {tours.length === 0 ? (
        <p>No tours available.</p>
      ) : (
        <ul>
          {tours.map((tour) => (
            <li key={tour.id} style={{ marginBottom: '20px' }}>
              <h3>{tour.name}</h3>
              <p><strong>Duration:</strong> {tour.duration}</p>
              <p><strong>Description:</strong> {tour.description}</p>
              <p><strong>Available Spots:</strong> {tour.available_spots}</p>
              <p><strong>Scheduled:</strong> {tour.start_time ? new Date(tour.start_time).toLocaleString() : 'Not scheduled'}</p>
              <p><strong>Status:</strong> {tour.is_scheduled ? 'Scheduled' : 'Not Scheduled'}</p>
              
              <div>
                <strong>Route:</strong>
                <ol>
                  {tour.route_details && tour.route_details.length > 0 ? (
                    tour.route_details
                      .sort((a, b) => a.order - b.order)
                      .map(stop => (
                        <li key={stop.id}>
                          {stop.habitat_name} (Stop #{stop.order})
                        </li>
                      ))
                  ) : (
                    <p>No route information available</p>
                  )}
                </ol>
              </div>
              
              <div>
                <strong>Animals:</strong>
                <ul>
                  {tour.animals && tour.animals.length > 0 ? (
                    tour.animals.map(animal => (
                      <li key={animal.id}>{animal.species}</li>
                    ))
                  ) : (
                    <p>No animals on this tour</p>
                  )}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TourList;

