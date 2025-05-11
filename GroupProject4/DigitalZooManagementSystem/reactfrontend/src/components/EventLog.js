import React from 'react';
import RenewMembership from './RenewMembership';

function EventLog({ visitorData }) {
  const { membership, events } = visitorData || {};
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Event Log</h2>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        <strong>Your Membership Level:</strong> {membership || 'None'}
      </p>
      
      {events ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>Event ID</th>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>Event Name</th>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>Event Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{event.id}</td>
                <td style={{ padding: '10px' }}>{event.name}</td>
                <td style={{ padding: '10px' }}>{new Date(event.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#ff6347', fontSize: '16px' }}>No events available</p>
      )}
      
      <RenewMembership visitorData={visitorData} />
    </div>
  );
}

export default EventLog;