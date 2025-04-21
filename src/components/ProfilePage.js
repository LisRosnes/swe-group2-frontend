import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
// need to connect backend
// Upload Profile Picture: POST /user/profile-picture
// Requires authentication with Bearer token
// Accepts form data with a 'file' field containing the image
// Or accepts JSON with a base64-encoded 'image' field
// Returns the profile picture URL on success

// Get Profile Picture: GET /user/profile-picture/<user_id>
// Does not require authentication
// Returns the JPEG image file directly
// Falls back to a default image if none exists

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
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [editedProfile, setEditedProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }

            const [meRes, reviewsRes, teamsRes] = await Promise.all([
                fetch('http://localhost:8080/user/me', { headers }),
                fetch('http://localhost:8080/game_info/comments/me', { headers }),
                fetch('http://localhost:8080/teams/me',   { headers }),
                ]);

            if (!meRes.ok || !reviewsRes.ok || !teamsRes.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const meData = await meRes.json();
            const reviewsData = await reviewsRes.json();
            const teamsData = await teamsRes.json();

            const userData = {
                id: meData.id,
                firstName: meData.name ? meData.name.split(' ')[0] || '' : '',  // Extract first name from name
                lastName: meData.name ? meData.name.split(' ')[1] || '' : '',   // Extract last name from name
                username: meData.username || '',
                password: meData.password || '',
                email: meData.email || '',
                phone: meData.phone || '',
                bio: meData.bio || '',
                favoriteGenres: meData.favoriteGenres ? meData.favoriteGenres.split(',') : [], // Assuming favoriteGenres is a comma-separated string
                profilePicture: meData.profilePicture ? `http://localhost:8080${meData.profilePicture}` : null,
                
                gameReviews: reviewsData.map(review => ({
                    id: review.id,
                    gameID: review.gameID,
                    userID: review.userID,
                    username: review.username,
                    content: review.content,
                    timestamp: review.timestamp,
                })),
                gameTeams: teamsData.map(teamData => ({
                    id: teamData.team.id,
                    name: teamData.team.teamName || 'Unnamed Team',
                    description: teamData.team.description || 'No description available',
                    members: teamData.members.map(member => member.username || 'Unknown User'),
                    gameId: teamData.team.gameId,
                    teamSize: teamData.team.teamSize,
                    fromTime: teamData.team.fromTime,
                    toTime: teamData.team.toTime,
                    img: teamData.team.teamImage 
                        ? `http://localhost:8080${teamData.team.teamImage}` 
                        : "https://ui-avatars.com/api/?name=Team&background=random"
                }))
            };
            setProfile(userData);
            setEditedProfile({...userData});
            setLoading(false);

        } catch (error) {
            console.error('Error fetching profile:', error);
            setError(error.message || 'Failed to load profile data');
            setLoading(false);
        }
    };

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

    // Function to handle profile picture click
    const handleProfilePictureClick = () => {
        fileInputRef.current.click();
    };

    // Function to handle file selection
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Client-side validation
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        try {
            setIsUploadingPicture(true);

            // Read the file as data URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                // Update the local state with the image preview
                setEditedProfile({
                    ...editedProfile,
                    profilePicture: reader.result
                });
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('authToken');
            if (!token) {
                // If not logged in, just show the preview but don't upload
                setIsUploadingPicture(false);
                return;
            }

            const response = await fetch('http://localhost:8080/user/profile-picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile picture');
            }

            const data = await response.json();
            console.log('Profile picture updated:', data);

            // Update profile picture URL in state
            const profilePictureUrl = `http://localhost:8080${data.profile_picture_url}`;
            setEditedProfile({
                ...editedProfile,
                profilePicture: profilePictureUrl
            });

        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture');
        } finally {
            setIsUploadingPicture(false);
        }
    };

    // Function to save profile changes
    const saveProfileChanges = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Authentication token not found. Please log in.");
                return;
            }
            
            // Log the current profile before update
            console.log('Current profile before update:', profile);

            const payload = {
                id: profile.id,
                name: `${editedProfile.firstName} ${editedProfile.lastName}`.trim(),
                username: editedProfile.username,
                email: editedProfile.email,
                phone: editedProfile.phone,
                bio: editedProfile.bio,
                favoriteGenres: editedProfile.favoriteGenres.filter(g => g).join(','),
                createdAt: profile.createdAt,
                updatedAt: new Date().toISOString(),
              };


            console.log("Payload to send:", payload);
                      
            const response = await fetch('http://localhost:8080/user/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchUserProfile();
                setIsEditing(false);
                alert("Update success");
              } else {
                const errText = await response.text();
                throw new Error(errText);
              }
              
        } catch (error) {
            console.error('Error saving profile changes:', error);
        }
    };

    // Function to cancel editing
    const cancelEditing = () => {
        setEditedProfile({ ...profile });
        setIsEditing(false);
    };

    // Function to render the profile picture
    const renderProfilePicture = () => {
        if (!profile) return null;

        const profilePic = isEditing ? editedProfile.profilePicture : profile.profilePicture;
        const defaultPic = "https://ui-avatars.com/api/?name=" + profile.username + "&background=random";

        return (
            <div className="profile-picture-container">
                {isUploadingPicture ? (
                    <div className="profile-picture-loading">
                        <p>Uploading...</p>
                    </div>
                ) : (
                    <>
                        <img
                            src={profilePic || defaultPic}
                            alt="Profile"
                            className="profile-picture"
                            onClick={isEditing ? handleProfilePictureClick : undefined}
                            style={isEditing ? { cursor: 'pointer' } : {}}
                        />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <div className="profile-picture-overlay">
                                    <span>Change Picture</span>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };

    if (loading) {
        return <div className="profile-page">Loading profile...</div>;
    }

    if (error) {
        return <div className="profile-page">Error: {error}</div>;
    }
    
    // If profile is null, don't try to render the profile content
    if (!profile) {
        return <div className="profile-page">No profile data available</div>;
    }

    return (
        <div className="profile-page">
            <button className="back-button" onClick={() => navigate('/')}>
                Back
            </button>
            <div className="left-column">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    {/* <p1>Username: {profile.username}</p1> */}
                    {!isEditing ? (
                        <button onClick={handleEditProfile}>Edit Profile</button>
                    ) : (
                        <div className="edit-buttons">
                            <button onClick={saveProfileChanges}>Save</button>
                            <button onClick={cancelEditing}>Cancel</button>
                        </div>
                    )}
                </div>

                {/* Add the profile picture section */}
                {renderProfilePicture()}

                <div className="profile-details">
                    {!isEditing ? (
                        <>
                            <p><strong>Bio: </strong>{profile.bio}</p>
                            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                            <p><strong>Username:</strong> {profile.username}</p>
                            <p><strong>Email:</strong> {profile.email}</p>

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
                                <input type="text" name="lastName" value={editedProfile.lastName} onChange={handleInputChange} />
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
                                <textarea name="bio" value={editedProfile.bio} onChange={handleInputChange} rows="4" />
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
                    <p><strong>Total Teams:</strong> {profile.gameTeams.length}</p>
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
                                <div>
                                    <h3>{game.name}</h3>
                                    <p><strong>Rating:</strong> {game.rating}/5</p>
                                    <p><strong>Review:</strong> {game.review}</p>
                                </div>
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
                                    alt={`${team.name} image`}
                                    className="team-image"
                                />
                                <div>
                                    <h3>{team.name}</h3>
                                    <p><strong>Description:</strong> {team.description}</p>
                                    <p><strong>Members:</strong> {team.members.join(', ')}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;