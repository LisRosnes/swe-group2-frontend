import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GameInfo.css';

const GameInfo = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState(false);

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
        setComments(data);
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
  
      // Refresh comments after posting
      setNewComment('');
      
      // Fetch comments again to update the list
      const commentsResponse = await fetch(`http://10.44.157.76:8080/game_info/${game.id}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'credentials': 'include',
        },
      });
      
      if (commentsResponse.ok) {
        const data = await commentsResponse.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };  

  // Handle vote on a comment
  const handleVote = async (commentId, isLike) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to vote on comments');
        return;
      }
      
      setVotingInProgress(true);
      
      const response = await fetch(`http://10.44.157.76:8080/game_info/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'credentials': 'include',
        },
        body: JSON.stringify({
          isLike: isLike
        }),
      });
      
      if (!response.ok) throw new Error('Failed to vote on comment');
      
      const updatedComment = await response.json();
      
      // Update the comments array with the updated comment
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (error) {
      console.error('Error voting on comment:', error);
    } finally {
      setVotingInProgress(false);
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

  // Helper function to determine vote button styles
  const getVoteButtonStyle = (comment, isLikeButton) => {
    if (!comment.userVoteStatus) return "";
    
    if (isLikeButton && comment.userVoteStatus === "LIKE") {
      return "vote-button-active";
    } else if (!isLikeButton && comment.userVoteStatus === "DISLIKE") {
      return "vote-button-active";
    }
    
    return "";
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
                <strong>User {comment.userId}:</strong> {comment.content}
              </div>
              
              <div className="comment-actions">
                <div className="vote-buttons">
                  <button 
                    className={`vote-button like-button ${getVoteButtonStyle(comment, true)}`}
                    onClick={() => handleVote(comment.id, true)}
                    disabled={votingInProgress}
                  >
                    <span role="img" aria-label="thumbs up">👍</span> 
                    <span className="vote-count">{comment.likeCount || 0}</span>
                  </button>
                  
                  <button 
                    className={`vote-button dislike-button ${getVoteButtonStyle(comment, false)}`}
                    onClick={() => handleVote(comment.id, false)}
                    disabled={votingInProgress}
                  >
                    <span role="img" aria-label="thumbs down">👎</span>
                    <span className="vote-count">{comment.dislikeCount || 0}</span>
                  </button>
                </div>
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