import React, { useState, useEffect } from 'react';
import { getTours, addTourFeedback } from "../services/api";

function Feedback({ visitorData }) {
    const { name } = visitorData || {};
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

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

    const handleTourChange = (event) => {
        setSelectedTour(event.target.value);
    };

    const handleRatingChange = (event) => {
        setSelectedRating(event.target.value);
    };

    const handleFeedbackChange = (event) => {
        setFeedbackText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedTour || !selectedRating || !feedbackText) {
            alert('Please fill out all fields before submitting.');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const feedbackData = {
                tour_id: selectedTour,
                visitor_name: name, 
                rating: selectedRating,
                comment: feedbackText,
            };
            console.log(feedbackData)
            const response = await addTourFeedback(feedbackData);
            console.log('Feedback submitted successfully:', response);

            setSubmitMessage('Thank you for your feedback!');
            setSelectedTour('');
            setSelectedRating('');
            setFeedbackText('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitMessage('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Feedback</h2>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                <strong>On which tour would you like to give us feedback?</strong>
            </p>

            <form onSubmit={handleSubmit}>
                {/* Dropdown for selecting a tour */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="tour-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Select a tour:
                    </label>
                    <select
                        id="tour-select"
                        value={selectedTour}
                        onChange={handleTourChange}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
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

                {/* Dropdown for selecting a rating */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="rating-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Rate your experience (1 to 5):
                    </label>
                    <select
                        id="rating-select"
                        value={selectedRating}
                        onChange={handleRatingChange}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    >
                        <option value="" disabled>Choose a rating</option>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>
                                {rating}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Big text field for feedback */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="feedback-text" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Your feedback:
                    </label>
                    <textarea
                        id="feedback-text"
                        value={feedbackText}
                        onChange={handleFeedbackChange}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '150px' }}
                        placeholder="Enter your feedback here..."
                        required
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '12px 20px',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {/* Submission message */}
                {submitMessage && (
                    <p style={{ marginTop: '20px', color: submitMessage.includes('Thank you') ? '#4CAF50' : '#FF0000' }}>
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    );
}

export default Feedback;