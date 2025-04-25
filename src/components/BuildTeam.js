import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BuildTeam.css';

const BuildTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = location.state || {};

  const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  const [game, setGame] = useState({
    id: '',
    name: '',
    background_image: ''
  });

  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: 3,
    description: '',
    dayOfWeek: 'monday',
    startTime: '14:00',
    endTime: '18:00'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gameId) return;
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch game data');
        const data = await response.json();
        setGame({
          id: data.id,
          name: data.name,
          background_image: data.background_image
        });
      } catch (err) {
        console.error(err);
        setError('Unable to load game details.');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to create a team');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamSize' ? parseInt(value, 10) : value
    }));
  };

  const validateTimeSelection = () => {
    const { startTime, endTime } = formData;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return end > start;
  };

  const getDateTimeString = (dayOfWeek, timeString) => {
    const days = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
    const now = new Date();
    const currentDay = now.getDay();
    const selectedDay = days[dayOfWeek];
    const daysToAdd = (selectedDay + 7 - currentDay) % 7;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysToAdd);
    const [hours, minutes] = timeString.split(':').map(Number);
    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate.toISOString();
  };

  const saveToLocalStorage = (teamData, username) => {
    try {
      const existing = JSON.parse(localStorage.getItem('teams') || '[]');
      const newTeam = { id: `team-${Date.now()}`, ...teamData, members: [username], createdAt: new Date().toISOString() };
      localStorage.setItem('teams', JSON.stringify([...existing, newTeam]));
      return true;
    } catch {
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
        navigate('/login');
        return;
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.username || 'Anonymous';

      const fromTime = getDateTimeString(formData.dayOfWeek, formData.startTime);
      const toTime = getDateTimeString(formData.dayOfWeek, formData.endTime);
      const formattedAvailability = `${formData.dayOfWeek.charAt(0).toUpperCase()}${formData.dayOfWeek.slice(1)} ${formData.startTime} - ${formData.endTime}`;

      const teamData = {
        gameId: gameId,
        gameName: game.name,
        gameImage: game.background_image,
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        description: formData.description,
        availabilityTime: formattedAvailability,
        fromTime,
        toTime,
        createdAt: new Date().toISOString(),
        schedule: {
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime
        }
      };

      const response = await fetch('http://10.44.140.30:8080/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(teamData)
      });

      if (response.ok) {
        saveToLocalStorage(teamData, username);
        alert('Team created successfully!');
        navigate('/');
      } else {
        throw new Error('Server request failed');
      }
    } catch (err) {
      console.error(err);
      if (saveToLocalStorage) {
        alert('Saved locally.');
        navigate('/');
      } else {
        setError(err.message);
      }
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
      <h1>Build Team Page</h1>
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      {error && <div className="error-message">{error}</div>}
      {loading || !game.id ? (
        <p>Loading game details...</p>
      ) : (
        <div className="selected-game-preview">
          <h3>Game: {game.name}</h3>
          {game.background_image && <img src={game.background_image} alt={game.name} />}
        </div>
      )}
      <form className="team-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Team Name:</label>
          <input type="text" id="teamName" name="teamName" value={formData.teamName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="teamSize">Team Size:</label>
          <select id="teamSize" name="teamSize" value={formData.teamSize} onChange={handleChange} required>
            {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Players</option>)}
          </select>
        </div>
        <div className="form-group schedule-section">
          <label>Time Schedule:</label>
          <div className="schedule-inputs">
            <div className="schedule-item">
              <label htmlFor="dayOfWeek">Day of Week:</label>
              <select id="dayOfWeek" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} required>
                {weekdays.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div className="schedule-item">
              <label htmlFor="startTime">Start Time:</label>
              <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </div>
            <div className="schedule-item">
              <label htmlFor="endTime">End Time:</label>
              <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" required />
        </div>
        <button type="submit" className="create-team-button" disabled={loading}>Create Team</button>
      </form>
    </div>
  );
};

export default BuildTeam;
