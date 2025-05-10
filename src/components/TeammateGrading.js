import React, { useState } from 'react';
import './TeammateGrading.css';

const TeammateGrading = ({ teammateId, teammateName }) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleRating = (selectedRating) => {
        if (!submitted) {
            setRating(selectedRating);
        }
    };

    const handleSubmit = async () => {
        try {
            // TODO: Connect to your backend API
            // await axios.post('/api/grades', { teammateId, rating });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 2000); // Reset after 2sec
        } catch (error) {
            console.error('Rating submission failed:', error);
        }
    };

    return (
        <div className="grading-container">
            <div className="teammate-info">
                <span className="teammate-name">{teammateName}</span>
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`star ${star <= rating ? 'active' : ''} ${submitted ? 'disabled' : ''}`}
                            onClick={() => handleRating(star)}
                            disabled={submitted}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            {!submitted && rating > 0 && (
                <button className="submit-button" onClick={handleSubmit}>
                    Submit Rating
                </button>
            )}

            {submitted && <div className="confirmation-message">Rating submitted! 🎉</div>}
        </div>
    );
};

export default TeammateGrading;