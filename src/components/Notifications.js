import React, { useState, useEffect } from 'react';

const Notifications = ({ token }) => {
    const [notifications, setNotifications] = useState([]); // pending invites
    const [hasNew, setHasNew] = useState(false); // red‑dot flag
    const [showNotif, setShowNotif] = useState(false); // dropdown toggle

    const fetchNotifications = async () => {
        // TODO: GET /api/notifications (auth ‑> token)
        // Dummy: random subset of 3 hard‑coded invites
        const dummy = [
            { id: 1, teamName: 'Diamond Dogs', inviterName: 'Eva' },
            { id: 2, teamName: 'Night Howlers', inviterName: 'Sam' },
            { id: 3, teamName: 'Pixel Pirates', inviterName: 'Jo' },
        ];
        const invites = dummy.filter(() => Math.random() < 0.5);
        setNotifications(invites);
        if (invites.length) setHasNew(true);
    };

    useEffect(() => {
        fetchNotifications(); // initial load
        const id = setInterval(fetchNotifications, 20_000); // 20s poll
        return () => clearInterval(id);
    }, []);
    const handleAccept = async (id) => {
        // TODO: POST /invitations/{id}/accept
        setNotifications((prev) => prev.filter((inv) => inv.id !== id));
    };

    const handleReject = async (id) => {
        // TODO: DELETE /invitations/{id}
        setNotifications((prev) => prev.filter((inv) => inv.id !== id));
    };

    return (
        <div className="notif-wrapper">
            <button
                className="notif-btn"
                onClick={() => {
                    setShowNotif((prev) => !prev);
                    setHasNew(false); // mark as seen when opened
                }}
            >
                🔔
                {hasNew && <span className="red-dot" />}
            </button>

            {showNotif && (
                <div className="notif-dropdown">
                    {notifications.length === 0 ? (
                        <p className="empty">No invitations right now.</p>
                    ) : (
                        notifications.map((inv) => (
                            <div className="invite-row" key={inv.id}>
                                <span>
                                    <strong>{inv.teamName}</strong>
                                    <br />
                                    <small>invited by {inv.inviterName}</small>
                                </span>
                                <div className="actions">
                                    <button onClick={() => handleAccept(inv.id)}>Accept</button>
                                    <button onClick={() => handleReject(inv.id)}>Reject</button>
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