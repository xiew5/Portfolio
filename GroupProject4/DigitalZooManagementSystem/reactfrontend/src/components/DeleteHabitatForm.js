import React, { useState } from 'react';
import { deleteHabitat } from '../services/api';

export const DeleteHabitatForm = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await deleteHabitat(name);
            setMessage(response.message);
            setName("");
        } catch (err) {
            setError(err.error || 'Failed to delete habitat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-form">
            <h2>Delete Habitat</h2>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Habitat Name to Delete:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete Habitat'}
                </button>
            </form>
        </div>
    );
};

export default DeleteHabitatForm;


