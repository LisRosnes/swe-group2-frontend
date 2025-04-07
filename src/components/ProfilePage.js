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
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        username: 'GameExplorer',
        email: 'gameexplorer@example.com',
        bio: 'Avid gamer and reviewer. Love exploring new games and sharing my thoughts.',
        favoriteGenres: ['RPG', 'Strategy', 'Adventure'],
        gameReviews: [
        {
            id: 1,
            name: 'Placeholder Game 1',
            rating: 4,
            review: 'Great game with immersive gameplay!', 
            img: "https://raw.githubusercontent.com/mu-xiaofan/Icy/main/icy.png"
        },
        {
            id: 2,
            name: 'Placeholder Game 2',
            rating: 5,
            review: 'Enjoyed the graphics and storyline.',
            img: "https://raw.githubusercontent.com/mu-xiaofan/Icy/main/icy.png"
        }
        ],
        gameTeams: [
            {
                id: 'team-1',
                name: 'Team Alpha',
                description: 'A team of elite gamers.',
                members: ['John', 'Jane', 'Doe'],
                img: '/team1.jpg'
            },
            {
                id: 'team-2',
                name: 'Team Beta',
                description: 'Casual gamers united.',
                members: ['Alice', 'Bob'],
                img: '/team2.jpg'
            }
        ]
    });

  const [editedProfile, setEditedProfile] = useState({...profile });

  // Function to handle profile editing
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

    // Function to handle genre changes
    const handleGenreChange = (e, index) => {
      const newGenres = [...editedProfile.favoriteGenres];
      newGenres[index] = e.target.value;
      setEditedProfile({
          ...editedProfile,
          favoriteGenres: newGenres
      });
  };
  
  // Function to add a new genre field
  const addGenreField = () => {
      setEditedProfile({
          ...editedProfile,
          favoriteGenres: [...editedProfile.favoriteGenres, '']
      });
  };
  
  // Function to remove a genre field
  const removeGenreField = (index) => {
      const newGenres = [...editedProfile.favoriteGenres];
      newGenres.splice(index, 1);
      setEditedProfile({
          ...editedProfile,
          favoriteGenres: newGenres
      });
  };
  
  // Function to save profile changes
  const saveProfileChanges = () => {
      setProfile({...editedProfile});
      setIsEditing(false);
  };
  
  // Function to cancel editing
  const cancelEditing = () => {
      setEditedProfile({...profile});
      setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
      <div className="left-column">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing ? (
            <button onClick={handleEditProfile}>Edit Profile</button>
          ) : (
            <div className="edit-buttons">
              <button onClick={saveProfileChanges}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </div>
          )}
        </div>
        
        <div className="profile-details">
          {!isEditing ? (
            <>
              <p><strong>Bio: </strong>{profile.bio}</p>
              <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email</strong> {profile.email}</p>
              
              <h2>Favorite Genres</h2>
              <ul>
                {profile.favoriteGenres.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                  <label>First Name:</label>
                  <input type="text" name="firstName" value={editedProfile.firstName} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                  <label>Last Name:</label>
                  <input type="text" name="lastName" value={editedProfile.lastName} onChange={handleInputChange}/>
              </div>
              
              <div className="form-group">
                  <label>Username:</label>
                  <input type="text" name="username" value={editedProfile.username} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                  <label>Email:</label>
                  <input type="email" name="email" value={editedProfile.email} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                  <label>Bio:</label>
                  <textarea name="bio" value={editedProfile.bio} onChange={handleInputChange} rows="4"/>
              </div>
              
              <div className="form-group">
                  <label>Favorite Genres:</label>
                  {editedProfile.favoriteGenres.map((genre, index) => (
                      <div key={index} className="genre-input">
                          <input type="text" value={genre} onChange={(e) => handleGenreChange(e, index)} />
                          <button type="button" onClick={() => removeGenreField(index)} className="remove-genre">
                              Remove
                          </button>
                      </div>
                  ))}
                  <button type="button" onClick={addGenreField} className="add-genre">
                      Add Genre
                  </button>
            </div>
        </div>
    )}
    
    <h2>Community Summary</h2>
    <p><strong>Total Reviews:</strong> {profile.gameReviews.length}</p>
    <p><strong>Total Teams:</strong> 0</p>
</div>
</div>

  <div className="right-column">
    <div className="review-summary">
        <h2>Game Reviews</h2>
        <div className="game-review-container">
            {profile.gameReviews.map((game) => (
                <div key={game.id} className="game-review-card">
                    <img
                      src={game.img}
                      alt={`${game.name} image`}
                      className="game-image"
                    />
                    <h3>{game.name}</h3>
                    <p><strong>Rating:</strong> {game.rating}</p>
                    <p><strong>Review:</strong> {game.review}</p>
                </div>
            ))}
        </div>
    </div>
    <div className="community-summary">
        <h2>My Teams</h2>
        <div className="team-container">
            {profile.gameTeams.map((team) => (
                <button key={team.id} className="team-card"
                onClick={() => navigate(`/team/${team.id}`)}>
                <img
                  src={team.img}
                  alt={`${team.id} image`}
                  className="team-image"
                />
                    <h3>{team.name}</h3>
                    <p><strong>Description:</strong> {team.description}</p>
                    <p><strong>Members:</strong> {team.members.join(', ')}</p>
                </button>
            ))}
        </div>
    </div>
  </div>
</div>
);
};

export default ProfilePage;