import React, { useState } from 'react';
import { deleteEvent } from '../services/api';

export const DeleteEventForm = () => {
    const [id, setID] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await deleteEvent(id);
            setMessage(response.message);
            setID("");
        } catch (err) {
            setError(err.error || 'Failed to delete event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-form">
            <h2>Delete Event</h2>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id">Event ID to Delete:</label>
                    <input
                        type="text"
                        id="id"
                        value={id}
                        onChange={(e) => setID(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete Event'}
                </button>
            </form>
        </div>
    );
};

export default DeleteEventForm;


