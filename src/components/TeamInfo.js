import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamInfo.css';

const TeamInfo = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const [team, setTeam] = useState({
    id: 'team-1',
    name: 'Alpha Squad',
    gameName: 'Brutal Legend',
    teamSize: 3,
    time: 'Weekends, 8:00 PM - 11:00 PM',
    description: 'Casual team looking for players to climb ranked. All skill levels welcome!',
    members: [
      {
        name: 'Alice',
        avatar: 'https://ui-avatars.com/api/?name=Alice&background=4a90e2&color=fff&size=100'
      },
      {
        name: 'Bob',
        avatar: 'https://ui-avatars.com/api/?name=Bob&background=e24a4a&color=fff&size=100'
      },
      {
        name: 'Charlie',
        avatar: 'https://ui-avatars.com/api/?name=Charlie&background=4ae24a&color=fff&size=100'
      }
    ],
    host: 'Alice'
  });

  useEffect(() => {
    console.log(`Fetching data for team ID: ${teamId}`);
    const timer = setTimeout(() => {
      console.log('Team data loaded');
    }, 500);
    return () => clearTimeout(timer);
  }, [teamId]);

  const handleRequestJoin = () => {
    setRequesting(true);
    setTimeout(() => {
      alert('Join request sent successfully!');
      setRequesting(false);
    }, 1000);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="team-info-container">
      <div className="team-info-header">
        <button className="back-button" onClick={handleBackToHome}>Home</button>
        <h1>Team Info Page</h1>
      </div>
      <div className="team-info-card">
        <div className="team-info-field">
          <label>Game Name:</label>
          <span>{team.gameName}</span>
        </div>
        <div className="team-info-field">
          <label>Team Size:</label>
          <span>{team.teamSize} Members</span>
        </div>
        <div className="team-info-field">
          <label>Time:</label>
          <span>{team.time}</span>
        </div>
        <div className="team-info-field">
          <label>Description:</label>
          <p>{team.description}</p>
        </div>
        <div className="team-info-field">
          <label>Current team Members:</label>
          <div className="team-members-list">
            {team.members.map((member, index) => (
              <div key={index} className="team-member">
                <img src={member.avatar} alt={member.name} className="member-avatar" />
                <span>{member.name}{member.name === team.host ? ' (Host)' : ''}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="request-join-button"
          onClick={handleRequestJoin}
          disabled={requesting}
        >
          {requesting ? 'Sending Request...' : 'Request to join'}
        </button>
      </div>
    </div>
  );
};

export default TeamInfo;