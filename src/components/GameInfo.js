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

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch game info from RAWG API
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
          score: data.metacritic,
        });
      } catch (error) {
        console.error('Failed to fetch game:', error);
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
        console.log('Auth Token:', token); // 🔍 Debugging: Print the token
  
        if (!token) {
          console.warn('No auth token found, skipping comment fetch');
          return;
        }
  
        const response = await fetch(`http://10.44.157.76:8080/game_info/${game.id}/comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'credentials': 'include',
          },
        });
  
        if (!response.ok) throw new Error('Failed to fetch comments');
  
        const data = await response.json();
        const formatted = data.map(comment => ({
          user: `User${comment.userId}`,
          text: comment.content
        }));
        setComments(formatted);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [game.id]);
  
  

  // Post new comment to backend
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to post a comment');
        return;
      }
  
      const response = await fetch(`http://10.44.157.76:8080/game_info/${game.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'credentials': 'include',
        },
        body: JSON.stringify({
          content: newComment
        }),
      });
  
      if (!response.ok) throw new Error('Failed to post comment');
  
      setComments([...comments, { user: 'You', text: newComment }]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };  

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
