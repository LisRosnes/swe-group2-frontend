import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GameInfo.css';

const GameInfo = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);

  const [game, setGame] = useState({
    id: '',
    name: '',
    genre: '',
    platform: '',
    image: '',
    review: '',
    score: '',
  });

  const [comments, setComments] = useState([
    { user: 'PlayerOne', text: 'Loved this game! So immersive.' },
    { user: 'GamerGirl99', text: 'Combat system could be better.' },
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchGameData = async () => {
      setRequesting(true);
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${gameId}?key=${process.env.REACT_APP_RAWG_API_KEY}`
        );
        const data = await response.json();
        setGame({
          id: data.id,
          name: data.name,
          genre: data.genres.map(g => g.name).join(', '),
          platform: data.platforms.map(p => p.platform.name).join(', '),
          image: data.background_image,
          review: data.description_raw,
          score:  data.metacritic,
        });
      } catch (error) {
        console.error('Failed to fetch game:', error);
      } finally {
        setRequesting(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBuildTeamClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to create a team');
      navigate('/login');
      return;
    }
    navigate('/build-team');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const dummyUser = `User${Math.floor(Math.random() * 1000)}`;
      setComments([...comments, { user: dummyUser, text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="game-info-container">
      <div className="game-info-header">
        <div className="button-group">
          <button className="back-button" onClick={handleBackToHome}>Home</button>
          <button className="back-button" onClick={handleBuildTeamClick}>Build Team</button>
        </div>
        <div className="game-title-wrapper">
          <h1>{game.name || 'Game Info'}</h1>
        </div>
      </div>

      {requesting ? (
        <p>Loading game data...</p>
      ) : (
        <div className="game-info-card">
          <div className="game-info-field">
            <label>Genre:</label>
            <span>{game.genre}</span>
          </div>

          <div className="game-info-field">
            <label>Platform:</label>
            <span>{game.platform}</span>
          </div>

          <div className="game-info-field">
            {game.image && (
              <div className="game-image-wrapper">
                <img src={game.image} alt={game.name} className="game-image" />
              </div>
            )}
          </div>

          <div className="game-info-field">
            <label>Review:</label>
            <p>{game.review}</p>
          </div>

          <div className="game-info-field">
            <label>Score:</label>
            <div className="star-rating">
              {Array.from({ length: 5 }, (_, index) => {
                const ratingOutOfFive = game.score ? game.score / 20 : 0;
                return (
                  <span key={index} className={`star ${index < Math.round(ratingOutOfFive) ? 'filled' : ''}`}>
                    ★
                  </span>
                );
              })}
              <span className="numeric-score">{game.score ? game.score : 'N/A'}</span>
            </div>
          </div>

        </div>
      )}

      <div className="comment-section">
        <h2>Comments</h2>
        <ul className="comment-list">
          {comments.map((comment, index) => (
            <li key={index}>
              <strong>{comment.user}:</strong> {comment.text}
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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
