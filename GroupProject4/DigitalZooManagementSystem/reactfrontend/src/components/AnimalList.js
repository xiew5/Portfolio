import React, { useEffect, useState } from "react";
import { getAnimals } from '../services/api';

export const AnimalList = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                setLoading(true);
                const data = await getAnimals();
                setAnimals(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch animals');
                console.error("Error fetching animals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    if (loading) return <p>Loading animals...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>Animal List</h1>
            {animals.length === 0 ? (
                <p>No animals found.</p>
            ) : (
                <ul>
                    {animals.map((animal) => (
                        <li key={animal.id}>
                            {animal.species} — {animal.diet} — {animal.lifespan} years — {animal.behaviour} — 
                            Habitats: {animal.habitats.join(', ') || "Unknown habitat"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnimalList;


