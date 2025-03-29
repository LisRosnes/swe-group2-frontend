import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuildTeam.css';

const BuildTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gameName: '',
    teamName: '',
    time: '',
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
    
    // Here is the place that require data from backend
    // Sumulate part

    alert('Team created successfully!');
    navigate('/');
  };

  return (
    <div className="build-team-container">
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
          <label htmlFor="time">Time: (time schedule to play)</label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
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