import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GameInfo.css';

const GameInfo = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);

  const [game, setGame] = useState({
    id: 0,
    name: '',
    genre: '',
    platform: '',
    image: '',
    review: '',
    score: '',
  });

  // Now each comment has: id, user, text, likeCount, hasLiked
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch game info from RAWG API
  useEffect(() => {
    const fetchGameData = async () => {
      setRequesting(true);
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${gameId}?key=${process.env.REACT_APP_RAWG_API_KEY}`
        );
        const data = await res.json();
        setGame({
          id: data.id,
          name: data.name,
          genre: data.genres.map(g => g.name).join(', '),
          platform: data.platforms.map(p => p.platform.name).join(', '),
          image: data.background_image,
          review: data.description_raw,
          score: data.metacritic,
        });
      } catch (err) {
        console.error('Failed to fetch game:', err);
      } finally {
        setRequesting(false);
      }
    };
    fetchGameData();
  }, [gameId]);

  // Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.warn('No auth token, skipping comment fetch');
          return;
        }

        const res = await fetch(
          `http://10.44.140.30:8080/game_info/${game.id}/comments`,
          {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();
        console.log('Comments API response:', data);

        // Normalize for our UI
        const formatted = data.map(item => ({
          id: item.comment.id,
          user: item.creator.username,
          text: item.comment.content,
          likeCount: item.comment.likeCount ?? 0,
          hasLiked: item.hasBeenLiked,
        }));

        setComments(formatted);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    if (game.id) fetchComments();
  }, [game.id]);

  // Toggle like/unlike
  const handleLikeToggle = async (commentId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to like comments');
      return;
    }

    // Find current state
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    const willLike = !comment.hasLiked;

    try {
      const res = await fetch(
        `http://10.44.140.30:8080/game_info/comments/${commentId}/like`,
        {
          method: willLike ? 'POST' : 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);

      // Optimistically update UI
      setComments(comments.map(c =>
        c.id === commentId
          ? {
            ...c,
            hasLiked: willLike,
            likeCount: c.likeCount + (willLike ? 1 : -1),
          }
          : c
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Post new comment to backend
  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to post a comment');
        return;
      }

      const res = await fetch(
        `http://10.44.140.30:8080/game_info/${game.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ content: newComment }),
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);

      // Newly posted comment starts with zero likes
      setComments([
        ...comments,
        { id: Date.now(), user: 'You', text: newComment, likeCount: 0, hasLiked: false }
      ]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleBackToHome = () => navigate('/');
  const handleBuildTeamClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to create a team');
      navigate('/login');
      return;
    }
    navigate('/build-team', { state: { gameId: game.id } });
  };

  return (
    <div className="game-info-container">
      <button className="back-button" onClick={handleBackToHome}>Home</button>

      <div className="game-info-header">
        <h1>{game.name || 'Game Info'}</h1>
      </div>

      <div className="button-group">
        <button className="back-button" onClick={handleBuildTeamClick}>
          Build Team
        </button>
      </div>

      {requesting ? (
        <p>Loading game data...</p>
      ) : (
        <div className="game-info-card">
          <div className="game-info-field">
            <label>Genre:</label><span>{game.genre}</span>
          </div>
          <div className="game-info-field">
            <label>Platform:</label><span>{game.platform}</span>
          </div>
          {game.image && (
            <div className="game-image-wrapper">
              <img src={game.image} alt={game.name} className="game-image" />
            </div>
          )}
          <div className="game-info-field">
            <label>Review:</label><p>{game.review}</p>
          </div>
          <div className="game-info-field">
            <label>Score:</label>
            <div className="star-rating">
              {Array.from({ length: 5 }, (_, i) => {
                const outOfFive = game.score ? game.score / 20 : 0;
                return (
                  <span key={i} className={i < Math.round(outOfFive) ? 'star filled' : 'star'}>
                    ★
                  </span>
                );
              })}
              <span className="numeric-score">
                {game.score ?? 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="comment-section">
        <h2>Comments</h2>
        <ul className="comment-list">
          {comments.map(c => (
            <li key={c.id} className="comment-item">
              <div>
                <strong>{c.user}:</strong> {c.text}
              </div>
              <div className="like-controls">
                <button
                  className={`like-button ${c.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLikeToggle(c.id)}
                >
                  {c.hasLiked ? '♥' : '♡'}
                </button>
                <span className="like-count">{c.likeCount}</span>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            rows="3"
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default GameInfo;
