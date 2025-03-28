import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; 
// Profile Page Component
    // Profile summary comp
        // personal info (editable form)
            // name
            // email
            // bio
        // community summary
            // total reviews
            // total teams
    // my reviews
        // game | rating | review text

    // my teams
        // team name | team description | team members

const ProfilePage = () => {
    // Example profile state
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: 'GameExplorer',
        email: 'gameexplorer@example.com',
        favoriteGenres: ['RPG', 'Strategy', 'Adventure'],
        gameReviews: [
        {
            id: 1,
            name: 'Placeholder Game 1',
            rating: 4,
            review: 'Great game with immersive gameplay!'
        },
        {
            id: 2,
            name: 'Placeholder Game 2',
            rating: 5,
            review: 'Enjoyed the graphics and storyline.'
        }
        ]
    });

  // Function to handle profile editing
  const handleEditProfile = () => {
    // Placeholder for profile editing logic
    console.log('Edit Profile Clicked');
  };

  return (
    <div className="profile-page">
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={handleEditProfile}>Edit Profile</button>
      </div>
      
      <div className="profile-details">
        <h2>User Information</h2>
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>
        
        <h2>Favorite Genres</h2>
        <ul>
          {profile.favoriteGenres.map((genre, index) => (
            <li key={index}>{genre}</li>
          ))}
        </ul>
      </div>
        
        <h2>Game Reviews</h2>
        <div className="game-review-container">
          {profile.gameReviews.map((game) => (
            <div key={game.id} className="game-review-card">
                <h3>{game.name}</h3>
                <p>Rating: {game.rating}</p>
                <p>Review: {game.review}</p>
            </div>
          ))}
        </div>
        <h2>My Teams</h2>
        <div className="team-container">
          {/* Placeholder for team information */}
          <p>No teams joined yet.</p>
        </div>
    </div>
  );
};

export default ProfilePage;