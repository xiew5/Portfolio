import React, { useEffect, useState } from "react";
import { getTours, getTourFeedbackByTour } from "../services/api";

const FeedbackList = () => {
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState('');
    const [feedbackList, setFeedbackList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const data = await getTours();
            console.log("Tours Data from API:", data);
            setTours(data);
        } catch (error) {
            console.error("Failed to fetch Tours:", error);
        }
    };

    const handleTourChange = async (event) => {
        const tourId = event.target.value;
        setSelectedTour(tourId);
    
        if (tourId) {
            setIsLoading(true);
            try {
                console.log("Fetching feedback for tour ID:", tourId);
                const feedbackData = await getTourFeedbackByTour(tourId);
                console.log("Feedback Data from API:", feedbackData);
    
                // Convert tourId to a number to match data type
                const filteredFeedback = feedbackData.filter(feedback => feedback.tour === Number(tourId));
                console.log("Filtered Feedback:", filteredFeedback);
                setFeedbackList(filteredFeedback);
            } catch (error) {
                console.error("Failed to fetch Feedback:", error);
                setFeedbackList([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setFeedbackList([]);
        }
    };

    return (
        <div>
            <h2>Feedback List</h2>

            <div>
                <label htmlFor="tour-select">Select a tour:</label>
                <select
                    id="tour-select"
                    value={selectedTour}
                    onChange={handleTourChange}
                    required
                >
                    <option value="" disabled>Choose a tour</option>
                    {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                            {tour.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h3>Feedback for Selected Tour</h3>
                {isLoading ? (
                    <p>Loading feedback...</p>
                ) : feedbackList.length > 0 ? (
                    <ul>
                        {feedbackList.map((feedback) => (
                            <li key={feedback.id}>
                                <p><strong>Rating:</strong> {feedback.rating} <label>/ 5</label></p>
                                <p><strong>Comment:</strong> {feedback.comment}</p>
                                <p><strong>Visitor:</strong> {feedback.visitor_name}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No feedback available for this tour.</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;