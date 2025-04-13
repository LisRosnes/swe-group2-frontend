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
  const [userInteractions, setUserInteractions] = useState({});

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
  
        const response = await fetch(`http://localhost:8080/game_info/${game.id}/comments`, {
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
          id: comment.id,
          user: `User${comment.userId}`,
          text: comment.content,
          likes: comment.likes || 0,
          dislikes: comment.dislikes || 0
        }));
        setComments(formatted);
        
        // Initialize user interactions object
        const interactions = {};
        formatted.forEach(comment => {
          interactions[comment.id] = { liked: false, disliked: false };
        });
        setUserInteractions(interactions);
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
  
      const response = await fetch(`http://localhost:8080/game_info/${game.id}/comments`, {
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
  
      // Add new comment with initial 0 likes and dislikes
      const newCommentObj = { 
        id: Date.now(), // Temporary ID until we get the real one
        user: 'You', 
        text: newComment,
        likes: 0,
        dislikes: 0
      };
      
      setComments([...comments, newCommentObj]);
      
      // Initialize interaction state for the new comment
      setUserInteractions({
        ...userInteractions,
        [newCommentObj.id]: { liked: false, disliked: false }
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  
  // Handle like click
  const handleLike = async (commentId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to like comments');
        return;
      }
      
      const interaction = userInteractions[commentId];
      let endpoint;
      
      if (interaction.liked) {
        // If already liked, unlike it
        endpoint = `http://localhost:8080/game_info/comments/${commentId}/unlike`;
      } else {
        // If not liked, like it
        endpoint = `http://localhost:8080/game_info/comments/${commentId}/like`;
        
        // If it was disliked, also remove the dislike
        if (interaction.disliked) {
          await fetch(`http://localhost:8080/game_info/comments/${commentId}/undislike`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'credentials': 'include',
            }
          });
        }
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'credentials': 'include',
        }
      });
      
      if (!response.ok) throw new Error('Failed to update like');
      
      // Update comments state
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          if (interaction.liked) {
            // Unliking
            return { ...comment, likes: Math.max(0, comment.likes - 1) };
          } else {
            // Liking
            return { 
              ...comment, 
              likes: comment.likes + 1,
              // If it was disliked, also decrease the dislikes
              dislikes: interaction.disliked ? Math.max(0, comment.dislikes - 1) : comment.dislikes
            };
          }
        }
        return comment;
      }));
      
      // Update interaction state
      setUserInteractions({
        ...userInteractions,
        [commentId]: { 
          liked: !interaction.liked, 
          disliked: interaction.disliked && !interaction.liked ? false : interaction.disliked 
        }
      });
      
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };
  
  // Handle dislike click
  const handleDislike = async (commentId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to dislike comments');
        return;
      }
      
      const interaction = userInteractions[commentId];
      let endpoint;
      
      if (interaction.disliked) {
        // If already disliked, undislike it
        endpoint = `http://localhost:8080/game_info/comments/${commentId}/undislike`;
      } else {
        // If not disliked, dislike it
        endpoint = `http://localhost:8080/game_info/comments/${commentId}/dislike`;
        
        // If it was liked, also remove the like
        if (interaction.liked) {
          await fetch(`http://localhost:8080/game_info/comments/${commentId}/unlike`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'credentials': 'include',
            }
          });
        }
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'credentials': 'include',
        }
      });
      
      if (!response.ok) throw new Error('Failed to update dislike');
      
      // Update comments state
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          if (interaction.disliked) {
            // Undisliking
            return { ...comment, dislikes: Math.max(0, comment.dislikes - 1) };
          } else {
            // Disliking
            return { 
              ...comment, 
              dislikes: comment.dislikes + 1,
              // If it was liked, also decrease the likes
              likes: interaction.liked ? Math.max(0, comment.likes - 1) : comment.likes
            };
          }
        }
        return comment;
      }));
      
      // Update interaction state
      setUserInteractions({
        ...userInteractions,
        [commentId]: { 
          disliked: !interaction.disliked, 
          liked: interaction.liked && !interaction.disliked ? false : interaction.liked 
        }
      });
      
    } catch (error) {
      console.error('Error updating dislike:', error);
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
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-content">
                <strong>{comment.user}:</strong> {comment.text}
              </div>
              <div className="comment-actions">
                <button 
                  className={`like-button ${userInteractions[comment.id]?.liked ? 'active' : ''}`}
                  onClick={() => handleLike(comment.id)}
                >
                  👍 <span className="like-count">{comment.likes}</span>
                </button>
                <button 
                  className={`dislike-button ${userInteractions[comment.id]?.disliked ? 'active' : ''}`}
                  onClick={() => handleDislike(comment.id)}
                >
                  👎 <span className="dislike-count">{comment.dislikes}</span>
                </button>
              </div>
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