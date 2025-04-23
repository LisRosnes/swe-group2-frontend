import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamInfo.css';

const BACKEND_URL = 'http://localhost:8080';

export default function TeamInfo() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/user/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.id);
        }
      } catch (err) {
        console.error('Failed to fetch current user', err);
      }
    };
    fetchCurrentUser();
  }, []);

  const isMember = currentUserId != null && members.some(m => m.id === currentUserId);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view team details.');
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/teams/${teamId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });

        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        const data = await res.json();
        setTeam(data.team || data);
        setMembers(data.members || []);
      } catch (err) {
        console.error('Fetch failed', err);
        setError('Failed to load team data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId, navigate]);

  const handleJoin = async () => {
    setRequesting(true);
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to join a team.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/teams/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ id: Number(teamId) })
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      alert('Join request sent successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Join failed', err);
      setError('Failed to join team.');
    } finally {
      setRequesting(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;

    setRequesting(true);
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to leave a team.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/teams/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ id: Number(teamId) })
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      alert('You have left the team.');
      navigate('/');
    } catch (err) {
      console.error('Leave failed', err);
      setError('Failed to leave the team.');
    } finally {
      setRequesting(false);
    }
  };

  const handleBack = () => navigate('/');

  const formatTime = t => new Date(t).toLocaleString([], {
    weekday: 'long', hour: '2-digit', minute: '2-digit'
  });

  const renderMembers = () => (
    <div className="team-members">
      {members.map((m, i) => {
        const name = m.username || m.name || `User ${m.id}`;
        const isHost = m.id === team.creatorId;
        return (
          <div key={i} className="member">
            <img
              className="avatar"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=100`}
              alt={name}
            />
            <div>
              {name} {isHost && <strong>(Host)</strong>}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="team-info-container">
        <button onClick={handleBack} className="back-btn">← Home</button>
        <p>Loading team details…</p>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="team-info-container">
        <button onClick={handleBack} className="back-btn">← Home</button>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="team-info-container">
      <div className="team-header">
        <button onClick={handleBack} className="back-btn">← Home</button>
        <h1>{team.teamName}</h1>
      </div>

      <div className="team-details">
        <div><strong>Game ID:</strong> {team.gameId}</div>
        <div><strong>Size:</strong> {team.teamSize} players</div>
        <div>
          <strong>When:</strong>{' '}
          {team.fromTime && team.toTime
            ? `${formatTime(team.fromTime)} – ${formatTime(team.toTime)}`
            : 'N/A'}
        </div>
        <div><strong>Description:</strong>
          <p>{team.description}</p>
        </div>
        <div><strong>Members:</strong></div>
        {renderMembers()}
      </div>

      {isMember ? (
        <button
          className="leave-btn"
          onClick={handleLeave}
          disabled={requesting}
        >
          {requesting ? 'Leaving…' : 'Leave Team'}
        </button>
      ) : (
        <button
          className="join-btn"
          onClick={handleJoin}
          disabled={requesting}
        >
          {requesting ? 'Requesting…' : 'Request to Join'}
        </button>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
