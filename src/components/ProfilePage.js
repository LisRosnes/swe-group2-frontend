import React, { useState } from 'react';
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
// function PersonalInfo() {
//     return (
//         <>
//             <p><strong>Name:</strong> Elisa</p>
//             <p><strong>Email:</strong> username@gmail.com</p>
//             <p><strong>Bio:</strong> Blah Blah </p>
//         </>
//     )
// }

// function CommunitySummary() {
//     return (
//         <>
//             <p><strong>Total Reviews:</strong> 10</p>
//             <p><strong>Total Teams:</strong> 5</p>
//         </>
//     )
// }

// function MyReviews() {

//     return (
//         <>
//             <h3>My Reviews</h3>
//             <ul>
//                 <li>Game 1 | ⭐⭐⭐⭐ | "Great game!"</li>
//                 <li>Game 2 | ⭐⭐⭐ | "It was okay."</li>
//                 <li>Game 3 | ⭐⭐⭐⭐⭐ | "Best game ever!"</li>
//             </ul>
//         </>
//     )
// }