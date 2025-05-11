import React, { useEffect, useState } from "react";
import { getEvents } from "../services/api";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      console.log("Events Data from API:", data);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch Events:", error);
    }
  };

  return (
    <div>
      <h2>Event List</h2>
      <ul>
        {events.length === 0 ? <p>No events available.</p> : null}
        {events.map((event, index) => (
          <li key={index}>
            No.{event.id} - <strong>{event.name}</strong>
            <br />
            <small>| Memberships: {event.memberships.join(", ") || "Unknown Membership"}</small>
            <br />
            <small>| Scheduled: {new Date(event.time).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;

