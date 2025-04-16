import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamInfo.css';

const TeamInfo = () => {
  const { teamId } = useParams();        // <‑‑ comes from `/team/:id`
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [team, setTeam]   = useState(null);   // ⇐ start empty
  const [requesting, setRequesting] = useState(false);

  /** fetch the real team */
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        // endpoint we added in TeamController
        const res = await fetch(`http://10.0.0.124:8080/teams/${teamId}`);
        if (!res.ok) throw new Error('Failed to load team');
        const { team: t, members } = await res.json();

        setTeam({
          id:         t.id,
          gameName:   t.teamName ?? 'Unknown Game',   // change if you store real game name separately
          teamSize:   t.teamSize,
          time:       `${t.fromTime ?? ''} – ${t.toTime ?? ''}`,
          description:t.description,
          members:    members.map(u => ({
                        name: u.username,
                        // quick avatar
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}`
                      })),
          host: members.find(u => u.id === t.creatorId)?.username ?? ''
        });
      } catch (err) {
        console.error(err);
        alert('Could not load team information');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  /* ––––– UI ––––– */

  if (loading || !team) return <p className="team-info-container">Loading…</p>;

  return (
    <div className="team-info-container">
      <div className="team-info-header">
        <button className="back-button" onClick={() => navigate('/')}>Home</button>
        <h1>Team Info</h1>
      </div>

      <div className="team-info-card">
        <div className="team-info-field"><label>Game Name:</label><span>{team.gameName}</span></div>
        <div className="team-info-field"><label>Team Size:</label><span>{team.teamSize} Members</span></div>
        <div className="team-info-field"><label>Time:</label><span>{team.time}</span></div>
        <div className="team-info-field"><label>Description:</label><p>{team.description}</p></div>

        <div className="team-info-field">
          <label>Current Members:</label>
          <div className="team-members-list">
            {team.members.map((m,i) => (
              <div key={i} className="team-member">
                <img src={m.avatar} alt={m.name} className="member-avatar" />
                <span>{m.name}{m.name === team.host && ' (Host)'}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="request-join-button"
                onClick={() => { setRequesting(true); /* TODO: POST /teams/join */ }}
                disabled={requesting}>
          {requesting ? 'Sending…' : 'Request to join'}
        </button>
      </div>
    </div>
  );
};

export default TeamInfo;
