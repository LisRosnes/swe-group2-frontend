import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuildTeam.css';

const BuildTeam = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  const [formData, setFormData] = useState({
    gameId: '',
    teamName: '',
    teamSize: 3,
    description: '',
    dayOfWeek: 'monday',
    startTime: '14:00',
    endTime: '18:00'
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You must be logged in to create a team');
          return;
        }
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=1&page_size=20`
        );
        if (!response.ok) throw new Error('Failed to fetch games');
        const data = await response.json();
        const formattedGames = data.results.map(game => ({
          id: game.id,
          name: game.name,
          background_image: game.background_image
        }));
        setGames(formattedGames);
        if (formattedGames.length > 0) {
          setFormData(prev => ({
            ...prev,
            gameId: formattedGames[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games. Please try again.');
      }
    };
    fetchGames();
  }, [RAWG_API_KEY]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to create a team');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'teamSize' ? parseInt(value, 10) : value
    }));
  };

  const validateTimeSelection = () => {
    const { startTime, endTime } = formData;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return end > start;
  };

  const saveToLocalStorage = (teamData, username) => {
    try {
      const existingTeams = JSON.parse(localStorage.getItem('teams') || '[]');
      const newTeam = {
        id: `team-${Date.now()}`,
        ...teamData,
        members: [username],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('teams', JSON.stringify([...existingTeams, newTeam]));
      return true;
    } catch (error) {
      console.error('Error saving team to local storage:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTimeSelection()) {
      setError('End time must be after start time');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to create a team');
        navigate('/login');
        return;
      }
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const username = userData.username || 'Anonymous';
      const selectedGame = games.find(
        game => game.id.toString() === formData.gameId.toString()
      );
      const formattedAvailability = `${formData.dayOfWeek.charAt(0).toUpperCase() + formData.dayOfWeek.slice(1)} ${formData.startTime} - ${formData.endTime}`;
      const teamData = {
        gameId: formData.gameId,
        gameName: selectedGame ? selectedGame.name : '',
        gameImage: selectedGame ? selectedGame.background_image : '',
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        description: formData.description,
        availabilityTime: formattedAvailability,
        schedule: {
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime
        }
      };
      try {
        const response = await fetch('http://localhost:8080/teams/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(teamData)
        });
        if (response.ok) {
          saveToLocalStorage(teamData, username);
          alert('Team created successfully!');
          navigate('/');
          return;
        } else {
          console.warn('Server request failed with status:', response.status);
          throw new Error('Server request failed');
        }
      } catch (error) {
        const localSaveSuccess = saveToLocalStorage(teamData, username);
        if (localSaveSuccess) {
          alert('Team saved locally. Server connection might be unavailable.');
          navigate('/');
        } else {
          setError('Failed to save team. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setError(error.message || 'Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const weekdays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="build-team-container">
      <div className="background-overlay"></div>
      <h1>Build Team Page</h1>
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
      {error && <div className="error-message">{error}</div>}
      <form className="team-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gameId">Game:</label>
          <select
            id="gameId"
            name="gameId"
            value={formData.gameId}
            onChange={handleChange}
            required
          >
            <option value="">Select a game</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="teamName">Team Name:</label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="teamSize">Team Size:</label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            required
          >
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
            <option value="5">5 Players</option>
            <option value="6">6 Players</option>
          </select>
        </div>
        <div className="form-group schedule-section">
          <label>Time Schedule:</label>
          <div className="schedule-inputs">
            <div className="schedule-item">
              <label htmlFor="dayOfWeek">Day of Week:</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                required
              >
                {weekdays.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="schedule-item">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="schedule-item">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="selected-time-display">
            Selected time:{' '}
            <strong>
              {weekdays.find(day => day.value === formData.dayOfWeek)?.label}{' '}
              {formData.startTime} - {formData.endTime}
            </strong>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">
            Description: (team goals, requirements)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
        <button type="submit" className="create-team-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
      {formData.gameId && games.length > 0 && (
        <div className="selected-game-preview">
          <h3>Selected Game:</h3>
          {(() => {
            const selectedGame = games.find(
              game => game.id.toString() === formData.gameId.toString()
            );
            if (selectedGame) {
              return (
                <div>
                  <h4>{selectedGame.name}</h4>
                  {selectedGame.background_image && (
                    <img
                      src={selectedGame.background_image}
                      alt={selectedGame.name}
                      style={{ maxWidth: '300px', maxHeight: '200px' }}
                    />
                  )}
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
};

export default BuildTeam;
