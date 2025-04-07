import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuildTeam.css';

const BuildTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gameName: 'Apex Legends', 
    teamName: '',
    timeRange: '',
    size: '3', 
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Team creation form submitted:', formData);


    alert('Team created successfully!');
    navigate('/');
  };

  return (
    <div className="build-team-container">
      <div className="background-overlay"></div>
      <h1>Build Team Page</h1>
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
      <form className="team-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gameName">Game Name:</label>
          <input
            type="text"
            id="gameName"
            name="gameName"
            value={formData.gameName}
            onChange={handleChange}
            required
          />
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
          <label htmlFor="size">Team Size:</label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          >
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
            <option value="5">5 Players</option>
            <option value="6+">6+ Players</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="timeRange">Time Schedule:</label>
          <input
            type="text"
            id="timeRange"
            name="timeRange"
            value={formData.timeRange}
            onChange={handleChange}
            placeholder="e.g.,Weekends 2-5 PM EST"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description: (team goals, requirements)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
        <button type="submit" className="create-team-button">
          Create Team
        </button>
      </form>
    </div>
  );
};

export default BuildTeam;