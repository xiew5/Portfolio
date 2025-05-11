import React, { useState } from 'react';
import { deleteAnimal } from '../services/api';

export const DeleteAnimalForm = () => {
    const [species, setSpecies] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await deleteAnimal(species);
            setMessage(response.message);
            setSpecies("");
        } catch (err) {
            setError(err.error || 'Failed to delete animal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-form">
            <h2>Delete Animal</h2>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="species">Animal Species to Delete:</label>
                    <input
                        type="text"
                        id="species"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete Animal'}
                </button>
            </form>
        </div>
    );
};

export default DeleteAnimalForm;


