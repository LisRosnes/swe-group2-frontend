import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GameInfo.css';
//import placeholder from '../placeholder.png';

const GameInfo = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);

  const [game, setGame] = useState({
    id: 'game-1',
    name: 'Placeholder Game',
    genre: 'Action/Adventure',
    platform: 'PC, PS5, Xbox',
    //image: placeholder,
    review: 'This game is amazing with stunning graphics and captivating gameplay! Highly recommended.',
    command: 'Press X to attack, O to dodge.'
  });

  useEffect(() => {
    console.log(`Fetching data for game ID: ${gameId}`);
    const timer = setTimeout(() => {
      console.log('Game data loaded');
    }, 500);

    return () => clearTimeout(timer);
  }, [gameId]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="game-info-container">
      <div className="game-info-header">
        <button className="back-button" onClick={handleBackToHome}>Home</button>
        <h1>Game Info Page</h1>
      </div>

      <div className="game-info-card">
        <div className="game-info-field">
          <label>Game Name:</label>
          <span>{game.name}</span>
        </div>

        <div className="game-info-field">
          <label>Genre:</label>
          <span>{game.genre}</span>
        </div>

        <div className="game-info-field">
          <label>Platform:</label>
          <span>{game.platform}</span>
        </div>

        <div className="game-info-field">
          <label>Game Image:</label>
          <img src={game.image} alt={game.name} className="game-image" />
        </div>

        <div className="game-info-field">
          <label>Review:</label>
          <p>{game.review}</p>
        </div>

        <div className="game-info-field">
          <label>Command:</label>
          <p>{game.command}</p>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
