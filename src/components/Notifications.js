import React, { useState, useEffect } from 'react';

const API = 'http://10.44.140.30:8080';

const Notifications = () => {
    const [requests, setRequests] = useState([]); // pending
    const [hasNew, setHasNew] = useState(false); // red dot flag
    const [open, setOpen] = useState(false); // dropdown toggle
    const loadRequests = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch(`${API}/teams/my_team_request`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include',
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            setRequests(data);
            if (data.length) setHasNew(true);
        } catch (err) {
            console.error('Error loading team requests:', err);
        }
    };
    useEffect(() => {
        loadRequests();
        const id = setInterval(loadRequests, 20_000);
        return () => clearInterval(id);
    }, []);

    const actOn = async (action, joinTeamId) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            await fetch(`${API}/teams/${action}/${joinTeamId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include',
            });
            setRequests((prev) => prev.filter((r) => r.joinTeam.id !== joinTeamId));
        } catch (err) {
            console.error(`Could not ${action} request ${joinTeamId}:`, err);
        }
    };
    return (
        <div className="notif-wrapper">
            <button
                className="notif-btn"
                onClick={() => { setOpen(!open); setHasNew(false); }}
                title="Team invitations"
            >
                🔔 {hasNew && <span className="red-dot" />}
            </button>

            {open && (
                <div className="notif-dropdown">
                    {requests.length === 0 ? (
                        <p className="empty">No invitations right now.</p>
                    ) : (
                        requests.map((req) => (
                            <div key={req.joinTeam.id} className="invite-row">
                                <span>
                                    <strong>{req.team?.teamName ?? 'Unnamed Team'}</strong><br />
                                    <small>requested by {req.user?.username ?? 'Unknown'}</small>
                                </span>
                                <div className="actions">
                                    <button onClick={() => actOn('approve', req.joinTeam.id)}>Accept</button>
                                    <button onClick={() => actOn('reject', req.joinTeam.id)}>Reject</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;