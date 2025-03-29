import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameInfo.css';

const GameInfo = () => {
  const navigate = useNavigate();

  // Example static game data
  const game = {
    title: 'Epic Quest',
    genre: 'RPG',
    platform: 'PC',
    releaseDate: '2024-01-01',
    coverImageUrl: '/images/epic-quest.jpg',
    details: 'An immersive RPG set in a fantasy world with rich storytelling and character progression.',
    review: 'Top-notch gameplay and storytelling. A must-play for RPG fans!'
  };

  return (
    <div className="game-info-container">
      <h1>Game Info Page</h1>

      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>

      <img className="game-cover" src={game.coverImageUrl} alt={game.title} />

      <div className="game-detail"><strong>Title:</strong> {game.title}</div>
      <div className="game-detail"><strong>Genre:</strong> {game.genre}</div>
      <div className="game-detail"><strong>Platform:</strong> {game.platform}</div>
      <div className="game-detail"><strong>Release Date:</strong> {game.releaseDate}</div>
      <div className="game-detail"><strong>Details:</strong> {game.details}</div>

      <div className="game-review-box">
        "{game.review}"
      </div>
    </div>
  );
};

export default GameInfo;
