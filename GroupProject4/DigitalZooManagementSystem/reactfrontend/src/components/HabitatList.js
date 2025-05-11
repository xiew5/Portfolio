import React, { useEffect, useState } from "react";
import { getHabitats } from '../services/api';

export const HabitatList = () => {
    const [habitats, setHabitats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHabitats = async () => {
            try {
                setLoading(true);
                const data = await getHabitats();
                setHabitats(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch habitats');
                console.error("Error fetching habitats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHabitats();
    }, []);

    if (loading) return <p>Loading habitats...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>Habitat List</h1>
            {habitats.length === 0 ? (
                <p>No habitats found.</p>
            ) : (
                <ul>
                    {habitats.map((habitat) => (
                        <li key={habitat.id}>
                            {habitat.name} — Size: {habitat.size} — Climate: {habitat.climate} — Animals: <strong>{habitat.animals}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HabitatList;


